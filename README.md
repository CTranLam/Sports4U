# Sports4U - E-Commerce Platform

<p align="center">
  <img src="sports4u-react/src/assets/logo.png" alt="Sports4U Banner" width="200px">
</p>

## Giới thiệu

**Sports4U** là một nền tảng thương mại điện tử chuyên nghiệp cung cấp các trang thiết bị và trang phục thể thao chính hãng (Pickleball, Tennis, Badminton, Basketball). Dự án được thiết kế theo mô hình tách biệt Frontend và Backend (Decoupled Architecture) với các công nghệ hiện đại, đảm bảo tính mở rộng, bảo mật cao và hiệu suất tối ưu.

### Điểm nổi bật
- **Kiến trúc Frontend Hiện đại**: Xây dựng bằng React + Vite + TypeScript, cấu trúc theo **Feature-first Architecture** giúp modular hóa và bảo trì dễ dàng.
- **Tách nhỏ Fat Pages**: Các trang nghiệp vụ lớn được tối ưu hóa thành các sub-components gọn gàng dưới 100-150 dòng.
- **Xử lý bất đồng bộ (Message Queue)**: Hệ thống gửi email (xác thực OTP, hóa đơn) chạy bất đồng bộ qua RabbitMQ với Dead Letter Queue (DLQ).
- **Redis Caching & Security**: Cache dữ liệu với TTL linh hoạt, kết hợp đếm lượt đăng nhập sai (Rate Limiting) và tự động khóa tài khoản tạm thời bằng Redis.
- **Thanh toán trực tuyến**: Tích hợp cổng thanh toán VNPay Sandbox.
- **Lưu trữ đám mây**: Upload và tối ưu hóa hình ảnh sản phẩm qua Cloudinary API.
- **Hỗ trợ Container hóa**: Triển khai nhanh chóng và đồng bộ thông qua Docker Compose.

---

## Kiến trúc Hệ thống & Cấu trúc Thư mục

### Cấu trúc Frontend (`sports4u-react`)
```
sports4u-react/
├── src/
│   ├── assets/              # Logo và tài nguyên tĩnh
│   ├── components/
│   │   ├── layout/          # Layouts dùng chung (UserLayout, AdminLayout)
│   │   ├── shared/          # Components chia sẻ giữa các trang (Header, Footer, ProtectedRoute)
│   │   └── ui/              # Các UI components nền tảng (Button, Card, Input...)
│   ├── config/              # Biến môi trường (env.ts), Định nghĩa route (routes.ts)
│   ├── features/            # Modules nghiệp vụ (Feature-first)
│   │   ├── auth/            # Xác thực người dùng (Login, Register, OTP, Password Reset)
│   │   ├── products/        # Hiển thị, tìm kiếm, đánh giá và danh mục sản phẩm
│   │   ├── cart/            # Quản lý giỏ hàng
│   │   ├── orders/          # Đặt hàng, Xem lịch sử đơn hàng và thanh toán
│   │   ├── profile/         # Cập nhật thông tin cá nhân
│   │   └── admin/           # Dashboard quản trị, Quản lý tài khoản, danh mục, sản phẩm & đơn hàng
│   ├── pages/               # Trang đóng vai trò "Orchestrator" kết nối URL và các components của Feature
│   ├── services/            # Axios API client dùng chung (`apiClient.ts`)
│   ├── store/               # Quản lý Global State bằng Zustand (`useAuthStore.ts`)
│   ├── types/               # Kiểu dữ liệu TypeScript dùng chung
│   ├── utils/               # Định dạng hiển thị tiền tệ, thời gian (`formatters.ts`)
│   ├── App.tsx              # Router chính của ứng dụng
│   └── main.tsx
```

### Cấu trúc Backend (`sports4u-backend`)
```
sports4u-backend/
├── src/main/java/com/sports4u/sports4u_backend/
│   ├── configuration/       # Cấu hình Security, CORS, RabbitMQ, Cloudinary, Redis, VNPay
│   ├── controller/          # REST Controllers (Admin, User, Guest, Payment)
│   ├── converter/           # Map Entity <-> DTO
│   ├── dto/                 # Data Transfer Objects cho từng phân vùng nghiệp vụ
│   ├── entity/              # Thực thể JPA (Database Schema)
│   ├── enums/               # Các Enum hệ thống (Role, OrderStatus, PaymentMethod...)
│   ├── exception/           # Xử lý lỗi tập trung (Global Exception Handler)
│   ├── filters/             # Bộ lọc JWT Security Filter
│   ├── repository/          # JPA Repositories tương tác CSDL
│   ├── service/             # Logic nghiệp vụ & Tích hợp dịch vụ (Redis, RabbitMQ, Mail)
│   └── utils/               # JWT helper, phân trang
```

---

## Công nghệ Sử dụng

### Frontend (sports4u-react)
| Công nghệ | Vai trò |
|-----------|---------|
| **React 18** | Thư viện xây dựng giao diện |
| **Vite** | Build tool siêu nhanh cho SPA |
| **TypeScript** | Định kiểu tĩnh an toàn |
| **Tailwind CSS** | Styling giao diện linh hoạt |
| **Zustand** | Quản lý global state (auth, cart) |
| **TanStack React Query (v5)** | Caching, quản lý trạng thái server và đồng bộ data |
| **Axios** | HTTP client gọi REST API |
| **Lucide React** | Thư viện icon hiện đại |

### Backend (sports4u-backend)
| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| **Java** | 21 | Ngôn ngữ lập trình chính |
| **Spring Boot** | 3.5.10 | Framework backend chính |
| **Spring Security & JWT** | - | Xác thực stateless và phân quyền người dùng |
| **Spring Data JPA** | - | Tương tác CSDL PostgreSQL |
| **PostgreSQL** | 16 | Hệ quản trị CSDL quan hệ |
| **Redis** | 7 | Caching dữ liệu, Rate Limiting login và khóa tài khoản |
| **RabbitMQ** | 3 (Management) | Message Queue xử lý gửi email bất đồng bộ |
| **Cloudinary** | - | Lưu trữ và tối ưu hóa hình ảnh sản phẩm |

---

## Hướng dẫn Khởi chạy & Triển khai

### Cách 1: Triển khai nhanh bằng Docker Compose (Khuyên dùng)
Docker Compose sẽ tự động xây dựng và liên kết toàn bộ dịch vụ (PostgreSQL, Redis, RabbitMQ, Spring Boot Backend và React Frontend với Nginx).

1. **Khởi động các dịch vụ Backend & Middleware:**
   ```bash
   cd sports4u-backend
   docker compose up -d --build
   ```
   *Cơ sở dữ liệu PostgreSQL (cổng `5435`), Redis, RabbitMQ (Management UI tại `http://localhost:15672`) và Spring Boot API (cổng `8080`) sẽ được thiết lập tự động.*

2. **Khởi động Frontend React (Nginx Proxy):**
   ```bash
   cd ../sports4u-react
   docker compose up -d --build
   ```
   *Frontend React sẽ được đóng gói bằng Multi-stage build và chạy thông qua Nginx tại địa chỉ `http://localhost:3000`.*

---

### Cách 2: Khởi chạy trong Môi trường Phát triển (Local Development)

#### Yêu cầu hệ thống:
- Java 21+ & Maven 3.8+
- Node.js 20+
- PostgreSQL, Redis, RabbitMQ đang chạy trên máy local.

#### 1. Khởi chạy Backend:
- Tạo database PostgreSQL: `CREATE DATABASE sports4u;`
- Tạo tệp `sports4u-backend/.env` từ file mẫu và thiết lập các biến môi trường (Database username/password, Mail SMTP, Cloudinary API Key, VNPay Config).
- Khởi động ứng dụng Spring Boot:
  ```bash
  cd sports4u-backend
  ./mvnw spring-boot:run
  ```
  *API sẽ hoạt động tại: `http://localhost:8080`*

#### 2. Khởi chạy Frontend React:
- Cài đặt các dependencies:
  ```bash
  cd sports4u-react
  npm install
  ```
- Khởi chạy dev server:
  ```bash
  npm run dev
  ```
  *Ứng dụng client sẽ chạy tại: `http://localhost:5173` (hoặc cổng được Vite cung cấp).*

---

## Chi tiết Cơ chế Nghiệp vụ

### 🔒 Bảo mật & Xác thực
- **Stateless Authentication**: Sử dụng JWT token đính kèm trong Header `Authorization` (thời hạn 30 ngày).
- **Phân quyền Role-based**:
  - `ROLE_USER`: Khách hàng mua sắm, quản lý giỏ hàng và đơn hàng cá nhân.
  - `ROLE_ADMIN`: Xem dashboard báo cáo, quản lý tài khoản, danh mục, sản phẩm và cập nhật trạng thái đơn hàng.
- **Khóa tài khoản tự động (Redis)**: Khi người dùng nhập sai mật khẩu quá 5 lần liên tiếp, tài khoản sẽ tự động bị khóa tạm thời trong 15 phút.

### ⚡ Cấu hình Caching (Redis)
Dữ liệu ít biến động được lưu cache để giảm tải CSDL:
- `productList`, `productDetail`, `categoryList`: Cache 30 phút.
- `dashboardSummary`, `revenueByMonth`, `ordersLast7Days`: Cache 10 phút.
- `provinces`, `wards`: Cache 24 giờ.

### 💳 Thanh toán VNPay Sandbox
Khi chọn thanh toán qua VNPay, hệ thống sẽ sinh URL thanh toán NCB Sandbox:
- **NCB Test Card**:
  - Số thẻ: `9704198526191432198`
  - Tên chủ thẻ: `NGUYEN VAN A`
  - Ngày phát hành: `07/15`
  - OTP: `123456`

---

## Danh sách API Endpoints Chính

### Guest & Public APIs
- `GET /api/categories/parents` - Danh sách danh mục cha
- `GET /api/categories/{id}/child` - Danh mục con
- `GET /api/products/popular/{categoryId}` - Danh sách sản phẩm Hot
- `GET /api/products/search` - Tìm kiếm sản phẩm (keyword, phân trang)
- `GET /api/products/{id}` - Chi tiết sản phẩm

### Customer APIs (Yêu cầu Token)
- `POST /api/user/login` - Đăng nhập nhận JWT
- `POST /api/user/register` - Đăng ký tài khoản
- `POST /api/user/forgot-password` - Gửi OTP qua mail reset pass
- `POST /api/user/verify-otp` - Xác nhận mã OTP
- `POST /api/user/reset-password` - Cập nhật mật khẩu mới
- `GET /api/user/profile` - Lấy thông tin cá nhân
- `GET /api/user/cart` - Lấy thông tin giỏ hàng
- `POST /api/user/cart/items` - Thêm sản phẩm vào giỏ
- `POST /api/user/order/checkout/from-cart` - Đặt hàng từ giỏ
- `GET /api/user/orders` - Lịch sử đơn hàng của tôi

### Admin APIs (Yêu cầu Quyền Admin)
- `GET /api/admin/dashboard/summary` - Thống kê tổng số lượng (Users, Products, Orders)
- `GET /api/admin/dashboard/revenue-by-month` - Báo cáo doanh thu theo tháng
- `GET /api/admin/accounts` - Quản lý tài khoản người dùng
- `POST /api/admin/product` - Tạo sản phẩm mới (tải ảnh lên Cloudinary)
- `PUT /api/admin/products/{id}` - Cập nhật thông tin sản phẩm
- `GET /api/admin/orders` - Xem toàn bộ danh sách đơn hàng
- `PUT /api/admin/orders/{id}/status` - Cập nhật trạng thái giao hàng

---

## Tác giả & Đóng góp
- Phát triển bởi **CTRANLAM**.
- Phục dựng và tái cấu trúc sang React Feature-first bởi **Antigravity AI Assistant**.
