from flask import Flask, request
import os
from dotenv import load_dotenv
from .auth import auth_bp
from .users import users_bp
from .main import main_bp
from .api import api_bp
from .settings import settings_bp
from flask_cors import CORS
from app.extensions.marshmallow import ma

load_dotenv()


def create_app():
    template_dir = os.path.abspath("templates")
    static_dir = os.path.abspath("templates/images")

    app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # Para debug - verás esto en los logs de Render
    print(f"🔥 FRONTEND_URL: {frontend_url}")

    ma.init_app(app)

    # Configuración CORS
    CORS(
        app,
        origins=["http://localhost:5173", "https://pixel-reviews-livid.vercel.app"],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Headers adicionales para asegurar CORS
    @app.after_request
    def after_request(response):
        origin = request.headers.get("Origin")
        # Verifica que el origen sea el permitido
        if origin == frontend_url:
            response.headers["Access-Control-Allow-Origin"] = (
                "https://pixel-reviews-livid.vercel.app"
            )
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = (
                "Content-Type, Authorization"
            )
            response.headers["Access-Control-Allow-Methods"] = (
                "GET, POST, PUT, DELETE, OPTIONS"
            )
        return response

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(settings_bp)

    return app
