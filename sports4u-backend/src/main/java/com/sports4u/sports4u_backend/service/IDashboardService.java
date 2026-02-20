package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.admindto.DashboardSummaryDTO;
import com.sports4u.sports4u_backend.dto.admindto.OrdersLast7DaysDTO;
import com.sports4u.sports4u_backend.dto.admindto.ProductCategoryStatsDTO;
import com.sports4u.sports4u_backend.dto.admindto.RevenueByMonthDTO;

import java.util.List;

public interface IDashboardService {
    DashboardSummaryDTO getSummary();

    List<RevenueByMonthDTO> getRevenueByMonth(int year);

    List<ProductCategoryStatsDTO> getProductByCategory();

    List<OrdersLast7DaysDTO> getOrdersLast7Days();
}
