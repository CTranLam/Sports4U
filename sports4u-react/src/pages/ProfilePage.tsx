import React from 'react';
import { useUserProfile } from '@/features/profile/hooks/useUserApi';
import { useAuthStore } from '@/store/useAuthStore';
import { User, Mail, Phone, MapPin, Lock, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ProfileForm } from '@/features/profile/components';

export default function ProfilePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);
  
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useUserProfile();

  React.useEffect(() => {
    if (profile?.fullName) {
      updateUser({ fullName: profile.fullName });
    }
  }, [profile, updateUser]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-50 p-6 rounded-full text-slate-400 mb-6">
          <Lock size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Vui lòng đăng nhập</h2>
        <p className="text-slate-500 max-w-sm mb-8">
          Bạn cần đăng nhập tài khoản của mình để xem và chỉnh sửa thông tin cá nhân.
        </p>
        <Link to="/login">
          <Button className="bg-slate-950 hover:bg-slate-900 text-white px-8 py-6 rounded-xl font-semibold shadow-md">
            Đăng nhập ngay
          </Button>
        </Link>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-slate-800 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  if (isProfileError || !profile) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-red-600">
        <p className="font-semibold text-lg">Đã có lỗi xảy ra khi tải thông tin cá nhân.</p>
        <p className="text-slate-500 mt-2 text-sm">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý thông tin tài khoản, địa chỉ nhận hàng và mật khẩu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-slate-950 text-white rounded-full flex items-center justify-center mb-4 text-3xl font-bold shadow-md animate-fade-in">
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : profile.userName.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold text-slate-800 text-lg truncate w-full">
                {profile.fullName || 'Chưa cập nhật họ tên'}
              </h3>
              <p className="text-slate-400 text-sm truncate w-full mb-4">{profile.userName}</p>
              
              <div className="w-full border-t pt-4 space-y-2 text-left">
                <div className="flex items-center gap-2.5 text-slate-600 text-sm">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{profile.userName}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2.5 text-slate-600 text-sm">
                    <Phone size={16} className="text-slate-400 shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.provinceName && (
                  <div className="flex items-center gap-2.5 text-slate-600 text-sm">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="truncate">{`${profile.wardName}, ${profile.provinceName}`}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
              <Link to="/profile" className="flex items-center gap-3 px-6 py-4 bg-slate-50 text-slate-950 font-bold border-l-4 border-slate-950 transition-colors">
                <User size={18} />
                Thông tin cá nhân
              </Link>
              <Link to="/cart" className="flex items-center gap-3 px-6 py-4 text-slate-600 hover:text-slate-950 hover:bg-slate-50 font-semibold transition-colors">
                <ShoppingBag size={18} />
                Giỏ hàng của tôi
              </Link>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-8">
            <ProfileForm key={profile.userId} profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}
