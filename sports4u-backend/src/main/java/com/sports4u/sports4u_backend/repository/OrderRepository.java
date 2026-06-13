package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.dto.admindto.RevenueByMonthDTO;
import com.sports4u.sports4u_backend.entity.OrderEntity;
import com.sports4u.sports4u_backend.enums.OrderStatus;
import com.sports4u.sports4u_backend.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    @Query("""
        SELECT new com.sports4u.sports4u_backend.dto.admindto.RevenueByMonthDTO(
               CAST(EXTRACT(MONTH FROM o.orderDate) AS int),
               SUM(o.totalAmount)
        )
        FROM OrderEntity o
        WHERE o.status = com.sports4u.sports4u_backend.enums.OrderStatus.COMPLETED
        AND EXTRACT(YEAR FROM o.orderDate) = :year
        GROUP BY EXTRACT(MONTH FROM o.orderDate)
        ORDER BY EXTRACT(MONTH FROM o.orderDate)
    """)
    List<RevenueByMonthDTO> getRevenueByMonth(int year);

    @Query("""
        SELECT CAST(o.orderDate AS date), COUNT(o)
        FROM OrderEntity o
        WHERE o.orderDate >= :startDate
        GROUP BY CAST(o.orderDate AS date)
        ORDER BY CAST(o.orderDate AS date)
    """)
    List<Object[]> countOrdersFromDate(LocalDateTime startDate);

    Page<OrderEntity> findByUser_UserIdAndStatus(Long userId, OrderStatus status, Pageable pageable);

    Page<OrderEntity> findByUser_UserId(Long userId, Pageable pageable);

    Optional<OrderEntity> findByOrderIdAndUser_UserId(Long orderId, Long userId);

    Page<OrderEntity> findByStatus(OrderStatus status, Pageable pageable);

    Page<OrderEntity> findByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable);

    Page<OrderEntity> findByStatusAndPaymentStatus(OrderStatus status, PaymentStatus paymentStatus, Pageable pageable);

    @Query("""
        SELECT COUNT(o) > 0 
        FROM OrderEntity o 
        JOIN o.orderDetails od 
        WHERE o.user.userId = :userId 
          AND od.productId = :productId 
          AND o.status = com.sports4u.sports4u_backend.enums.OrderStatus.COMPLETED
    """)
    boolean hasCompletedOrderWithProduct(@Param("userId") Long userId, @Param("productId") Long productId);
}

