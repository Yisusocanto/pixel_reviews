from flask import Blueprint, request, g, jsonify, make_response, url_for, redirect
from app.database.database_manage import DatabaseManager
from app.utils.jwt_handler import token_required

db = DatabaseManager()

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.route("/ratings", methods=["POST"])
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

    message = db.create_or_update_rating(user_id, game_id, score)
    return jsonify({"message": message}), 200


@api_bp.route("/reviews", methods=["POST"])
@token_required
def create_or_update_review():
    data = request.get_json()

    review_title = data.get("review_title")
    review_content = data.get("review_content")
    game_id = data.get("game_id")

    if not review_content or not review_title:
        return jsonify({"error": "Review fields cannot be empty"}), 400
    
    if not game_id:
        return jsonify({"error": "game_id cannot be empty"}), 400

    payload = g.user_payload
    user_id = int(payload["sub"])

    message = db.create_or_update_review(game_id, user_id, review_title, review_content)

    game = db.get_game_by_his_id(game_id)
    return redirect(url_for("main.game_details", slug=game.slug))