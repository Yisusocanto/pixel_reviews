from flask import Blueprint, g, jsonify, request
from app.database import GameManager, ReviewManager
from app.utils.jwt_handler import token_required
from app.services.rawg_api import RawgApi

rawg_api = RawgApi()

main_bp = Blueprint("main", __name__, url_prefix="/main")


@main_bp.route("/", methods=["GET", "OPTIONS"])
def index():
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", request.headers.get('Origin'))
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200
    
    # GET request normal
    page = request.args.get("page")
    limit = request.args.get("limit")

    if page and limit:
        try:
            page_number = int(page)
            limit_number = int(limit)
        except Exception as e:
            print(f"❌ Error on route '/main': {e}")
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
        print(f"❌ ERROR en ReviewManager: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@main_bp.route("/search/<game_title>", methods=["GET", "OPTIONS"])
@token_required
def search(game_title):
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", request.headers.get('Origin'))
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200
        
    game_list = rawg_api.search_games(game_title)
    if not game_list:
        return jsonify({"message": "No results"}), 404

    return jsonify({"game_list": game_list}), 200


@main_bp.route("/games/<slug>", methods=["GET", "OPTIONS"])
@token_required
def game_details(slug):
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", request.headers.get('Origin'))
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200
        
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

    return jsonify(
        {
            "game_data": game,
            "user_rating_data": user_rating,
            "user_review_data": user_review,
        }
    ), 200