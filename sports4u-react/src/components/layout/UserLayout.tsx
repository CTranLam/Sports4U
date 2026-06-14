import { Outlet } from 'react-router-dom';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function UserLayout() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
