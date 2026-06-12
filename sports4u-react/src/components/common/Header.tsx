import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User as UserIcon, LogOut, ReceiptText } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useState } from 'react';
import { Button, buttonVariants } from '../ui/button';
import { Input } from '../ui/input';
import { useCartCount } from '../../hooks/useCartApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import LogoImage from '../../assets/logo.png';

export default function Header() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: cartCount } = useCartCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <img src={LogoImage} alt="Sports4U Logo" className="h-16 w-auto object-contain" />
              <span className="text-xl font-extrabold tracking-tight text-slate-900 hidden sm:inline-block">
                SPORTS4U
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden flex-1 max-w-2xl md:block">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-14 h-11 text-base bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-400 focus-visible:border-slate-300"
              />
              <Button
                type="submit"
                size="icon"
                variant="default"
                className="absolute right-0 top-0 h-full rounded-l-none bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
              >
                <Search size={20} />
              </Button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
              <ShoppingCart size={28} />
              {cartCount !== undefined && cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" size="lg" className="rounded-full flex gap-2 h-11 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer" />}>
                  <UserIcon size={20} className="text-slate-700" />
                  <span className="hidden text-base font-medium md:block">
                    {user?.fullName || 'Tài khoản'}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5 border-slate-100 bg-white text-slate-900">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer py-2.5 px-3 text-base hover:bg-slate-100 rounded-lg transition-colors">
                    <UserIcon size={18} className="mr-2.5" />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer py-2.5 px-3 text-base hover:bg-slate-100 rounded-lg transition-colors">
                    <ReceiptText size={18} className="mr-2.5" />
                    Đơn hàng của tôi
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1.5 border-slate-100" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2.5 px-3 text-base text-red-600 hover:bg-red-50 hover:text-red-600 focus:text-red-600 rounded-lg transition-colors">
                    <LogOut size={18} className="mr-2.5" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden gap-3 sm:flex">
                <Link to="/login" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer' })}>
                  Đăng nhập
                </Link>
                <Link to="/register" className={buttonVariants({ variant: 'default', size: 'lg', className: 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' })}>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
