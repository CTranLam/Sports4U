package com.sports4u.sports4u_backend.dto.admindto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPurchaseStatsDTO {
    private Long productId;
    private String productName;
    private Long totalQuantitySold;
}

