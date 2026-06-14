/**
 * Định dạng số tiền sang chuẩn tiền tệ Việt Nam (VND)
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

/**
 * Định dạng chuỗi ngày tháng sang định dạng vi-VN
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Định dạng ngày giờ đầy đủ
 */
export function formatDateTime(dateString: string | Date): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
