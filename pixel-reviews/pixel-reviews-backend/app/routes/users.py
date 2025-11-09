from flask import Blueprint, jsonify
from app.database import UserManager
from app.utils.jwt_handler import token_required


users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/<username>")
@token_required
def profile(username):
    user = UserManager.get_user_by_username(username=username)
    if not user:
        return (
            jsonify(
                {"message": "An error ocurred returning the user data or do not exits"}
            ),
            404,
        )

    return jsonify({"user_data": user}), 200
