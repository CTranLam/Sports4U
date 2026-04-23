package com.sports4u.sports4u_backend.dto.admindto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPurchaseStatsListResponse {
    private List<ProductPurchaseStatsDTO> stats;
}

