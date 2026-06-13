package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.reviewdto.CreateReviewRequestDTO;
import com.sports4u.sports4u_backend.dto.reviewdto.ProductRatingSummaryDTO;
import com.sports4u.sports4u_backend.dto.reviewdto.ReviewDTO;
import com.sports4u.sports4u_backend.utils.PageResponse;

public interface IReviewService {
    ReviewDTO createReview(String email, CreateReviewRequestDTO request) throws IllegalArgumentException;

    PageResponse<ReviewDTO> getReviewsByProduct(Long productId, int page, int size) throws IllegalArgumentException;

    ProductRatingSummaryDTO getRatingSummary(Long productId) throws IllegalArgumentException;
}
