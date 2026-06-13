import apiClient from './apiClient';
import type { ResponseDTO } from '../types/api';

export interface AddToCartPayload {
  productId: number;
  quantity: number;
}

export interface CartItemResponseDTO {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selected: boolean;
}

export interface UpdateCartItemPayload {
  productId?: number;
  quantity?: number;
  selected?: boolean;
}

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
