package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.utils.PageResponse;

import java.util.List;

public interface ICategoryService {
    PageResponse<CategoryDTO> getCategories(int page, int size);
    CategoryDTO insertCategory(CategoryRequestDTO categoryRequestDTO);
    void deleteCategory(Long categoryId);
    List<CategoryDTO> getCategories();
}
