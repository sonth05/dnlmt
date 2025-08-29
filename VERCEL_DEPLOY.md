# Hướng dẫn Deploy lên Vercel

## **Vấn đề đã được sửa:**

### 1. **Tên file hình ảnh có dấu tiếng Việt**
- ✅ Đã đổi tên file hình ảnh từ tiếng Việt sang tiếng Anh
- ✅ Cập nhật HTML để sử dụng tên file mới
- ✅ Đảm bảo tương thích với Vercel (Linux case-sensitive)

### 2. **Cấu hình Vercel**
- ✅ Cập nhật `vercel.json` để xử lý CSS, JS và hình ảnh
- ✅ Tạo `.vercelignore` để loại trừ file không cần thiết

## **Các file đã được đổi tên:**

| File cũ | File mới |
|---------|----------|
| `ấm pin Longi Solar – Model LR7-72HVH-640M.jpg` | `longi-solar-lr7-72hvh-640m.jpg` |
| `Tấm pin Jinko Solar – Model JKM590N-72HL4-BDV (Tiger Neo).png` | `jinko-solar-jkm590n-72hl4-bdv.png` |
| `JA Solar Model JAM66D45-610LB.jpg` | `ja-solar-jam66d45-610lb.jpg` |

## **Cách deploy:**

### 1. **Commit và push code:**
```bash
git add .
git commit -m "Fix file names for Vercel deployment"
git push
```

### 2. **Deploy lên Vercel:**
```bash
vercel --prod
```

### 3. **Hoặc sử dụng Vercel Dashboard:**
- Kết nối GitHub repository
- Vercel sẽ tự động deploy khi có push mới

## **Cấu trúc file sau khi sửa:**

```
├── index.html          # Trang chính (đã sửa đường dẫn hình ảnh)
├── styles.css          # CSS (đã tối ưu)
├── script.js           # JavaScript (đã sửa lỗi)
├── vercel.json         # Cấu hình Vercel (đã cập nhật)
├── .vercelignore       # Loại trừ file (mới tạo)
├── images/             # Thư mục hình ảnh
│   ├── logo.png        # Logo
│   ├── longi-solar-lr7-72hvh-640m.jpg
│   ├── jinko-solar-jkm590n-72hl4-bdv.png
│   ├── ja-solar-jam66d45-610lb.jpg
│   └── anh1.jpg -> anh21.jpg
└── api/                # API endpoints
```

## **Lưu ý quan trọng:**

1. **Tên file**: Không sử dụng dấu tiếng Việt hoặc ký tự đặc biệt
2. **Case sensitivity**: Vercel phân biệt chữ hoa/thường
3. **Đường dẫn**: Sử dụng đường dẫn tương đối đúng
4. **Cấu hình**: Đảm bảo `vercel.json` xử lý đúng các loại file

## **Kiểm tra sau khi deploy:**

1. **Trang chính**: `https://your-domain.vercel.app/`
2. **CSS**: Kiểm tra styles có load đúng không
3. **JavaScript**: Kiểm tra console có lỗi không
4. **Hình ảnh**: Kiểm tra hình ảnh có hiển thị đúng không
5. **Modal**: Kiểm tra đăng nhập và chat có hoạt động không

## **Troubleshooting:**

### Nếu vẫn có lỗi 404:
1. Kiểm tra tên file trong thư mục `images/`
2. Kiểm tra đường dẫn trong HTML
3. Kiểm tra cấu hình `vercel.json`
4. Clear cache browser và thử lại

### Nếu CSS không load:
1. Kiểm tra đường dẫn `styles.css`
2. Kiểm tra cấu hình build trong `vercel.json`

### Nếu JavaScript không hoạt động:
1. Kiểm tra console browser
2. Kiểm tra đường dẫn `script.js`
3. Kiểm tra cấu hình build trong `vercel.json`
