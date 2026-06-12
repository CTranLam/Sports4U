import apiClient from './apiClient';
import type { ResponseDTO, LoginResponseData, UserResponseDTO } from '../types/api';

// Các Interface Payload dựa trên DTO của Backend
export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string; // Trong backend gọi là username nhưng map với DTO là email
  password?: string;
  retypePassword?: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword?: string;
}

export const authService = {
  // Đăng nhập
  login: async (data: LoginPayload): Promise<ResponseDTO<LoginResponseData>> => {
    return await apiClient.post('/user/login', data);
  },

  // Đăng ký
  register: async (data: RegisterPayload): Promise<ResponseDTO<unknown>> => {
    return await apiClient.post('/user/register', data);
  },

  // Quên mật khẩu - Gửi OTP
  forgotPassword: async (email: string): Promise<ResponseDTO<number>> => {
    return await apiClient.post('/user/forgot-password', { email });
  },

  // Xác nhận OTP
  verifyOtp: async (email: string, otp: string): Promise<ResponseDTO<string>> => {
    return await apiClient.post('/user/verify-otp', { email, otp });
  },

  // Đặt lại mật khẩu
  resetPassword: async (data: ResetPasswordPayload): Promise<ResponseDTO<string>> => {
    return await apiClient.post('/user/reset-password', data);
  },

  // Gửi lại OTP
  resendOtp: async (email: string): Promise<ResponseDTO<number>> => {
    return await apiClient.post('/user/resend-otp', { email });
  },

  // Lấy Profile hiện tại
  getProfile: async (): Promise<ResponseDTO<UserResponseDTO>> => {
    return await apiClient.get('/user/profile');
  }
};
