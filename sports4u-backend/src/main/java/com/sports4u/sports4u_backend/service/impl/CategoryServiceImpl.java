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

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements ICategoryService {
    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    public PageResponse<CategoryDTO> getParentCategories(int page, int size) {

        Pageable pageable = PageRequest.of(page-1, size, Sort.by("categoryId").descending());

        Page<CategoryEntity> categoryPage = categoryRepository.findByParentIsNullAndIsDeletedFalse(pageable);

        List<CategoryDTO> content = new ArrayList<>();
        for (CategoryEntity parent : categoryPage.getContent()) {

            List<CategoryEntity> children = categoryRepository
                    .findByParent_categoryIdAndIsDeletedFalse(parent.getCategoryId());

            long totalProductCount = 0;
            for (CategoryEntity child : children) {
                totalProductCount += productRepository
                        .countByCategoryEntity_CategoryIdAndIsDeletedFalse(child.getCategoryId());
            }

            content.add(CategoryDTO.builder()
                    .categoryId(parent.getCategoryId())
                    .categoryName(parent.getCategoryName())
                    .productCount(totalProductCount)
                    .build());
        }

        return PageResponse.<CategoryDTO>builder()
                .content(content)
                .pageNumber(categoryPage.getNumber() + 1)
                .pageSize(categoryPage.getSize())
                .totalElements(categoryPage.getTotalElements())
                .totalPages(categoryPage.getTotalPages())
                .last(categoryPage.isLast())
                .build();
    }

    public CategoryListResponse getParentCategories() {
        List<CategoryEntity> parents = categoryRepository.findByParentIsNullAndIsDeletedFalse(Sort.by("categoryId"));

        List<CategoryDTO> result = new ArrayList<>();
        for (CategoryEntity parent : parents) {
            long totalProductCount = 0;

            List<CategoryEntity> children = categoryRepository
                    .findByParent_categoryIdAndIsDeletedFalse(parent.getCategoryId());

            for (CategoryEntity child : children) {
                totalProductCount += productRepository
                        .countByCategoryEntity_CategoryIdAndIsDeletedFalse(child.getCategoryId());
            }

            result.add(CategoryDTO.builder()
                    .categoryId(parent.getCategoryId())
                    .categoryName(parent.getCategoryName())
                    .productCount(totalProductCount)
                    .build());
        }

        return CategoryListResponse.builder()
                .categories(result)
                .build();
    }


    public List<CategoryDTO> getCategoryChild(Long categoryId) {
        if (!categoryRepository.existsByCategoryIdAndIsDeletedFalse(categoryId)) {
            throw new NotFoundException("Danh mục không tồn tại");
        }

        List<CategoryEntity> childList = categoryRepository.findByParent_categoryIdAndIsDeletedFalse(categoryId);

        List<CategoryDTO> result = new ArrayList<>();
        for (CategoryEntity child : childList) {
            long productCount = productRepository
                    .countByCategoryEntity_CategoryIdAndIsDeletedFalse(child.getCategoryId());

            result.add(CategoryDTO.builder()
                    .categoryId(child.getCategoryId())
                    .categoryName(child.getCategoryName())
                    .productCount(productCount)
                    .parentId(child.getParent() != null ? child.getParent().getCategoryId() : null)
                    .build());
        }
        return result;
    }

    @Override
    public List<CategoryDTO> getAllCategoryChild() {
        List<CategoryEntity> childList = categoryRepository.findByParentIsNotNullAndIsDeletedFalse();

        List<CategoryDTO> result = new ArrayList<>();
        for (CategoryEntity child : childList) {
            long productCount = productRepository
                    .countByCategoryEntity_CategoryIdAndIsDeletedFalse(child.getCategoryId());

            result.add(CategoryDTO.builder()
                    .categoryId(child.getCategoryId())
                    .categoryName(child.getCategoryName())
                    .productCount(productCount)
                    .parentId(child.getParent().getCategoryId())
                    .build());
        }
        return result;
    }

    @Override
    @CacheEvict(value = {"categoryList", "categoryTree"}, allEntries = true)
    public CategoryDTO insertCategory(CategoryRequestDTO dto) {
        if (categoryRepository.existsByCategoryNameIgnoreCase(dto.getCategoryName())) {
            throw new IllegalArgumentException("Danh mục đã tồn tại");
        }

        CategoryEntity.CategoryEntityBuilder builder = CategoryEntity.builder()
                .categoryName(dto.getCategoryName());

        // Nếu có parentId → là danh mục con
        if (dto.getParentId() != null) {
            CategoryEntity parent = categoryRepository.findByCategoryIdAndIsDeletedFalse(dto.getParentId());
            if (parent == null) {
                throw new NotFoundException("Danh mục cha không tồn tại");
            }
            // Không cho phép tạo danh mục cháu (chỉ 2 cấp)
            if (parent.getParent() != null) {
                throw new IllegalArgumentException("Chỉ hỗ trợ 2 cấp danh mục");
            }
            builder.parent(parent);
        }

        CategoryEntity saved = categoryRepository.save(builder.build());

        return CategoryDTO.builder()
                .categoryId(saved.getCategoryId())
                .categoryName(saved.getCategoryName())
                .parentId(saved.getParent() != null ? saved.getParent().getCategoryId() : null)
                .build();
    }

    @Override
    public void deleteCategory(Long categoryId) {
        if (categoryId == null || categoryId <= 0) {
            throw new IllegalArgumentException("Danh mục không hợp lệ");
        }

        CategoryEntity category = categoryRepository.findByCategoryIdAndIsDeletedFalse(categoryId);
        if (category == null) {
            throw new NotFoundException("Danh mục không tồn tại");
        }

        if (category.getParent() == null) {
            List<CategoryEntity> children = categoryRepository
                    .findByParent_categoryIdAndIsDeletedFalse(categoryId);
            if (!children.isEmpty()) {
                throw new IllegalArgumentException("Không thể xóa danh mục cha vì còn chứa danh mục con");
            }
        }
        boolean hasProducts = productRepository
                .existsByCategoryEntity_CategoryIdAndIsDeletedFalse(categoryId);
        if (hasProducts) {
            throw new IllegalArgumentException("Không thể xóa danh mục vì còn chứa các sản phẩm");
        }

        category.setIsDeleted(true);
        categoryRepository.save(category);
    }


}
