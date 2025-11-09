from flask import Blueprint, request, g, jsonify
from app.database import ReviewManager
from app.utils.jwt_handler import token_required

# Blueprint that handles API functionalities
api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.route("/create_rating", methods=["POST"])
@token_required
def create_or_update_rating():
    data = request.get_json()

    # Game's id and rating's score
    game_id = data.get("game_id")
    score = data.get("score")

    # Return error 400 (bad request) if one of those does not exits
    if not game_id or not score:
        return jsonify({"error": "data missing"}), 400

    # Return error 400 if the score is not between 1 and 5
    if score < 1 and score > 5:
        return jsonify({"error": "score out of range"}), 400

    # Extraction of the user_id
    payload = g.user_payload
    user_id = int(payload["sub"])

    # Creation or updating of the rating
    ReviewManager._create_or_update_rating(
        game_id=game_id, user_id=user_id, score=score
    )
    # Get of the new rating and review (if exits)
    rating = ReviewManager.get_user_rating(game_id=game_id, user_id=user_id)
    review = ReviewManager.get_user_review(game_id=game_id, user_id=user_id)

    if not rating:
        return jsonify({"error": "An error ocurred creating the rating"})

    return jsonify({"rating": rating, "review": review}), 200


@api_bp.route("/create_review", methods=["POST"])
@token_required
def create_or_update_review():
    data = request.get_json()

    # Review data
    review_title = data.get("review_title")
    review_content = data.get("review_content")
    game_id = data.get("game_id")
    score = data.get("score")

    # An error is returned if one of the data items does not exist
    if not review_content or not review_title or not score:
        return jsonify({"error": "Review fields cannot be empty"}), 400

    if not game_id:
        return jsonify({"error": "game_id cannot be empty"}), 400

    if score < 1 and score > 5:
        return jsonify({"error": "score out of range"}), 400

    # Extraction of the user_id
    payload = g.user_payload
    user_id = int(payload["sub"])

    # Creation or updating of the review
    review = ReviewManager.create_or_update_review(
        game_id=game_id,
        user_id=user_id,
        title=review_title,
        content=review_content,
        rating_score=score,
    )
    rating = ReviewManager.get_user_rating(game_id=game_id, user_id=user_id)

    if not review:
        return jsonify({"error", "An error ocurred creating the review"}), 500

    return jsonify({"review": review, "rating": rating}), 200
