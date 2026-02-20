package com.sports4u.sports4u_backend.dto.admindto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductCategoryStatsDTO {
    private String category;
    private long count;
}
