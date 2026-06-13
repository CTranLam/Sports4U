package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    Page<ReviewEntity> findByProduct_ProductId(Long productId, Pageable pageable);

    @Query("SELECT AVG(cast(r.rating as double)) FROM ReviewEntity r WHERE r.product.productId = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    Long countByProduct_ProductId(Long productId);
}
