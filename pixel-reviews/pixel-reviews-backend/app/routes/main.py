from flask import Blueprint, g, jsonify, request
from app.database import GameManager, ReviewManager
from app.utils.jwt_handler import token_required
from app.services.rawg_api import RawgApi
from app.utils.jwt_handler import JwtHandler

rawg_api = RawgApi()

main_bp = Blueprint("main", __name__, url_prefix="/main")


@main_bp.route("/", methods=["GET"])
def index():
    # Auth user's user_id to verify if the review has like or not
    user_id = None
    token = request.cookies.get("jwt_pixel_reviews")
    if token:
        payload = JwtHandler.check_jwt(token)
        if payload:
            user_id = int(payload["sub"])

    page = request.args.get("page")
    limit = request.args.get("limit")

    if page and limit:
        try:
            page_number = int(page)
            limit_number = int(limit)
        except Exception as e:
            print(f"Error on route '/main': {e}")
            return (
                jsonify(
                    {"error": "Type error on page or limit param. It should be Integer"}
                ),
                400,
            )
    else:
        return (
            jsonify({"error": "The query params 'page' and 'limit' are obligatory"}),
            400,
        )

    offset = (page_number - 1) * limit_number

    reviews = ReviewManager.get_reviews(
        limit=limit_number, offset=offset, user_id=user_id
    )
    if isinstance(reviews, dict):
        return jsonify(reviews), 500

    return (
        jsonify(
            {
                "results": reviews,
                "info": {
                    "page": page_number,
                    "limit": limit_number,
                    "results": len(reviews),
                },
            }
        ),
        200,
    )


@main_bp.route("/search/<game_title>", methods=["GET"])
def search(game_title):
    game_list = rawg_api.search_games(game_title)
    if not game_list:
        return jsonify({"message": "No results"}), 404

    return jsonify({"game_list": game_list}), 200


@main_bp.route("/games/<slug>", methods=["GET"])
def game_details(slug):
    game = GameManager.find_or_create_game(slug=slug)
    if not game:
        return jsonify({"message": "game not exits or an error occurred"}), 404

    return jsonify({"game": game}), 200


@main_bp.route("/games/<game_id>/in_user_wishlist", methods=["GET"])
@token_required
def in_user_wishlist(game_id):
    payload = g.user_payload
    user_id = int(payload["sub"])

    in_user_wishlist_value = GameManager.in_user_wishlist(
        user_id=user_id, game_id=game_id
    )
    return jsonify({"inUserWishlist": in_user_wishlist_value}), 200


@main_bp.route("/user_review/<game_id>", methods=["GET"])
@token_required
def user_review(game_id):
    payload = g.user_payload
    user_id = int(payload["sub"])

    review = ReviewManager.get_user_review(game_id, user_id)
    rating = ReviewManager.get_user_rating(game_id, user_id)

    if not review and not rating:
        return jsonify({"error": "The user does not have a review or rating."}), 404

    return jsonify({"review": review, "rating": rating}), 200
