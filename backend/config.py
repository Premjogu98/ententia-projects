import os
from dotenv import load_dotenv


load_dotenv()


class Config:
    SERVICE_NAME = "backend"
    SERVICE_DESCRIPTION = ""
    VERSION = "1.0.0"
    SUBROUTE = "insights"

    DATABASE_NAME = os.getenv("DATABASE_NAME", "ententia")
    DATABASE_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME", "ententia")
    DATABASE_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD", "Ententia321")
    DATABASE_HOST = os.getenv("DATABASE_HOST", "mongo")
    DATABASE_AUTHENTICATION_SOURCE = os.getenv("DATABASE_AUTHENTICATION_SOURCE", "admin")

    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))


config = Config()
