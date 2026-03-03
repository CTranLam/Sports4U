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

    @Cacheable(value = "categoryList", key = "#page + '-' + #size")
    public PageResponse<CategoryDTO> getParentCategories(int page, int size) {

        Pageable pageable = PageRequest.of(page-1, size, Sort.by("categoryId").descending());

        Page<CategoryEntity> categoryPage =
                categoryRepository.findByParentIsNullAndIsDeletedFalse(pageable);

        List<CategoryDTO> content = new ArrayList<>();
        for (CategoryEntity category : categoryPage.getContent()) {
            long productCount = productRepository
                    .countByCategoryEntity_CategoryIdAndIsDeletedFalse(
                            category.getCategoryId()
                    );

            content.add(CategoryDTO.builder()
                    .categoryId(category.getCategoryId())
                    .categoryName(category.getCategoryName())
                    .productCount(productCount)
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

    @Cacheable(value = "categoryList", key = "'all'")
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
//        return mapToDTOFlat(saved);
        return null;
    }

    @Override
    @CacheEvict(value = {"categoryList", "categoryTree"}, allEntries = true)
    public void deleteCategory(Long categoryId) {
        if (categoryId == null || categoryId <= 0) {
            throw new IllegalArgumentException("Danh mục không hợp lệ");
        }
        CategoryEntity category = categoryRepository.findByCategoryIdAndIsDeletedFalse(categoryId);

        if(category == null) {
            throw new NotFoundException("Danh mục không tồn tại");
        }

        boolean hasProducts = productRepository.existsByCategoryEntity_CategoryIdAndIsDeletedFalse(categoryId);
        if (hasProducts) {
            throw new IllegalArgumentException("Không thể xóa danh mục vì còn chứa các sản phẩm");
        }

        category.setIsDeleted(true);
        categoryRepository.save(category);
    }


}
