import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { useAuthStore } from '../store/useAuthStore';

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useCartCount = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['cart', 'count'],
    queryFn: async () => {
      const response = await cartService.getCartCount();
      return response.data;
    },
    enabled: isAuthenticated,
  });
};

export const useCart = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['cart', 'items'],
    queryFn: async () => {
      const response = await cartService.getCartItems();
      return response.data || [];
    },
    enabled: isAuthenticated,
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cartItemId,
      productId,
      quantity,
      selected,
    }: {
      cartItemId: number;
      productId?: number;
      quantity?: number;
      selected?: boolean;
    }) => cartService.updateCartItem(cartItemId, { productId, quantity, selected }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: number) => cartService.removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
