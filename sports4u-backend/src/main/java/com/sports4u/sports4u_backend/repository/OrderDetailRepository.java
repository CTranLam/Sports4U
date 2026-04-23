package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.OrderDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetailEntity, Long> {
    List<OrderDetailEntity> findByOrder_OrderId(Long orderId);

    @Query(value = """
        SELECT od.product_id, p.name as productName, SUM(od.quantity) as totalQuantity
        FROM order_details od
        JOIN orders o ON od.order_id = o.order_id
        JOIN products p ON od.product_id = p.product_id
        WHERE p.is_deleted = false
        GROUP BY od.product_id, p.name
        ORDER BY totalQuantity DESC
    """, nativeQuery = true)
    List<Object[]> getProductPurchaseStats();
}


