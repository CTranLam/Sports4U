import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useResetPasswordMutation } from '@/features/auth/hooks/useAuthApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const resetSchema = z.object({
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string().min(6, { message: 'Vui lòng xác nhận mật khẩu' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const email = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const resetMutation = useResetPasswordMutation();

  const onSubmit = async (data: ResetFormValues) => {
    try {
      setError(null);
      await resetMutation.mutateAsync({
        email,
        newPassword: data.password
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-slate-50/50 px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Đặt lại mật khẩu</CardTitle>
          <p className="text-sm text-slate-500">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="rounded-md bg-green-50 p-4 text-center text-green-800">
              <p className="font-semibold mb-2">Đổi mật khẩu thành công!</p>
              <p className="text-sm">Đang tự động chuyển hướng về trang đăng nhập...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu mới</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
              </Button>
            </form>
          )}
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
