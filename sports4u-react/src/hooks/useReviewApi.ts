import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import type { CreateReviewRequestDTO } from '../types/api';

export const useReviews = (productId: number | undefined, page = 1, size = 5) => {
  return useQuery({
    queryKey: ['products', productId, 'reviews', page, size],
    queryFn: () => reviewService.getReviewsByProduct(productId!, page, size),
    enabled: typeof productId === 'number',
  });
};

export const useRatingSummary = (productId: number | undefined) => {
  return useQuery({
    queryKey: ['products', productId, 'rating-summary'],
    queryFn: () => reviewService.getRatingSummary(productId!),
    enabled: typeof productId === 'number',
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateReviewRequestDTO) => reviewService.createReview(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId, 'rating-summary'] });
    },
  });
};
