import apiClient from '@/services/apiClient';
import type { ResponseDTO } from '@/types/common';
import type { UserResponseDTO, UpdateProfilePayload, ProvinceListResponse, WardListResponse } from '../types';

export const userService = {
  getUserProfile: async (): Promise<ResponseDTO<UserResponseDTO>> => {
    return await apiClient.get('/user/profile');
  },

  updateUserProfile: async (payload: UpdateProfilePayload): Promise<ResponseDTO<string>> => {
    return await apiClient.put('/user/profile', payload);
  },

  getProvinces: async (): Promise<ResponseDTO<ProvinceListResponse>> => {
    return await apiClient.get('/user/provinces');
  },

  getWards: async (provinceCode: string): Promise<ResponseDTO<WardListResponse>> => {
    return await apiClient.get('/user/wards', { params: { provinceCode } });
  },
};
