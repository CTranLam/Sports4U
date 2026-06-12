import apiClient from './apiClient';
import type { ResponseDTO } from '../types/api';

export interface AddToCartPayload {
  productId: number;
  quantity: number;
}

export const cartService = {
  addToCart: async (payload: AddToCartPayload): Promise<ResponseDTO<string>> => {
    return await apiClient.post('/user/cart/items', payload);
  },

  getCartCount: async (): Promise<ResponseDTO<number>> => {
    return await apiClient.get('/user/cart/count');
  },
};
