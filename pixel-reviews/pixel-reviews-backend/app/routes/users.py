from flask import Blueprint, jsonify, request
from app.database import UserManager
from app.utils.jwt_handler import token_required


users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/<username>")
def profile(username):
    user = UserManager.get_user_by_username(username=username)
    if not user:
        return (
            jsonify(
                {"error": "An error occurred returning the user data or do not exits"}
            ),
            404,
        )

    return jsonify({"user": user}), 200
