package com.sports4u.sports4u_backend.converter;

import com.sports4u.sports4u_backend.dto.reviewdto.ReviewDTO;
import com.sports4u.sports4u_backend.entity.ReviewEntity;
import org.springframework.stereotype.Component;

@Component
public class ReviewEntityToDTO {
    public static ReviewDTO convertToReviewDTO(ReviewEntity review) {
        if (review == null) return null;

        return ReviewDTO.builder()
                .reviewId(review.getReviewId())
                .productId(review.getProduct().getProductId())
                .fullName(review.getUser().getFullName() != null ? review.getUser().getFullName() : review.getUser().getEmail())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
