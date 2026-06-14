import apiClient from '@/services/apiClient';
import type { ResponseDTO } from '@/types/common';
import type { AddToCartPayload, CartItemResponseDTO, UpdateCartItemPayload } from '../types';

export const cartService = {
  addToCart: async (payload: AddToCartPayload): Promise<ResponseDTO<string>> => {
    return await apiClient.post('/user/cart/items', payload);
  },

  getCartCount: async (): Promise<ResponseDTO<number>> => {
    return await apiClient.get('/user/cart/count');
  },

  getCartItems: async (): Promise<ResponseDTO<CartItemResponseDTO[]>> => {
    return await apiClient.get('/user/cart');
  },

  updateCartItem: async (
    cartItemId: number,
    payload: UpdateCartItemPayload
  ): Promise<ResponseDTO<string>> => {
    return await apiClient.put(`/user/cart/items/${cartItemId}`, payload);
  },

  removeFromCart: async (cartItemId: number): Promise<ResponseDTO<string>> => {
    return await apiClient.delete(`/user/cart/items/${cartItemId}`);
  },
};
