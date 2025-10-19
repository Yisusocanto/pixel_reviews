from flask import Blueprint, request, g, jsonify, make_response, url_for, redirect
from app.database.database_manage import DatabaseManager
from app.utils.jwt_handler import token_required

db = DatabaseManager()

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.route("/create_rating", methods=["POST"])
@token_required
def create_or_update_rating():
    data = request.get_json()

    game_id = data.get("game_id")
    score = data.get("score")

    if not game_id or not score:
        return jsonify({"error": "data missing"}), 400

    if score < 1 and score > 5:
        return jsonify({"error": "score out of range"}), 400

    payload = g.user_payload
    user_id = int(payload["sub"])

    db.create_or_update_rating(user_id, game_id, score)
    rating = db.get_user_rating(game_id=game_id, user_id=user_id)
    review = db.get_user_review(game_id=game_id, user_id=user_id)
    if not rating:
        return jsonify({"error": "An error ocurred creating the rating"})

    return jsonify({"rating": rating, "review": review}), 200


@api_bp.route("/create_review", methods=["POST"])
@token_required
def create_or_update_review():
    data = request.get_json()

    review_title = data.get("review_title")
    review_content = data.get("review_content")
    game_id = data.get("game_id")
    score = data.get("score")

    if not review_content or not review_title or not score:
        return jsonify({"error": "Review fields cannot be empty"}), 400

    if not game_id:
        return jsonify({"error": "game_id cannot be empty"}), 400
    
    if score < 1 and score > 5:
        return jsonify({"error": "score out of range"}), 400

    payload = g.user_payload
    user_id = int(payload["sub"])

    review = db.create_or_update_review(
        game_id, user_id, review_title, review_content, score
    )
    rating = db.get_user_rating(game_id=game_id, user_id=user_id)

    if not review:
        return jsonify({"error", "An error ocurred creating the review"}), 500

    return jsonify({"review": review, "rating": rating}), 200
