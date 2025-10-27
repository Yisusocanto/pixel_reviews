from flask import Blueprint, g, jsonify
from app.database import GameManager, ReviewManager
from app.utils.jwt_handler import token_required
from app.services.rawg_api import RawgApi

rawg_api = RawgApi()

main_bp = Blueprint("main", __name__, url_prefix="/main")


@main_bp.route("/")
def index():
    reviews = ReviewManager.get_recent_reviews(count=10)
    return jsonify({"reviews": reviews}), 200


@main_bp.route("/search/<game_title>")
@token_required
def search(game_title):
    game_list = rawg_api.search_games(game_title)
    if not game_list:
        return jsonify({"message": "No results"}), 404

    return jsonify({"game_list": game_list}), 200


@main_bp.route("/games/<slug>")
@token_required
def game_details(slug):
    payload = g.user_payload
    user_id = int(payload["sub"])

    game = GameManager.find_or_create_game(slug=slug)
    if not game:
        return jsonify({"message": "game not exits or an error ocurred"}), 404

    user_rating = ReviewManager.get_user_rating(
        game_id=game["game_id"], user_id=user_id
    )
    user_review = ReviewManager.get_user_review(
        game_id=game["game_id"], user_id=user_id
    )

    return (
        jsonify(
            {
                "game_data": game,
                "user_rating_data": user_rating,
                "user_review_data": user_review,
            }
        ),
        200,
    )
