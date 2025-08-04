# 🚀 Hướng dẫn Deploy Website lên mamnonthaonguyenxanh.com

## ✅ Tình trạng hiện tại
- **API Backend**: Đã hoạt động hoàn hảo (đã test thành công):
  - ✅ Contact form API (/api/contact)
  - ✅ Affiliate registration API (/api/affiliate/register) 
  - ✅ Affiliate login API (/api/affiliate/login)
  - ✅ Password reset API (/api/affiliate/reset-password)
  - ✅ Homepage content API (/api/admin/homepage)

- **Frontend**: Đã build thành công với tất cả pages và components

- **Vấn đề**: Trang mamnonthaonguyenxanh.com hiện tại vẫn hiển thị version cũ (404 errors)

## 📦 Package Hosting đã chuẩn bị

File: `hosting-package-[timestamp].tar.gz` chứa:
- `index.html` - Single Page Application entry point
- `assets/` - JavaScript và CSS files đã optimize  
- `.htaccess` - Cấu hình routing cho SPA
- Hướng dẫn deploy chi tiết

## 🔧 Cách Deploy

### Bước 1: Truy cập Hosting Control Panel
- Đăng nhập vào hosting panel của mamnonthaonguyenxanh.com
- Vào File Manager hoặc FTP access

### Bước 2: Backup dữ liệu cũ (nếu cần)
```bash
mkdir backup-$(date +%Y%m%d)
mv * backup-$(date +%Y%m%d)/
```

### Bước 3: Upload và extract package
- Upload file `hosting-package-[timestamp].tar.gz` 
- Extract vào thư mục gốc domain:
```bash
tar -xzf hosting-package-[timestamp].tar.gz
```

### Bước 4: Set permissions
```bash
chmod 644 index.html
chmod 644 .htaccess  
chmod -R 644 assets/*
```

### Bước 5: Test website
- Truy cập https://mamnonthaonguyenxanh.com
- Kiểm tra các pages: /affiliate-login, /affiliate-register, /contact
- Test form submissions

## 🔍 Troubleshooting

### Nếu hiển thị 404:
1. Kiểm tra .htaccess có được upload không
2. Đảm bảo index.html ở thư mục gốc domain
3. Check Apache mod_rewrite có enabled không

### Nếu CSS/JS không load:
1. Kiểm tra folder assets/ có đầy đủ files không
2. Xem source code của index.html có path đúng không
3. Clear browser cache

### Nếu forms không hoạt động:
- Cần thêm PHP backend hoặc Node.js server để xử lý API endpoints
- Hiện tại package này chỉ có frontend (React SPA)

## 📋 Bước tiếp theo

Sau khi deploy frontend thành công, cần:

1. **Thêm Backend API**: 
   - Deploy Node.js server (từ dist/index.js)
   - Hoặc tạo PHP endpoints tương ứng
   - Setup database connection

2. **Test toàn bộ hệ thống**:
   - Affiliate registration/login
   - Contact form submission  
   - Homepage content management

3. **SSL và Domain**:
   - Đảm bảo HTTPS hoạt động
   - Test từ nhiều devices/browsers

## 🆘 Hỗ trợ

Nếu gặp vấn đề trong quá trình deploy:
1. Check hosting error logs
2. Test từng file một cách riêng lẻ
3. Liên hệ hosting support nếu cần config server

---
Created: $(date)
Status: Ready for deployment