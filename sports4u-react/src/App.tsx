import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ConfirmOTPPage from './pages/auth/ConfirmOTPPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import DeliveryPage from './pages/DeliveryPage';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col font-sans">
        <Header />
        
        <main className="flex-1 bg-white">
          <Routes>
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
            <Route path="/orders" element={<div className="container mx-auto p-8 text-center text-slate-500">Đơn hàng (Đang phát triển)</div>} />
            <Route path="*" element={<div className="container mx-auto p-8 text-center text-slate-500">Không tìm thấy trang (404)</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
