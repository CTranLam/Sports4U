package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.admindto.*;
import com.sports4u.sports4u_backend.repository.OrderRepository;
import com.sports4u.sports4u_backend.repository.ProductRepository;
import com.sports4u.sports4u_backend.repository.UserRepository;
import com.sports4u.sports4u_backend.service.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DashboardServiceImpl implements IDashboardService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    @Cacheable(value = "dashboardSummary", key = "'summary'") // key là tên duy nhất hoặc có thể dùng tham số
    public DashboardSummaryDTO getSummary() {
        System.out.println("Fetching dashboard summary from database");
        return DashboardSummaryDTO.builder()
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .build();
    }

    @Override
    @Cacheable(value = "revenueByMonth", key = "#year")
    public RevenueByMonthListResponse getRevenueByMonth(int year) {
        System.out.println("Fetching revenue by month from database for year: " + year);
        List<RevenueByMonthDTO> revenues = orderRepository.getRevenueByMonth(year);
        return RevenueByMonthListResponse.builder()
                .revenues(revenues)
                .build();
    }

    @Override
    @Cacheable(value = "productByCategory", key = "'all'")
    public ProductCategoryStatsListResponse getProductByCategory() {
        System.out.println("Fetching product by category stats from database");
        List<ProductCategoryStatsDTO> stats = productRepository.countProductByCategory()
                .stream()
                .map(row -> ProductCategoryStatsDTO.builder()
                        .category((String) row[0])
                        .count((Long) row[1])
                        .build())
                .toList();
        return ProductCategoryStatsListResponse.builder()
                .stats(stats)
                .build();
    }

    @Override
    @Cacheable(value = "ordersLast7Days", key = "'last7days'")
    public OrdersLast7DaysListResponse getOrdersLast7Days() {
        System.out.println("Fetching orders last 7 days from database");
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        List<OrdersLast7DaysDTO> orders = orderRepository.countOrdersFromDate(startDate)
                .stream()
                .map(row -> OrdersLast7DaysDTO.builder()
                        .date(row[0].toString())
                        .count((Long) row[1])
                        .build())
                .toList();
        return OrdersLast7DaysListResponse.builder()
                .orders(orders)
                .build();
    }
}
