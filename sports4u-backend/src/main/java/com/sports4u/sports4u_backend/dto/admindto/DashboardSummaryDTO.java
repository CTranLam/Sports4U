package com.sports4u.sports4u_backend.dto.admindto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
}
