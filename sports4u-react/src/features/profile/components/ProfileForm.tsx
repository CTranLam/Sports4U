import React, { useState } from 'react';
import { useUpdateProfileMutation, useProvinces, useWards } from '../hooks/useUserApi';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UpdateProfilePayload, UserResponseDTO } from '../types';

interface ProfileFormProps {
  profile: UserResponseDTO;
}

export function ProfileForm({ profile }: ProfileFormProps) {
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
