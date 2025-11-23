import jwt
from datetime import datetime, timedelta
from flask import request, redirect, url_for, make_response, render_template, g, jsonify
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()
SECRECT_KEY = os.getenv("SECRECT_KEY_JWT")
ALGORITHM = "HS256"
TOKEN_EXP_SECONDS = 86400


class JwtHandler:
    """class that handles the creation and verification of JWTs"""

    @staticmethod
    def create_jwt(user_id):
        payload = {
            "sub": str(user_id),
            "exp": datetime.utcnow() + timedelta(seconds=TOKEN_EXP_SECONDS),
        }
        token = jwt.encode(payload, SECRECT_KEY, algorithm=ALGORITHM)
        return token

    @staticmethod
    def check_jwt(token):
        try:
            payload = jwt.decode(token, SECRECT_KEY, algorithms=ALGORITHM)
            return payload
        except Exception:
            return False


# --- Decorador para verificar el token y exponer el payload ---
def token_required(f):
    """
    Decorator to protect routes that require a JWT token. It checks for the presence and validity of the 'jwt_pixel_reviews' token in the cookies. If the token is valid, the payload is stored in `g.user_payload`.
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get("jwt_pixel_reviews")

        if not token:
            return jsonify({"message": "User not authenticated"}), 401

        payload = JwtHandler.check_jwt(token)

        if not payload:
            response = make_response(jsonify({"message": "Token invalid"}))
            response.set_cookie(
                "jwt_pixel_reviews",
                "",
                max_age=0,
                samesite='None',
                httponly=True,
                secure=True,
            )
            return response, 401

        g.user_payload = payload

        return f(*args, **kwargs)

    return decorated_function
