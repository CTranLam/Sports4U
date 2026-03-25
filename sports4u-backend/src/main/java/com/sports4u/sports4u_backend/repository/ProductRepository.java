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

    @Query(value = """
        SELECT * FROM products p
        WHERE p.is_deleted = false
          AND (CAST(:keyword AS text) IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS text), '%')))
          AND (CAST(:categoryId AS bigint) IS NULL OR p.category_id = CAST(:categoryId AS bigint))
          AND (CAST(:inStock AS boolean) IS NULL
               OR (CAST(:inStock AS boolean) = true AND p.stock_quantity > 0)
               OR (CAST(:inStock AS boolean) = false AND p.stock_quantity = 0))
          AND (CAST(:minPrice AS numeric) IS NULL OR p.price >= CAST(:minPrice AS numeric))
          AND (CAST(:maxPrice AS numeric) IS NULL OR p.price <= CAST(:maxPrice AS numeric))
        ORDER BY p.product_id DESC
    """,
    countQuery = """
        SELECT COUNT(*) FROM products p
        WHERE p.is_deleted = false
          AND (CAST(:keyword AS text) IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS text), '%')))
          AND (CAST(:categoryId AS bigint) IS NULL OR p.category_id = CAST(:categoryId AS bigint))
          AND (CAST(:inStock AS boolean) IS NULL
               OR (CAST(:inStock AS boolean) = true AND p.stock_quantity > 0)
               OR (CAST(:inStock AS boolean) = false AND p.stock_quantity = 0))
          AND (CAST(:minPrice AS numeric) IS NULL OR p.price >= CAST(:minPrice AS numeric))
          AND (CAST(:maxPrice AS numeric) IS NULL OR p.price <= CAST(:maxPrice AS numeric))
    """,
    nativeQuery = true)
    Page<ProductEntity> findAllWithFilters(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("inStock") Boolean inStock,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );
}
