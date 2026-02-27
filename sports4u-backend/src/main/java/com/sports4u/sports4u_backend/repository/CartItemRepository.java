package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.CartItemEntity;
import com.sports4u.sports4u_backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    CartItemEntity findByUser_UserIdAndProduct_ProductId(Long userId, Long productId);
    List<CartItemEntity> findByUser_UserId(Long userId);

    @Query("SELECT COALESCE(SUM(c.quantity), 0) FROM CartItemEntity c WHERE c.user.userId = :userId")
    Long sumQuantityByUserId(Long userId);

    List<CartItemEntity> findByProduct_ProductIdInAndUser_UserId(List<Long> ids, Long userId);

}
