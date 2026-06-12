import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h5 className="mb-4 text-lg font-semibold text-foreground">Về chúng tôi</h5>
            <p className="text-sm text-muted-foreground">
              Sports4U là nền tảng mua sắm thể thao hàng đầu. Nơi cung cấp các trang thiết bị thể thao chính hãng và chất lượng.
            </p>
          </div>
          
          <div>
            <h5 className="mb-4 text-lg font-semibold text-foreground">Hỗ trợ</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground no-underline">Liên hệ</Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground no-underline">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="mb-4 text-lg font-semibold text-foreground">Chính sách</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground no-underline">Điều khoản dịch vụ</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground no-underline">Bảo mật thông tin</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="mb-4 text-lg font-semibold text-foreground">Liên kết</h5>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sports4U. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
