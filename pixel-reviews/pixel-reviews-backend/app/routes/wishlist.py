from flask import request, jsonify, Blueprint, g
from app.utils.jwt_handler import token_required
from app.database.wishlist_manager import WishlistManager


wishlist_bp = Blueprint("wishlist", __name__, url_prefix="/wishlist")


@wishlist_bp.route("/toggle", methods=["POST"])
@token_required
def add_to_wishlist():
    payload = g.user_payload

    data = request.get_json()
    game_id = data.get("game_id")
    user_id = int(payload["sub"])

    if not game_id:
        return jsonify({"error": "game_id was not provided."}), 400

    wishlist_item = WishlistManager.toggle_wishlist_item(game_id=game_id, user_id=user_id)

    if isinstance(wishlist_item, dict) and "error" in wishlist_item:
        return jsonify(wishlist_item), 500

    if not wishlist_item:
        return jsonify({"error": "Unknown error."}), 500

    return jsonify({"success": "Game has been added/removed to/from the wishlist"}), 200


