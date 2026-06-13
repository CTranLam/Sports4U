import apiClient from './apiClient';
import type { ResponseDTO } from '../types/api';

export interface UserResponseDTO {
  userId: number;
  userName: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  status: number;
  provinceName: string | null;
  provinceCode: string | null;
  wardName: string | null;
  wardCode: string | null;
  detailAddress: string | null;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone: string;
  provinceCode: string;
  wardCode: string;
  detailAddress: string;
  password?: string;
}

export interface ProvinceResponseDTO {
  code: string;
  name: string;
}

export interface ProvinceListResponse {
  provinces: ProvinceResponseDTO[];
}

export interface WardResponseDTO {
  code: string;
  name: string;
}

export interface WardListResponse {
  wards: WardResponseDTO[];
}

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
