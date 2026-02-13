package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.CategoryEntity;
import com.sports4u.sports4u_backend.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
    Boolean existsByCategoryEntity_CategoryId(Long categoryId);
}
