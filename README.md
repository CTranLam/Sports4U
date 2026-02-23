# Sports4U - E-Commerce Platform

<p align="center">
  <img src="sports4u-frontend/assets/banner-img.png" alt="Sports4U Banner" width="100%">
</p>

## Giới thiệu

**Sports4U** là một nền tảng thương mại điện tử chuyên về các sản phẩm thể thao như Pickleball, Badminton, Basketball, Tennis. Hệ thống được xây dựng với kiến trúc tách biệt Frontend và Backend, đảm bảo khả năng mở rộng và bảo trì dễ dàng.

### Điểm nổi bật
- **Kiến trúc Microservices-ready**: Tách biệt FE/BE, dễ scale
- **Message Queue**: Xử lý email bất đồng bộ với RabbitMQ + Dead Letter Queue
- **Redis Caching**: Cache dữ liệu với TTL, rate limiting login, account lock
- **Payment Gateway**: Tích hợp VNPay Sandbox cho thanh toán online
- **Cloud Storage**: Upload ảnh lên Cloudinary

## Kiến trúc hệ thống

```
Sports4U/
├── sports4u-backend/          # Spring Boot REST API
│   ├── src/main/java/
│   │   └── com/sports4u/sports4u_backend/
│   │       ├── Sports4uBackendApplication.java  # Main class (@EnableScheduling)
│   │       ├── configuration/     # Cấu hình Security, CORS, RabbitMQ, Cloudinary, Redis, VNPay
│   │       │   ├── CloudinaryConfig.java        # Cloud image storage
│   │       │   ├── CorsConfig.java              # CORS policy
│   │       │   ├── MapperConfiguration.java     # ModelMapper
│   │       │   ├── RabbitMQConfig.java          # Message queue + DLQ
│   │       │   ├── RedisCacheConfig.java        # Redis cache manager + TTL config
│   │       │   ├── SecurityConfig.java          # Auth provider, BCrypt
│   │       │   ├── VNPayConfig.java             # VNPay payment gateway config
│   │       │   └── WebSecurityConfig.java       # Filter chain, endpoints
│   │       ├── controller/        # REST Controllers
│   │       │   ├── AdminController.java         # Admin APIs
│   │       │   ├── GuestController.java         # Public APIs
│   │       │   ├── UserController.java          # User APIs
│   │       │   └── UserOrderController.java     # Order + Payment APIs
│   │       ├── converter/         # Entity <-> DTO converters
│   │       ├── dto/               # Data Transfer Objects
│   │       │   ├── addressdto/
│   │       │   ├── admindto/      # Dashboard DTOs
│   │       │   ├── cartdto/
│   │       │   ├── categorydto/
│   │       │   ├── orderdto/
│   │       │   ├── productdto/
│   │       │   └── userdto/
│   │       ├── entity/            # JPA Entities
│   │       ├── enums/             # Role, OrderStatus, PaymentMethod, PaymentStatus, OtpStatus
│   │       ├── exception/         # GlobalExceptionHandler, NotFoundException
│   │       ├── filters/           # JwtTokenFilter
│   │       ├── repository/        # Spring Data JPA Repositories
│   │       ├── service/           # Business Logic Services
│   │       │   ├── impl/          # Service implementations
│   │       │   │   └── PaymentServiceImpl.java  # VNPay payment processing
│   │       │   ├── RabbitMQService/
│   │       │   │   ├── EmailProducerService.java    # Gửi message vào queue
│   │       │   │   ├── EmailConsumerService.java    # Xử lý gửi email
│   │       │   │   ├── EmailDLQConsumerService.java # Xử lý email thất bại
│   │       │   │   └── OtpCleanupService.java       # Scheduled task xóa OTP hết hạn
│   │       │   └── Redis/
│   │       │       ├── RateLimitLoginService.java   # Rate limiting login
│   │       │       └── AccountLockService.java      # Khóa tài khoản tạm thời
│   │       └── utils/
│   │           ├── JwtTokenUtil.java    # JWT generation & validation
│   │           ├── PageResponse.java    # Pagination wrapper
│   │           └── ResponseDTO.java     # Standard API response
│   └── src/main/resources/
│       └── application.properties # Cấu hình ứng dụng
│
└── sports4u-frontend/         # Vanilla JavaScript Frontend
    ├── index.html             # Trang chủ
    ├── assets/                # Hình ảnh sản phẩm và banner
    ├── css/
    │   ├── base.css           # Base styles
    │   └── layout.css         # Layout & hover effects
    ├── js/
    │   ├── api/               # API service calls
    │   ├── pages/             # Page-specific JavaScript
    │   └── utils/
    │       ├── admin-common.js # Admin utilities
    │       ├── header.js       # Header component
    │       └── pagination.js   # Pagination utility
    └── pages/                 # HTML pages
        ├── admin/             # Admin dashboard pages
        └── *.html             # User-facing pages
```

## Công nghệ sử dụng

### Backend
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **Java** | 21 | Ngôn ngữ lập trình chính |
| **Spring Boot** | 3.5.10 | Framework backend |
| **Spring Security** | - | Xác thực và phân quyền |
| **Spring Data JPA** | - | ORM và truy vấn database |
| **PostgreSQL** | - | Cơ sở dữ liệu quan hệ |
| **Redis** | - | Caching và rate limiting |
| **RabbitMQ** | - | Message queue cho email async |
| **JWT (jjwt)** | 0.11.5 | Token-based authentication |
| **Cloudinary** | 1.39.0 | Cloud image storage |
| **ModelMapper** | 3.1.1 | Object mapping |
| **Lombok** | - | Giảm boilerplate code |
| **Spring Mail** | - | Gửi email SMTP |
| **Gemini AI** | - | Tích hợp AI (Spring AI) |

### Frontend
| Công nghệ | Mô tả |
|-----------|-------|
| **HTML5** | Cấu trúc trang |
| **CSS3** | Styling |
| **Vanilla JavaScript** | Logic phía client |
| **Bootstrap 5.3.3** | UI Framework |
| **Bootstrap Icons** | Icon library |
| **Chart.js** | Biểu đồ dashboard |

## Entities (Database Schema)

| Entity | Mô tả |
|--------|-------|
| `UserEntity` | Thông tin người dùng (email, password, role, address) |
| `ProductEntity` | Sản phẩm (name, price, stock, category, image) |
| `CategoryEntity` | Danh mục sản phẩm |
| `CartItemEntity` | Giỏ hàng của user |
| `OrderEntity` | Đơn hàng |
| `OrderDetailEntity` | Chi tiết đơn hàng |
| `ProvinceEntity` | Tỉnh/Thành phố |
| `WardEntity` | Phường/Xã |
| `PasswordResetOTPEntity` | OTP reset mật khẩu |

## Bảo mật

### Authentication & Authorization
- **JWT Token**: Xác thực stateless với thời hạn 30 ngày
- **Role-based Access Control**: 
  - `ROLE_USER`: Người dùng thường
  - `ROLE_ADMIN`: Quản trị viên
- **BCrypt**: Mã hóa mật khẩu

### Security Features
- **Rate Limiting Login**: Giới hạn số lần đăng nhập sai (Redis)
- **Account Lock**: Tự động khóa tài khoản sau 4 lần đăng nhập sai trong 15 phút
- **OTP Verification**: Xác thực OTP qua email khi reset mật khẩu
- **CORS Configuration**: Kiểm soát cross-origin requests

## Redis Caching

Hệ thống sử dụng **Redis** để caching dữ liệu, cải thiện hiệu suất và giảm tải cho database.

### Cấu hình Cache
Các cache được cấu hình với thời gian sống (TTL) khác nhau tùy theo đặc tính dữ liệu:

| Cache Name | TTL | Mô tả |
|------------|-----|-------|
| `productDetail` | 30 phút | Cache chi tiết sản phẩm |
| `productList` | 30 phút | Cache danh sách sản phẩm |
| `categoryList` | 30 phút | Cache danh sách danh mục |
| `dashboardSummary` | 10 phút | Cache tổng quan dashboard |
| `revenueByMonth` | 10 phút | Cache doanh thu theo tháng |
| `productByCategory` | 10 phút | Cache số lượng sản phẩm theo danh mục |
| `ordersLast7Days` | 10 phút | Cache đơn hàng 7 ngày gần nhất |
| `provinces` | 24 giờ | Cache danh sách tỉnh/thành phố |
| `wards` | 24 giờ | Cache danh sách phường/xã |

### Cache Configuration (RedisCacheConfig.java)
```java
@Configuration
public class RedisCacheConfig {
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        // Các cấu hình TTL cho từng loại cache
        // Product & category: 30 phút
        // Dashboard: 10 phút
        // Address: 24 giờ
    }
}
```

### Rate Limiting & Account Lock
Redis cũng được sử dụng cho:
- **RateLimitLoginService**: Đếm số lần đăng nhập sai trong khoảng thời gian
- **AccountLockService**: Khóa tài khoản tạm thời khi đăng nhập sai quá nhiều lần

## Thanh toán VNPay (Sandbox)

Hệ thống tích hợp **VNPay** - cổng thanh toán trực tuyến phổ biến tại Việt Nam. Hiện tại đang sử dụng môi trường **Sandbox** để test.

### Cấu hình VNPay
```properties
# application.properties
vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.tmn-code=YOUR_TMN_CODE
vnpay.hash-secret=YOUR_HASH_SECRET
vnpay.return-url=http://localhost:8080/api/user/order/payment/vnpay-return
vnpay.version=2.1.0
```

### Luồng thanh toán VNPay

```
┌─────────────┐     1. Tạo URL thanh toán     ┌─────────────┐
│   Client    │ ────────────────────────────▶ │   Backend   │
│  (Frontend) │                               │ (Spring Boot)│
└─────────────┘                               └─────────────┘
       │                                             │
       │     2. Redirect đến VNPay Gateway          │
       ▼                                             │
┌─────────────┐                                      │
│   VNPay     │                                      │
│  Gateway    │                                      │
│  (Sandbox)  │                                      │
└─────────────┘                                      │
       │                                             │
       │     3. Callback vnpay-return               │
       └────────────────────────────────────────────▶│
                                                     │
       │     4. Verify signature & update order     │
       │◀────────────────────────────────────────────│
       ▼
┌─────────────┐
│  Hiển thị   │
│  kết quả    │
└─────────────┘
```

### API Endpoints VNPay
```
GET /api/user/order/payment/vnpay/{orderId}    # Tạo URL thanh toán VNPay
GET /api/user/order/payment/vnpay-return       # Callback từ VNPay (public)
```

### VNPay Response Codes
| Code | Mô tả |
|------|-------|
| `00` | Giao dịch thành công |
| `07` | Trừ tiền thành công nhưng giao dịch bị nghi ngờ |
| `09` | Thẻ/Tài khoản chưa đăng ký InternetBanking |
| `10` | Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần |
| `11` | Đã hết hạn chờ thanh toán (15 phút) |
| `12` | Thẻ/Tài khoản bị khóa |
| `13` | Nhập sai mật khẩu OTP |
| `24` | Khách hàng hủy giao dịch |
| `51` | Tài khoản không đủ số dư |
| `65` | Vượt quá hạn mức giao dịch trong ngày |
| `75` | Ngân hàng thanh toán đang bảo trì |
| `79` | Nhập sai mật khẩu thanh toán quá số lần quy định |
| `99` | Lỗi không xác định |

### Test Cards (Sandbox)
Sử dụng các thông tin test sau khi thanh toán trên sandbox:

| Ngân hàng | Số thẻ | Tên chủ thẻ | Ngày phát hành | OTP |
|-----------|--------|-------------|----------------|-----|
| NCB | 9704198526191432198 | NGUYEN VAN A | 07/15 | 123456 |

## API Endpoints

### Guest APIs (Public)
```
GET  /api/categories                    # Lấy danh sách danh mục
GET  /api/categories/{id}/products      # Lấy sản phẩm theo danh mục
GET  /api/products/{id}                 # Chi tiết sản phẩm
```

### User APIs (Authenticated)
```
POST /api/user/register                 # Đăng ký tài khoản
POST /api/user/login                    # Đăng nhập
POST /api/user/forgot-password          # Quên mật khẩu
POST /api/user/verify-otp               # Xác thực OTP
POST /api/user/reset-password           # Đặt lại mật khẩu
POST /api/user/resend-otp               # Gửi lại OTP
GET  /api/user/profile                  # Lấy thông tin cá nhân
PUT  /api/user/profile                  # Cập nhật thông tin
GET  /api/user/provinces                # Danh sách tỉnh/thành
GET  /api/user/wards                    # Danh sách phường/xã

# Giỏ hàng
POST   /api/user/cart/items             # Thêm sản phẩm vào giỏ
GET    /api/user/cart                   # Lấy giỏ hàng
PUT    /api/user/cart/items/{itemId}    # Cập nhật số lượng
DELETE /api/user/cart/items/{itemId}    # Xóa sản phẩm khỏi giỏ
GET    /api/user/cart/count             # Đếm số sản phẩm trong giỏ

# Đơn hàng của user
GET    /api/user/orders                 # Danh sách đơn hàng của tôi
GET    /api/user/orders/{id}            # Chi tiết đơn hàng
PUT    /api/user/orders/{id}/cancel     # Hủy đơn hàng
```

### User Order APIs
```
POST /api/user/order/cart/list-item     # Lấy items từ giỏ hàng
POST /api/user/order/checkout/from-cart # Đặt hàng từ giỏ
POST /api/user/order/preview-from-product # Preview đơn hàng
POST /api/user/order/checkout/from-product # Mua ngay
```

### Admin APIs (ROLE_ADMIN)
```
# Quản lý tài khoản
POST   /api/admin/account               # Tạo tài khoản
PUT    /api/admin/account/{id}          # Cập nhật tài khoản
DELETE /api/admin/account/{id}          # Khóa tài khoản
GET    /api/admin/accounts              # Danh sách tài khoản (filter: status, role)

# Quản lý danh mục
POST   /api/admin/categories            # Tạo danh mục
GET    /api/admin/categories            # Danh sách danh mục (phân trang)
DELETE /api/admin/categories/{id}       # Xóa danh mục (soft delete)

# Quản lý sản phẩm
POST   /api/admin/product               # Tạo sản phẩm (multipart/form-data)
PUT    /api/admin/products/{id}         # Cập nhật sản phẩm
DELETE /api/admin/products/{id}         # Xóa sản phẩm (soft delete)
GET    /api/admin/categories/{id}/products # Sản phẩm theo danh mục

# Quản lý đơn hàng
GET    /api/admin/orders                # Danh sách đơn hàng (filter: status)
PUT    /api/admin/orders/{id}/status    # Cập nhật trạng thái

# Dashboard & Thống kê
GET    /api/admin/dashboard/summary            # Tổng quan (users, products, orders)
GET    /api/admin/dashboard/revenue-by-month   # Doanh thu theo tháng (?year=2026)
GET    /api/admin/dashboard/product-by-category # Số lượng sản phẩm theo danh mục
GET    /api/admin/dashboard/orders-last-7-days # Đơn hàng 7 ngày gần nhất
```

## Tính năng chính

### Người dùng (User)
- ✅ Đăng ký / Đăng nhập
- ✅ Quên mật khẩu với OTP qua email
- ✅ Xem danh sách sản phẩm theo danh mục
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Đặt hàng từ giỏ hàng hoặc mua ngay
- ✅ Quản lý đơn hàng cá nhân
- ✅ Cập nhật thông tin cá nhân

### Quản trị viên (Admin)
- ✅ Dashboard thống kê (doanh thu, đơn hàng, sản phẩm)
- ✅ Quản lý tài khoản người dùng (CRUD, khóa/mở khóa)
- ✅ Quản lý danh mục sản phẩm
- ✅ Quản lý sản phẩm (CRUD, upload ảnh lên Cloudinary)
- ✅ Quản lý đơn hàng (xem, cập nhật trạng thái)

### Hệ thống
- ✅ Gửi email bất đồng bộ qua RabbitMQ
- ✅ Rate limiting đăng nhập với Redis
- ✅ Tự động khóa tài khoản khi đăng nhập sai nhiều lần
- ✅ Scheduled tasks (OTP cleanup)
- ✅ Tích hợp AI (Gemini) cho các tính năng thông minh

## Hướng dẫn cài đặt

### Yêu cầu hệ thống
- **Java 21+**
- **Maven 3.8+**
- **PostgreSQL 14+**
- **Redis 7+**
- **RabbitMQ 3.12+**

### 1. Clone repository
```bash
git clone <repository-url>
cd Sports4U
```

### 2. Cấu hình Database
Tạo database PostgreSQL:
```sql
CREATE DATABASE sports4u;
```

### 3. Cấu hình Backend
Chỉnh sửa file `sports4u-backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/sports4u
spring.datasource.username=your_username
spring.datasource.password=your_password

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# RabbitMQ
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest

# Mail (Gmail SMTP)
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# Gemini AI (optional)
spring.ai.open-ai.api-key=${GEMINI_KEY}
```

### 4. Khởi động Backend
```bash
cd sports4u-backend
./mvnw spring-boot:run
```
Backend sẽ chạy tại: `http://localhost:8080`

### 5. Khởi động Frontend
Sử dụng Live Server hoặc bất kỳ HTTP server nào:
```bash
cd sports4u-frontend
# Sử dụng VS Code Live Server hoặc
npx serve .
```

## Trạng thái đơn hàng (Order Status)

| Status | Mô tả |
|--------|-------|
| `PENDING` | Chờ xác nhận |
| `CONFIRMED` | Đã xác nhận |
| `SHIPPING` | Đang giao hàng |
| `COMPLETED` | Hoàn thành |
| `CANCELLED` | Đã hủy |

## Phương thức thanh toán

| Method | Mô tả |
|--------|-------|
| `COD` | Thanh toán khi nhận hàng |
| `VNPAY` | Thanh toán qua VNPay |

## Trạng thái thanh toán (Payment Status)

| Status | Mô tả |
|--------|-------|
| `PENDING` | Chờ thanh toán |
| `PAID` | Đã thanh toán |
| `FAILED` | Thanh toán thất bại |

## 🔧 Cấu trúc Response API

```json
{
  "message": "Thông báo kết quả",
  "data": {
    // Dữ liệu trả về
  }
}
```

### Pagination Response
```json
{
  "message": "Lấy danh sách thành công",
  "data": {
    "content": [...],
    "page": 1,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10
  }
}
```

## Cấu trúc thư mục Frontend

```
sports4u-frontend/
├── index.html                 # Trang chủ
├── pages/
│   ├── login.html             # Đăng nhập
│   ├── register.html          # Đăng ký
│   ├── forgot.html            # Quên mật khẩu
│   ├── confirm-otp.html       # Xác nhận OTP
│   ├── reset-password.html    # Đặt lại mật khẩu
│   ├── product-list.html      # Danh sách sản phẩm
│   ├── product-detail.html    # Chi tiết sản phẩm
│   ├── cart.html              # Giỏ hàng
│   ├── delivery.html          # Thông tin giao hàng
│   ├── orders.html            # Đơn hàng của tôi
│   ├── profile.html           # Thông tin cá nhân
│   └── admin/
│       ├── dashboard.html     # Trang quản trị
│       ├── users.html         # Quản lý tài khoản
│       ├── product-category.html # Quản lý danh mục
│       ├── product-list.html  # Quản lý sản phẩm
│       ├── product-form.html  # Form thêm/sửa sản phẩm
│       └── orders.html        # Quản lý đơn hàng
├── js/
│   ├── api/                   # API calls
│   ├── pages/                 # Page logic
│   └── utils/                 # Utilities
├── css/
│   ├── base.css               # Base styles
│   └── layout.css             # Layout styles
└── assets/
    ├── banner-img.png         # Banner
    └── products/              # Product images
```

## Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Tác giả

- **CTRANLAM**

---


