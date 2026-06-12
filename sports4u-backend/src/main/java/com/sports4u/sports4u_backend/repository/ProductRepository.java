package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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

    @Query("""
        SELECT p FROM ProductEntity p
        WHERE p.isDeleted = false
          AND (:keyword IS NULL OR :keyword = '' OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:categoryId IS NULL OR p.categoryEntity.categoryId = :categoryId)
          AND (:inStock IS NULL
               OR (:inStock = true AND p.stockQuantity > 0)
               OR (:inStock = false AND p.stockQuantity = 0))
          AND (:isPopular IS NULL OR p.isPopular = :isPopular)
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
    """)
    Page<ProductEntity> findAllWithFilters(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("inStock") Boolean inStock,
            @Param("isPopular") Boolean isPopular,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    Page<ProductEntity> findByCategoryEntity_parent_CategoryIdAndIsPopularTrueAndIsDeletedFalse(Long CategoryId, Pageable pageable);
}
