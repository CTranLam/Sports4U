import os

class Settings:
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_NAME: str = os.getenv("DB_NAME", "sports4u")
    DB_USER: str = os.getenv("DB_USERNAME", "postgres")
    DB_PASS: str = os.getenv("DB_PASSWORD", "postgres")

settings = Settings()
