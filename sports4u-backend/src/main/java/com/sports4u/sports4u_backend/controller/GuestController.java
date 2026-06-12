package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryListResponse;
import com.sports4u.sports4u_backend.dto.productdto.ProductDTO;
import com.sports4u.sports4u_backend.service.ICategoryService;
import com.sports4u.sports4u_backend.service.IProductService;
import com.sports4u.sports4u_backend.utils.PageResponse;
import com.sports4u.sports4u_backend.utils.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class GuestController {

    private final ICategoryService categoryService;
    private final IProductService productService;

    @GetMapping("/categories/parents")
    public ResponseEntity<ResponseDTO<CategoryListResponse>> getAllCategoriesParentForHome() {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy danh sách danh mục thành công", categoryService.getParentCategories())
        );
    }

//    @GetMapping("/categories")
//    public ResponseEntity<ResponseDTO<CategoryListResponse>> getAllCategories() {
//        // Returns all child categories (leaf nodes that contain products)
//        return ResponseEntity.ok(
//                new ResponseDTO<>("Lấy danh sách danh mục thành công",
//                        CategoryListResponse.builder()
//                                .categories(categoryService.getAllCategoryChild())
//                                .build())
//        );
//    }

    @GetMapping("/categories/{categoryId}/child")
    public ResponseEntity<ResponseDTO<List<CategoryDTO>>> getAllCategoriesChildrenForHome(@PathVariable Long categoryId) {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy danh sách danh mục thành công", categoryService.getCategoryChild(categoryId))
        );
    }

    @GetMapping("/categories/{categoryId}/children")
    public ResponseEntity<?> getCategoryChildren(@PathVariable Long categoryId) {
        try {
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy danh sách danh mục con thành công", categoryService.getCategoryChild(categoryId))
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @GetMapping("/categories/{id}/products")
    public ResponseEntity<ResponseDTO<PageResponse<?>>> getProductsByCategoryId(@PathVariable Long id,
                                                     @RequestParam(required = false) BigDecimal minPrice,
                                                     @RequestParam(required = false) BigDecimal maxPrice,
                                                     @RequestParam(required = false) Boolean inStock,
                                                     @RequestParam(required = false) String sortBy,
                                                     @RequestParam(defaultValue = "1") int page,
                                                     @RequestParam(defaultValue = "12") int size) {
        try {
            PageResponse<?> products = productService.getProductsByCategory(id, minPrice, maxPrice, inStock, sortBy, page, size);
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

    @GetMapping("/products/popular/{categoryId}")
    public ResponseEntity<ResponseDTO<PageResponse<ProductDTO>>> getPopularProducts(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        try {
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy danh sách sản phẩm phổ biến thành công", productService.getProductsPopularByCategory(categoryId, page, size))
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<ResponseDTO<PageResponse<?>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            return ResponseEntity.ok(
                    new ResponseDTO<>("Tìm kiếm sản phẩm thành công", productService.searchProducts(keyword, minPrice, maxPrice, inStock, sortBy, page, size))
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }
}
