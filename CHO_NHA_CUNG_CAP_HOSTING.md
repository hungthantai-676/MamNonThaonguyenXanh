# 📋 Hướng dẫn cho Nhà cung cấp Hosting
## Website: mamnonthaonguyenxanh.com

---

## 📦 Thông tin Backup

**File backup**: `FINAL-mamnonthaonguyenxanh-com.tar.gz`
**Kích thước**: ~46KB
**Ngày tạo**: 26/07/2025
**Loại**: Website PHP hoàn chỉnh

---

## 🔧 Yêu cầu Hosting

### Hệ thống
- **PHP**: 7.4 hoặc 8.0+ 
- **MySQL**: 5.7+ hoặc MariaDB 10.3+
- **Apache/Nginx**: Hỗ trợ .htaccess
- **SSL**: Bắt buộc (HTTPS)

### Resources
- **Disk**: Tối thiểu 100MB
- **RAM**: 128MB+
- **Bandwidth**: 1GB/tháng

### Modules PHP cần thiết
- `pdo_mysql`
- `curl`
- `json`
- `mbstring`

---

## 🚀 Hướng dẫn Triển khai

### 1. Upload & Giải nén
```bash
# Upload file FINAL-mamnonthaonguyenxanh-com.tar.gz
# Giải nén vào thư mục gốc domain:
tar -xzf FINAL-mamnonthaonguyenxanh-com.tar.gz
```

### 2. Tạo Database
- Tạo database MySQL mới
- Character set: `utf8mb4_unicode_ci`
- Ghi nhớ: DB name, username, password

### 3. Cài đặt Website
- Truy cập: `https://mamnonthaonguyenxanh.com/setup-hosting.php`
- Nhập thông tin database
- Nhấn "Cài đặt Website"
- Website tự động import database và cấu hình

### 4. Kiểm tra
- Website: `https://mamnonthaonguyenxanh.com`
- Admin: `https://mamnonthaonguyenxanh.com/admin.php`
  - Username: `admin`
  - Password: `admin123`

---

## 🌐 Cấu hình Tên miền

### DNS Records cần thiết:
```
A Record: @ → IP hosting
A Record: www → IP hosting
CNAME: www → mamnonthaonguyenxanh.com
```

### SSL Certificate:
- Kích hoạt Let's Encrypt hoặc SSL miễn phí
- Force HTTPS redirect

---

## 🔄 Tính năng Đặc biệt: Auto-Update

Website này có tính năng tự động cập nhật từ Replit.

### Webhook Endpoint:
```
https://mamnonthaonguyenxanh.com/webhook-update.php?secret=mamnon2025update
```

### Cách hoạt động:
1. Developer cập nhật code trên Replit
2. Hệ thống tự động gửi updates đến hosting
3. Website tự động cập nhật không cần can thiệp

### File logs:
- `update-log.txt` - Lịch sử cập nhật
- Có thể theo dõi qua cPanel

---

## ⚠️ Lưu ý Bảo mật

### Files nhạy cảm:
- `database.sql` - Đã được ẩn qua .htaccess
- `config.hosting.php` - Chỉ đọc được từ PHP
- `*.log` - Files log được bảo vệ

### Permissions đề xuất:
```bash
chmod 755 assets/uploads/
chmod 644 *.php
chmod 600 database.sql
```

---

## 📞 Thông tin Liên hệ

**Khách hàng**: Mầm Non Thảo Nguyên Xanh
**Website**: mamnonthaonguyenxanh.com
**Email**: contact@mamnonthaonguyenxanh.com

**Developer Support**: Available via Replit platform

---

## ✅ Checklist Triển khai

- [ ] Upload và giải nén backup
- [ ] Tạo database MySQL
- [ ] Chạy setup-hosting.php
- [ ] Kiểm tra website hoạt động
- [ ] Kiểm tra admin panel
- [ ] Cấu hình DNS records
- [ ] Kích hoạt SSL certificate
- [ ] Test auto-update webhook
- [ ] Backup database ban đầu
- [ ] Gửi thông tin truy cập cho khách hàng

---

**🎯 Kết quả**: Website hoàn chỉnh với tính năng tự động cập nhật, sẵn sàng phục vụ khách hàng!