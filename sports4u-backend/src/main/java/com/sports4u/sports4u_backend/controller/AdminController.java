package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.categorydto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.categorydto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductAdminDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductRequestDTO;
import com.sports4u.sports4u_backend.dto.userdto.UserInAdminDTO;
import com.sports4u.sports4u_backend.dto.userdto.UserResponseDTO;
import com.sports4u.sports4u_backend.dto.userdto.UserUpdateDTO;
import com.sports4u.sports4u_backend.enums.Role;
import com.sports4u.sports4u_backend.service.*;
import com.sports4u.sports4u_backend.utils.PageResponse;
import com.sports4u.sports4u_backend.utils.ResponseDTO;
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

    private final IOrderService orderService;

    private final IDashboardService dashboardService;

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

    @PutMapping("/account/{id}/unlock")
    public ResponseEntity<?> unlockAccount(@PathVariable Long id) {
        userService.unlockAccount(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã mở khóa tài khoản thành công"
        ));
    }

    @GetMapping("/accounts")
    public ResponseEntity<ResponseDTO<PageResponse<UserResponseDTO>>> getAccounts(
            @RequestParam(required = false) Long status,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        Role roleEnum = null;
        if (role != null && !role.isBlank()) {
            try {
                roleEnum = Role.valueOf(role);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(new ResponseDTO<>("Role không hợp lệ. Chỉ chấp nhận: ROLE_USER, ROLE_ADMIN, ROLE_GUEST", null));
            }
        }

        PageResponse<UserResponseDTO> accounts = userService.getAccounts(status, roleEnum, page, size);
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy danh sách tài khoản thành công", accounts)
        );
    }

    @PostMapping("/categories")
    public ResponseEntity<ResponseDTO<CategoryDTO>> insertCategories(@RequestBody @Valid CategoryRequestDTO categoryRequestDTO) {
        CategoryDTO categoryDTO = categoryService.insertCategory(categoryRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseDTO<>("Tạo danh mục thành công", categoryDTO));
    }

    @GetMapping("/categories")
    public ResponseEntity<ResponseDTO<?>> getCategoriesParent(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {

        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy danh sách danh mục thành công", categoryService.getParentCategories(page, size))
        );
    }

    @GetMapping("/categories/{categoryId}/child")
    public ResponseEntity<?> getCategoryChild(@PathVariable Long categoryId) {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy cây danh mục thành công", categoryService.getCategoryChild(categoryId))
        );
    }

    @GetMapping("/categories/children")
    public ResponseEntity<?> getAllCategoryChild() {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy tất cả danh mục con thành công", categoryService.getAllCategoryChild())
        );
    }


    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ResponseDTO<String>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(
                new ResponseDTO<>("Xóa danh mục thành công", null)
        );
    }

    @GetMapping("/categories/{id}/products")
    public ResponseEntity<ResponseDTO<PageResponse<?>>> getProductsByCategoryId(@PathVariable Long id,
                                                     @RequestParam(defaultValue = "1") int page,
                                                     @RequestParam(defaultValue = "12") int size) {
        try {
            PageResponse<?> products = productService.getProductsByCategoryForAdmin(id, page, size);
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy danh sách sản phẩm thành công", products)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }

    }

    @PostMapping(value = "/product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO<?>> createProduct(
            @RequestPart("data") @Valid ProductRequestDTO data,
            @RequestPart("image") MultipartFile imageFile) {

        System.out.println("Data: " + data); // thêm dòng này
        System.out.println("Image: " + imageFile.getOriginalFilename());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseDTO<>("Tạo sản phẩm thành công", productService.createProduct(data, imageFile)));
    }

    @PutMapping(value = "/products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO<ProductAdminDTO>> updateProduct(
            @PathVariable Long id,
            @RequestPart("data") @Valid ProductRequestDTO data,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        ProductAdminDTO updated = productService.updateProduct(id, data, imageFile);

        return ResponseEntity.ok(
                new ResponseDTO<>("Cập nhật sản phẩm thành công", updated)
        );
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ResponseDTO<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(
                new ResponseDTO<>("Xóa sản phẩm thành công", null)
        );
    }

    @GetMapping("orders")
    public ResponseEntity<?> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size){
        try {
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy danh sách đơn hàng thành công", orderService.getOrdersForAdmin(status,paymentStatus, page, size))
            );

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ResponseDTO<String>> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(
                    new ResponseDTO<>("Cập nhật trạng thái đơn hàng thành công", null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<?> getSummary() {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy thành công thống kê tổng quan", dashboardService.getSummary())
        );
    }

    @GetMapping("/dashboard/revenue-by-month")
    public ResponseEntity<?> getRevenue(@RequestParam int year) {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy thành công doanh thu theo tháng", dashboardService.getRevenueByMonth(year))
        );
    }

    @GetMapping("/dashboard/product-by-category")
    public ResponseEntity<?> getProductByCategory() {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy thành công thống kê sản phẩm theo danh mục", dashboardService.getProductByCategory())
        );
    }

    @GetMapping("/dashboard/orders-last-7-days")
    public ResponseEntity<?> getOrdersLast7Days() {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy thành công thống kê đơn hàng 7 ngày gần nhất", dashboardService.getOrdersLast7Days())
        );
    }

}
