import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import type { CreateOrderPayload, BuyNowPayload } from '../services/orderService';
import { useAuthStore } from '../store/useAuthStore';

export const useOrderPreviewFromCart = (itemIds: number[], enabled: boolean) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['orderPreviewCart', itemIds],
    queryFn: async () => {
      const response = await orderService.previewFromCart(itemIds);
      return response.data;
    },
    enabled: isAuthenticated && enabled && itemIds.length > 0,
  });
};

export const useOrderPreviewFromProduct = (productId: number | undefined, quantity: number, enabled: boolean) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['orderPreviewProduct', productId, quantity],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');
      const response = await orderService.previewFromProduct(productId, quantity);
      return response.data;
    },
    enabled: isAuthenticated && enabled && !!productId,
  });
};

export const useCheckoutFromCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderService.checkoutFromCart(payload),
    onSuccess: () => {
      // Invalidate cart queries since checking out empties the items from the cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useCheckoutFromProductMutation = () => {
  return useMutation({
    mutationFn: (payload: BuyNowPayload) => orderService.checkoutFromProduct(payload),
  });
};

export const useVnPayUrlMutation = () => {
  return useMutation({
    mutationFn: async (orderId: number) => {
      const response = await orderService.createVnPayUrl(orderId);
      // Backend returns Map<String, String>, so data is a Record<string, string>
      const data = response.data as unknown as Record<string, string>;
      return data.paymentUrl;
    },
  });
};
