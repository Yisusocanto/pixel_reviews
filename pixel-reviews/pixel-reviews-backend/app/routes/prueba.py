from flask import Blueprint, render_template

prueba_bp = Blueprint("prueba", __name__, url_prefix="/prueba")

@prueba_bp.route("/ruta")
def prueba():
    return render_template("index.html")