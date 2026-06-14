import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import {
  useMyOrdersQuery,
  useOrderDetailQuery,
  useCancelOrderMutation,
} from '@/features/orders/hooks/useOrderApi';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OrderTabs, OrderCard, OrderDetailModal } from '@/features/orders/components';

const TABS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // States
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const pageSize = 5;
  const statusParam = activeTab === 'ALL' ? undefined : activeTab;

  // Queries & Mutations
  const { data: pageData, isLoading, isError } = useMyOrdersQuery(page, pageSize, statusParam);
  const { data: orderDetail, isLoading: isLoadingDetail } = useOrderDetailQuery(
    selectedOrderId || undefined,
    !!selectedOrderId
  );
  const cancelOrderMutation = useCancelOrderMutation();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Reset page to 1 when changing tabs
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setPage(1);
  };

  const handleCancelOrder = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      cancelOrderMutation.mutate(id, {
        onSuccess: () => {
          alert('Hủy đơn hàng thành công!');
        },
        onError: (err: unknown) => {
          const error = err as { message?: string };
          alert(error.message || 'Hủy đơn hàng thất bại');
        },
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const orders = pageData?.content || [];
  const totalPages = pageData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3 no-underline">
            <ArrowLeft size={16} />
            Quay lại trang chủ
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đơn hàng của tôi</h1>
          <p className="text-slate-500 text-sm mt-1">Xem và quản lý lịch sử đặt hàng của bạn</p>
        </div>

        {/* Tab filters */}
        <OrderTabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-1/5"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-10 bg-slate-200 rounded w-1/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-6 text-center">
            Có lỗi xảy ra khi tải danh sách đơn hàng. Vui lòng thử lại sau.
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center flex flex-col items-center justify-center border-slate-100">
            <ShoppingBag size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy đơn hàng nào</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn chưa có đơn hàng nào ở trạng thái này.</p>
            <Link to="/">
              <Button className="bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl px-6">
                Mua sắm ngay
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onCancel={handleCancelOrder}
                onViewDetail={setSelectedOrderId}
                isCancelling={cancelOrderMutation.isPending}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-slate-200 text-slate-600 rounded-xl p-2.5 h-10 w-10 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <span className="text-sm font-bold text-slate-600">
                  Trang {page} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-slate-200 text-slate-600 rounded-xl p-2.5 h-10 w-10 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          orderDetail={orderDetail}
          isLoadingDetail={isLoadingDetail}
          onCancelOrder={handleCancelOrder}
          isCancelling={cancelOrderMutation.isPending}
        />
      )}
    </div>
  );
}
