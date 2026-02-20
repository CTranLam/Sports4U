package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.OrderDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetailEntity, Long> {
    List<OrderDetailEntity> findByOrder_OrderId(Long orderId);
}
