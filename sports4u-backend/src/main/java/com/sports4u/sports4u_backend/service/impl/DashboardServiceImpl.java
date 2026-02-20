package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.admindto.DashboardSummaryDTO;
import com.sports4u.sports4u_backend.dto.admindto.OrdersLast7DaysDTO;
import com.sports4u.sports4u_backend.dto.admindto.ProductCategoryStatsDTO;
import com.sports4u.sports4u_backend.dto.admindto.RevenueByMonthDTO;
import com.sports4u.sports4u_backend.repository.OrderRepository;
import com.sports4u.sports4u_backend.repository.ProductRepository;
import com.sports4u.sports4u_backend.repository.UserRepository;
import com.sports4u.sports4u_backend.service.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements IDashboardService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    public DashboardSummaryDTO getSummary() {
        return DashboardSummaryDTO.builder()
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .build();
    }

    @Override
    public List<RevenueByMonthDTO> getRevenueByMonth(int year) {
        return orderRepository.getRevenueByMonth(year)
                .stream()
                .map(row -> RevenueByMonthDTO.builder()
                        .month(((Integer) row[0]))
                        .revenue((BigDecimal) row[1])
                        .build()
                )
                .toList();
    }

    @Override
    public List<ProductCategoryStatsDTO> getProductByCategory() {
        return productRepository.countProductByCategory()
                .stream()
                .map(row -> ProductCategoryStatsDTO.builder()
                        .category((String) row[0])
                        .count((Long) row[1])
                        .build())
                .toList();
    }

    @Override
    public List<OrdersLast7DaysDTO> getOrdersLast7Days() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        return orderRepository.countOrdersFromDate(startDate)
                .stream()
                .map(row -> OrdersLast7DaysDTO.builder()
                        .date(row[0].toString())
                        .count((Long) row[1])
                        .build())
                .toList();
    }
}
