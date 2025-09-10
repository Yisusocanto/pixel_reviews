from flask import Blueprint, render_template, request, g
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
    return render_template("feed.html", reviews=reviews)

@main_bp.route("/search", methods=["GET"])
@token_required
def search():
    game_title = request.args.get("search_game", "")
    if not game_title:
        return "escribe un juego sapo"
    
    try:
        games = rawg_api.search_games(game_title)
        return render_template("search_game.html", games=games)
    except Exception as e:
        return "Sin resultados"


@main_bp.route("/search/<slug>")
@token_required
def game_details(slug):
    payload = g.user_payload
    user_id = int(payload["sub"])

    game = db.find_or_create_game(slug)
    rating = db.get_rating(game.game_id, user_id)
    user_review = db.get_user_review(user_id, game.game_id)
    print(user_review)
    return render_template("game_details.html", game=game, rating=rating, user_review=user_review)
    
    
    

