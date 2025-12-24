from flask import Blueprint, request, jsonify, g
from app.utils.jwt_handler import token_required
from app.database.game_manager import GameManager
from app.services.rawg_api import RawgApi

games_bp = Blueprint("games", __name__, url_prefix="/games")


@games_bp.route("/search/<game_title>", methods=["GET"])
def search(game_title):
    game_list = RawgApi().search_games(game_title)
    if not game_list:
        return jsonify({"message": "No results"}), 404

    return jsonify({"game_list": game_list}), 200


@games_bp.route("/<slug>", methods=["GET"])
def game_details(slug):
    game = GameManager.find_or_create_game(slug=slug)
    if not game:
        return jsonify({"message": "game not exits or an error occurred"}), 404

    return jsonify({"game": game}), 200


@games_bp.route("/<game_id>/in_user_wishlist", methods=["GET"])
@token_required
def in_user_wishlist(game_id):
    payload = g.user_payload
    user_id = int(payload["sub"])

    in_user_wishlist_value = GameManager.in_user_wishlist(
        user_id=user_id, game_id=game_id
    )
    return jsonify({"inUserWishlist": in_user_wishlist_value}), 200
