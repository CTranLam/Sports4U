import { Link } from 'react-router-dom';
import type { ProductDTO } from '../../types/api';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: ProductDTO;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price || 0);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Product Image & Badges */}
      <Link to={`/products/${product.productId}`} className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400'}
          alt={product.productName}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400';
          }}
        />

        {/* Floating Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isPopular && (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              Bán chạy
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-slate-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              Hết hàng
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Name */}
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {product.categoryName || 'Sản phẩm'}
        </span>

        {/* Product Title */}
        <Link
          to={`/products/${product.productId}`}
          className="mt-1 line-clamp-2 text-sm font-semibold text-slate-800 hover:text-slate-900 no-underline"
        >
          {product.productName}
        </Link>

        {/* Price & Cart Trigger */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-base font-bold text-slate-900">{formattedPrice}</span>
          
          <Link
            to={`/products/${product.productId}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white transition-colors duration-200 hover:bg-slate-800"
            title="Xem chi tiết"
          >
            <ShoppingBag size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
