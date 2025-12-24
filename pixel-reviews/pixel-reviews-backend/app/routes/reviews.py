from flask import Blueprint, g, jsonify, request
from app.database import ReviewManager
from app.utils.jwt_handler import token_required
from app.utils.jwt_handler import JwtHandler


reviews_bp = Blueprint("reviews", __name__, url_prefix="/reviews")


@reviews_bp.route("/", methods=["GET"])
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


@reviews_bp.route("/user_review/<game_id>", methods=["GET"])
@token_required
def user_review(game_id):
    payload = g.user_payload
    user_id = int(payload["sub"])

    review = ReviewManager.get_user_review(game_id, user_id)
    rating = ReviewManager.get_user_rating(game_id, user_id)

    if not review and not rating:
        return jsonify({"error": "The user does not have a review or rating."}), 404

    return jsonify({"review": review, "rating": rating}), 200


@reviews_bp.route("/create_rating", methods=["POST"])
@token_required
def create_or_update_rating():
    data = request.get_json()

    # Game's id and rating's score
    game_id = data.get("game_id")
    score = data.get("score")

    # Return error 400 (bad request) if one of those does not exit
    if not game_id or not score:
        return jsonify({"error": "data missing"}), 400

    # Return error 400 if the score is not between 1 and 5
    if 1 > score > 5:
        return jsonify({"error": "score out of range"}), 400

    # Extraction of the user_id
    payload = g.user_payload
    user_id = int(payload["sub"])

    # Creation or updating of the rating
    ReviewManager.create_or_update_rating(game_id=game_id, user_id=user_id, score=score)
    # Get of the new rating and review (if exits)
    rating = ReviewManager.get_user_rating(game_id=game_id, user_id=user_id)
    review = ReviewManager.get_user_review(game_id=game_id, user_id=user_id)

    if not rating:
        return jsonify({"error": "An error occurred creating the rating"}), 500

    return jsonify({"rating": rating, "review": review}), 200


@reviews_bp.route("/create_review", methods=["POST"])
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

    if 1 > score > 5:
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
        return jsonify({"error", "An error occurred creating the review"}), 500

    return jsonify({"review": review, "rating": rating}), 200


@reviews_bp.route("/<int:review_id>", methods=["DELETE"])
@token_required
def delete_review(review_id):
    success = ReviewManager.delete_review(review_id)
    if not success:
        return jsonify({"error": "The review does not exits."}), 400

    return jsonify({"success": "The review has been deleted successfully."}), 200
