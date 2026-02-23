package com.sports4u.sports4u_backend.dto.admindto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductCategoryStatsListResponse {
    private List<ProductCategoryStatsDTO> stats;
}

