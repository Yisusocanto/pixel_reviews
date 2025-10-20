from flask import Blueprint, request, make_response, jsonify, render_template
from app.utils.validations import execute_validations
from app.database.database_manage import DatabaseManager
from app.utils.jwt_handler import JwtHandler
from app.utils import password_handler
from app.services.email_sender import EmailSender

# An instance of the database is created
database_manager = DatabaseManager()

email_sender = EmailSender()

# Blueprint that handles authentication paths
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/sign_up", methods=["POST"])
def sign_up():
    """
    The `sign_up` function in a Python Flask route collects user data, validates it, encrypts the
    password, creates a new user in the database, generates a JWT token, and sets it as a cookie before
    returning a success message.

    return: The `sign_up` function returns a response to the frontend after processing the user sign-up
    request.

    - If there are validation errors in the user data, a JSON response with a message indicating
    the error message is returned with a status code of 401.
    - If the user data is valid, the user is created
    in the database, a JWT token is generated for the user, and a success message is returned with
    """
    # User data sent from the frontend is collected
    response = request.get_json()
    email = response["email"]
    username = response["username"]
    password = response["password"]
    name = response["name"]
    lastname = response["lastname"]
    age = response["birthday"]

    # the data is validated and errors and a 400 code are returned to the frontend if there are errors
    error = execute_validations(email, username, password, name, lastname, age)
    if error:
        return (
            jsonify(
                {
                    "message": error,
                }
            ),
            401,
        )

    # Password is encrypted.
    hashed_pw = password_handler.hash_password(password)

    # The user is created and the token is created from the user_id of the created user
    user_id = database_manager.create_user(
        email, hashed_pw, username, name, lastname, age
    )
    if isinstance(user_id, dict) and "error" in user_id:
        return jsonify({"message": user_id["error"]}), 409

    token = JwtHandler.create_jwt(user_id)
    user = database_manager.returning_user_data(username=username)

    email_sender.welcome(email)
    

    # The response is created and the cookie is set with the token inside
    response = make_response(
        jsonify({"message": "User created succesfully", "user_data": user})
    )
    response.set_cookie(
        "jwt_pixel_reviews",
        token,
        max_age=86400,
        httponly=True,
        secure=False,
        samesite="Lax",
    )
    return response, 200


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    The `login` function in Python handles user authentication by validating the username and password,
    creating a JWT token, and setting a cookie for session management.

    return: The `login()` function returns a response with a message indicating the success or failure
    of the login attempt.

    - If the username is incorrect or does not exist in the database, a message
    stating "username incorrect or not exists" is returned with a status code of 401.
    - If the password
    provided does not match the hashed password stored in the database, a message stating "the password
    is incorrect" is returned
    """

    # User data sent from the frontend is collected
    response_data = request.get_json()
    username = response_data["username"]
    password = response_data["password"]

    # user validation
    hashed_password = database_manager.check_user_exits(username)
    if not hashed_password:
        return (
            jsonify({"message": "username incorrect or not exits"}),
            401,
        )

    if not password_handler.check_password(password, hashed_password):
        return jsonify({"message": "the password is incorrect"}), 401

    user_id = database_manager.returnig_user_id(username)
    token = JwtHandler.create_jwt(user_id)

    user = database_manager.returning_user_data(username=username)

    # The response is created and the cookie is set with the token inside
    response = make_response(
        jsonify({"message": "session started successfully", "user_data": user})
    )

    response.set_cookie(
        "jwt_pixel_reviews",
        token,
        max_age=86400,  # 24 horas en segundos
        httponly=True,
        secure=False,  # False para desarrollo sin HTTPS
        samesite="Lax",
    )
    return response, 200


@auth_bp.route("/logout", methods=["GET"])
def logout():
    """
    The `logout` function in Python logs out a user by setting a cookie named "jwt_pixel_reviews" to an
    empty string with a max age of 0.
    return: A response object and a status code of 200 are being returned from the `logout` function.
    """
    # The response is created with an empty token
    response = make_response()
    response.set_cookie(
        "jwt_pixel_reviews",
        "",
        max_age=0,
        httponly=True,
        secure=False,
    )
    return response, 200


@auth_bp.route("/verify")
def verify():
    """Function that verifies whether the user is authenticated or not
    - return a code 200 if authenticated
    - return a code 401 if not"""
    token = request.cookies.get("jwt_pixel_reviews")
    payload = JwtHandler.check_jwt(token)
    if payload:
        user_id = int(payload["sub"])
        username = database_manager.returnig_username(user_id=user_id)
        user = database_manager.returning_user_data(username=username)
        return jsonify({"message": "user authenticated", "user_data": user}), 200
    else:
        return jsonify({"message": "user not authenticated"}), 401
