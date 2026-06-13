import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Cấu hình Base URL từ biến môi trường (xem .env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý response chuẩn và tự động logout nếu token hết hạn (401)
apiClient.interceptors.response.use(
  (response) => {
    // Backend Spring Boot luôn bọc data trong cấu trúc ResponseDTO { message, data }
    return response.data;
  },
  (error) => {
    // Nếu lỗi 401 Unauthorized -> Đăng xuất người dùng
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    // Tự động bóc tách message lỗi từ Backend ném ra
    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi kết nối máy chủ';
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
