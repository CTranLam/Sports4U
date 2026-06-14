import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { UpdateProfilePayload } from '../types';
import { useAuthStore } from '@/store/useAuthStore';

export const useUserProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await userService.getUserProfile();
      return response.data;
    },
    enabled: isAuthenticated,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useProvinces = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const response = await userService.getProvinces();
      return response.data?.provinces || [];
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60,
  });
};

export const useWards = (provinceCode?: string) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['wards', provinceCode],
    queryFn: async () => {
      if (!provinceCode) return [];
      const response = await userService.getWards(provinceCode);
      return response.data?.wards || [];
    },
    enabled: isAuthenticated && !!provinceCode,
    staleTime: 1000 * 60 * 60,
  });
};
