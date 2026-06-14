import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from '../types';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => authService.verifyOtp(email, otp),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => authService.resetPassword(data),
  });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resendOtp(email),
  });
};
