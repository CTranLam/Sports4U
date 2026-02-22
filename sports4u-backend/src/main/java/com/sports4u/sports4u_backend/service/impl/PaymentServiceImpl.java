package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.configuration.VNPayConfig;
import com.sports4u.sports4u_backend.entity.OrderEntity;
import com.sports4u.sports4u_backend.enums.OrderStatus;
import com.sports4u.sports4u_backend.enums.PaymentStatus;
import com.sports4u.sports4u_backend.repository.OrderRepository;
import com.sports4u.sports4u_backend.service.IPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements IPaymentService {
    private final OrderRepository orderRepository;
    private final VNPayConfig vnPayConfig;

    @Override
    public String createVnPayPaymentUrl(Long orderId, HttpServletRequest request) {
        try {
            OrderEntity order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

            // Kiểm tra đơn hàng đã được thanh toán chưa
            if (order.getPaymentStatus() == PaymentStatus.PAID) {
                throw new RuntimeException("Đơn hàng đã được thanh toán");
            }

            Map<String, String> params = new TreeMap<>();
            params.put("vnp_Version", vnPayConfig.getVersion());
            params.put("vnp_Command", "pay");
            params.put("vnp_TmnCode", vnPayConfig.getTmnCode());

            // VNPay yêu cầu số tiền phải là số nguyên (đơn vị: VND * 100)
            long amount = order.getTotalAmount().multiply(new BigDecimal(100)).longValue();
            params.put("vnp_Amount", String.valueOf(amount));

            params.put("vnp_CurrCode", "VND");
            params.put("vnp_TxnRef", order.getOrderId().toString());
            params.put("vnp_OrderInfo", "Thanh toan don hang " + order.getOrderId());
            params.put("vnp_OrderType", "other");
            params.put("vnp_Locale", "vn");
            params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());

            // Lấy IP address
            String ipAddress = getIpAddress(request);
            params.put("vnp_IpAddr", ipAddress);

            // Tạo thời gian
            String vnpCreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            params.put("vnp_CreateDate", vnpCreateDate);

            // Thời gian hết hạn: 15 phút
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MINUTE, 15);
            String vnpExpireDate = new SimpleDateFormat("yyyyMMddHHmmss").format(calendar.getTime());
            params.put("vnp_ExpireDate", vnpExpireDate);

            // Tạo query string và hash
            String queryUrl = buildQueryString(params);
            String vnpSecureHash = hmacSHA512(vnPayConfig.getHashSecret(), queryUrl);

            String paymentUrl = vnPayConfig.getVnpUrl() + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;

            System.out.println("VNPay Payment URL created for order " + orderId + ": " + paymentUrl);

            return paymentUrl;

        } catch (Exception e) {
            System.err.println("Error creating VNPay payment URL: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi tạo liên kết thanh toán: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handleVnPayReturn(Map<String, String> params) {
        try {
            System.out.println("VNPay return params: " + params);

            // Lấy secure hash từ params
            String vnpSecureHash = params.get("vnp_SecureHash");

            // Remove các params không cần thiết
            params.remove("vnp_SecureHash");
            params.remove("vnp_SecureHashType");

            // Tạo lại secure hash để verify
            String signValue = buildQueryString(params);
            String checkHash = hmacSHA512(vnPayConfig.getHashSecret(), signValue);

            // Verify signature
            if (!checkHash.equals(vnpSecureHash)) {
                System.err.println("Invalid VNPay signature");
                throw new RuntimeException("Chữ ký không hợp lệ");
            }

            String orderId = params.get("vnp_TxnRef");
            String responseCode = params.get("vnp_ResponseCode");
            String transactionNo = params.get("vnp_TransactionNo");
            String bankCode = params.get("vnp_BankCode");
            String cardType = params.get("vnp_CardType");

            OrderEntity order = orderRepository.findById(Long.valueOf(orderId))
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

            // Kiểm tra response code
            if ("00".equals(responseCode)) {
                // Thanh toán thành công
                order.setPaymentStatus(PaymentStatus.PAID);
                order.setStatus(OrderStatus.CONFIRMED);
                System.out.println("Order " + orderId + " payment successful. Transaction: " + transactionNo +
                        ", Bank: " + bankCode + ", CardType: " + cardType);
            } else {
                // Thanh toán thất bại
                order.setPaymentStatus(PaymentStatus.FAILED);
                System.out.println("Order " + orderId + " payment failed. Response code: " + responseCode);
            }

            orderRepository.save(order);

        } catch (Exception e) {
            System.err.println("Error handling VNPay return: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi xử lý kết quả thanh toán: " + e.getMessage());
        }
    }


    private String buildQueryString(Map<String, String> params) {
        return params.entrySet().stream()
                .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));
    }


    private String hmacSHA512(String key, String data) {
        try {
            Mac hmacSha512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmacSha512.init(secretKey);
            byte[] hash = hmacSha512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // Convert to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (Exception e) {
            System.err.println("Error creating HMAC SHA512: " + e.getMessage());
            throw new RuntimeException("Lỗi tạo chữ ký");
        }
    }

    private String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }
}
