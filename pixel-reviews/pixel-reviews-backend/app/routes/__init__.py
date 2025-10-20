from flask import Flask, redirect, render_template, g, url_for
from app.utils.jwt_handler import already_authenticated
import os
from .auth import auth_bp
from .users import users_bp
from .main import main_bp
from .api import api_bp
from.review import review_bp
from flask_cors import CORS
from app.extensions.marshmallow import ma


def create_app():

    template_dir = os.path.abspath('templates')
    static_dir = os.path.abspath('templates/images')
    
    app = Flask(__name__, 
                template_folder=template_dir,
                static_folder=static_dir)
    
    ma.init_app(app)
    
    CORS(app, 
    resources={r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Set-Cookie"],
        "supports_credentials": True,
        "send_wildcard": False
    }}
)
    
    @app.route("/")
    @already_authenticated()
    def index():
        return render_template("index.html")

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(review_bp)
    
    return app
