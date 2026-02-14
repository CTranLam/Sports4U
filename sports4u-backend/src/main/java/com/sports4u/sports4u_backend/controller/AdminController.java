package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductAdminDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductRequestDTO;
import com.sports4u.sports4u_backend.service.ICategoryService;
import com.sports4u.sports4u_backend.service.IProductService;
import com.sports4u.sports4u_backend.utils.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "/product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestPart("data") @Valid ProductRequestDTO data,
            @RequestPart("image") MultipartFile imageFile) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(data, imageFile));
    }

    @PutMapping(value = "/products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("data") @Valid ProductRequestDTO data,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        ProductAdminDTO updated = productService.updateProduct(id, data, imageFile);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", updated,
                "message", "Cập nhật sản phẩm thành công"
        ));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Xóa sản phẩm thành công"
        ));
    }

}
