import psycopg2
import logging
from src.config import settings

logger = logging.getLogger(__name__)

def get_db_connection():
    logger.info(f"Connecting to database {settings.DB_NAME} at {settings.DB_HOST}:{settings.DB_PORT}")
    return psycopg2.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        database=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASS
    )
