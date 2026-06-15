import pandas as pd
import numpy as np
import logging
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack, csr_matrix
from src.database import get_db_connection

logger = logging.getLogger(__name__)

class RecommendationService:
    @staticmethod
    def get_all_active_products() -> pd.DataFrame:
        try:
            conn = get_db_connection()
            query = """
                SELECT product_id, category_id, name, origin, advantages, price, is_popular 
                FROM products 
                WHERE is_deleted = false
            """
            df = pd.read_sql_query(query, conn)
            conn.close()
            return df
        except Exception as e:
            logger.error(f"Failed to query database: {str(e)}")
            raise e

    @classmethod
    def get_knn_recommendations(cls, target_product_id: int, k: int = 6) -> list:
        df = cls.get_all_active_products()
        if df.empty:
            logger.warning("No products found in the database.")
            return []

        if target_product_id not in df['product_id'].values:
            logger.warning(f"Product ID {target_product_id} not found or is deleted.")
            raise ValueError(f"Product with ID {target_product_id} not found or is deleted.")

        # Get index of the target product
        target_idx = df[df['product_id'] == target_product_id].index[0]

        # Combine text fields (name, origin, advantages)
        df['text_features'] = (
            df['name'].fillna('') + ' ' + 
            df['origin'].fillna('') + ' ' + 
            df['advantages'].fillna('')
        )
        
        # TF-IDF Vectorizer (weight = 1.5)
        tfidf = TfidfVectorizer(stop_words=None)
        tfidf_matrix = tfidf.fit_transform(df['text_features']) * 1.5

        # MinMaxScaler for price (weight = 1.0)
        scaler = MinMaxScaler()
        prices_scaled = scaler.fit_transform(df[['price']]) * 1.0

        # Numeric popularity (weight = 0.5)
        popularity_scaled = (df[['is_popular']].astype(int).values) * 0.5

        # One-hot encode category (weight = 2.0)
        categories_encoded = pd.get_dummies(df['category_id']).values * 2.0

        # Concatenate features
        features_combined = hstack([
            tfidf_matrix,
            csr_matrix(prices_scaled),
            csr_matrix(popularity_scaled),
            csr_matrix(categories_encoded)
        ])

        # Nearest Neighbors Model
        n_neighbors = min(len(df), k + 1)
        knn = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine')
        knn.fit(features_combined)

        # Query neighbors
        distances, indices = knn.kneighbors(features_combined[target_idx])
        
        # Exclude target product
        recommended_ids = []
        for idx in indices[0]:
            pid = int(df.iloc[idx]['product_id'])
            if pid != target_product_id:
                recommended_ids.append(pid)
                
        return recommended_ids[:k]
