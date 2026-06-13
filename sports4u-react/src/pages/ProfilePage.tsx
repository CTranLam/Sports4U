import React, { useState } from 'react';
import { useUserProfile, useUpdateProfileMutation, useProvinces, useWards } from '../hooks/useUserApi';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Phone, MapPin, Lock, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import type { UpdateProfilePayload, UserResponseDTO } from '../services/userService';

interface ProfileFormProps {
  profile: UserResponseDTO;
}

function ProfileForm({ profile }: ProfileFormProps) {
  const { data: provinces = [] } = useProvinces();
  const updateUser = useAuthStore((state) => state.updateUser);
  
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [selectedProvince, setSelectedProvince] = useState(profile.provinceCode || '');
  const [selectedWard, setSelectedWard] = useState(profile.wardCode || '');
  const [detailAddress, setDetailAddress] = useState(profile.detailAddress || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { data: wards = [], isLoading: isWardsLoading } = useWards(selectedProvince);
  const updateProfileMutation = useUpdateProfileMutation();

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value);
    setSelectedWard('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }
    if (!phone.trim()) {
      alert('Vui lòng nhập số điện thoại.');
      return;
    }
    if (!selectedProvince) {
      alert('Vui lòng chọn tỉnh/thành phố.');
      return;
    }
    if (!selectedWard) {
      alert('Vui lòng chọn phường/xã.');
      return;
    }
    if (!detailAddress.trim()) {
      alert('Vui lòng nhập địa chỉ chi tiết.');
      return;
    }
    if (password) {
      if (password.length < 6) {
        alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Mật khẩu nhập lại không khớp.');
        return;
      }
    }

    const payload: UpdateProfilePayload = {
      fullName,
      phone,
      provinceCode: selectedProvince,
      wardCode: selectedWard,
      detailAddress,
    };

    if (password) {
      payload.password = password;
    }

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        alert('Cập nhật thông tin cá nhân thành công!');
        updateUser({ fullName });
        setPassword('');
        setConfirmPassword('');
      },
      onError: (err: unknown) => {
        const error = err as { message?: string };
        alert(error.message || 'Đã có lỗi xảy ra khi cập nhật thông tin.');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Cập nhật hồ sơ</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Fullname */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Họ và tên</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên của bạn"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-slate-800 text-sm bg-slate-50"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Số điện thoại</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-slate-800 text-sm bg-slate-50"
          />
        </div>
      </div>

      {/* Email (Readonly) */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">Địa chỉ Email</label>
        <div className="relative">
          <input
            type="email"
            value={profile.userName}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 text-sm bg-slate-100 cursor-not-allowed"
          />
          <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Địa chỉ nhận hàng</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Province Dropdown */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Tỉnh/Thành phố</label>
            <select
              value={selectedProvince}
              onChange={handleProvinceChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-slate-800 text-sm bg-slate-50 cursor-pointer"
            >
              <option value="">-- Chọn Tỉnh/Thành phố --</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ward Dropdown */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Phường/Xã</label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={!selectedProvince || isWardsLoading}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-slate-800 text-sm bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!selectedProvince
                  ? '-- Vui lòng chọn Tỉnh/Thành phố trước --'
                  : isWardsLoading
                  ? 'Đang tải...'
                  : '-- Chọn Phường/Xã --'}
              </option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Detail Address */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Địa chỉ chi tiết (Số nhà, Tên đường)</label>
          <input
            type="text"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="Nhập địa chỉ chi tiết..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-slate-800 text-sm bg-slate-50"
          />
        </div>
      </div>

      {/* Password update section */}
      <div className="border-t pt-6 space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Đổi mật khẩu</h3>
          <p className="text-xs text-slate-400">Điền nếu bạn muốn thay đổi mật khẩu đăng nhập</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Mật khẩu mới</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-slate-800 text-sm bg-slate-50"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Nhập lại mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-slate-800 text-sm bg-slate-50"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="w-full bg-slate-950 hover:bg-slate-900 text-white py-6 rounded-xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            <>
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

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
