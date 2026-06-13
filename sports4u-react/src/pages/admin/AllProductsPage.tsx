import { useState, useEffect } from 'react';
import {
  useAdminProducts,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../../hooks/useAdminApi';
import apiClient from '../../services/apiClient';
import { Plus, Edit2, Trash2, X, Filter, RefreshCw, Star } from 'lucide-react';
import type { CategoryDTO, ProductAdminDTO } from '../../types/api';

export default function AllProductsPage() {
  const [page, setPage] = useState(1);

  // Active filters
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPopular, setIsPopular] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Applied filters (passed to API query)
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    categoryId: '',
    isPopular: '',
    minPrice: '',
    maxPrice: '',
  });

  // Category list for dropdowns
  const [childCategories, setChildCategories] = useState<CategoryDTO[]>([]);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductAdminDTO | null>(null);

  // Form states
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodQty, setProdQty] = useState('');
  const [prodOrigin, setProdOrigin] = useState('');
  const [prodAdvantages, setProdAdvantages] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodIsPopular, setProdIsPopular] = useState('false');
  const [prodImageFile, setProdImageFile] = useState<File | null>(null);
  const [prodImagePreview, setProdImagePreview] = useState('');

  const [formError, setFormError] = useState('');

  // Queries & Mutations
  const { data: pageData, isLoading, refetch } = useAdminProducts(page, 10, appliedFilters);
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  useEffect(() => {
    let isMounted = true;
    const fetchSubcategories = async () => {
      try {
        const res = await apiClient.get('/admin/categories/children');
        if (isMounted) {
          const list = res.data || [];
          // Only keep children categories (those that have a parentId)
          const children = list.filter((cat: CategoryDTO) => cat.parentId);
          setChildCategories(children);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubcategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters({
      keyword,
      categoryId,
      isPopular,
      minPrice,
      maxPrice,
    });
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategoryId('');
    setIsPopular('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    setAppliedFilters({
      keyword: '',
      categoryId: '',
      isPopular: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setProdName('');
    setProdPrice('');
    setProdQty('');
    setProdOrigin('');
    setProdAdvantages('');
    setProdCategory('');
    setProdIsPopular('false');
    setProdImageFile(null);
    setProdImagePreview('');
    setFormError('');
    setShowProductModal(true);
  };

  const handleOpenEdit = (p: ProductAdminDTO) => {
    setSelectedProduct(p);
    setProdName(p.productName);
    setProdPrice(p.price.toString());
    setProdQty(p.quantity.toString());
    setProdOrigin(p.origin || '');
    setProdAdvantages(p.advantages || '');
    setProdCategory(p.categoryId?.toString() || '');
    setProdIsPopular(p.isPopular ? 'true' : 'false');
    setProdImageFile(null);
    setProdImagePreview(p.imageUrl || '');
    setFormError('');
    setShowProductModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProdImageFile(file);
      setProdImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!prodName.trim() || !prodPrice || !prodQty) {
      setFormError('Vui lòng nhập đầy đủ thông tin bắt buộc (Tên, Giá, Số lượng).');
      return;
    }

    if (!prodCategory) {
      setFormError('Vui lòng chọn danh mục sản phẩm.');
      return;
    }

    const isEdit = !!selectedProduct;

    if (!isEdit && !prodImageFile) {
      setFormError('Vui lòng chọn hình ảnh cho sản phẩm mới.');
      return;
    }

    const payload = {
      productName: prodName.trim(),
      price: parseFloat(prodPrice),
      stockQuantity: parseInt(prodQty),
      origin: prodOrigin.trim(),
      advantages: prodAdvantages.trim(),
      categoryId: parseInt(prodCategory),
      isPopular: prodIsPopular === 'true',
    };

    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );

    if (prodImageFile) {
      formData.append('image', prodImageFile);
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: selectedProduct.productId,
          formData,
        });
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await createMutation.mutateAsync(formData);
        alert('Thêm sản phẩm thành công!');
      }
      setShowProductModal(false);
      refetch();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Lỗi khi lưu sản phẩm.');
    }
  };

  const handleOpenDelete = (p: ProductAdminDTO) => {
    setSelectedProduct(p);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      await deleteMutation.mutateAsync(selectedProduct.productId);
      setShowDeleteModal(false);
      refetch();
      alert('Xóa sản phẩm thành công!');
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi xóa sản phẩm.');
    }
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const totalPages = pageData?.totalPages || 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tất cả sản phẩm</h1>
          <p className="text-slate-500 mt-1">Quản lý toàn bộ thông tin sản phẩm trong hệ thống.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </button>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Filter size={16} />
          Bộ lọc tìm kiếm
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Tên sản phẩm</span>
            <input
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Danh mục</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="">Tất cả danh mục</option>
              {childCategories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Trạng thái Hot</span>
            <select
              value={isPopular}
              onChange={(e) => setIsPopular(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="">Tất cả</option>
              <option value="true">Hot</option>
              <option value="false">Không hot</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 lg:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Khoảng giá (₫)</span>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Từ"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 outline-none focus:border-blue-500 focus:bg-white"
              />
              <span className="text-slate-350 text-xs font-bold">-</span>
              <input
                type="number"
                placeholder="Đến"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw size={12} />
            Thiết lập lại
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Filter size={12} />
            Áp dụng lọc
          </button>
        </div>
      </div>

      {/* Results details */}
      <div className="text-xs font-bold text-slate-450 px-1">
        {pageData && pageData.totalElements > 0 ? (
          <span>
            Hiển thị {(page - 1) * 10 + 1} – {Math.min(page * 10, pageData.totalElements)} trong tổng số{' '}
            {pageData.totalElements} sản phẩm
          </span>
        ) : (
          <span>Không có sản phẩm nào</span>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6" style={{ width: '60px' }}>#</th>
                <th className="py-4 px-6">Sản phẩm</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Giá bán</th>
                <th className="py-4 px-6 text-center">Tồn kho</th>
                <th className="py-4 px-6 text-center">Hot</th>
                <th className="py-4 px-6 text-right" style={{ width: '150px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <div className="h-6 w-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : !pageData || pageData.content.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 font-medium">
                    Không tìm thấy sản phẩm nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                pageData.content.map((p, idx) => (
                  <tr key={p.productId} className="hover:bg-slate-50/50 transition-colors align-middle">
                    <td className="py-4 px-6 font-bold text-slate-400">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl || ''}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                          alt={p.productName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="truncate max-w-60">
                          <div className="font-bold text-slate-800 truncate" title={p.productName}>
                            {p.productName}
                          </div>
                          {p.origin && (
                            <div className="text-xs text-slate-400 font-medium mt-0.5">{p.origin}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {p.categoryName || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {formatVND(p.price)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          p.quantity > 0
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-650'
                        }`}
                      >
                        {p.quantity > 0 ? `${p.quantity} chiếc` : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {p.isPopular ? (
                        <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Star size={10} fill="currentColor" />
                          Hot
                        </span>
                      ) : (
                        <span className="text-slate-350 text-xs font-semibold">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(p)}
                        className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
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

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-650">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {childCategories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên sản phẩm..."
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Giá bán (₫) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Nhập giá..."
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Nhập số lượng..."
                    value={prodQty}
                    onChange={(e) => setProdQty(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Xuất xứ</label>
                  <input
                    type="text"
                    placeholder="Nhập xuất xứ..."
                    value={prodOrigin}
                    onChange={(e) => setProdOrigin(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trạng thái hot</label>
                  <select
                    value={prodIsPopular}
                    onChange={(e) => setProdIsPopular(e.target.value)}
                    className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  >
                    <option value="false">Không hot</option>
                    <option value="true">Hot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ưu điểm</label>
                <input
                  type="text"
                  placeholder="Mô tả ưu điểm..."
                  value={prodAdvantages}
                  onChange={(e) => setProdAdvantages(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hình ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {prodImagePreview && (
                  <img
                    src={prodImagePreview}
                    alt="Preview"
                    className="mt-3 max-h-36 rounded-xl object-cover border border-slate-100"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-700 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Xác nhận xóa</h3>
            <p className="text-slate-600 text-sm mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm{' '}
              <strong className="text-slate-900">"{selectedProduct.productName}"</strong> không? Hành động này không
              thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-700 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
