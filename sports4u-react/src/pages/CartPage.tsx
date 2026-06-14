import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import {
  useCart,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from '@/features/cart/hooks/useCartApi';
import { ShoppingBag, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem, CartSummary } from '@/features/cart/components';

export default function CartPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const { data: cartItems = [], isLoading, isError } = useCart();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeFromCartMutation = useRemoveFromCartMutation();

  const handleQuantityChange = (
    cartItemId: number,
    productId: number,
    currentQty: number,
    delta: number
  ) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    updateCartItemMutation.mutate(
      { cartItemId, productId, quantity: newQty },
      {
        onError: (err: unknown) => {
          const error = err as { message?: string };
          alert(error.message || 'Không thể cập nhật số lượng sản phẩm.');
        },
      }
    );
  };

  const handleToggleSelect = (cartItemId: number, currentSelected: boolean) => {
    updateCartItemMutation.mutate(
      { cartItemId, selected: !currentSelected },
      {
        onError: (err: unknown) => {
          const error = err as { message?: string };
          alert(error.message || 'Không thể cập nhật trạng thái chọn sản phẩm.');
        },
      }
    );
  };

  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);

  const handleSelectAll = () => {
    const targetSelected = !allSelected;
    cartItems.forEach((item) => {
      if (item.selected !== targetSelected) {
        updateCartItemMutation.mutate({
          cartItemId: item.cartItemId,
          selected: targetSelected,
        });
      }
    });
  };

  const handleRemoveItem = (cartItemId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      removeFromCartMutation.mutate(cartItemId, {
        onError: (err: unknown) => {
          const error = err as { message?: string };
          alert(error.message || 'Không thể xóa sản phẩm khỏi giỏ hàng.');
        },
      });
    }
  };

  // Auth Wall
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-50 p-6 rounded-full text-slate-400 mb-6">
          <Lock size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Đăng nhập để xem giỏ hàng</h2>
        <p className="text-slate-500 max-w-sm mb-8">
          Vui lòng đăng nhập vào tài khoản của bạn để xem danh sách sản phẩm đã lưu và tiến hành thanh toán.
        </p>
        <Link to="/login">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-xl font-semibold shadow-md flex items-center gap-2">
            Đăng nhập ngay
            <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-slate-800 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Đang tải giỏ hàng của bạn...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-red-600">
        <p className="font-semibold text-lg">Đã có lỗi xảy ra khi tải giỏ hàng.</p>
        <p className="text-slate-500 mt-2 text-sm">Vui lòng làm mới trang hoặc thử lại sau.</p>
      </div>
    );
  }

  // Calculate totals based ONLY on selected items
  const selectedItems = cartItems.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 1000000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-50 p-6 rounded-full text-slate-400 mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-slate-500 max-w-sm mb-8">
          Hãy lấp đầy giỏ hàng của bạn bằng những sản phẩm thể thao chất lượng từ cửa hàng của chúng tôi.
        </p>
        <Link to="/">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-xl font-semibold shadow-md">
            Quay lại mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    const productIds = selectedItems.map((item) => item.productId);
    sessionStorage.setItem('selectedCartItems', JSON.stringify(productIds));
    sessionStorage.removeItem('buyNowItem');
    navigate('/delivery');
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Giỏ hàng</h1>
        <p className="text-sm text-slate-500 mt-1">
          Bạn đang có <span className="font-bold text-slate-800">{cartItems.length}</span> sản phẩm trong giỏ hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Select All Action Bar */}
          <div className="border border-slate-100 bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-950"
              id="select-all"
            />
            <label htmlFor="select-all" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
              Chọn tất cả ({cartItems.length} sản phẩm)
            </label>
          </div>

          <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onToggleSelect={handleToggleSelect}
                  onRemove={handleRemoveItem}
                  isUpdating={updateCartItemMutation.isPending}
                  isRemoving={removeFromCartMutation.isPending}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <CartSummary
            selectedCount={selectedItems.length}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
            onCheckout={handleCheckout}
            disabled={selectedItems.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
