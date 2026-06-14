import { useParams, useSearchParams } from 'react-router-dom';
import { useCategoryProducts, useSearchProducts } from '@/features/products/hooks/useProductApi';
import ProductCard from '@/features/products/components/ProductCard';
import ProductSkeleton from '@/components/shared/ProductSkeleton';
import PaginationHelper from '@/components/shared/PaginationHelper';
import { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: categoryId } = useParams<{ id: string }>();
  const categoryName = searchParams.get('name') || 'Sản phẩm';
  const keyword = searchParams.get('q') || searchParams.get('keyword') || '';
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = 12;

  // Sorting state from URL
  const sortBy = (searchParams.get('sortBy') as 'default' | 'price-asc' | 'price-desc' | 'name-asc') || 'default';

  // Filter state from URL or default
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    return parseInt(searchParams.get('maxPrice') || '5000000', 10);
  });
  const onlyInStock = searchParams.get('inStock') === 'true';

  // Debounced max price for API call
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState<number>(maxPrice);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice);
      
      const newParams = new URLSearchParams(searchParams);
      if (maxPrice !== 5000000) {
        newParams.set('maxPrice', maxPrice.toString());
      } else {
        newParams.delete('maxPrice');
      }
      newParams.set('page', '1');
      setSearchParams(newParams);
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrice]);

  const handleInStockChange = (checked: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (checked) {
      newParams.set('inStock', 'true');
    } else {
      newParams.delete('inStock');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (value: 'default' | 'price-asc' | 'price-desc' | 'name-asc') => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== 'default') {
      newParams.set('sortBy', value);
    } else {
      newParams.delete('sortBy');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const apiFilters = {
    minPrice: 0,
    maxPrice: debouncedMaxPrice,
    inStock: onlyInStock ? true : undefined,
    sortBy: sortBy !== 'default' ? sortBy : undefined,
  };

  // Fetch data depending on whether it's a search or category page
  const categoryProductsQuery = useCategoryProducts(
    categoryId ? Number(categoryId) : undefined,
    page,
    size,
    apiFilters
  );

  const searchProductsQuery = useSearchProducts(
    keyword,
    page,
    size,
    apiFilters
  );

  const activeQuery = categoryId ? categoryProductsQuery : searchProductsQuery;
  const { data: response, isLoading, isError } = activeQuery;
  
  const pageData = response?.data;
  const totalPages = pageData?.totalPages || 1;
  const totalElements = pageData?.totalElements || 0;

  // Render products directly from backend
  const processedProducts = pageData?.content || [];

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price-asc':
        return 'Giá: Thấp đến Cao';
      case 'price-desc':
        return 'Giá: Cao đến Thấp';
      case 'name-asc':
        return 'Tên: A - Z';
      default:
        return 'Mặc định';
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-600">
        <p className="font-semibold text-lg">Lỗi tải danh sách sản phẩm.</p>
        <p className="text-slate-500 mt-2 text-sm">Vui lòng tải lại trang hoặc thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {keyword ? `Kết quả tìm kiếm: "${keyword}"` : categoryName}
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          {isLoading ? 'Đang kiểm tra kho hàng...' : `Tìm thấy ${totalElements} sản phẩm phù hợp`}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b pb-2">
              <SlidersHorizontal size={16} className="text-slate-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Bộ lọc tìm kiếm</h3>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-slate-700 flex justify-between">
                <span>Giá tối đa:</span>
                <span className="text-slate-900 font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(maxPrice)}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="5000000"
                step="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0đ</span>
                <span>5.000.000đ</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="flex items-center gap-2.5 pt-2 border-t">
              <input
                type="checkbox"
                id="inStockOnly"
                checked={onlyInStock}
                onChange={(e) => handleInStockChange(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <label htmlFor="inStockOnly" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                Chỉ hiển thị còn hàng
              </label>
            </div>
          </div>
        </aside>

        {/* Right Product List Area */}
        <div className="flex-1 min-w-0">
          {/* Sorting Header */}
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <span className="text-sm text-slate-500 font-medium">
              Hiển thị {processedProducts.length} sản phẩm
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" className="flex items-center gap-2 border-slate-200 text-slate-700 h-9 font-medium">
                <ArrowUpDown size={14} />
                Sắp xếp: {getSortLabel()}
              </Button>}>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 text-slate-900">
                <DropdownMenuItem onClick={() => handleSortChange('default')} className="cursor-pointer hover:bg-slate-100">
                  Mặc định
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('price-asc')} className="cursor-pointer hover:bg-slate-100">
                  Giá: Thấp đến Cao
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('price-desc')} className="cursor-pointer hover:bg-slate-100">
                  Giá: Cao đến Thấp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('name-asc')} className="cursor-pointer hover:bg-slate-100">
                  Tên: A - Z
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Grid Products */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <ProductSkeleton count={6} />
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 py-16 text-center text-slate-500">
              Không có sản phẩm nào phù hợp với bộ lọc đã chọn.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {processedProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12">
                <PaginationHelper
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
