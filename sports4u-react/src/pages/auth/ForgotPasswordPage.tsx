import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '@/features/auth/hooks/useAuthApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const forgotSchema = z.object({
  email: z.string().email({ message: 'Vui lòng nhập địa chỉ email hợp lệ' }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const forgotMutation = useForgotPasswordMutation();

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      setError(null);
      await forgotMutation.mutateAsync(data.email);
      
      // Chuyển sang trang xác nhận OTP, có thể truyền email qua state
      navigate('/confirm-otp', { state: { email: data.email } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-slate-50/50 px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Quên mật khẩu</CardTitle>
          <p className="text-sm text-slate-500">
            Nhập email đã đăng ký để nhận mã xác nhận
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Gửi mã xác nhận'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <Link to="/login" className="font-medium text-slate-900 hover:underline">
            Quay lại đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
