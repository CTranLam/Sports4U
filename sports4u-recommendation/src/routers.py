from fastapi import APIRouter, HTTPException
from src.service import RecommendationService
from src.database import get_db_connection
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/health")
def health_check():
    try:
        conn = get_db_connection()
        conn.close()
        return {"status": "UP", "database": "CONNECTED"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "DOWN", "database": "DISCONNECTED", "error": str(e)}

@router.get("/recommend/{product_id}")
def recommend_products(product_id: int, k: int = 6):
    logger.info(f"Request received: recommend products for ID {product_id} (K={k})")
    try:
        recommendations = RecommendationService.get_knn_recommendations(product_id, k)
        return {
            "status": "success",
            "data": recommendations
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
