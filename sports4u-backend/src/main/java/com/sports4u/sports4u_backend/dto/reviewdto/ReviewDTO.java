package com.sports4u.sports4u_backend.dto.reviewdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDTO {
    private Long reviewId;
    private Long productId;
    private String fullName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
