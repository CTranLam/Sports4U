import { useState } from 'react';
import {
  useAccounts,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useLockAccountMutation,
  useUnlockAccountMutation,
} from '../../hooks/useAdminApi';
import { ShieldAlert, Plus, Edit2, Lock, Unlock, X } from 'lucide-react';
import type { UserAdminDTO } from '../../types/api';

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdminDTO | null>(null);

  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRetypePassword, setNewRetypePassword] = useState('');
  const [newRole, setNewRole] = useState('ROLE_USER');
  const [newStatus, setNewStatus] = useState(1);

  const [editRole, setEditRole] = useState('ROLE_USER');
  const [editPassword, setEditPassword] = useState('');

  const [formError, setFormError] = useState('');

  // Queries & Mutations
  const { data: pageData, isLoading } = useAccounts(page, 10, statusFilter, roleFilter);
  const createAccountMutation = useCreateAccountMutation();
  const updateAccountMutation = useUpdateAccountMutation();
  const lockAccountMutation = useLockAccountMutation();
  const unlockAccountMutation = useUnlockAccountMutation();

  const handleOpenEdit = (user: UserAdminDTO) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditPassword('');
    setFormError('');
    setShowEditModal(true);
  };

  const handleOpenAdd = () => {
    setNewEmail('');
    setNewPassword('');
    setNewRetypePassword('');
    setNewRole('ROLE_USER');
    setNewStatus(1);
    setFormError('');
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (newPassword !== newRetypePassword) {
      setFormError('Mật khẩu nhập lại không khớp.');
      return;
    }

    try {
      await createAccountMutation.mutateAsync({
        email: newEmail,
        password: newPassword,
        retypePassword: newRetypePassword,
        role: newRole,
        status: newStatus,
      });
      setShowAddModal(false);
      alert('Tạo tài khoản thành công!');
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Lỗi khi tạo tài khoản.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedUser) return;

    const payload: { role: string; newPassword?: string } = { role: editRole };
    if (editPassword.trim()) {
      payload.newPassword = editPassword;
    }

    try {
      await updateAccountMutation.mutateAsync({
        id: selectedUser.userId,
        payload,
      });
      setShowEditModal(false);
      alert('Cập nhật tài khoản thành công!');
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Lỗi khi cập nhật tài khoản.');
    }
  };

  const handleLockUnlock = async (user: UserAdminDTO) => {
    const action = user.status === 1 ? 'khóa' : 'mở khóa';
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này không?`)) return;

    try {
      if (user.status === 1) {
        await lockAccountMutation.mutateAsync(user.userId);
        alert('Đã khóa tài khoản.');
      } else {
        await unlockAccountMutation.mutateAsync(user.userId);
        alert('Đã mở khóa tài khoản.');
      }
    } catch (err: unknown) {
      alert((err as Error).message || 'Thao tác thất bại.');
    }
  };

  const totalPages = pageData?.totalPages || 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý tài khoản</h1>
          <p className="text-slate-500 mt-1">Danh sách người dùng và nhân viên trong hệ thống.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Thêm tài khoản
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Trạng thái</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-48">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Role</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="">Tất cả role</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_USER">User</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Tổng cộng: {pageData?.totalElements || 0} tài khoản
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6" style={{ width: '80px' }}>#</th>
                <th className="py-4 px-6">Email / Họ tên</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-right" style={{ width: '180px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    <div className="h-6 w-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Đang tải danh sách tài khoản...
                  </td>
                </tr>
              ) : !pageData || pageData.content.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                    Không tìm thấy tài khoản nào phù hợp.
                  </td>
                </tr>
              ) : (
                pageData.content.map((user, idx) => (
                  <tr key={user.userId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6 font-bold text-slate-400">
                      {idx + 1 + (page - 1) * 10}
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="font-semibold text-slate-800">{user.userName}</div>
                      {user.fullName && (
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{user.fullName}</div>
                      )}
                    </td>
                    <td className="py-4.5 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          user.role === 'ROLE_ADMIN'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          user.status === 1
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === 1 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {user.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleLockUnlock(user)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          user.status === 1
                            ? 'border-red-100 hover:bg-red-50 text-red-500 hover:text-red-700'
                            : 'border-emerald-100 hover:bg-emerald-50 text-emerald-500 hover:text-emerald-700'
                        }`}
                        title={user.status === 1 ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {user.status === 1 ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Container */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-center gap-1.5 bg-slate-50/50">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              ‹ Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  p === page
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'border border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              Sau ›
            </button>
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Thêm tài khoản</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600 flex items-center gap-2">
                <ShieldAlert size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nhập lại</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newRetypePassword}
                    onChange={(e) => setNewRetypePassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quyền hạn</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  >
                    <option value="ROLE_USER">User (Khách)</option>
                    <option value="ROLE_ADMIN">Admin (Quản trị)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trạng thái</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(Number(e.target.value))}
                    className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-700 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createAccountMutation.isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  {createAccountMutation.isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Chỉnh sửa tài khoản</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600 flex items-center gap-2">
                <ShieldAlert size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={selectedUser.userName}
                  className="w-full px-4 py-3 border border-slate-100 bg-slate-50 text-slate-400 rounded-xl text-sm outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quyền hạn</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Mật khẩu mới <span className="text-[10px] text-slate-400">(để trống nếu không đổi)</span>
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-700 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={updateAccountMutation.isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  {updateAccountMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
