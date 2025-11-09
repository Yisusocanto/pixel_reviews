from flask import Flask
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

    template_dir = os.path.abspath('templates')
    static_dir = os.path.abspath('templates/images')
    
    app = Flask(__name__, 
                template_folder=template_dir,
                static_folder=static_dir)
    
    ma.init_app(app)
    
    CORS(app, 
    resources={r"/*": {
        "origins": os.getenv("LOCAL_FRONTEND_URL"),
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Set-Cookie"],
        "supports_credentials": True,
        "send_wildcard": False
    }}
)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(settings_bp)
    
    return app
