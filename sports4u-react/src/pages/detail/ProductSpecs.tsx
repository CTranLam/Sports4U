import { useState } from 'react';
import { Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProductSpecsProps {
  description: string;
  origin: string;
  advantages: string;
  className?: string;
}

export default function ProductSpecs({ description, origin, advantages, className }: ProductSpecsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  // Parse advantages into bullet points if separated by dashes or semicolons
  const parsedAdvantages = advantages
    ? advantages.split(/[—•;-]/).map(item => item.trim()).filter(Boolean)
    : [];

  return (
    <div className={className || "mt-12 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"}>
      {/* Tabs Headers */}
      <div className="flex border-b border-slate-100 mb-6">
        <button
          onClick={() => setActiveTab('desc')}
          className={`pb-4 text-base font-bold tracking-tight border-b-2 px-4 transition-all -mb-px ${
            activeTab === 'desc'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Mô tả sản phẩm
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`pb-4 text-base font-bold tracking-tight border-b-2 px-4 transition-all -mb-px ${
            activeTab === 'specs'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Thông số kỹ thuật
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[150px]">
        {activeTab === 'desc' ? (
          <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
            <p className="whitespace-pre-line">
              {description || 'Hiện chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
            </p>

            {parsedAdvantages.length > 0 && (
              <div className="mt-6">
                <h4 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Ưu điểm nổi bật
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                  {parsedAdvantages.map((adv, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-600">
                      <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left text-sm text-slate-600">
              <tbody>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-700 w-1/3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-slate-400" />
                    Xuất xứ
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">{origin || 'Đang cập nhật'}</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-2">
                    <Info size={16} className="text-slate-400" />
                    Chất liệu & Độ bền
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">Chính hãng cao cấp</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-slate-400" />
                    Bảo hành
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">12 tháng lỗi nhà sản xuất</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
