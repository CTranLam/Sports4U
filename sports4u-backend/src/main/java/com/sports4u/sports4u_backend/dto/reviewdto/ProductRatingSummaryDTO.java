package com.sports4u.sports4u_backend.dto.reviewdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRatingSummaryDTO {
    private Double averageRating;
    private Long totalReviews;
}
