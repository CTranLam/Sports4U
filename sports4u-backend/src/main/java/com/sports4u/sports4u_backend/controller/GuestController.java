package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.service.ICategoryService;
import com.sports4u.sports4u_backend.service.IProductService;
import com.sports4u.sports4u_backend.utils.PageResponse;
import com.sports4u.sports4u_backend.utils.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class GuestController {

    private final ICategoryService categoryService;
    private final IProductService productService;

    @GetMapping("/categories")
    public ResponseEntity<ResponseDTO<List<CategoryDTO>>> getAllCategoriesForHome() {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy danh sách danh mục thành công", categoryService.getCategories())
        );
    }

    @GetMapping("/categories/{id}/products")
    public ResponseEntity<ResponseDTO<PageResponse<?>>> getProductsByCategoryId(@PathVariable Long id,
                                                     @RequestParam(defaultValue = "1") int page,
                                                     @RequestParam(defaultValue = "12") int size) {
        try {
            PageResponse<?> products = productService.getProductsByCategory(id, page, size);
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy danh sách sản phẩm thành công", products)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }

    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ResponseDTO<?>> getProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy thông tin sản phẩm thành công", productService.getProductById(id))
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }
}
