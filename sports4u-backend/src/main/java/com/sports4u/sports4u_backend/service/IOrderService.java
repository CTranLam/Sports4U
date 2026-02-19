package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.orderdto.CreateOrderRequestDTO;
import com.sports4u.sports4u_backend.dto.orderdto.OrderResponseDTO;

import java.security.Principal;

public interface IOrderService {
    OrderResponseDTO createOrder(String email, CreateOrderRequestDTO request);
}
