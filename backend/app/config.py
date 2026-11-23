"""Application configuration."""

import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///pantrypal.db",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    USE_SOON_DAYS = int(os.getenv("USE_SOON_DAYS", "3"))

class TestConfig(Config): 
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"