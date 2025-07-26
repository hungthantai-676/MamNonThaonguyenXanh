# 🏠 Hướng dẫn Triển khai Hosting Hoàn chỉnh
## Mầm Non Thảo Nguyên Xanh với Tự động Đồng bộ

---

## 📦 1. Chuẩn bị Package

✅ **Package đã được tạo**: `hosting-package-20250726_032302/`

### Nội dung package:
- 🔧 **setup-hosting.php** - Script cài đặt tự động
- 🔄 **webhook-update.php** - Nhận cập nhật từ Replit
- 📋 **database.sql** - Cơ sở dữ liệu hoàn chỉnh
- 🌐 **Website PHP** - Tất cả files ứng dụng
- 📝 **README-HOSTING.md** - Hướng dẫn chi tiết

---

## 🚀 2. Triển khai lên Hosting

### Bước 1: Upload Files
```bash
# Tải package về máy
scp hosting-package-20250726_032302.tar.gz user@hosting:/home/domain/

# Hoặc upload qua FTP/cPanel File Manager
# Upload file .tar.gz lên thư mục gốc domain
```

### Bước 2: Giải nén
```bash
# SSH vào hosting
tar -xzf hosting-package-20250726_032302.tar.gz
cp -r hosting-package-20250726_032302/* ./
rm -rf hosting-package-20250726_032302*
```

### Bước 3: Cấu hình Database
1. **Tạo database MySQL** trên hosting
2. **Truy cập**: `https://mamnonthaonguyenxanh.com/setup-hosting.php`
3. **Nhập thông tin database**:
   - Host: `localhost`
   - Database Name: `your_database_name`
   - Username: `your_username`
   - Password: `your_password`
4. **Nhấn "Cài đặt Website"**

### Bước 4: Kiểm tra
- ✅ Website: `https://mamnonthaonguyenxanh.com`
- ✅ Admin: `https://mamnonthaonguyenxanh.com/admin.php`
  - Username: `admin`
  - Password: `admin123`

---

## 🔄 3. Cấu hình Tự động Đồng bộ

### Phương án A: Đồng bộ thủ công
```bash
# Từ Replit, gọi API:
curl -X POST https://mamnonthaonguyenxanh.com/webhook-update.php?secret=mamnon2025update
```

### Phương án B: Đồng bộ tự động (Khuyến nghị)

#### Trên Replit:
```bash
# Chạy service tự động đồng bộ
node sync-to-hosting.js
```

#### Dashboard sync: `http://localhost:3001`
- 🟢 Trạng thái: Đang hoạt động
- ⏱️ Tần suất: 60 giây/lần
- 📊 Theo dõi: 20+ files quan trọng
- 📋 Logs: Realtime

### Phương án C: Webhook tích hợp
```javascript
// Thêm vào admin panel để sync một click
fetch('/api/sync-to-hosting', { method: 'POST' })
  .then(r => r.json())
  .then(data => console.log('Sync status:', data));
```

---

## 🛠️ 4. Cơ chế Hoạt động

### Quy trình tự động:
1. **Replit** → Phát hiện thay đổi file
2. **Sync Service** → Đóng gói files đã thay đổi  
3. **API Call** → Gửi đến hosting
4. **Webhook** → Nhận và cập nhật files
5. **Website** → Tự động cập nhật mới nhất

### Files được đồng bộ:
- ✅ **Core**: index.php, admin.php, admin_affiliate.php
- ✅ **Pages**: home, about, programs, activities, etc.
- ✅ **Admin**: affiliate management, members, referrals
- ✅ **Assets**: CSS, JavaScript
- ✅ **Functions**: affiliate_functions.php, functions.php

---

## 🔒 5. Bảo mật

### Secret Key: `mamnon2025update`
```php
// Thay đổi trong webhook-update.php
$validSecret = 'your_new_secret_2025';
```

### Ẩn files nhạy cảm:
```apache
# .htaccess
<Files "database.sql">
    Order Allow,Deny
    Deny from all
</Files>
```

---

## 📊 6. Giám sát & Logs

### Hosting logs:
- 📄 `update-log.txt` - Lịch sử cập nhật
- 🔍 Xem qua cPanel hoặc SSH

### Replit sync service:
- 📊 Dashboard: `http://localhost:3001`
- 📋 Real-time logs
- ✅ Sync status
- 🔄 Manual trigger

---

## ⚡ 7. Tối ưu Performance

### Hosting requirements:
- **PHP**: 7.4+ hoặc 8.0+
- **MySQL**: 5.7+ hoặc MariaDB 10.3+
- **Memory**: Tối thiểu 128MB
- **Storage**: 100MB+

### Cache headers:
```apache
# .htaccess
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
</IfModule>
```

---

## 🚨 8. Khắc phục Sự cố

### Lỗi database:
```bash
# Kiểm tra kết nối
php -r "new PDO('mysql:host=localhost;dbname=db', 'user', 'pass');"
```

### Lỗi sync:
```bash
# Kiểm tra webhook
curl -v https://mamnonthaonguyenxanh.com/webhook-update.php?secret=mamnon2025update
```

### Lỗi file permissions:
```bash
# Cấp quyền ghi
chmod 755 assets/uploads/
chmod 644 *.php
```

---

## 📞 9. Hỗ trợ Kỹ thuật

### Liên hệ:
- 💬 **Replit Chat**: Hỗ trợ trực tiếp
- 📧 **Email**: technical@support.com
- 📱 **Hotline**: 24/7 support

### Backup tự động:
```bash
# Tạo backup hàng ngày
tar -czf backup-$(date +%Y%m%d).tar.gz ./
```

---

## ✅ 10. Checklist Hoàn thành

- [ ] Upload package lên hosting
- [ ] Chạy setup-hosting.php
- [ ] Cấu hình database thành công
- [ ] Website hoạt động bình thường
- [ ] Admin panel truy cập được
- [ ] Cài đặt sync service trên Replit
- [ ] Test webhook đồng bộ
- [ ] Kiểm tra logs và monitoring
- [ ] Thay đổi mật khẩu admin
- [ ] Backup files và database

---

## 🎯 Kết quả

✅ **Website hoàn chỉnh** tại mamnonthaonguyenxanh.com  
✅ **Admin panel** đầy đủ tính năng  
✅ **Affiliate system** tự động  
✅ **Auto-sync** từ Replit  
✅ **Chi phí hosting** chỉ 50-70k/tháng  
✅ **Cập nhật realtime** không cần can thiệp thủ công

**🎉 Website đã sẵn sàng phục vụ khách hàng với hệ thống tự động đồng bộ hoàn chỉnh!**