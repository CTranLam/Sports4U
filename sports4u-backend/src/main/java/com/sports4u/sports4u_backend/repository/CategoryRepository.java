package com.sports4u.sports4u_backend.repository;

import com.sports4u.sports4u_backend.entity.CategoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {
    boolean existsByCategoryNameIgnoreCase(String categoryName);
    Page<CategoryEntity> findAllByIsDeletedFalse(Pageable pageable);
    List<CategoryEntity> findAllByIsDeletedFalse(Sort sort);
}
