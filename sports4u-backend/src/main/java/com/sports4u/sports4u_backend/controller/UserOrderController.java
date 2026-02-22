package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.cartdto.CartItemIdsRequestDTO;
import com.sports4u.sports4u_backend.dto.orderdto.BuyNowRequestDTO;
import com.sports4u.sports4u_backend.dto.orderdto.CreateOrderRequestDTO;
import com.sports4u.sports4u_backend.dto.orderdto.OrderPreviewResponseDTO;
import com.sports4u.sports4u_backend.dto.orderdto.OrderResponseDTO;
import com.sports4u.sports4u_backend.service.IOrderService;
import com.sports4u.sports4u_backend.service.IPaymentService;
import com.sports4u.sports4u_backend.service.IUserService;
import com.sports4u.sports4u_backend.utils.ResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user/order")
public class UserOrderController {
    private final IOrderService orderService;

    private final IUserService userService;

    private final IPaymentService paymentService;

    // Lấy thông tin và tạo order ở cart
    @PostMapping("cart/list-item")
    public ResponseEntity<ResponseDTO<List<OrderPreviewResponseDTO>>> getCartItemsByIds(@RequestBody CartItemIdsRequestDTO itemIds, Principal principal){
        try {
            List<OrderPreviewResponseDTO> items = orderService.getCartItemsByIds(principal.getName(), itemIds);

            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy thông tin sản phẩm thành công", items)
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    @PostMapping("/checkout/from-cart")
    public ResponseEntity<ResponseDTO<OrderResponseDTO>> createOrderFromCart(@RequestBody CreateOrderRequestDTO request, Principal principal) {
        try {
            String email = principal.getName();
            OrderResponseDTO response = orderService.createOrderFromCart(email, request);
            return ResponseEntity.ok(
                    new ResponseDTO<>("Tạo đơn hàng thành công", response)
            );
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(e.getMessage(), null));
        }
    }

    // Lấy thông tin và tạo order ở trang chi tiết sản phẩm
    @PostMapping("/preview-from-product")
    public ResponseEntity<ResponseDTO<?>> previewFromProduct(@RequestBody BuyNowRequestDTO request, Principal principal) {
        try {
            String email = principal.getName();

            OrderPreviewResponseDTO previewProduct = orderService.previewFromProduct(email, request);

            return ResponseEntity.ok(
                    new ResponseDTO<>("Lấy thông tin xác nhận đơn hàng thành công", previewProduct)
            );

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(ex.getMessage(), null));
        }
    }

    @PostMapping("/checkout/from-product")
    public ResponseEntity<ResponseDTO<?>> createOrderFromProduct(@RequestBody BuyNowRequestDTO request, Principal principal) {
        try {
            String email = principal.getName();

            OrderResponseDTO orderResponse = orderService.createOrderFromProduct(email, request);

            return ResponseEntity.ok(
                    new ResponseDTO<>("Tạo đơn hàng thành công", orderResponse)
            );

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(ex.getMessage(), null));
        }
    }

    @GetMapping("/payment/vnpay/{orderId}")
    public ResponseEntity<ResponseDTO<Map<String, String>>> createPaymentUrl(@PathVariable Long orderId,
                                              HttpServletRequest request) {
        try {
            String paymentUrl = paymentService.createVnPayPaymentUrl(orderId, request);
            return ResponseEntity.ok(
                    new ResponseDTO<>("Tạo liên kết thanh toán thành công", Map.of("paymentUrl", paymentUrl))
            );
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(ex.getMessage(), null));
        }
    }

    @GetMapping("/payment/vnpay-return")
    public ResponseEntity<ResponseDTO<String>> vnpayReturn(@RequestParam Map<String, String> params) {
        try {
            paymentService.handleVnPayReturn(params);

            String responseCode = params.get("vnp_ResponseCode");
            String message;

            if ("00".equals(responseCode)) {
                message = "Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.";
            } else {
                message = "Thanh toán thất bại. Mã lỗi: " + responseCode;
            }

            return ResponseEntity.ok(
                    new ResponseDTO<>(message, responseCode)
            );
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(ex.getMessage(), null));
        }
    }


}
