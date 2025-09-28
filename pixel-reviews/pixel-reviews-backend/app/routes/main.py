from flask import Blueprint, render_template, request, g, jsonify
from app.database.database_manage import DatabaseManager
from app.utils.jwt_handler import token_required
from app.services.rawg_api import RawgApi

rawg_api = RawgApi()

main_bp = Blueprint("main", __name__, url_prefix="/main")
db = DatabaseManager()


@main_bp.route("/")
@token_required
def index():
    reviews = db.get_review_count(reviews_count=10)
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

    game = db.find_or_create_game(slug)
    if not game:
        return jsonify({"message": "game not exits or an error ocurred"}), 404

    user_rating = db.get_user_rating(game["game_id"], user_id)
    user_review = db.get_user_review(game["game_id"], user_id)


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
