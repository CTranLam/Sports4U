package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.OrderEntity;
import com.sports4u.sports4u_backend.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Page<OrderEntity> findByStatus(OrderStatus status, Pageable pageable);

    @Query("""
        SELECT EXTRACT(MONTH FROM o.orderDate),
               SUM(o.totalAmount)
        FROM OrderEntity o
        WHERE o.status = com.sports4u.sports4u_backend.enums.OrderStatus.COMPLETED
        AND EXTRACT(YEAR FROM o.orderDate) = :year
        GROUP BY EXTRACT(MONTH FROM o.orderDate)
        ORDER BY EXTRACT(MONTH FROM o.orderDate)
    """)
    List<Object[]> getRevenueByMonth(int year);

    @Query("""
        SELECT CAST(o.orderDate AS date), COUNT(o)
        FROM OrderEntity o
        WHERE o.orderDate >= :startDate
        GROUP BY CAST(o.orderDate AS date)
        ORDER BY CAST(o.orderDate AS date)
    """)
    List<Object[]> countOrdersFromDate(LocalDateTime startDate);

    Page<OrderEntity> findByUser_UserId(Long userId, Pageable pageable);

    Optional<OrderEntity> findByOrderIdAndUser_UserId(Long orderId, Long userId);

}

