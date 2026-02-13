package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.entity.CategoryEntity;
import com.sports4u.sports4u_backend.exception.NotFoundException;
import com.sports4u.sports4u_backend.repository.CategoryRepository;
import com.sports4u.sports4u_backend.repository.ProductRepository;
import com.sports4u.sports4u_backend.service.ICategoryService;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Builder
public class CategoryServiceImpl implements ICategoryService {
    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllByIsDeletedFalse()
                .stream()
                .map(category -> CategoryDTO.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .build())
                .toList();
    }

    @Override
    public CategoryDTO insertCategory(CategoryRequestDTO categoryRequestDTO) {
        if (categoryRepository.existsByCategoryNameIgnoreCase(categoryRequestDTO.getCategoryName())) {
            throw new IllegalArgumentException("Danh mục đã tồn tại");
        }
        CategoryEntity category = CategoryEntity.builder()
                .categoryName(categoryRequestDTO.getCategoryName())
                .build();

        CategoryEntity saved = categoryRepository.save(category);

        return CategoryDTO.builder()
                .categoryId(saved.getCategoryId())
                .categoryName(saved.getCategoryName())
                .build();
    }

    @Override
    public void deleteCategory(Long categoryId) {
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục sản phẩm đã chọn"));

        boolean hasProducts = productRepository.existsByCategoryEntity_CategoryId(categoryId);
        if (hasProducts) {
            throw new IllegalArgumentException("Không thể xóa danh mục vì còn chứa các sản phẩm");
        }

        category.setIsDeleted(true);
        categoryRepository.save(category);
    }
}
