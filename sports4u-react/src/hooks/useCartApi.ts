import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { useAuthStore } from '../store/useAuthStore';

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
    },
  });
};

export const useCartCount = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['cart', 'count'],
    queryFn: async () => {
      const response = await cartService.getCartCount();
      return response.data || 0;
    },
    enabled: isAuthenticated, // Only fetch cart count if user is logged in
    initialData: 0,
  });
};
