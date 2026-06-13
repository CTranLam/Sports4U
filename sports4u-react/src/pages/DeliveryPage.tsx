import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  useOrderPreviewFromCart,
  useOrderPreviewFromProduct,
  useCheckoutFromCartMutation,
  useCheckoutFromProductMutation,
  useVnPayUrlMutation,
} from '../hooks/useOrderApi';
import { MapPin, User, CreditCard, ArrowLeft, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface SessionBuyNowItem {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function DeliveryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('COD');
  const [checkoutError, setCheckoutError] = useState<string | null>(() => {
    return searchParams.get('error') ? 'Thanh toán VNPay thất bại hoặc đã bị hủy. Vui lòng thử lại.' : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  // Retrieve checkout sources from sessionStorage
  const buyNowItemStr = sessionStorage.getItem('buyNowItem');
  const selectedCartItemsStr = sessionStorage.getItem('selectedCartItems');

  const buyNowItem: SessionBuyNowItem | null = buyNowItemStr ? JSON.parse(buyNowItemStr) : null;
  const selectedCartItems: number[] = selectedCartItemsStr ? JSON.parse(selectedCartItemsStr) : [];

  const isBuyNow = !!buyNowItem;
  const isCartCheckout = !isBuyNow && selectedCartItems.length > 0;

  // Fetch previews
  const {
    data: cartPreviewData,
    isLoading: isCartPreviewLoading,
    error: cartPreviewError,
  } = useOrderPreviewFromCart(selectedCartItems, isCartCheckout);

  const {
    data: productPreviewData,
    isLoading: isProductPreviewLoading,
    error: productPreviewError,
  } = useOrderPreviewFromProduct(buyNowItem?.productId, buyNowItem?.quantity || 1, isBuyNow);

  const isLoading = isBuyNow ? isProductPreviewLoading : isCartPreviewLoading;
  const apiError = isBuyNow ? productPreviewError : cartPreviewError;

  // Normalized preview items list
  const previewItems = isBuyNow
    ? productPreviewData ? [productPreviewData] : []
    : cartPreviewData || [];

  // Mutations
  const checkoutFromCartMutation = useCheckoutFromCartMutation();
  const checkoutFromProductMutation = useCheckoutFromProductMutation();
  const vnPayUrlMutation = useVnPayUrlMutation();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Redirect if no items to checkout
  useEffect(() => {
    if (isOrderCompleted) return;
    if (!isLoading && previewItems.length === 0 && !apiError) {
      navigate('/cart');
    }
  }, [isLoading, previewItems.length, apiError, navigate, isOrderCompleted]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-slate-800 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Đang tải thông tin đơn hàng của bạn...</p>
      </div>
    );
  }

  // Address validation error handler
  if (apiError) {
    const errMsg = apiError.message || '';
    const needsAddressUpdate = errMsg.includes('địa chỉ') || errMsg.includes('address');

    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Không thể đặt hàng</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {needsAddressUpdate
              ? 'Tài khoản của bạn chưa cập nhật địa chỉ giao hàng nhận hàng. Vui lòng hoàn tất thông tin cá nhân trước khi thực hiện đặt hàng.'
              : errMsg || 'Đã xảy ra lỗi khi chuẩn bị đơn hàng.'}
          </p>
          
          {needsAddressUpdate ? (
            <Link to="/profile" className="w-full">
              <Button className="w-full bg-slate-950 hover:bg-slate-900 text-white py-3 rounded-xl font-semibold shadow-md">
                Cập nhật địa chỉ ngay
              </Button>
            </Link>
          ) : (
            <Link to="/cart" className="w-full">
              <Button className="w-full bg-slate-950 hover:bg-slate-900 text-white py-3 rounded-xl font-semibold shadow-md">
                Quay lại giỏ hàng
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Calculations
  const firstItem = previewItems[0];
  const receiverName = firstItem?.fullName || 'Chưa cập nhật';
  const receiverPhone = firstItem?.phone || 'Chưa cập nhật';
  const deliveryAddress = firstItem?.fullAddress || 'Chưa cập nhật địa chỉ';

  const subtotal = previewItems.reduce((acc, item) => acc + Number(item.subtotal), 0);
  const shippingFee = 0; // Backend order preview does not specify shipping fee, default to free
  const total = subtotal + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleConfirmOrder = async () => {
    try {
      setCheckoutError(null);
      setIsSubmitting(true);

      let orderId: number;

      if (isBuyNow && buyNowItem) {
        const response = await checkoutFromProductMutation.mutateAsync({
          productId: buyNowItem.productId,
          quantity: buyNowItem.quantity,
          paymentMethod: paymentMethod,
        });
        if (!response.data) {
          throw new Error('Không nhận được dữ liệu đơn hàng từ hệ thống.');
        }
        orderId = response.data.orderId;
      } else {
        const response = await checkoutFromCartMutation.mutateAsync({
          cartItemIds: selectedCartItems,
          paymentMethod: paymentMethod,
        });
        if (!response.data) {
          throw new Error('Không nhận được dữ liệu đơn hàng từ hệ thống.');
        }
        orderId = response.data.orderId;
      }

      if (paymentMethod === 'VNPAY') {
        // VNPay Payment redirect
        const paymentUrl = await vnPayUrlMutation.mutateAsync(orderId);
        setIsOrderCompleted(true);
        // Clean session
        sessionStorage.removeItem('buyNowItem');
        sessionStorage.removeItem('selectedCartItems');
        window.location.href = paymentUrl;
      } else {
        // COD Success flow
        setIsOrderCompleted(true);
        alert('Đặt hàng thành công! Cảm ơn quý khách đã mua sắm tại Sports4U.');
        sessionStorage.removeItem('buyNowItem');
        sessionStorage.removeItem('selectedCartItems');
        navigate('/');
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setCheckoutError(error.message || 'Đặt hàng thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Xác nhận đơn hàng</h1>

        {checkoutError && (
          <div className="mb-6 bg-red-50 border border-red-150 rounded-xl p-4 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
            <span>{checkoutError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Info & Items */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Receiver Info */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-slate-500" />
                Thông tin người nhận
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Họ và tên</span>
                  <p className="text-sm font-bold text-slate-800">{receiverName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Số điện thoại</span>
                  <p className="text-sm font-bold text-slate-800">{receiverPhone}</p>
                </div>
                <div className="space-y-1 md:col-span-2 pt-2 border-t border-slate-50">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Địa chỉ giao hàng</span>
                  <p className="text-sm font-bold text-slate-800 flex items-start gap-1.5 mt-0.5">
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{deliveryAddress}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm overflow-hidden">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-slate-500" />
                Sản phẩm sẽ giao
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-3 font-semibold">Sản phẩm</th>
                      <th className="pb-3 text-center font-semibold">Số lượng</th>
                      <th className="pb-3 text-right font-semibold">Giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewItems.map((item, idx) => (
                      <tr key={`${item.productId}-${idx}`} className="align-middle">
                        <td className="py-4 pr-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              width={52}
                              height={52}
                              className="rounded-lg object-cover bg-slate-50 border border-slate-100"
                              alt={item.productName}
                            />
                            <span className="font-bold text-slate-800 line-clamp-1">{item.productName}</span>
                          </div>
                        </td>
                        <td className="py-4 text-center font-bold text-slate-800">{item.quantity}</td>
                        <td className="py-4 text-right font-extrabold text-slate-900">{formatPrice(Number(item.subtotal))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side: Order summary & Payment options */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Tạm tính</span>
                  <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-green-600">Miễn phí</span>
                </div>
                
                <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline mb-6">
                  <span className="font-bold text-slate-900">Tổng cộng</span>
                  <span className="text-xl font-black text-slate-950">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4 mb-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard size={16} className="text-slate-500" />
                  Phương thức thanh toán
                </h3>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-slate-950 bg-slate-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="h-4.5 w-4.5 text-slate-950 focus:ring-slate-950 accent-slate-950"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-800">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-slate-450 mt-0.5">Giao hàng và thu tiền tại nhà</p>
                    </div>
                  </label>

                  {/* VNPAY */}
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'VNPAY'
                        ? 'border-slate-950 bg-slate-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={() => setPaymentMethod('VNPAY')}
                      className="h-4.5 w-4.5 text-slate-950 focus:ring-slate-950 accent-slate-950"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-800">Thanh toán điện tử VNPay</p>
                      <p className="text-slate-450 mt-0.5">Thanh toán online qua thẻ ATM/QR Code</p>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white py-6 rounded-xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Đang xử lý đơn hàng...
                  </>
                ) : (
                  'Xác nhận đặt hàng'
                )}
              </Button>

              <Link to="/cart">
                <Button variant="outline" className="w-full border-slate-200 text-slate-700 py-5 rounded-xl font-bold text-sm mt-3 flex items-center justify-center gap-1.5">
                  <ArrowLeft size={16} />
                  Quay lại giỏ hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
