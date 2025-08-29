# Hệ thống Authentication và Role Management

## Tổng quan
Hệ thống đăng nhập với popup và phân quyền role cho website Điện mặt trời Hồi Xuân.

## Tính năng

### 1. Đăng nhập Khách (Guest)
- Không cần mật khẩu
- Chỉ cần họ tên và số điện thoại
- Tự động tạo tài khoản khách
- Token có hiệu lực 7 ngày

### 2. Đăng nhập Admin
- Yêu cầu username và password
- Token có hiệu lực 24 giờ
- Quyền truy cập admin panel

### 3. Đăng ký Admin
- Chỉ cho phép tạo 1 tài khoản admin đầu tiên
- Mật khẩu tối thiểu 6 ký tự
- Tự động chuyển sang tab đăng nhập sau khi tạo thành công

## Cấu trúc Database

### Collection: users
```javascript
{
  _id: ObjectId,
  username: String,        // Chỉ admin có
  password: String,        // Chỉ admin có (đã hash)
  name: String,            // Tên hiển thị
  phone: String,           // Chỉ guest có
  role: String,            // "admin" hoặc "guest"
  permissions: Array,      // Chỉ admin có
  createdAt: Date,
  lastLogin: Date
}
```

### Permissions cho Admin
- `chat_management`: Quản lý chat
- `user_management`: Quản lý người dùng
- `system_admin`: Quyền hệ thống

## API Endpoints

### POST /api/auth
**Body parameters:**
- `action`: "login", "guest", hoặc "register"
- `username`: Tên đăng nhập (admin)
- `password`: Mật khẩu (admin)
- `guestName`: Tên khách (guest)
- `guestPhone`: Số điện thoại (guest)

**Response:**
```javascript
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "admin_username", // Chỉ admin
    "name": "User Name",
    "phone": "phone_number",      // Chỉ guest
    "role": "admin"               // hoặc "guest"
  }
}
```

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình environment variables
Tạo file `.env` với nội dung:
```env
MONGODB_URI=mongodb://localhost:27017/solar-chat
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### 3. Khởi tạo database
- Tạo database `solar-chat` trong MongoDB
- Collection `users` sẽ được tạo tự động

### 4. Tạo tài khoản admin đầu tiên
- Sử dụng tab "Đăng ký Admin" trong popup đăng nhập
- Chỉ có thể tạo 1 tài khoản admin đầu tiên

## Sử dụng

### Frontend
1. Click vào nút "ĐĂNG NHẬP" trên navbar
2. Chọn tab phù hợp (Khách/Admin/Đăng ký Admin)
3. Điền thông tin và submit
4. Token sẽ được lưu trong localStorage

### Backend
Sử dụng middleware để bảo vệ API:
```javascript
const { verifyToken, requireRole, requirePermission } = require('./api/middleware');

// Yêu cầu đăng nhập
app.use('/api/protected', verifyToken);

// Yêu cầu role admin
app.use('/api/admin', requireRole('admin'));

// Yêu cầu permission cụ thể
app.use('/api/chat', requirePermission('chat_management'));
```

## Bảo mật

### JWT Token
- Secret key được lưu trong environment variables
- Token có thời hạn (24h cho admin, 7 ngày cho guest)
- Được gửi trong Authorization header

### Password
- Sử dụng bcrypt để hash password
- Salt rounds: 12
- Mật khẩu tối thiểu 6 ký tự

### Role-based Access Control
- Admin có tất cả quyền
- Guest chỉ có quyền chat cơ bản
- Permissions được kiểm tra ở backend

## Troubleshooting

### Lỗi thường gặp
1. **"Token không hợp lệ"**: Token đã hết hạn, cần đăng nhập lại
2. **"Không có quyền truy cập"**: User không có role hoặc permission cần thiết
3. **"Admin đã tồn tại"**: Chỉ có thể tạo 1 tài khoản admin đầu tiên

### Debug
- Kiểm tra console browser để xem lỗi frontend
- Kiểm tra server logs để xem lỗi backend
- Verify MongoDB connection string
- Kiểm tra JWT_SECRET trong .env

## Production Notes

1. **Thay đổi JWT_SECRET** thành key phức tạp và ngẫu nhiên
2. **Sử dụng HTTPS** để bảo vệ token
3. **Implement rate limiting** cho API endpoints
4. **Logging** cho các hoạt động authentication
5. **Backup database** thường xuyên
