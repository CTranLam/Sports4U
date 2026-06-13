import apiClient from './apiClient';
import type { ResponseDTO } from '../types/api';

export interface OrderPreviewResponseDTO {
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  fullName: string;
  phone: string;
  fullAddress: string;
}

export interface OrderResponseDTO {
  orderId: number;
  totalAmount: number;
}

export interface BuyNowPayload {
  productId: number;
  quantity: number;
  paymentMethod?: string;
}

export interface CreateOrderPayload {
  cartItemIds: number[];
  paymentMethod: string;
}

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
};
