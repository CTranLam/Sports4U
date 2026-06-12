# ReactJS Frontend Development Guidelines
Dự án sử dụng: **Vite, React, TypeScript, TanStack Query, và shadcn/ui (+ Tailwind CSS)**.

Đây là chuẩn mực phát triển Frontend cho dự án, yêu cầu tất cả các thành viên tuân thủ để đảm bảo code sạch, dễ bảo trì và mở rộng, đồng bộ với quy chuẩn của Backend NestJS.

## 1. Kiến trúc & Luồng xử lý (Architecture & Request Flow)
- **Luồng xử lý bắt buộc:** `Component (UI)` -> `Custom Hook (Logic)` -> `Service (API/Data)`.
- **Tách biệt UI và Logic:** UI Component chỉ chịu trách nhiệm hiển thị (rendering). Các logic xử lý nghiệp vụ, gọi API, quản lý state phức tạp phải được tách riêng thành các Custom Hooks. Tuyệt đối không viết logic fetch data lằng nhằng bên trong file component hiển thị.
- **Phân chia thư mục chuẩn trong `src/`:**
  - `components/`: Chứa các UI Components.
    - `ui/`: Các component cơ bản được sinh ra/cài đặt bởi thư viện **shadcn/ui** (ví dụ: Button, Input, Dialog, Card). Không tự ý sửa core của file trong này trừ khi có yêu cầu design đặc biệt.
    - `common/`: Các component dùng chung được ghép từ nhiều UI components nhỏ (ví dụ: Navbar, Footer, DataTable).
    - `features/`: Các component đặc thù phục vụ riêng cho một nghiệp vụ cụ thể.
  - `hooks/`: Chứa các custom hooks dùng chung cho toàn dự án (ví dụ: `useDebounce`, `useAuth`, `useWindowSize`).
  - `services/`: Chứa logic gọi API backend.
  - `pages/` (hoặc `views/`): Chứa các component ở mức độ trang (Page-level components), nơi được gọi trực tiếp bởi Router.
  - `store/` (hoặc `context/`): Quản lý Global State.
  - `utils/`: Chứa các hàm hỗ trợ thuần túy (như formatDate, calculatePrice).
  - `types/`: Chứa các interface/type TypeScript định nghĩa cấu trúc dữ liệu, DTOs (Data Transfer Objects).

## 2. Thiết kế API & State Management
- **Ngôn ngữ:** Bắt buộc sử dụng **TypeScript** 100%. Định nghĩa chặt chẽ `interface` hoặc `type` cho props của Component, state và cấu trúc API responses. Không sử dụng kiểu `any`.
- **Quản lý Trạng thái (State Management):**
  - **Local State:** Sử dụng `useState` cho trạng thái đơn giản và `useReducer` cho logic trạng thái nội bộ phức tạp.
  - **Server State (Dữ liệu từ API):** Bắt buộc dùng thư viện **React Query (@tanstack/react-query)** để xử lý fetching, caching, loading state, error state và phân trang. Không tự gọi API thủ công bằng `useEffect`. API có phân trang (OFFSET/CURSOR) bắt buộc dùng `useInfiniteQuery` hoặc `useQuery`.
  - **Global State:** Sử dụng **Zustand** cho các state cần chia sẻ xuyên suốt app (ví dụ: giỏ hàng, thông tin user đăng nhập). Dùng React Context API cho các state nhỏ, gần như tĩnh (ví dụ: Theme/Dark mode).
- **Thiết kế UI Component & Styling:**
  - Bắt buộc sử dụng **shadcn/ui** làm hệ thống component nền tảng.
  - Sử dụng **Tailwind CSS** để tùy biến và viết style mới. Hạn chế tối đa việc tạo file CSS thuần (trừ reset css hoặc global css ban đầu).

## 3. Tương tác Giao tiếp Backend (API Communication)
- **Axios Instance:** Gom toàn bộ cấu hình Axios (base URL lấy từ biến môi trường Vite `import.meta.env`, timeout, headers) vào một instance duy nhất tại `services/apiClient.ts`.
- **Interceptors:**
  - *Request Interceptor:* Tự động đính kèm Access Token vào mọi request cần xác thực.
  - *Response Interceptor:* Xử lý lỗi toàn cục. Tự động handle HTTP 401 (chặn và redirect về Login), hiển thị toast notification chung cho các lỗi (đồng bộ quy tắc ExceptionFailed trả về từ NestJS).

## 4. Tối ưu hiệu năng (Performance)
- **Code Splitting (Lazy Loading):** Phải sử dụng `React.lazy()` và `<Suspense>` kết hợp với React Router ở các route cấp trang để giảm dung lượng file bundle JS tải lần đầu (First Load).
- **Tránh Re-render:**
  - Tách nhỏ Component để hạn chế re-render diện rộng.
  - Sử dụng `React.memo`, `useMemo`, và `useCallback` để tối ưu hóa tại các component đồ sộ (ví dụ: các bảng dữ liệu lớn, biểu đồ) hoặc khi truyền function/object làm prop xuống component con. Không dùng vô tội vạ.
- **Tối ưu Hình ảnh:** Sử dụng định dạng ảnh hiện đại (WebP) hoặc sử dụng các service/CDN hỗ trợ tối ưu ảnh trước khi render.

## 5. Routing (Điều hướng)
- Sử dụng **React Router DOM v6** (sử dụng cấu trúc `createBrowserRouter` hiện đại).
- Cấu trúc **Protected Routes**: Áp dụng các HOC (Higher-Order Component) hoặc Wrapper Component (ví dụ: `<ProtectedRoute />`) để kiểm tra trạng thái Authentication và thực thi RBAC (Phân quyền Role) trước khi render page content.

## 6. Quy ước đặt tên File (Naming Conventions)
- **Components / Pages:** `PascalCase.tsx` (ví dụ: `UserProfile.tsx`, `ConfirmModal.tsx`).
- **Hooks:** `camelCase` với tiền tố `use`, đuôi file là `.ts` (ví dụ: `useAuth.ts`, `useSearch.ts`).
- **Services / Utils:** `camelCase` với đuôi file là `.ts` (ví dụ: `authService.ts`, `dateFormatter.ts`).
- **Interface / Types:** `PascalCase` với tiền tố/hậu tố nếu cần thiết (ví dụ: `UserDto`, `ProductInterface.ts`).
- **Đường dẫn Import (Absolute Imports):** Cấu hình Vite (`vite.config.ts`) và `tsconfig.json` để sử dụng alias import (như `@/components/`, `@/utils/`). Hạn chế import tương đối lằng nhằng dạng `../../../../components/`.

## 7. Cân nhắc Bảo mật Frontend
- **Quản lý Token:** Cố gắng không lưu trữ Token quá nhạy cảm ở `localStorage` trừ khi có thiết kế cụ thể. Cân nhắc việc sử dụng HTTPOnly cookies cho Refresh Token (cần BE thiết lập).
- **Chống XSS:** React đã bảo mật rất tốt, tuy nhiên khi render mã HTML trực tiếp từ CSDL Backend thông qua `dangerouslySetInnerHTML`, bắt buộc phải xử lý sanitize (bằng thư viện như `DOMPurify`).
- **Environment Variables:** Tiền tố biến môi trường của Vite phải bắt đầu bằng `VITE_`. Nhớ kỹ: Mọi biến có tiền tố `VITE_` sẽ bị lộ ra ngoài client-side, do đó tuyệt đối không đưa các Secret Key của dịch vụ backend/bên thứ 3 vào đây.
