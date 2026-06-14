import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import type { CartItemResponseDTO } from '../types';

interface CartItemProps {
  item: CartItemResponseDTO;
  onQuantityChange: (cartItemId: number, productId: number, currentQty: number, delta: number) => void;
  onToggleSelect: (cartItemId: number, currentSelected: boolean) => void;
  onRemove: (cartItemId: number) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

export function CartItem({
  item,
  onQuantityChange,
  onToggleSelect,
  onRemove,
  isUpdating,
  isRemoving,
}: CartItemProps) {
  return (
    <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
      {/* Selection Checkbox */}
      <div className="shrink-0">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => onToggleSelect(item.cartItemId, item.selected)}
          className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-950"
        />
      </div>

      {/* Product Image */}
      <div className="h-24 w-24 rounded-xl border border-slate-100 overflow-hidden shrink-0 bg-slate-50">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
          alt={item.productName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h3 className="font-bold text-slate-800 text-lg hover:text-slate-900 transition-colors truncate">
          <Link to={`/products/${item.productId}`}>{item.productName}</Link>
        </h3>
        <p className="text-slate-500 font-semibold mt-1">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity controls & Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
        {/* Quantity Selector */}
        <div className="flex items-center border border-slate-200 rounded-lg h-9 overflow-hidden bg-slate-50">
          <button
            onClick={() => onQuantityChange(item.cartItemId, item.productId, item.quantity, -1)}
            disabled={item.quantity <= 1 || isUpdating}
            className="px-3 text-slate-500 hover:bg-slate-100 hover:text-slate-800 h-full flex items-center transition-colors disabled:opacity-50"
          >
            <Minus size={14} />
          </button>
          <span className="w-12 text-center text-sm font-bold text-slate-700">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item.cartItemId, item.productId, item.quantity, 1)}
            disabled={isUpdating}
            className="px-3 text-slate-500 hover:bg-slate-100 hover:text-slate-800 h-full flex items-center transition-colors disabled:opacity-50"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="w-28 text-right hidden sm:block">
          <p className="font-extrabold text-slate-900 text-base">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        {/* Delete Action */}
        <button
          onClick={() => onRemove(item.cartItemId)}
          disabled={isRemoving}
          className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
          title="Xóa khỏi giỏ hàng"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
