import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVerifyOtpMutation, useResendOtpMutation } from '../../hooks/useAuthApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'Mã OTP phải bao gồm 6 chữ số' }),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export default function ConfirmOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  
  // Email từ trang Quên mật khẩu truyền sang
  const email = location.state?.email || 'email-cua-ban@example.com';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const verifyMutation = useVerifyOtpMutation();
  const resendMutation = useResendOtpMutation();

  const onSubmit = async (data: OtpFormValues) => {
    try {
      setError(null);
      await verifyMutation.mutateAsync({ email, otp: data.otp });
      
      // Chuyển sang trang đặt lại mật khẩu sau khi OTP hợp lệ
      navigate('/reset-password', { state: { email, otp: data.otp } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Mã OTP không chính xác hoặc đã hết hạn.');
      }
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync(email);
      setCountdown(60);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-slate-50/50 px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Xác nhận OTP</CardTitle>
          <p className="text-sm text-slate-500">
            Nhập mã xác nhận gồm 6 chữ số đã được gửi về email <span className="font-semibold">{email}</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-center block">Mã OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                {...register('otp')}
                className={`text-center text-lg tracking-[0.5em] font-mono ${errors.otp ? 'border-red-500' : ''}`}
              />
              {errors.otp && (
                <p className="text-xs text-red-500 text-center">{errors.otp.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xác minh...' : 'Xác nhận'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-3 text-sm">
          <div className="text-slate-500">
            {countdown > 0 ? (
              <span>Gửi lại mã sau <span className="font-bold text-slate-700">{countdown}s</span></span>
            ) : (
              <Button variant="outline" size="sm" onClick={handleResend} className="w-full">
                Gửi lại OTP
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
