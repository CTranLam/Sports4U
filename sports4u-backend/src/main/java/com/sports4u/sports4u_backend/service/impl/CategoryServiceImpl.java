package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryListResponse;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.entity.CategoryEntity;
import com.sports4u.sports4u_backend.exception.NotFoundException;
import com.sports4u.sports4u_backend.repository.CategoryRepository;
import com.sports4u.sports4u_backend.repository.ProductRepository;
import com.sports4u.sports4u_backend.service.ICategoryService;
import com.sports4u.sports4u_backend.utils.PageResponse;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements ICategoryService {
    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    @Cacheable(value = "categoryList", key = "#page + '-' + #size")
    public PageResponse<CategoryDTO> getCategories(int page, int size) {

        Pageable pageable = PageRequest.of(page-1, size, Sort.by("categoryId").descending());

        Page<CategoryEntity> categoryPage =
                categoryRepository.findAllByIsDeletedFalse(pageable);

        List<CategoryDTO> content = categoryPage.getContent()
                .stream()
                .map(category -> CategoryDTO.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .build())
                .toList();

        return PageResponse.<CategoryDTO>builder()
                .content(content)
                .pageNumber(categoryPage.getNumber() + 1)
                .pageSize(categoryPage.getSize())
                .totalElements(categoryPage.getTotalElements())
                .totalPages(categoryPage.getTotalPages())
                .last(categoryPage.isLast())
                .build();

    }

    @Cacheable(value = "categoryList")
    public CategoryListResponse getCategories() {
        List<CategoryDTO> categories = categoryRepository.findAllByIsDeletedFalse(Sort.by("categoryId"))
                .stream()
                .map(category -> {
                    long productCount = productRepository
                            .countByCategoryEntity_CategoryIdAndIsDeletedFalse(
                                    category.getCategoryId()
                            );

                    return CategoryDTO.builder()
                            .categoryId(category.getCategoryId())
                            .categoryName(category.getCategoryName())
                            .productCount(productCount)
                            .build();
                })
                .toList();

        return CategoryListResponse.builder()
                .categories(categories)
                .build();
    }



    @Override
    @CacheEvict(value = "categoryList", allEntries = true)
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
    @CacheEvict(value = "categoryList", allEntries = true)
    public void deleteCategory(Long categoryId) {
        if (categoryId == null || categoryId <= 0) {
            throw new IllegalArgumentException("Danh mục không hợp lệ");
        }
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
