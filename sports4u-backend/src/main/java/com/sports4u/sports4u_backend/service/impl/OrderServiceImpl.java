package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.cartdto.CartItemIdsRequestDTO;
import com.sports4u.sports4u_backend.dto.orderdto.*;
import com.sports4u.sports4u_backend.entity.*;
import com.sports4u.sports4u_backend.enums.OrderStatus;
import com.sports4u.sports4u_backend.enums.PaymentStatus;
import com.sports4u.sports4u_backend.repository.*;
import com.sports4u.sports4u_backend.service.IOrderService;
import com.sports4u.sports4u_backend.utils.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements IOrderService {
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public List<OrderPreviewResponseDTO> getCartItemsByIds(String email, CartItemIdsRequestDTO itemIds) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        if (itemIds.getItemIds() == null || itemIds.getItemIds().isEmpty()) {
            throw new RuntimeException("Danh sách sản phẩm không được để trống");
        }

        List<CartItemEntity> cartItems = cartItemRepository.findByProduct_ProductIdInAndUser_UserId(
                itemIds.getItemIds(),
                user.getUserId()
        );

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Không tìm thấy sản phẩm nào trong giỏ hàng");
        }

        if (user.getProvince() == null || user.getWard() == null || user.getDetailAddress() == null) {
            throw new RuntimeException("Vui lòng cập nhật địa chỉ trước khi xem đơn hàng");
        }

        String fullAddress = user.getDetailAddress() + ", " + user.getWard().getName() + ", " + user.getProvince().getName();

        return cartItems.stream()
                .map(cartItem -> {
                    ProductEntity product = cartItem.getProduct();
                    if (product.getIsDeleted()) {
                        throw new RuntimeException("Sản phẩm " + product.getProductName() + " không còn tồn tại");
                    }
                    if (product.getStockQuantity() < cartItem.getQuantity()) {
                        throw new RuntimeException("Sản phẩm " + product.getProductName() +
                                " không đủ số lượng trong kho. Còn lại: " + product.getStockQuantity());
                    }
                    BigDecimal subtotal = product.getPrice().multiply(
                            BigDecimal.valueOf(cartItem.getQuantity())
                    );

                    return OrderPreviewResponseDTO.builder()
                            .productId(product.getProductId())
                            .productName(product.getProductName())
                            .imageUrl(product.getImageUrl())
                            .quantity(cartItem.getQuantity())
                            .unitPrice(product.getPrice())
                            .subtotal(subtotal)
                            .fullName(user.getFullName())
                            .phone(user.getPhone())
                            .fullAddress(fullAddress)
                            .build();
                })
                .toList();
    }

    @Transactional
    @CacheEvict(value = {"productDetail", "productList"}, allEntries = true)
    @Override
    public OrderResponseDTO createOrderFromCart(String email, CreateOrderRequestDTO request) {
        System.out.println("Creating order from cart and clearing product cache");
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));


        List<CartItemEntity> cartItems = cartItemRepository.findByProduct_ProductIdInAndUser_UserId(request.getCartItemIds(), user.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Không có sản phẩm nào trong giỏ hàng để tạo đơn hàng");
        }

        // Tạo order
        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(PaymentStatus.UNPAID);

        if (user.getProvince() == null || user.getWard() == null || user.getDetailAddress() == null) {
            throw new RuntimeException("Vui lòng cập nhật địa chỉ trước khi đặt hàng");
        }
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


    @Override
    public OrderPreviewResponseDTO previewFromProduct(String email, BuyNowRequestDTO request) {
            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

            ProductEntity product = productRepository.findByProductIdAndIsDeletedFalse(request.getProductId());
            if (product == null) {
                throw new RuntimeException("Sản phẩm không tồn tại");
            }
            if (product.getStockQuantity() < request.getQuantity()) {
                throw new RuntimeException("Sản phẩm không đủ số lượng trong kho");
            }

            OrderPreviewResponseDTO preview = new OrderPreviewResponseDTO();
            preview.setProductId(product.getProductId());
            preview.setProductName(product.getProductName());
            preview.setImageUrl(product.getImageUrl());
            preview.setUnitPrice(product.getPrice());
            preview.setQuantity(request.getQuantity());
            preview.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
            preview.setFullName(user.getFullName());
            preview.setPhone(user.getPhone());
            preview.setFullAddress(user.getDetailAddress() + ", " + user.getWard().getName() + ", " + user.getProvince().getName());

            return preview;
    }

    @Override
    @CacheEvict(value = {"productDetail", "productList"}, allEntries = true)
    public OrderResponseDTO createOrderFromProduct(String email, BuyNowRequestDTO request) {
        System.out.println("Creating order from product and clearing product cache");
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        ProductEntity product = productRepository.findByProductIdAndIsDeletedFalse(request.getProductId());
        if (product == null) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Sản phẩm không đủ số lượng trong kho");
        }

        // Tạo order
        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(PaymentStatus.UNPAID);

        if (user.getProvince() == null || user.getWard() == null || user.getDetailAddress() == null) {
            throw new RuntimeException("Vui lòng cập nhật địa chỉ trước khi đặt hàng");
        }
        order.setProvinceCode(user.getProvince().getCode());
        order.setWardCode(user.getWard().getCode());
        order.setAddressDetail(user.getDetailAddress());
        String fullAddress = user.getDetailAddress() + ", " + user.getWard().getName() + ", " + user.getProvince().getName();
        order.setFullAddress(fullAddress);
        order.setTotalAmount(BigDecimal.ZERO);

        order = orderRepository.save(order);

        // Tạo order detail
        OrderDetailEntity orderDetail = new OrderDetailEntity();

        orderDetail.setOrder(order);
        orderDetail.setProductId(product.getProductId());
        orderDetail.setQuantity(request.getQuantity());
        orderDetail.setUnitPrice(product.getPrice());
        orderDetail.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
        orderDetail.setCreatedAt(LocalDateTime.now());
        orderDetailRepository.save(orderDetail);

        // Giảm stock quantity
        product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
        productRepository.save(product);

        // Cập nhật tổng tiền của order
        order.setTotalAmount(orderDetail.getSubtotal());
        orderRepository.save(order);

        return new OrderResponseDTO(order.getOrderId(), order.getTotalAmount());
    }

    @Override
    public PageResponse<OrderResponseInAdminDTO> getOrdersForAdmin(String status, int page, int size) {

        OrderStatus orderStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                orderStatus = OrderStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(
                        "Trạng thái đơn hàng không hợp lệ. Chỉ chấp nhận: PENDING, CONFIRMED, SHIPPED, COMPLETED, CANCELED"
                );
            }
        }

        Pageable pageable = PageRequest.of(page-1, size, Sort.by("orderDate").descending());

        Page<OrderEntity> orders = (orderStatus != null)
                ? orderRepository.findByStatus(orderStatus, pageable)
                : orderRepository.findAll(pageable);

        return PageResponse.<OrderResponseInAdminDTO>builder()
                .content(
                        orders.getContent().stream()
                                .map(order -> OrderResponseInAdminDTO.builder()
                                        .orderId(order.getOrderId())
                                        .userEmail(order.getUser().getEmail())
                                        .status(order.getStatus().name())
                                        .totalAmount(order.getTotalAmount())
                                        .orderDate(order.getOrderDate())
                                        .fullAddress(order.getFullAddress())
                                        .build()
                                )
                                .toList()
                )
                .pageNumber(orders.getNumber())
                .pageSize(orders.getSize())
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .last(orders.isLast())
                .build();
    }

    @Override
    public void updateOrderStatus(Long orderId, String status) throws NoSuchElementException {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Đơn hàng không tồn tại"));

        OrderStatus orderStatus;
        try {
            orderStatus = OrderStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Trạng thái đơn hàng không hợp lệ. Chỉ chấp nhận: PENDING, CONFIRMED, SHIPPED, COMPLETED, CANCELED"
            );
        }

        order.setStatus(orderStatus);
        orderRepository.save(order);
    }

    @Override
    public PageResponse<OrderSummaryDTO> getOrders(String email, String status, int page, int size) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User không tồn tại"))
                .getUserId();

        Pageable pageable = PageRequest.of(page-1, size, Sort.by("orderDate").descending());

        Page<OrderEntity> orders;
        if (status != null && !status.isBlank()) {
            OrderStatus orderStatus;
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Trạng thái không hợp lệ: " + status);
            }
            orders = orderRepository.findByUser_UserIdAndStatus(userId, orderStatus, pageable);
        } else {
            orders = orderRepository.findByUser_UserId(userId, pageable);
        }

        return PageResponse.<OrderSummaryDTO>builder()
                .content(
                        orders.getContent().stream()
                                .map(order -> OrderSummaryDTO.builder()
                                        .orderId(order.getOrderId())
                                        .status(order.getStatus().name())
                                        .totalAmount(order.getTotalAmount())
                                        .orderDate(order.getOrderDate())
                                        .build()
                                )
                                .toList()
                )
                .pageNumber(orders.getNumber())
                .pageSize(orders.getSize())
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .last(orders.isLast())
                .build();
    }

    @Override
    public OrderDetailDTO getOrderDetail(Long orderId, String email) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User không tồn tại"));

        OrderEntity order = orderRepository.findByOrderIdAndUser_UserId(orderId, user.getUserId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy đơn hàng"));

        List<OrderDetailEntity> orderDetails = orderDetailRepository.findByOrder_OrderId(orderId);

        List<OrderItemDetailDTO> items = orderDetails.stream()
                .map(detail -> {
                    ProductEntity product = productRepository.findById(detail.getProductId())
                            .orElse(null);

                    String productName = product != null ? product.getProductName() : "Sản phẩm không tồn tại";
                    String thumbnail = product != null ? product.getImageUrl() : null;

                    return OrderItemDetailDTO.builder()
                            .productId(detail.getProductId())
                            .productName(productName)
                            .thumbnail(thumbnail)
                            .price(detail.getUnitPrice())
                            .quantity(detail.getQuantity().intValue())
                            .subtotal(detail.getSubtotal())
                            .build();
                }).toList();

        return OrderDetailDTO.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus().name())
                .orderDate(order.getOrderDate())
                .receiverName(user.getFullName())
                .receiverPhone(user.getPhone())
                .fullAddress(order.getFullAddress())
                .totalAmount(order.getTotalAmount())
                .items(items)
                .build();
    }

    @Override
    @Transactional
    @CacheEvict(value = {"dashboardSummary", "ordersLast7Days"}, allEntries = true)
    public void cancelOrder(Long orderId, String email) {
        System.out.println("Cancelling order and clearing dashboard cache");
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User không tồn tại"))
                .getUserId();

        OrderEntity order = orderRepository.findByOrderIdAndUser_UserId(orderId, userId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy đơn hàng"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Chỉ đơn hàng đang chờ xác nhận mới được hủy");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

}
