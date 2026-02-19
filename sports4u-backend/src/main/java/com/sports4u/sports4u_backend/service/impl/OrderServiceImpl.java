package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.orderdto.CreateOrderRequestDTO;
import com.sports4u.sports4u_backend.dto.orderdto.OrderResponseDTO;
import com.sports4u.sports4u_backend.entity.*;
import com.sports4u.sports4u_backend.enums.OrderStatus;
import com.sports4u.sports4u_backend.enums.PaymentStatus;
import com.sports4u.sports4u_backend.repository.*;
import com.sports4u.sports4u_backend.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements IOrderService {
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    @Override
    public OrderResponseDTO createOrder(String email, CreateOrderRequestDTO request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));


        List<CartItemEntity> cartItems = cartItemRepository.findByCartItemIdInAndUser_UserId(request.getCartItemIds(), user.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Không có sản phẩm nào trong giỏ hàng để tạo đơn hàng");
        }

        // Tạo order
        OrderEntity order = new OrderEntity();
        order.setUserId(user.getUserId());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setProvinceCode(user.getProvince().getCode());
        order.setWardCode(user.getWard().getCode());
        order.setAddressDetail(user.getDetailAddress());
        String fullAddress = user.getDetailAddress() + ", " + user.getWard().getName() + ", " + user.getProvince().getName();
        order.setFullAddress(fullAddress);
        order.setTotalAmount(BigDecimal.ZERO);

        order = orderRepository.save(order);

        // Tạo order details và tính tổng tiền
        BigDecimal total = BigDecimal.ZERO;
        for (CartItemEntity item : cartItems) {
            ProductEntity product = item.getProduct();
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getProductName() + " không đủ số lượng trong kho");
            }
            BigDecimal unitPrice = product.getPrice();
            BigDecimal subtotal = unitPrice.multiply(
                    BigDecimal.valueOf(item.getQuantity())
            );

            OrderDetailEntity detail = new OrderDetailEntity();
            detail.setOrder(order);
            detail.setProductId(product.getProductId());
            detail.setQuantity(item.getQuantity());
            detail.setUnitPrice(unitPrice);
            detail.setSubtotal(subtotal);
            detail.setCreatedAt(LocalDateTime.now());
            orderDetailRepository.save(detail);

            total = total.add(subtotal);

            product.setStockQuantity(
                    product.getStockQuantity() - item.getQuantity()
            );
            productRepository.save(product);
        }
        order.setTotalAmount(total);
        orderRepository.save(order);

        cartItemRepository.deleteAll(cartItems);

        return new OrderResponseDTO(order.getOrderId(), total);
    }
}
