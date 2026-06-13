import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Package,
  FileText,
  LogOut,
} from 'lucide-react';
import LogoImage from '../../assets/logo.png';

export default function AdminLayout() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Tài khoản', icon: Users },
    { to: '/admin/categories', label: 'Danh mục', icon: FolderTree },
    { to: '/admin/products', label: 'Sản phẩm', icon: Package },
    { to: '/admin/orders', label: 'Đơn hàng', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col shrink-0 border-r border-gray-700 shadow-xl">
        {/* Brand */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2 no-underline text-white">
            <img src={LogoImage} alt="Logo" className="h-10 w-auto" />
            <span className="font-extrabold text-lg tracking-wider">SPORTS4U</span>
          </Link>
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-blue-400">
              {user?.fullName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate mb-0">
                {user?.fullName || 'Administrator'}
              </p>
              <p className="text-[10px] text-gray-400 truncate mb-0 font-light">
                {user?.email || 'admin@gmail.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white text-xs font-semibold border border-red-600/30 hover:border-transparent transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Content Page wrapper */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
