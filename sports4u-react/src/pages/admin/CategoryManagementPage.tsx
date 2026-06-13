import React, { useState, useEffect } from 'react';
import {
  useAdminCategories,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../hooks/useAdminApi';
import apiClient from '../../services/apiClient';
import { Folder, FolderOpen, Tag, Plus, Edit2, Trash2, X, Search, ChevronRight, ChevronDown } from 'lucide-react';
import type { CategoryDTO } from '../../types/api';

export default function CategoryManagementPage() {
  const [page, setPage] = useState(1);
  
  // Expanded parent category IDs
  const [expandedParentIds, setExpandedParentIds] = useState<number[]>([]);
  // Store children categories mapped by parent ID
  const [childrenMap, setChildrenMap] = useState<Record<number, CategoryDTO[]>>({});
  const [loadingChildren, setLoadingChildren] = useState<Record<number, boolean>>({});

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null);

  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [allParents, setAllParents] = useState<CategoryDTO[]>([]);

  // Search subcategories
  const [searchQuery, setSearchQuery] = useState('');
  const [allChildrenForSearch, setAllChildrenForSearch] = useState<CategoryDTO[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<CategoryDTO[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  // Queries & Mutations
  const { data: pageData, isLoading, refetch } = useAdminCategories(page, 10);
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  // Load all parents for dropdown
  const loadParentDropdownData = async () => {
    try {
      const res = await apiClient.get('/admin/categories?page=1&size=100');
      const content = res.data?.content || [];
      // Parents are categories without a parentId
      const parents = content.filter((cat: CategoryDTO) => !cat.parentId);
      setAllParents(parents);
    } catch (err) {
      console.error(err);
    }
  };

  // Load all children for search autocomplete
  const loadAllChildrenForSearch = async () => {
    try {
      const res = await apiClient.get('/admin/categories/children');
      const list = res.data || [];
      setAllChildrenForSearch(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const res = await apiClient.get('/admin/categories/children');
        if (isMounted) {
          setAllChildrenForSearch(res.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matched = allChildrenForSearch.filter((cat) =>
      cat.categoryName.toLowerCase().includes(val.toLowerCase())
    );
    setSearchSuggestions(matched);
    setShowSuggestions(true);
  };

  const toggleParent = async (parentId: number) => {
    const isExpanded = expandedParentIds.includes(parentId);
    if (isExpanded) {
      setExpandedParentIds((prev) => prev.filter((id) => id !== parentId));
    } else {
      setExpandedParentIds((prev) => [...prev, parentId]);
      if (!childrenMap[parentId]) {
        setLoadingChildren((prev) => ({ ...prev, [parentId]: true }));
        try {
          const res = await apiClient.get(`/admin/categories/${parentId}/child`);
          setChildrenMap((prev) => ({ ...prev, [parentId]: res.data || [] }));
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingChildren((prev) => ({ ...prev, [parentId]: false }));
        }
      }
    }
  };

  const handleOpenAdd = async () => {
    setCategoryName('');
    setParentId('');
    setErrorMsg('');
    await loadParentDropdownData();
    setShowAddModal(true);
  };

  const handleOpenEdit = async (cat: CategoryDTO) => {
    setSelectedCategory(cat);
    setCategoryName(cat.categoryName);
    setErrorMsg('');
    setShowEditModal(true);
  };

  const handleOpenDelete = (cat: CategoryDTO) => {
    setSelectedCategory(cat);
    setShowDeleteModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!categoryName.trim()) {
      setErrorMsg('Vui lòng nhập tên danh mục.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        categoryName,
        parentId: parentId ? Number(parentId) : null,
      });
      setShowAddModal(false);
      refetch();
      loadAllChildrenForSearch();
      // Clear children cache if parent is modified
      if (parentId) {
        setChildrenMap((prev) => {
          const updated = { ...prev };
          delete updated[Number(parentId)];
          return updated;
        });
        // Remove from expanded to force reload on next click
        setExpandedParentIds((prev) => prev.filter((id) => id !== Number(parentId)));
      }
      alert('Thêm danh mục thành công!');
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Lỗi xảy ra.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!categoryName.trim() || !selectedCategory) {
      setErrorMsg('Vui lòng nhập tên danh mục.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: selectedCategory.categoryId,
        payload: {
          categoryName,
          parentId: selectedCategory.parentId,
        },
      });
      setShowEditModal(false);
      refetch();
      loadAllChildrenForSearch();
      const pId = selectedCategory.parentId;
      if (pId) {
        // Clear children cache
        setChildrenMap((prev) => {
          const updated = { ...prev };
          delete updated[pId];
          return updated;
        });
        setExpandedParentIds((prev) => prev.filter((id) => id !== pId));
      }
      alert('Cập nhật thành công!');
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Lỗi xảy ra.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    try {
      await deleteMutation.mutateAsync(selectedCategory.categoryId);
      setShowDeleteModal(false);
      refetch();
      loadAllChildrenForSearch();
      const pId = selectedCategory.parentId;
      if (pId) {
        setChildrenMap((prev) => {
          const updated = { ...prev };
          delete updated[pId];
          return updated;
        });
        setExpandedParentIds((prev) => prev.filter((id) => id !== pId));
      }
      alert('Xóa danh mục thành công!');
    } catch (err: unknown) {
      alert((err as Error).message || 'Lỗi khi xóa danh mục.');
    }
  };

  const totalPages = pageData?.totalPages || 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Danh mục sản phẩm</h1>
          <p className="text-slate-500 mt-1">Quản lý các danh mục phân loại hàng hóa.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Thêm danh mục
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative">
        <div className="relative max-w-lg w-full">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm danh mục con..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="absolute right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Autocomplete suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <ul className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-150 shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-50">
              {searchSuggestions.map((cat) => (
                <li
                  key={cat.categoryId}
                  className="px-4 py-3 hover:bg-slate-50 flex justify-between items-center cursor-pointer text-sm text-slate-700"
                  onClick={() => {
                    setSearchQuery(cat.categoryName);
                    setShowSuggestions(false);
                    // Open modal or display details
                    handleOpenEdit(cat);
                  }}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Tag size={14} className="text-blue-500" />
                    {cat.categoryName}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {cat.productCount ?? 0} SP
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6" style={{ width: '80px' }}>#</th>
                <th className="py-4 px-6">Tên danh mục</th>
                <th className="py-4 px-6 text-center" style={{ width: '220px' }}>Số lượng sản phẩm</th>
                <th className="py-4 px-6 text-right" style={{ width: '180px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">
                    <div className="h-6 w-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : !pageData || pageData.content.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                    Không tìm thấy danh mục nào.
                  </td>
                </tr>
              ) : (
                pageData.content.map((cat, idx) => {
                  const isExpanded = expandedParentIds.includes(cat.categoryId);
                  return (
                    <React.Fragment key={cat.categoryId}>
                      {/* Parent row */}
                      <tr
                        onClick={() => toggleParent(cat.categoryId)}
                        className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                      >
                        <td className="py-4.5 px-6 font-bold text-slate-400">
                          {idx + 1 + (page - 1) * 10}
                        </td>
                        <td className="py-4.5 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </span>
                            <span className="text-slate-400">
                              {isExpanded ? <FolderOpen size={18} className="text-blue-500" /> : <Folder size={18} className="text-slate-400" />}
                            </span>
                            <span className="font-bold text-slate-800 text-base">{cat.categoryName}</span>
                          </div>
                        </td>
                        <td className="py-4.5 px-6 text-center font-semibold text-slate-700">
                          {cat.productCount ?? 0}
                        </td>
                        <td className="py-4.5 px-6 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg border border-slate-250 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Sửa tên"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(cat)}
                            className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                            title="Xóa danh mục"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>

                      {/* Children row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={4} className="p-0 bg-slate-50/50">
                            <div className="pl-14 pr-6 py-4 border-l-4 border-blue-500/30">
                              {loadingChildren[cat.categoryId] ? (
                                <div className="py-2 text-slate-400 flex items-center gap-2 text-xs">
                                  <div className="h-4 w-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                                  Đang tải danh mục con...
                                </div>
                              ) : !childrenMap[cat.categoryId] || childrenMap[cat.categoryId].length === 0 ? (
                                <div className="py-2 text-slate-450 italic text-xs">Chưa có danh mục con.</div>
                              ) : (
                                <div className="divide-y divide-slate-100">
                                  {childrenMap[cat.categoryId].map((child) => (
                                    <div key={child.categoryId} className="flex justify-between items-center py-3">
                                      <span className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                        <Tag size={13} className="text-blue-500" />
                                        {child.categoryName}
                                      </span>
                                      <div className="flex items-center gap-6">
                                        <span className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                          {child.productCount ?? 0} SP
                                        </span>
                                        <div className="flex gap-1">
                                          <button
                                            onClick={() => handleOpenEdit(child)}
                                            className="p-1 rounded border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                                          >
                                            <Edit2 size={12} />
                                          </button>
                                          <button
                                            onClick={() => handleOpenDelete(child)}
                                            className="p-1 rounded border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
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

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Thêm danh mục</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Danh mục cha (Tùy chọn)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                >
                  <option value="">-- Không chọn (Thêm làm danh mục chính) --</option>
                  {allParents.map((parent) => (
                    <option key={parent.categoryId} value={parent.categoryId}>
                      {parent.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên danh mục..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
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
                  disabled={createMutation.isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  {createMutation.isPending ? 'Đang lưu...' : 'Lưu danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Sửa danh mục</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Phân loại cha
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={
                    selectedCategory.parentId
                      ? 'Danh mục con'
                      : 'Danh mục chính (Cấp 1)'
                  }
                  className="w-full px-4 py-3 border border-slate-100 bg-slate-50 text-slate-400 rounded-xl text-sm outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên danh mục..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
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
                  disabled={updateMutation.isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Xác nhận xóa</h3>
            <p className="text-slate-600 text-sm mb-6">
              Bạn có chắc muốn xóa danh mục{' '}
              <strong className="text-slate-900">"{selectedCategory.categoryName}"</strong> không? Hành động này có
              thể ảnh hưởng đến việc hiển thị các sản phẩm thuộc danh mục này.
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
