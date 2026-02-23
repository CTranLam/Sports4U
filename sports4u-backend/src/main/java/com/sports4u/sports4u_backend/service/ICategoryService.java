package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryListResponse;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.exception.NotFoundException;
import com.sports4u.sports4u_backend.utils.PageResponse;

public interface ICategoryService {
    PageResponse<CategoryDTO> getCategories(int page, int size);
    CategoryDTO insertCategory(CategoryRequestDTO categoryRequestDTO) throws IllegalArgumentException;
    void deleteCategory(Long categoryId) throws NotFoundException, IllegalArgumentException;
    CategoryListResponse getCategories();
}
