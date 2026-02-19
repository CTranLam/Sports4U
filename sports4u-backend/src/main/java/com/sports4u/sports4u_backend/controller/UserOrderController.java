package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.orderdto.CreateOrderRequestDTO;
import com.sports4u.sports4u_backend.dto.orderdto.OrderResponseDTO;
import com.sports4u.sports4u_backend.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user/order")
public class UserOrderController {
    private final IOrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequestDTO request, Principal principal) {
        String email = principal.getName();
        OrderResponseDTO response = orderService.createOrder(email, request);
        return ResponseEntity.ok(response);
    }
}
