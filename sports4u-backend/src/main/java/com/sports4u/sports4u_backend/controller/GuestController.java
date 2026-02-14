package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.service.ICategoryService;
import com.sports4u.sports4u_backend.service.IProductService;
import com.sports4u.sports4u_backend.utils.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class GuestController {

    private final ICategoryService categoryService;
    private final IProductService productService;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategoriesForHome() {
        return ResponseEntity.ok(categoryService.getCategories());
    }

    @GetMapping("/categories/{id}/products")
    public ResponseEntity<?> getProductsByCategoryId(@PathVariable Long id,
                                                     @RequestParam(defaultValue = "1") int page,
                                                     @RequestParam(defaultValue = "12") int size) {
        try {
            PageResponse<?> products = productService.getProductsByCategory(id, page, size);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }

    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProductById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
