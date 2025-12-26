import os

from flask import Blueprint, request, make_response, jsonify, url_for, redirect
from app.utils.validations import execute_validations
from app.database import UserManager, AuthManager
from app.utils.jwt_handler import JwtHandler
from app.utils import password_handler, reset_token_handler
from app.services.email_sender import EmailSender
from dotenv import load_dotenv
from flask import current_app
from authlib.integrations.flask_client import OAuthError
from random_username.generate import generate_username

load_dotenv()

email_sender = EmailSender()


# Blueprint that handles authentication paths
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/sign_up", methods=["POST"])
def sign_up():
    # User data sent from the frontend is collected
    data = request.get_json()
    email = data.get("email", "")
    password = data.get("password", "")
    username_from_data: str = data.get("username", "")
    username = username_from_data.lower()

    # the data is validated and errors and a 400 code are returned to the frontend if there are errors
    error = execute_validations(email, username, password)
    if error:
        return (
            jsonify(
                {
                    "error": error,
                }
            ),
            400,
        )

    # Password is encrypted.
    hashed_pw = password_handler.hash_password(password)

    # The user is created and the token is created from the user_id of the created user
    user_id = UserManager.create_user(
        email=email, password=hashed_pw, username=username
    )
    if isinstance(user_id, dict) and "error" in user_id:
        return jsonify(user_id), 409

    token = JwtHandler.create_jwt(user_id)
    user = UserManager.get_user_by_username(username=username)

    email_sender.welcome_email(email, username)

    # The response is created and the cookie is set with the token inside
    response = make_response(jsonify({"user": user}))
    response.set_cookie(
        "jwt_pixel_reviews",
        token,
        max_age=86400,
        httponly=True,
        secure=True,
        samesite="None",
    )
    return response, 200


@auth_bp.route("/login", methods=["POST"])
def login():
    # User data sent from the frontend is collected
    data = request.get_json()
    username_from_data: str = data.get("username", "")
    username = username_from_data.lower()
    password = data.get("password", "")

    # user validation
    hashed_password = AuthManager.get_hashed_password(username=username)
    if not hashed_password:
        return (
            jsonify({"error": "username incorrect or not exits"}),
            401,
        )

    if not password_handler.check_password(password, hashed_password):
        return jsonify({"error": "the password is incorrect"}), 401

    user_id = UserManager.get_user_id(username=username)
    token = JwtHandler.create_jwt(user_id)

    user = UserManager.get_user_by_username(username=username)

    # The response is created and the cookie is set with the token inside
    response = make_response(jsonify({"user": user}))

    response.set_cookie(
        "jwt_pixel_reviews",
        token,
        max_age=86400,
        httponly=True,
        secure=True,
        samesite="None",
    )
    return response, 200


@auth_bp.route("/logout", methods=["GET"])
def logout():
    # The response is created with an empty token
    response = make_response()
    response.set_cookie(
        "jwt_pixel_reviews",
        "",
        max_age=0,
        samesite="None",
        httponly=True,
        secure=True,
    )
    return response, 200


@auth_bp.route("/google/login")
def google_login():
    google = current_app.config["OAUTH_GOOGLE"]
    redirect_uri = url_for("auth.google_callback", _external=True)
    return google.authorize_redirect(redirect_uri)


@auth_bp.route("/google/callback")
def google_callback():
    frontend_url = os.getenv("FRONTEND_URL")
    try:
        google = current_app.config["OAUTH_GOOGLE"]
        google_token = google.authorize_access_token()

        user_info = google_token.get("userinfo")
        email = user_info.get("email")
        avatar_url = user_info.get("picture", None)

        # If the user already exist
        user = UserManager.get_user_by_email(email=email)
        if user:
            token = JwtHandler.create_jwt(user["userID"])
            response = make_response(redirect(f"{frontend_url}/feed"))
            response.set_cookie(
                "jwt_pixel_reviews",
                token,
                max_age=86400,
                httponly=True,
                secure=True,
                samesite="None",
            )
            return response

        # If the user does not exist, it is created
        user_id = UserManager.create_user(email=email, avatar_url=avatar_url)
        if isinstance(user_id, dict):
            return redirect(f"{frontend_url}/login?error={user_id["error"]}")

        token = JwtHandler.create_jwt(user_id)
        response = make_response(redirect(f"{frontend_url}/choose-username"))
        response.set_cookie(
            "jwt_pixel_reviews",
            token,
            max_age=86400,
            httponly=True,
            secure=True,
            samesite="None",
        )
        return response

    except OAuthError as o:
        print(f"Error on google callback: {o}")
        return redirect(f"{frontend_url}/login?error={o}")
    except Exception as e:
        print(f"Unknown error on google callback {e}")
        return redirect(f"{frontend_url}/login?error={e}")


@auth_bp.route("/verify")
def verify():
    """Function that verifies whether the user is authenticated or not
    - return a code 200 if authenticated
    - return a code 401 if not"""
    token = request.cookies.get("jwt_pixel_reviews")
    payload = JwtHandler.check_jwt(token)
    if payload:
        user_id = int(payload["sub"])
        user = UserManager.get_user_by_id(user_id=user_id)
        return jsonify({"user": user}), 200
    else:
        return jsonify({"error": "user not authenticated"}), 401


@auth_bp.route("/password_recovery", methods=["POST"])
def password_recovery():
    data = request.get_json()
    email = data.get("email", "")

    # check if the user exits
    user = UserManager.get_user_by_email(email=email)
    if not user:
        return jsonify({"error": "email not associated with any user"}), 401

    try:
        # The reset token is created
        reset_token = reset_token_handler.generate_reset_token()
        # The reset token is saved in the database
        AuthManager.create_password_reset_token(
            user_id=user["user_id"], reset_token=reset_token
        )
        # The email with the reset token is sent
        email_sender.reset_token_email(email, user["username"], reset_token)
        return jsonify({"success": "reset token created and sent"}), 200

    except Exception as e:
        print("error on reset token route", e)
        return jsonify({"error": "Unknown error."}), 500


@auth_bp.route("/password_reset/<reset_token>", methods=["PATCH"])
def password_reset(reset_token):
    data = request.get_json()
    # The reset token and new password is collected
    new_password = data.get("new_password", "")

    # The token is verified
    user_id = AuthManager.check_reset_token(reset_token=reset_token)
    if not user_id:
        return jsonify({"error": "token not valid or expired"}), 401

    # the new password is checked
    hashed_password = password_handler.hash_password(new_password)

    # The password is updated in the database
    message = AuthManager.update_password(user_id=user_id, new_password=hashed_password)
    if not message:
        return jsonify({"error": "error updating the password"}), 500

    return jsonify(message)
