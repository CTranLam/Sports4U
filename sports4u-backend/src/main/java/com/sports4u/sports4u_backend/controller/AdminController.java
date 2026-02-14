package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.service.ICategoryService;
import com.sports4u.sports4u_backend.service.IProductService;
import com.sports4u.sports4u_backend.utils.PageResponse;
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

    private final IProductService productService;

    @PostMapping("/categories")
    public ResponseEntity<?> insertCategories(@RequestBody @Valid CategoryRequestDTO categoryRequestDTO) {
        CategoryDTO categoryDTO = categoryService.insertCategory(categoryRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryDTO);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {

        return ResponseEntity.ok(categoryService.getCategories(page, size));
    }


    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Category deleted successfully"
        ));
    }

    @GetMapping("/categories/{id}/products")
    public ResponseEntity<?> getProductsByCategoryId(@PathVariable Long id,
                                                     @RequestParam(defaultValue = "1") int page,
                                                     @RequestParam(defaultValue = "12") int size) {
        try {
            PageResponse<?> products = productService.getProductsByCategoryForAdmin(id, page, size);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }

    }
}
