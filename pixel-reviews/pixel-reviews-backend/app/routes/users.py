from flask import Blueprint, redirect, request, render_template, url_for, make_response, g
from app.database.database_manage import DatabaseManager
from app.utils.jwt_handler import JwtHandler, token_required

database_manager = DatabaseManager()

users_bp = Blueprint("users", __name__, url_prefix="/users")

@users_bp.route("/redirecting_profile")
@token_required
def redirecting_profile():
    payload = g.user_payload
    user_id = int(payload["sub"])
    username = database_manager.returnig_username(user_id)
    return redirect(url_for("users.profile", username=username))


@users_bp.route("/profile/<username>")
@token_required
def profile(username): 
    user = database_manager.returning_user_data(username)
    if not user:
        print("ocurrio un error retornando el ususario")
        return "<h1>User not found</h1>"

    # user_dic = {
    #     "username": user[0],
    #     "email": user[1],
    #     "created_at": user[2].strftime("%Y-%m-%d"),
    #     "total_reviews": 0,
    #     "rating_prom": 0,
    #     "total_comments": 0,
    #     "followers": 0,
    #     "following": 0
    # }
    
    return render_template("profile.html", user=user)