import jwt
from datetime import datetime, timedelta, timezone
from flask import request, redirect, url_for, make_response, render_template, g
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()
SECRECT_KEY = os.getenv("SECRECT_KEY_JWT")


class JwtHandler:
    """class that handles the creation and verification of JWTs"""

    @staticmethod
    def create_jwt(user_id):
        payload = {
            "sub": str(user_id),
            "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=30)
        }
        token = jwt.encode(payload, SECRECT_KEY, algorithm="HS256")
        return token
    
    @staticmethod
    def check_jwt(token):
        try:
            payload = jwt.decode(token, SECRECT_KEY, algorithms="HS256")
            return payload
        except Exception as e:
            print(f"error {e}")
            return False


# --- Decorador para verificar el token y exponer el payload ---
def token_required(f):
    """
    Decorador para proteger rutas que requieren un token JWT.
    Verifica la presencia y validez del token 'jwt_pixel_reviews' en las cookies.
    Si el token es válido, el payload se almacena en `g.user_payload`.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get("jwt_pixel_reviews")

        if not token:
            return redirect(url_for("auth.login", _external=True))

        payload = JwtHandler.check_jwt(token)

        if not payload:
            response = make_response(render_template("login.html", error="Tu sesión ha expirado o el token no es válido. Por favor, inicia sesión de nuevo."))
            response.set_cookie(
                "jwt_pixel_reviews", "", max_age=0, samesite="Lax", httponly=True, secure=True
            )
            return response
        
        # Almacenar el payload en el objeto 'g' de Flask.
        # 'g' es un objeto especial que está disponible durante el ciclo de vida de una solicitud.
        # Puedes usar cualquier nombre de atributo, 'user_payload' o 'current_user' son comunes.
        g.user_payload = payload
        
        return f(*args, **kwargs)
    return decorated_function

def already_authenticated(redirect_endpoint="main.index"):
    """
    Decorador para evitar que usuarios autenticados accedan a rutas como login o registro.
    Si el usuario ya tiene un JWT válido, lo redirige.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.cookies.get("jwt_pixel_reviews")
            payload = JwtHandler.check_jwt(token) if token else None
            if payload:
                return redirect(url_for(redirect_endpoint))
            return f(*args, **kwargs)
        return decorated_function
    return decorator