import apiClient from './apiClient';
import type { ResponseDTO, PageResponse, ReviewDTO, CreateReviewRequestDTO, ProductRatingSummaryDTO } from '../types/api';

export const reviewService = {
  // Lấy danh sách đánh giá của sản phẩm (phân trang)
  getReviewsByProduct: async (
    productId: number,
    page = 1,
    size = 5
  ): Promise<ResponseDTO<PageResponse<ReviewDTO>>> => {
    return await apiClient.get(`/products/${productId}/reviews`, {
      params: { page, size },
    });
  },

  // Lấy tổng hợp rating của sản phẩm
  getRatingSummary: async (productId: number): Promise<ResponseDTO<ProductRatingSummaryDTO>> => {
    return await apiClient.get(`/products/${productId}/rating-summary`);
  },

  // Gửi đánh giá sản phẩm (yêu cầu đăng nhập)
  createReview: async (request: CreateReviewRequestDTO): Promise<ResponseDTO<ReviewDTO>> => {
    return await apiClient.post('/user/reviews', request);
  },
};
