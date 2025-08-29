# Hướng dẫn cài đặt và cấu hình

## Các lỗi đã được sửa:

### 1. **File CSS bị trùng lặp**
- ✅ Đã xóa các đoạn CSS bị duplicate
- ✅ Tối ưu hóa code CSS
- ✅ Giữ lại chỉ một phiên bản của mỗi style

### 2. **HTML thiếu modal đăng nhập**
- ✅ Đã thêm modal đăng nhập đầy đủ
- ✅ Hỗ trợ đăng nhập khách và admin
- ✅ Có form tạo tài khoản admin

### 3. **JavaScript có lỗi logic**
- ✅ Đã sửa các element không tồn tại
- ✅ Thêm error handling cho Socket.IO
- ✅ Sửa các event listener

### 4. **Thiếu modal chat trực tiếp**
- ✅ Đã thêm modal chat trực tiếp
- ✅ Hỗ trợ gửi tin nhắn

## Cài đặt:

### 1. **Cài đặt dependencies:**
```bash
npm install
```

### 2. **Tạo file .env:**
```bash
MONGODB_URI=mongodb://localhost:27017/solar-chat
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. **Khởi động MongoDB:**
```bash
# Cài đặt MongoDB nếu chưa có
# Khởi động MongoDB service
```

### 4. **Chạy development server:**
```bash
npm run dev
```

### 5. **Deploy lên Vercel:**
```bash
npm run deploy
```

## Cấu trúc project:

```
├── index.html          # Trang chính
├── styles.css          # CSS đã được tối ưu
├── script.js           # JavaScript đã được sửa lỗi
├── package.json        # Dependencies
├── vercel.json         # Cấu hình Vercel
├── api/                # API endpoints
│   ├── auth.js         # Xác thực
│   ├── chat.js         # Chat API
│   └── socket.js       # WebSocket
├── admin/              # Admin panel
│   ├── index.html      # Admin interface
│   ├── admin.js        # Admin logic
│   └── style.css       # Admin styles
└── images/             # Hình ảnh
```

## Tính năng:

- ✅ Website responsive
- ✅ Modal đăng nhập khách/admin
- ✅ Chat trực tiếp
- ✅ Admin panel
- ✅ Form đăng ký tư vấn
- ✅ Slideshow hero section
- ✅ Gallery dự án
- ✅ API backend với MongoDB
- ✅ WebSocket chat

## Lưu ý:

1. **MongoDB**: Cần cài đặt và khởi động MongoDB
2. **JWT Secret**: Thay đổi JWT_SECRET trong production
3. **Socket.IO**: Cần cài đặt Socket.IO client
4. **Images**: Đảm bảo các hình ảnh trong thư mục images/ tồn tại

## Troubleshooting:

### Lỗi thường gặp:
1. **MongoDB connection failed**: Kiểm tra MongoDB service
2. **Socket.IO error**: Kiểm tra network và firewall
3. **CSS không load**: Kiểm tra đường dẫn file CSS
4. **JavaScript error**: Kiểm tra console browser

### Giải pháp:
1. Restart MongoDB service
2. Kiểm tra port 27017 (MongoDB)
3. Clear browser cache
4. Kiểm tra file paths
