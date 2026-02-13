package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.service.ICategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ICategoryService categoryService;

    @PostMapping("/categories")
    public ResponseEntity<?> insertCategories(@RequestBody @Valid CategoryRequestDTO categoryRequestDTO) {
        CategoryDTO categoryDTO = categoryService.insertCategory(categoryRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryDTO);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Category deleted successfully"
        ));
    }
}
