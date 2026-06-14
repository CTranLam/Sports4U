import apiClient from '@/services/apiClient';
import type { ResponseDTO, PageResponse } from '@/types/common';
import type { OrderSummaryDTO, OrderDetailDTO, OrderPreviewResponseDTO, OrderResponseDTO, CreateOrderPayload, BuyNowPayload } from '../types';

export const orderService = {
  previewFromCart: async (itemIds: number[]): Promise<ResponseDTO<OrderPreviewResponseDTO[]>> => {
    return apiClient.post('/user/order/cart/list-item', { itemIds });
  },

  previewFromProduct: async (productId: number, quantity: number): Promise<ResponseDTO<OrderPreviewResponseDTO>> => {
    return apiClient.post('/user/order/preview-from-product', { productId, quantity });
  },

  checkoutFromCart: async (payload: CreateOrderPayload): Promise<ResponseDTO<OrderResponseDTO>> => {
    return apiClient.post('/user/order/checkout/from-cart', payload);
  },

  checkoutFromProduct: async (payload: BuyNowPayload): Promise<ResponseDTO<OrderResponseDTO>> => {
    return apiClient.post('/user/order/checkout/from-product', payload);
  },

  createVnPayUrl: async (orderId: number): Promise<ResponseDTO<Map<string, string>>> => {
    return apiClient.get(`/user/order/payment/vnpay/${orderId}`);
  },

  getMyOrders: async (page = 1, size = 10, status?: string): Promise<ResponseDTO<PageResponse<OrderSummaryDTO>>> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('size', String(size));
    if (status) params.append('status', status);
    return apiClient.get(`/user/orders?${params.toString()}`);
  },

  getOrderDetail: async (orderId: number): Promise<ResponseDTO<OrderDetailDTO>> => {
    return apiClient.get(`/user/orders/${orderId}`);
  },

  cancelOrder: async (orderId: number): Promise<ResponseDTO<string>> => {
    return apiClient.put(`/user/orders/${orderId}/cancel`);
  },
};
