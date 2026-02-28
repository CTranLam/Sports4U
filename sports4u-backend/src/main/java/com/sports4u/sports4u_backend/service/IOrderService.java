package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.cartdto.CartItemIdsRequestDTO;
import com.sports4u.sports4u_backend.dto.orderdto.*;
import com.sports4u.sports4u_backend.utils.PageResponse;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.List;
import java.util.NoSuchElementException;

public interface IOrderService {
    OrderResponseDTO createOrderFromCart(String email, CreateOrderRequestDTO request);
    List<OrderPreviewResponseDTO> getCartItemsByIds(String email, CartItemIdsRequestDTO itemIds);
    OrderPreviewResponseDTO previewFromProduct(String email, BuyNowRequestDTO request);
    OrderResponseDTO createOrderFromProduct(String email, BuyNowRequestDTO request);
    PageResponse<OrderResponseInAdminDTO> getOrdersForAdmin(String status, String paymentStatus, int page, int size) throws NoSuchElementException;
    void updateOrderStatus(Long orderId, String status) throws NoSuchElementException;
    PageResponse<OrderSummaryDTO> getOrders(String email,String status, int page, int size);
    OrderDetailDTO getOrderDetail(Long orderId, String email);
    void cancelOrder(Long orderId, String email);
}
