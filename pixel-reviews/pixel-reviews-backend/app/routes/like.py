from flask import Blueprint, jsonify, request, g
from app.utils.jwt_handler import token_required
from app.database.like_manager import LikeManager

like_bp = Blueprint("likes", __name__, url_prefix="/likes")

@like_bp.route("/toggle", methods=["POST"])
@token_required
def toggle_like():
    payload = g.user_payload

    data = request.get_json()
    review_id = data.get("review_id")
    user_id = int(payload["sub"])

    like = LikeManager.toggle_like(user_id=user_id, review_id=review_id)
    if isinstance(like, dict) and "error" in like:
        return jsonify({"error": like}), 500

    if not like:
        return jsonify({"error": "Unknown error."})

    return jsonify({"success": "Like created/removed."})