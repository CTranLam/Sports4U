package com.sports4u.sports4u_backend.service;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface IPaymentService {
    String createVnPayPaymentUrl(Long orderId, HttpServletRequest request);

    void handleVnPayReturn(Map<String, String> params);
}
