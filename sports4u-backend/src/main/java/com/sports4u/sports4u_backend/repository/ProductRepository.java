package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.CategoryEntity;
import com.sports4u.sports4u_backend.entity.ProductEntity;
import com.sports4u.sports4u_backend.utils.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
    Boolean existsByCategoryEntity_CategoryIdAndIsDeletedFalse(Long categoryId);
    Page<ProductEntity> findByCategoryEntity_CategoryIdAndIsDeletedFalse(Long categoryId, Pageable pageable);
    Long countByCategoryEntity_CategoryIdAndIsDeletedFalse(Long categoryId);
    Boolean existsByProductNameIgnoreCaseAndCategoryEntity_CategoryIdAndIsDeletedFalse(
            String productName,
            Long categoryId
    );
    ProductEntity findByProductIdAndIsDeletedFalse(Long id);

    @Query("""
        SELECT c.categoryName, COUNT(p)
        FROM ProductEntity p
        JOIN p.categoryEntity c
        WHERE p.isDeleted = false
        GROUP BY c.categoryName
    """)
    List<Object[]> countProductByCategory();

    Page<ProductEntity> findByProductNameContainingIgnoreCaseAndIsDeletedFalse(String keyword, Pageable pageable);
}
