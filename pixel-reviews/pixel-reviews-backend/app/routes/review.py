from flask import Blueprint, request, g, render_template, url_for
from app.utils.jwt_handler import token_required
from app.database.database_manage import DatabaseManager

review_bp = Blueprint("reviews", __name__, url_prefix="/reviews")
db = DatabaseManager()


@review_bp.route("/review_game/<slug>")
@token_required
def review_game(slug):
    game = db.get_game(slug)
    return render_template("review_game.html", game=game)
    