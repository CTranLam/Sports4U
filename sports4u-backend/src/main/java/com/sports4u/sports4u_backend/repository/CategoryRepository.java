package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {
    boolean existsByCategoryNameIgnoreCase(String categoryName);
    List<CategoryEntity> findAllByIsDeletedFalse();
}
