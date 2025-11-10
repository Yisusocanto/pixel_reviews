from flask import Flask
from app.routes import create_app
from dotenv import load_dotenv
import os

load_dotenv()

app = create_app()

