export interface CategoryDTO {
  categoryId: number;
  categoryName: string;
  productCount: number;
  parentId: number | null;
}

export interface CategoryListResponse {
  categories: CategoryDTO[];
}

export interface ProductDTO {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  description: string;
  categoryId: number;
  categoryName: string;
  origin: string;
  advantages: string;
  quantity: number;
  inStock: boolean;
  isPopular: boolean;
}

export interface ReviewDTO {
  reviewId: number;
  productId: number;
  fullName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequestDTO {
  productId: number;
  rating: number;
  comment: string;
}

export interface ProductRatingSummaryDTO {
  averageRating: number;
  totalReviews: number;
}
