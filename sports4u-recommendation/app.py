import logging
import uvicorn
from fastapi import FastAPI
from src.routers import router

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = FastAPI(
    title="Sports4U KNN Recommendation API",
    description="A microservice using KNN Cosine Distance to recommend similar products.",
    version="1.0.0"
)

# Register routes
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000)
