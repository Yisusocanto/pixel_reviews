from flask import Blueprint, request, g, jsonify
from app.utils.jwt_handler import token_required
from app.database import SettingManager, AuthManager
from app.utils import password_handler


settings_bp = Blueprint("settings", __name__, url_prefix="/settings")


@settings_bp.route("/update_profile", methods=["POST"])
@token_required
def update_profile():
    data = request.get_json()
    name = data["name"]
    lastname = data["lastname"]
    location = data["location"]
    bio = data["bio"]
    website = data["website"]

    payload = g.user_payload
    user_id = int(payload["sub"])

    user = SettingManager.update_profile(
        user_id=user_id,
        name=name,
        lastname=lastname,
        location=location,
        bio=bio,
        website=website,
    )

    if not user:
        return jsonify({"error": "unknown error"}), 500

    return jsonify({"succes": "profile updated successfully"}), 200


@settings_bp.route("/change_password", methods=["POST"])
@token_required
def change_password():
    data = request.get_json()
    current_password = data["current_password"]
    new_password = data["new_password"]

    new_hashed_pw = password_handler.hash_password(new_password)

    payload = g.user_payload
    user_id = int(payload["sub"])

    user = AuthManager.change_password(
        user_id=user_id, current_password=current_password, new_password=new_hashed_pw
    )
    if not user:
        return jsonify({"error": "The current password is incorrect"}), 401

    return jsonify({"succes": "password changed successfully"}), 200
