package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.CategoryEntity;
import com.sports4u.sports4u_backend.entity.ProductEntity;
import com.sports4u.sports4u_backend.utils.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
    Boolean existsByCategoryEntity_CategoryId(Long categoryId);
    Page<ProductEntity> findByCategoryEntity_CategoryIdAndIsDeletedFalse(Long categoryId, Pageable pageable);
    Long countByCategoryEntity_CategoryIdAndIsDeletedFalse(Long categoryId);
    Boolean existsByProductNameIgnoreCaseAndCategoryEntity_CategoryIdAndIsDeletedFalse(
            String productName,
            Long categoryId
    );
    ProductEntity findByProductIdAndIsDeletedFalse(Long id);

}
