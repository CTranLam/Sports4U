package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductAdminDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductRequestDTO;
import com.sports4u.sports4u_backend.dto.userdto.UserInAdminDTO;
import com.sports4u.sports4u_backend.dto.userdto.UserResponseDTO;
import com.sports4u.sports4u_backend.dto.userdto.UserUpdateDTO;
import com.sports4u.sports4u_backend.enums.Role;
import com.sports4u.sports4u_backend.service.ICategoryService;
import com.sports4u.sports4u_backend.service.IProductService;
import com.sports4u.sports4u_backend.service.IUserService;
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
    private final IUserService userService;

    private final ICategoryService categoryService;

    private final IProductService productService;

    @PostMapping("/account")
    public ResponseEntity<?> createAccount(@RequestBody @Valid UserInAdminDTO requestAdminDTO) {
        if(!requestAdminDTO.getPassword().equals(requestAdminDTO.getRetypePassword())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Mật khẩu nhập lại không khớp"
            ));
        }
        UserResponseDTO userResponseDTO = userService.createAccount(requestAdminDTO);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", userResponseDTO,
                "message", "Tạo tài khoản thành công"
        ));
    }

    @PutMapping("/account/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody @Valid UserUpdateDTO requestUserDTO) {
        userService.updateAccount(id, requestUserDTO);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật tài khoản thành công"
        ));
    }

    @DeleteMapping("/account/{id}")
    public ResponseEntity<?> lockAccount(@PathVariable Long id) {
        userService.lockAccount(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã khóa tài khoản thành công"
        ));
    }

    @GetMapping("/accounts")
    public ResponseEntity<?> getAccounts(
            @RequestParam(required = false) Long status,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        Role roleEnum = null;
        if (role != null && !role.isBlank()) {
            try {
                roleEnum = Role.valueOf(role);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Role không hợp lệ. Chỉ chấp nhận: ROLE_USER, ROLE_ADMIN, ROLE_GUEST"
                ));
            }
        }

        PageResponse<UserResponseDTO> accounts = userService.getAccounts(status, roleEnum, page, size);
        return ResponseEntity.ok(accounts);
    }

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
