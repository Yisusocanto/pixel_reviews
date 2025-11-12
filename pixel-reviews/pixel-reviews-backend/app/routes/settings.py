from flask import Blueprint, request, g, jsonify
from app.utils.jwt_handler import token_required
from app.database import SettingManager, AuthManager
from app.utils import password_handler
from app.services.cloudinary_handler import CloudinaryHandler

# Blueprint for Setting routes
settings_bp = Blueprint("settings", __name__, url_prefix="/settings")


@settings_bp.route("/update_profile", methods=["POST"])
@token_required
def update_profile():
    # New data of the user
    data = request.get_json()
    name = data["name"]
    lastname = data["lastname"]
    location = data["location"]
    bio = data["bio"]
    website = data["website"]

    # Extraction of the user_id
    payload = g.user_payload
    user_id = int(payload["sub"])

    # User data update
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

    return jsonify({"user": user}), 200


@settings_bp.route("/change_password", methods=["POST"])
@token_required
def change_password():
    # Old and new password of the user
    data = request.get_json()
    current_password = data["current_password"]
    new_password = data["new_password"]

    # The new password is hashed
    new_hashed_pw = password_handler.hash_password(new_password)

    # Extraction of the user_id
    payload = g.user_payload
    user_id = int(payload["sub"])

    # An attempt is being made to change the user's password
    user = AuthManager.change_password(
        user_id=user_id, current_password=current_password, new_password=new_hashed_pw
    )
    if not user:
        return jsonify({"error": "The current password is incorrect"}), 401

    return jsonify({"success": "password changed successfully"}), 200


@settings_bp.route("/upload_avatar", methods=["POST"])
@token_required
def upload_avatar():
    file_storage = request.files.get("file")
    file_obj = None
    if file_storage:
        # Pass a file-like to Cloudinary (FileStorage.stream)
        file_obj = file_storage.stream
    else:
        # fallback: try JSON / base64 (if the frontend sends base64 in the body)
        data = request.get_json(silent=True)
        if (
            data
            and isinstance(data.get("file"), str)
            and data["file"].startswith("data:")
        ):
            import base64, io

            header, encoded = data["file"].split(",", 1)
            file_bytes = base64.b64decode(encoded)
            file_obj = io.BytesIO(file_bytes)

    if not file_obj:
        return jsonify({"error": "No file provided"}), 400

    result = CloudinaryHandler.upload_avatar(file=file_obj)
    if not result:
        return jsonify({"error": "error uploading the photo"}), 500

    payload = g.user_payload
    user_id = int(payload["sub"])

    user = SettingManager.save_avatar(
        user_id=user_id, public_id=result["public_id"], secure_url=result["secure_url"]
    )
    if not user:
        return jsonify({"error": "error uploading the photo"}), 500

    return jsonify({"user": user}), 200


@settings_bp.route("delete_avatar")
@token_required
def delete_avatar():
    # Extraction of the user_id
    payload = g.user_payload
    user_id = int(payload["sub"])

    # Extraction of the avatar_public_id in the database
    avatar_public_id = SettingManager.get_avatar_public_id(user_id=user_id)

    # An attempt is being made to delete the file from the Cloudinary cloud.
    result = CloudinaryHandler.delete_avatar(avatar_public_id=avatar_public_id)
    if not result:
        return jsonify({"error": "Unknown error."}), 500

    # The avatar_public_id and avatar_url is deleted from the user of the database
    user = SettingManager.delete_avatar(user_id=user_id)
    if not user:
        return jsonify({"error": "Unknown error."}), 500

    return jsonify({"user": user})
