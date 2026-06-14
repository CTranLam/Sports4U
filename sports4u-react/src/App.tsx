import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ConfirmOTPPage from '@/pages/auth/ConfirmOTPPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import HomePage from '@/pages/HomePage';
import ProductListPage from '@/pages/ProductListPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import ProfilePage from '@/pages/ProfilePage';
import DeliveryPage from '@/pages/DeliveryPage';
import OrdersPage from '@/pages/OrdersPage';

// Layouts & Protection
import UserLayout from '@/components/layout/UserLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

// Admin Pages
import DashboardPage from '@/pages/admin/DashboardPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import CategoryManagementPage from '@/pages/admin/CategoryManagementPage';
import AllProductsPage from '@/pages/admin/AllProductsPage';
import OrderManagementPage from '@/pages/admin/OrderManagementPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/confirm-otp" element={<ConfirmOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route path="/" element={<HomePage />} />
          <Route path="/categories/:id" element={<ProductListPage />} />
          <Route path="/search" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          
          <Route path="/cart" element={<CartPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="*" element={<div className="container mx-auto p-8 text-center text-slate-500">Không tìm thấy trang (404)</div>} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/categories" element={<CategoryManagementPage />} />
            <Route path="/admin/products" element={<AllProductsPage />} />
            <Route path="/admin/orders" element={<OrderManagementPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

