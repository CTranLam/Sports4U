import { useState } from 'react';
import {
  useAdminOrders,
  useUpdateOrderStatusMutation,
} from '../../hooks/useAdminApi';


const STATUS_MAP: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'Chờ xác nhận', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Đã xác nhận', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  SHIPPING: { label: 'Đang vận chuyển', class: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  COMPLETED: { label: 'Hoàn thành', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', class: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; class: string }> = {
  PAID: { label: 'Đã thanh toán', class: 'bg-emerald-50 text-emerald-600' },
  UNPAID: { label: 'Chưa thanh toán', class: 'bg-red-50 text-red-650' },
};

const PAYMENT_METHOD_MAP: Record<string, string> = {
  VNPAY: 'VNPay',
  COD: 'COD',
  MOMO: 'MoMo',
};

export default function OrderManagementPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');

  // Queries & Mutations
  const { data: pageData, isLoading, refetch } = useAdminOrders(page, 10, statusFilter, paymentStatusFilter);
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status: newStatus });
      alert('Cập nhật trạng thái đơn hàng thành công!');
      refetch();
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi cập nhật trạng thái đơn hàng.');
    }
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(
      d.getHours()
    ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const totalPages = pageData?.totalPages || 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-slate-500 mt-1">Theo dõi, duyệt và cập nhật trạng thái vận chuyển của đơn đặt hàng.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Trạng thái đơn hàng
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="SHIPPING">Đang vận chuyển</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-48">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Trạng thái thanh toán
            </span>
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="">Tất cả thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="UNPAID">Chưa thanh toán</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Tổng cộng: {pageData?.totalElements || 0} đơn hàng
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6" style={{ width: '60px' }}>#</th>
                <th className="py-4 px-6">Mã đơn</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Địa chỉ</th>
                <th className="py-4 px-6">Trạng thái đơn</th>
                <th className="py-4 px-6">Thanh toán</th>
                <th className="py-4 px-6">Tổng tiền</th>
                <th className="py-4 px-6">Ngày đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400">
                    <div className="h-6 w-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : !pageData || pageData.content.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400 font-medium">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                pageData.content.map((order, idx) => {
                  const statusInfo = STATUS_MAP[order.status] || {
                    label: order.status,
                    class: 'bg-slate-50 text-slate-700 border-slate-200',
                  };
                  const payInfo = PAYMENT_STATUS_MAP[order.paymentStatus] || {
                    label: order.paymentStatus,
                    class: 'bg-slate-50 text-slate-700',
                  };
                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors align-middle">
                      <td className="py-4.5 px-6 font-bold text-slate-400">
                        {(page - 1) * 10 + idx + 1}
                      </td>
                      <td className="py-4.5 px-6">
                        <span className="font-bold text-slate-800">#{order.orderId}</span>
                      </td>
                      <td className="py-4.5 px-6">
                        <span className="font-medium text-slate-750">{order.userEmail}</span>
                      </td>
                      <td className="py-4.5 px-6">
                        <div
                          className="text-xs text-slate-450 max-w-45 truncate"
                          title={order.fullAddress || ''}
                        >
                          {order.fullAddress || 'Chưa cập nhật'}
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <select
                          value={order.status}
                          disabled={updateStatusMutation.isPending}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer transition-all ${statusInfo.class}`}
                        >
                          <option value="PENDING">Chờ xác nhận</option>
                          <option value="CONFIRMED">Đã xác nhận</option>
                          <option value="SHIPPING">Đang vận chuyển</option>
                          <option value="COMPLETED">Hoàn thành</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="space-y-0.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${payInfo.class}`}
                          >
                            {payInfo.label}
                          </span>
                          <div className="text-[10px] text-slate-400 font-bold ml-1">
                            {PAYMENT_METHOD_MAP[order.paymentMethod] || order.paymentMethod}
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 font-bold text-slate-800">
                        {formatVND(order.totalAmount)}
                      </td>
                      <td className="py-4.5 px-6 text-slate-500 text-xs font-medium">
                        {formatDate(order.orderDate)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
    </div>
  );
}
