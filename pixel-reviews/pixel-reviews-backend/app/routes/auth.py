from flask import Blueprint, request, make_response, jsonify
from app.utils.validations import execute_validations
from app.database.database_manage import DatabaseManager
from app.utils.jwt_handler import JwtHandler
from app.utils import password_handler

# An instance of the database is created
database_manager = DatabaseManager()

# Blueprint that handles authentication paths
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/sign_up", methods=["POST"])
def sign_up():  # route that handles user creation
    # User data sent from the frontend is collected
    response = request.get_json()
    email = response["email"]
    username = response["username"]
    password = response["password"]
    name = response["name"]
    lastname = response["lastname"]
    age = response["birthday"]

    # the data is validated and errors and a 400 code are returned to the frontend if there are errors
    errors = execute_validations(email, username, password, name, lastname, age)
    if errors:
        return jsonify({"errors": errors}), 400

    # Password is encrypted
    hashed_pw = password_handler.hash_password(password)

    # The user is created and the token is created from the user_id of the created user
    user_id = database_manager.create_user(
        email, hashed_pw, username, name, lastname, age
    )
    token = JwtHandler.create_jwt(user_id)
    response = make_response(
        jsonify({"message": "session started succesfully", "state": True}), 200
    )
    response.set_cookie(
        "jwt_pixel_reviews",
        token,
        max_age=10000000,
        httponly=True,
        secure=False,
        samesite="Lax",
    )
    return response


@auth_bp.route("/login", methods=["POST"])
def login():
    response_data = request.get_json()
    username = response_data["username"]
    password = response_data["password"]

    # user validation
    hashed_password = database_manager.check_user_exits(username)
    if not hashed_password:
        return jsonify({"message": "username incorrect or not exits", "state": False}), 400

    if not password_handler.check_password(password, hashed_password):
        return jsonify({"message": "the password is incorrect", "state": False}), 400

    user_id = database_manager.returnig_user_id(username)
    token = JwtHandler.create_jwt(user_id)

    # Crear respuesta
    response = make_response(
        jsonify({"message": "session started successfully", "state": True}), 200
    )
    
    # Establecer cookie con configuración específica para desarrollo local
    response.set_cookie(
        "jwt_pixel_reviews",
        token,
        max_age=86400,  # 24 horas en segundos
        httponly=True,
        secure=False,   # False para desarrollo sin HTTPS
        samesite="Lax",
    )
    return response


@auth_bp.route("/already_auth", methods=["GET", "OPTIONS"])
def already_auth():
    token = request.cookies.get("jwt_pixel_reviews")    
    if token:
        try:
            payload = JwtHandler.check_jwt(token)
            if payload:
                return jsonify({"already_auth": True}), 200
        except Exception as e:
            print(f"Error verificando token: {e}")
    
    # Si no hay token o es inválido
    response = make_response(jsonify({"already_auth": False}), 200)
    
    # Eliminar cookie si existe pero es inválida
    if token:
        response.set_cookie(
            "jwt_pixel_reviews",
            "",
            max_age=0,
            httponly=True,
            secure=False,
        )
    return response
