"""PantryPal Flask application factory."""

from flask import Flask
from flask_cors import CORS

from .config import Config
from .models import db



def create_app(config_object=Config):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    CORS(app, origins = app.config["CORS_ORIGINS"])

    from .routes import api
    app.register_blueprint(api, url_prefix="/api")
    #create tables on startup. Swap for Flask-Migrate later
    with app.app_context():
        db.create_all()

    return app
