import { useState } from 'react';
import {
  useDashboardSummary,
  useRevenueByMonth,
  useProductByCategory,
  useOrdersLast7Days,
  useProductPurchaseStats,
} from '@/features/admin/hooks/useAdminApi';
import { Users, Package, FileText, Calendar, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Queries
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: revenueData, isLoading: isRevenueLoading } = useRevenueByMonth(selectedYear);
  const { data: categoryData, isLoading: isCategoryLoading } = useProductByCategory();
  const { data: orderData, isLoading: isOrderLoading } = useOrdersLast7Days();
  const { data: purchaseStats, isLoading: isPurchaseStatsLoading } = useProductPurchaseStats();

  // 1. Process Revenue Data
  const revenueList = revenueData?.revenues || [];
  const maxRevenue = Math.max(...revenueList.map((d) => d.revenue), 1000000);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthlyRevenues = months.map((month) => {
    const found = revenueList.find((d) => d.month === month);
    return found ? found.revenue : 0;
  });

  // 2. Process Category Data
  const categoriesList = categoryData?.stats || [];
  const totalCategoryProducts = categoriesList.reduce((acc, curr) => acc + curr.count, 0);
  
  const doughnutSegments = categoriesList.map((item, index) => {
    const percentage = totalCategoryProducts > 0 ? (item.count / totalCategoryProducts) * 100 : 0;
    const startPercentage = categoriesList
      .slice(0, index)
      .reduce((acc, curr) => acc + (totalCategoryProducts > 0 ? (curr.count / totalCategoryProducts) * 100 : 0), 0);
    return {
      label: item.category,
      count: item.count,
      percentage,
      startPercentage,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'][index % 6],
    };
  });

  // 3. Process 7-day Orders Data
  const ordersList = orderData?.orders || [];
  const maxOrders = Math.max(...ordersList.map((o) => o.count), 5);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatCompactVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trang quản trị</h1>
          <p className="text-slate-500 mt-1">Tổng quan về hoạt động kinh doanh của cửa hàng Sports4U.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-2xl shadow-xs">
          <Calendar size={16} className="text-slate-400" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer pr-4"
          >
            <option value="2024">Năm 2024</option>
            <option value="2025">Năm 2025</option>
            <option value="2026">Năm 2026</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-0.5">Tài khoản</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-0">
              {isSummaryLoading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-lg mt-1" />
              ) : (
                summary?.totalUsers ?? 0
              )}
            </h3>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-0.5">Sản phẩm</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-0">
              {isSummaryLoading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-lg mt-1" />
              ) : (
                summary?.totalProducts ?? 0
              )}
            </h3>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-0.5">Đơn hàng</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-0">
              {isSummaryLoading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-lg mt-1" />
              ) : (
                summary?.totalOrders ?? 0
              )}
            </h3>
          </div>
        </div>
      </div>

      {/* Row 1: Revenue & Categories charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-0">
              <TrendingUp size={20} className="text-blue-500" />
              Doanh thu theo tháng
            </h3>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Năm {selectedYear}
            </span>
          </div>

          <div className="flex-1 relative min-h-70 w-full flex items-end justify-between px-2 pt-6">
            {isRevenueLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Y-Axis Ticks (Right background lines) */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-6">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="w-full border-t border-slate-100 flex justify-between text-[10px] text-slate-400 pt-1">
                      <span>{formatCompactVND(maxRevenue - (maxRevenue / 4) * idx)}</span>
                    </div>
                  ))}
                </div>

                {/* Bars Container */}
                <div className="relative z-10 w-full h-55 flex items-end justify-between gap-1 md:gap-3">
                  {monthlyRevenues.map((revenue, index) => {
                    const heightPercent = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap shadow-md">
                          {formatVND(revenue)}
                        </div>

                        {/* Bar */}
                        <div
                          style={{ height: `${Math.max(heightPercent, 2)}%` }}
                          className="w-full bg-linear-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:from-blue-500 group-hover:to-indigo-400 cursor-pointer shadow-xs"
                        />
                        
                        {/* Label */}
                        <span className="text-xs text-slate-400 font-medium mt-2">
                          T{index + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Category Ratio Doughnut Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Tỉ lệ sản phẩm theo môn</h3>
          
          {isCategoryLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : doughnutSegments.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
              Không có dữ liệu
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-around">
              {/* Doughnut SVG */}
              <div className="relative h-44 w-44 mx-auto flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="h-full w-full transform -rotate-90">
                  {doughnutSegments.map((seg, idx) => {
                    const strokeDasharray = `${seg.percentage} ${100 - seg.percentage}`;
                    const strokeDashoffset = 100 - seg.startPercentage;
                    return (
                      <circle
                        key={idx}
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="3.2"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700"
                      />
                    );
                  })}
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-800">{totalCategoryProducts}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Sản phẩm</span>
                </div>
              </div>

              {/* Legends */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {doughnutSegments.map((seg, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="text-slate-600 truncate flex-1">{seg.label}</span>
                    <span className="font-bold text-slate-800">{seg.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: 7-day orders Line Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Đơn hàng 7 ngày gần nhất</h3>

        {isOrderLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ordersList.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-slate-400">
            Không có dữ liệu đơn hàng
          </div>
        ) : (
          <div className="relative w-full h-48 pt-4">
            <svg viewBox="0 0 700 150" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {Array.from({ length: 4 }).map((_, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={(150 / 3) * idx}
                  x2="700"
                  y2={(150 / 3) * idx}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              ))}

              {/* Draw area under path */}
              <path
                d={`
                  M 10 150
                  ${ordersList
                    .map((item, idx) => {
                      const x = 10 + (680 / 6) * idx;
                      const y = 140 - (item.count / maxOrders) * 110;
                      return `L ${x} ${y}`;
                    })
                    .join(' ')}
                  L 690 150 Z
                `}
                fill="url(#orderAreaGradient)"
              />

              {/* Draw path */}
              <path
                d={ordersList
                  .map((item, idx) => {
                    const x = 10 + (680 / 6) * idx;
                    const y = 140 - (item.count / maxOrders) * 110;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Draw circles & labels */}
              {ordersList.map((item, idx) => {
                const x = 10 + (680 / 6) * idx;
                const y = 140 - (item.count / maxOrders) * 110;
                const date = new Date(item.date);
                const label = `${date.getDate()}/${date.getMonth() + 1}`;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5.5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                    <text x={x} y={y - 12} textAnchor="middle" className="text-[10px] font-bold fill-slate-700">
                      {item.count}
                    </text>
                    <text x={x} y="146" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400">
                      {label}
                    </text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="orderAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>

      {/* Row 3: Product purchase stats */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-0">Thống kê số lượng sản phẩm đã mua</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6 style={{ width: '80px' }}">#</th>
                <th className="py-4 px-6">Tên sản phẩm</th>
                <th className="py-4 px-6 text-right" style={{ width: '240px' }}>Số lượng đã bán</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isPurchaseStatsLoading ? (
                <tr>
                  <td colSpan={3} className="text-center text-slate-400 py-10">
                    <div className="h-6 w-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Đang tải thống kê sản phẩm...
                  </td>
                </tr>
              ) : !purchaseStats || purchaseStats.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-slate-400 py-10">
                    Chưa có sản phẩm nào được mua.
                  </td>
                </tr>
              ) : (
                purchaseStats.map((item, idx) => {
                  const qty = Number(
                    item.totalQuantitySold ??
                    item.quantitySold ??
                    item.totalQuantity ??
                    item.quantity ??
                    item.count ??
                    0
                  );
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4.5 px-6 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-4.5 px-6 font-semibold text-slate-800">{item.productName}</td>
                      <td className="py-4.5 px-6 text-right font-black text-slate-950 text-base">
                        {new Intl.NumberFormat('vi-VN').format(qty)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
