from flask import request, jsonify, Blueprint
from app.utils.jwt_handler import token_required
from app.database.wishlist_manager import WishlistManager
from app.database.user_manager import UserManager
from app.database.game_manager import GameManager
from app.schemas.wishlist_item_schema import WishlistItemSchema


wishlist_bp = Blueprint("wishlist", __name__, url_prefix="/wishlist")


@wishlist_bp.route("/add_to_wishlist", methods=["POST"])
@token_required
def add_to_wishlist():
    data = request.get_json()
    # wishlist_item's data
    game_id = data.get("game_id")
    user_id = data.get("user_id")

    # An error is returned if there is no game_id or user_id
    if not game_id or not user_id:
        return jsonify({"error": "game_id and user_id were not provided."}), 400

    # An attempt to add the game from the wishlist
    wishlist_item = WishlistManager.add_to_wishlist(user_id, game_id)

    # An error is returned if the game was already in the wishlist
    if isinstance(wishlist_item, dict) and "error" in wishlist_item:
        return jsonify(wishlist_item), 500

    if not wishlist_item:
        return jsonify({"error": "Unknown error."}), 500

    user = UserManager.get_user_by_id(user_id)
    game = GameManager.get_game_by_id(game_id)

    return jsonify({"user": user, "game": game, "wishlist_item": wishlist_item}), 200

@wishlist_bp.route("/remove_from_wishlist", methods=["POST"])
@token_required
def remove_from_wishlist():
    data = request.get_json()
    # wishlist_item's data
    game_id = data.get("game_id")
    user_id = data.get("user_id")

    # An error is returned if there is no game_id or user_id
    if not game_id or not user_id:
        return jsonify({"error": "game_id and user_id were not provided."}), 400

    # An attempt to remove the game from the wishlist
    message = WishlistManager.remove_from_wishlist(user_id, game_id)
    if isinstance(message, dict) and "error" in message:
        return jsonify(message), 500

    user = UserManager.get_user_by_id(user_id)
    game = GameManager.get_game_by_id(game_id)

    return jsonify({"user": user, "game": game}), 200

