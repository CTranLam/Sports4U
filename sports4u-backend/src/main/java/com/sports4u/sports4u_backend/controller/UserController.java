package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.cartdto.CartItemDTO;
import com.sports4u.sports4u_backend.dto.cartdto.CartItemResponseDTO;
import com.sports4u.sports4u_backend.dto.userdto.*;
import com.sports4u.sports4u_backend.dto.reviewdto.CreateReviewRequestDTO;
import com.sports4u.sports4u_backend.dto.reviewdto.ReviewDTO;
import com.sports4u.sports4u_backend.service.IAddressService;
import com.sports4u.sports4u_backend.service.IOrderService;
import com.sports4u.sports4u_backend.service.IUserService;
import com.sports4u.sports4u_backend.service.IReviewService;
import com.sports4u.sports4u_backend.utils.ResponseDTO;
import com.sports4u.sports4u_backend.entity.RefreshTokenEntity;
import com.sports4u.sports4u_backend.entity.UserEntity;
import com.sports4u.sports4u_backend.service.IRefreshTokenService;
import com.sports4u.sports4u_backend.utils.JwtTokenUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {
    private final IUserService userService;

    private final IAddressService addressService;

    private final IOrderService orderService;

    private final IReviewService reviewService;

    private final IRefreshTokenService refreshTokenService;

    private final JwtTokenUtil jwtTokenUtil;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO<?>> registerUser(@RequestBody UserRegisterDTO userRegisterDTO,
            BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest()
                        .body(new ResponseDTO<>("Lỗi validation", errorMessages));
            }
            if (!userRegisterDTO.getPassword().equals(userRegisterDTO.getRetypedPassword())) {
                return ResponseEntity.badRequest()
                        .body(new ResponseDTO<>("Mật khẩu nhập lại không khớp", null));
            }
            UserRegisterResponseDTO userRegisterResponseDTO = userService.createUser(userRegisterDTO);
            return ResponseEntity.ok(
                    new ResponseDTO<>("Đăng ký thành công", userRegisterResponseDTO));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO<?>> login(@Valid @RequestBody UserLoginDTO userDTO, BindingResult result, HttpServletResponse httpServletResponse) {
        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>("Lỗi validation", errors));
        }

        try {
            UserResponseDTO userResponseDTO = userService.findByUsername(userDTO.getUserName());
            if (userResponseDTO == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseDTO<>("Tài khoản không tồn tại", null));
            }
            String token = userService.login(userDTO.getUserName(), userDTO.getPassword());
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseDTO<>("Sai mật khẩu", null));
            }

            // Generate Refresh Token
            RefreshTokenEntity refreshTokenEntity = refreshTokenService.createRefreshToken(userDTO.getUserName());
            setRefreshTokenCookie(httpServletResponse, refreshTokenEntity.getToken());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("refreshToken", refreshTokenEntity.getToken());
            response.put("email", userResponseDTO.getUserName());
            response.put("id", userResponseDTO.getUserId());
            response.put("role", userResponseDTO.getRole());

            return ResponseEntity.ok(
                    new ResponseDTO<>("Đăng nhập thành công", response));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseDTO<Long>> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>("Email không được để trống", null));
        }

        try {
            Long time = userService.sendOtp(email);
            return ResponseEntity.ok(
                    new ResponseDTO<>("OTP sẽ được gửi đến email của bạn", time));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO<>("Email không tồn tại", null));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ResponseDTO<String>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        boolean isValid = userService.verifyOtp(email, otp);

        if (!isValid) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>("OTP không hợp lệ hoặc đã hết hạn", null));
        }

        return ResponseEntity.ok(
                new ResponseDTO<>("Xác thực OTP thành công", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseDTO<String>> resetPassword(@Valid @RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>("Mật khẩu mới không hợp lệ!", null));
        }
        userService.setNewPassword(email, newPassword);
        return ResponseEntity.ok(
                new ResponseDTO<>("Mật khẩu đã được thay đổi", null));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ResponseDTO<Long>> resendOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>("Email không được để trống", null));
        }

        try {
            Long time = userService.sendOtp(email);
            return ResponseEntity.ok(
                    new ResponseDTO<>("OTP sẽ được gửi đến email của bạn", time));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO<>("Email không tồn tại", null));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ResponseDTO<String>> updateProfile(@RequestBody UpdateProfileDTO request,
            Principal principal) {
        userService.updateUserInfo(principal.getName(), request);

        return ResponseEntity.ok(
                new ResponseDTO<>("Cập nhật thành công", null));
    }

    @GetMapping("/profile")
    public ResponseEntity<ResponseDTO<UserResponseDTO>> getUserProfile(Principal principal) {
        try {
            UserResponseDTO userResponseDTO = userService.findByUsername(principal.getName());
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy thông tin thành công", userResponseDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @GetMapping("/provinces")
    public ResponseEntity<ResponseDTO<?>> getProvinces() {
        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy danh sách tỉnh/thành phố thành công", addressService.getAllProvinces()));
    }

    @GetMapping("/wards")
    public ResponseEntity<ResponseDTO<?>> getWardsByProvince(
            @RequestParam String provinceCode) {

        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy danh sách quận/huyện thành công",
                        addressService.getWardsByProvince(provinceCode)));
    }

    @PostMapping("/cart/items")
    public ResponseEntity<ResponseDTO<String>> addItemToCart(@RequestBody CartItemDTO cartItemDTO,
            Principal principal) {
        try {
            userService.addItemToCart(principal.getName(), cartItemDTO);
            return ResponseEntity.ok(
                    new ResponseDTO<>("Thêm sản phẩm vào giỏ hàng thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("/cart/items/{itemId}")
    public ResponseEntity<ResponseDTO<String>> removeItemFromCart(@PathVariable Long itemId, Principal principal) {
        try {
            userService.removeItemFromCart(principal.getName(), itemId);
            return ResponseEntity.ok(
                    new ResponseDTO<>("Xóa sản phẩm khỏi giỏ hàng thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @GetMapping("/cart")
    public ResponseEntity<ResponseDTO<List<CartItemResponseDTO>>> getCartItems(Principal principal) {
        try {
            List<CartItemResponseDTO> listItem = userService.getCartItems(principal.getName());
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy giỏ hàng thành công", listItem));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @PutMapping("/cart/items/{itemId}")
    public ResponseEntity<ResponseDTO<String>> updateCartItem(@PathVariable Long itemId,
            @RequestBody CartItemDTO cartItemDTO,
            Principal principal) {
        try {
            userService.updateItemCart(principal.getName(), cartItemDTO, itemId);
            return ResponseEntity.ok(
                    new ResponseDTO<>("Cập nhật sản phẩm trong giỏ hàng thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @GetMapping("/cart/count")
    public ResponseEntity<ResponseDTO<Long>> getCartItemCount(Principal principal) {
        try {
            Long count = userService.getCartItemCount(principal.getName());
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy số lượng sản phẩm trong giỏ hàng thành công", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<ResponseDTO<?>> getMyOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            Principal principal) {

        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy danh sách đơn hàng thành công",
                        orderService.getOrders(principal.getName(), status, page, size)));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ResponseDTO<?>> getOrderDetail(@PathVariable Long id, Principal principal) {

        return ResponseEntity.ok(
                new ResponseDTO<>("Lấy chi tiết đơn hàng thành công",
                        orderService.getOrderDetail(id, principal.getName())));
    }

    @PutMapping("/orders/{id}/cancel")
    public ResponseEntity<ResponseDTO<String>> cancelOrder(@PathVariable Long id, Principal principal) {

        orderService.cancelOrder(id, principal.getName());

        return ResponseEntity.ok(
                new ResponseDTO<>("Hủy đơn hàng thành công", null));
    }

    @PostMapping("/reviews")
    public ResponseEntity<ResponseDTO<ReviewDTO>> createReview(
            @RequestBody CreateReviewRequestDTO request,
            Principal principal) {
        try {
            return ResponseEntity.ok(
                    new ResponseDTO<>("Gửi đánh giá sản phẩm thành công",
                             reviewService.createReview(principal.getName(), request)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ResponseDTO<?>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestBody(required = false) Map<String, String> body) {
        
        String refreshToken = null;
        
        // 1. Try to get from cookies
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
        
        // 2. Try to get from body
        if ((refreshToken == null || refreshToken.isEmpty()) && body != null) {
            refreshToken = body.get("refreshToken");
        }

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>("Không tìm thấy Refresh Token", null));
        }

        try {
            Optional<RefreshTokenEntity> tokenOpt = refreshTokenService.findByToken(refreshToken);
            if (tokenOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ResponseDTO<>("Refresh Token không hợp lệ hoặc đã bị thu hồi", null));
            }

            RefreshTokenEntity tokenEntity = tokenOpt.get();
            refreshTokenService.verifyExpiration(tokenEntity);
            
            UserEntity user = tokenEntity.getUser();
            String newAccessToken = jwtTokenUtil.generateToken(user);
            
            // Rotate the Refresh Token
            RefreshTokenEntity rotatedRefreshToken = refreshTokenService.createRefreshToken(user.getEmail());
            setRefreshTokenCookie(response, rotatedRefreshToken.getToken());
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", newAccessToken);
            responseData.put("refreshToken", rotatedRefreshToken.getToken());
            
            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy Access Token mới thành công", responseData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseDTO<?>> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    refreshTokenService.deleteByToken(token);
                    break;
                }
            }
        }
        
        // Clear cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // Set to true in prod with HTTPS
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        
        return ResponseEntity.ok(new ResponseDTO<>("Đăng xuất thành công", null));
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // Set to true in prod with HTTPS
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days in seconds
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
