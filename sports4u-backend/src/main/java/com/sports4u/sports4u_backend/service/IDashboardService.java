package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.admindto.*;

public interface IDashboardService {
    DashboardSummaryDTO getSummary();

    RevenueByMonthListResponse getRevenueByMonth(int year);

    ProductCategoryStatsListResponse getProductByCategory();

    OrdersLast7DaysListResponse getOrdersLast7Days();

    ProductPurchaseStatsListResponse getProductPurchaseStats();
}
