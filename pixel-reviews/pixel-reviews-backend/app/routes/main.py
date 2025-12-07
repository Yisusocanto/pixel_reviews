from flask import Blueprint, g, jsonify, request, make_response
from app.database import GameManager, ReviewManager
from app.utils.jwt_handler import token_required
from app.services.rawg_api import RawgApi
from app.utils.jwt_handler import JwtHandler

rawg_api = RawgApi()

main_bp = Blueprint("main", __name__, url_prefix="/main")


@main_bp.route("/", methods=["GET"])
def index():
    page = request.args.get("page")
    limit = request.args.get("limit")

    if page and limit:
        try:
            page_number = int(page)
            limit_number = int(limit)
        except Exception as e:
            print(f"Error on route '/main': {e}")
            return jsonify(
                {"error": "Type error on page or limit param. It should be Integer"}
            ), 400
    else:
        return jsonify({"error": "The query params 'page' and 'limit' are obligatory"}), 400

    offset = (page_number - 1) * limit_number

    try:
        reviews = ReviewManager.get_reviews(limit=limit_number, offset=offset)
        if reviews == "error":
            return jsonify({"error": "Database error"}), 500

        return jsonify(
            {
                "results": reviews,
                "info": {"page": page, "limit": limit, "results": len(reviews)},
            }
        ), 200
    except Exception as e:
        print(f"ERROR on ReviewManager: {e}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


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

    user_rating = None
    user_review = None

    token = request.cookies.get("jwt_pixel_reviews")

    if token:
        payload = JwtHandler.check_jwt(token)
        if not payload:
            response = make_response(jsonify({"message": "Token invalid"}))
            response.set_cookie(
                "jwt_pixel_reviews",
                "",
                max_age=0,
                samesite='None',
                httponly=True,
                secure=True,
            )
            return response, 401

        user_id = int(payload["sub"])

        user_rating = ReviewManager.get_user_rating(
            game_id=game["game_id"], user_id=user_id
        )
        user_review = ReviewManager.get_user_review(
            game_id=game["game_id"], user_id=user_id
        )

    return jsonify(
        {
            "game": game,
            "userRating": user_rating,
            "userReview": user_review,
        }
    ), 200