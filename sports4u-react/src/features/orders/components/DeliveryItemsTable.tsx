import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

interface PreviewItem {
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  subtotal: number | string;
}

interface DeliveryItemsTableProps {
  previewItems: PreviewItem[];
}

export function DeliveryItemsTable({ previewItems }: DeliveryItemsTableProps) {
  return (
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
  );
}
