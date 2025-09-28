from flask import Blueprint, redirect, render_template, url_for, g, jsonify
from app.database.database_manage import DatabaseManager
from app.utils.jwt_handler import token_required

database_manager = DatabaseManager()

users_bp = Blueprint("users", __name__, url_prefix="/users")

@users_bp.route("/<username>")
@token_required
def profile(username): 
    user = database_manager.returning_user_data(username)
    if not user:
        print("ocurrio un error retornando el ususario")
        return jsonify({"message": "An error ocurred returning the user data or do not exits"}), 404
        
    return jsonify({"user_data": user}), 200