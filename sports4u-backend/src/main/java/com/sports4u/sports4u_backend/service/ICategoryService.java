package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.CategoryRequestDTO;

import java.util.List;

public interface ICategoryService {
    List<CategoryDTO> getAllCategories();
    CategoryDTO insertCategory(CategoryRequestDTO categoryRequestDTO);
    void deleteCategory(Long categoryId);

}
