import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import type { CreateOrderPayload, BuyNowPayload } from '../types';
import { useAuthStore } from '@/store/useAuthStore';

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
      const data = response.data as unknown as Record<string, string>;
      return data.paymentUrl;
    },
  });
};

export const useMyOrdersQuery = (page: number, size: number, status?: string) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['myOrders', page, size, status],
    queryFn: async () => {
      const response = await orderService.getMyOrders(page, size, status);
      return response.data;
    },
    enabled: isAuthenticated,
  });
};

export const useOrderDetailQuery = (orderId: number | undefined, enabled: boolean) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      const response = await orderService.getOrderDetail(orderId);
      return response.data;
    },
    enabled: isAuthenticated && enabled && !!orderId,
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['orderDetail'] });
    },
  });
};
