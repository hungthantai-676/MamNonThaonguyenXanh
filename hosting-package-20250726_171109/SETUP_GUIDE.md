# Hướng Dẫn Triển Khai Website Mầm Non Thảo Nguyên Xanh

## 📋 Tổng Quan
Package này chứa phiên bản tối ưu cho hosting thông thường với PHP/MySQL, được thiết kế để:
- Chạy trên hosting giá rẻ với PHP 7.4+ và MySQL 5.7+
- Tối ưu SEO và tốc độ tải trang
- Tự động sync với Replit để cập nhật nội dung
- Hỗ trợ quản lý nội dung dễ dàng

## 🏗️ Cấu Trúc Thư Mục
```
hosting-package/
├── index.php              # Trang chính với SEO tối ưu
├── config/
│   ├── database.php       # Cấu hình MySQL
│   └── settings.php       # Cài đặt website
├── database/
│   └── schema.sql         # Cấu trúc cơ sở dữ liệu
├── pages/                 # Các trang nội dung
├── components/            # Header, footer, chatbot
├── assets/               # CSS, JS, hình ảnh
├── api/                  # API sync với Replit
├── admin/                # Panel quản trị
└── uploads/              # Thư mục upload file
```

## 🚀 Triển Khai Lên Hosting

### Bước 1: Chuẩn Bị Hosting
1. **Yêu cầu tối thiểu:**
   - PHP 7.4 hoặc cao hơn
   - MySQL 5.7 hoặc MariaDB 10.2+
   - Dung lượng: 500MB+
   - SSL certificate (Let's Encrypt miễn phí)

2. **Thông tin cần có:**
   - FTP/SFTP credentials
   - Database credentials (host, username, password, database name)
   - Domain đã trỏ về hosting

### Bước 2: Upload Files
1. **Giải nén package** và upload toàn bộ lên thư mục public_html/
2. **Đặt quyền thư mục:**
   ```bash
   chmod 755 assets/ uploads/ logs/
   chmod 644 *.php config/*.php
   ```

### Bước 3: Cấu Hình Database
1. **Tạo database** trong hosting control panel
2. **Import schema:**
   ```bash
   mysql -u username -p database_name < database/schema.sql
   ```
3. **Cập nhật config/database.php:**
   ```php
   $db_config = [
       'host' => 'localhost',        // Database host từ hosting
       'dbname' => 'your_db_name',   // Tên database vừa tạo
       'username' => 'your_db_user', // Username database
       'password' => 'your_db_pass', // Password database
   ];
   ```

### Bước 4: Cấu Hình Website
Chỉnh sửa `config/settings.php`:

```php
// Cập nhật thông tin liên hệ
$contact_info = [
    'phone' => '0856318686',
    'email' => 'mamnonthaonguyenxanh@gmail.com',
    'address' => 'Địa chỉ thực của trường...',
    // ...
];

// Cập nhật domain
define('SITE_URL', 'https://mamnonthaonguyenxanh.com');
```

### Bước 5: Cấu Hình Admin
1. **Truy cập:** `https://mamnonthaonguyenxanh.com/admin/`
2. **Đăng nhập:**
   - Username: `admin`
   - Password: `admin123`
3. **Đổi mật khẩu** ngay sau khi đăng nhập lần đầu

## 🔄 Cấu Hình Auto-Sync Với Replit

### Bước 1: Tạo Sync Token
1. Tạo token bảo mật mạnh:
   ```bash
   openssl rand -hex 32
   ```
2. Cập nhật vào `config/settings.php`:
   ```php
   $sync_settings = [
       'sync_token' => 'your_secure_token_here',
       'enable_auto_sync' => true,
   ];
   ```

### Bước 2: Cấu Hình Webhook
Trong Replit, tạo file `sync-to-hosting.js`:
```javascript
const HOSTING_SYNC_URL = 'https://mamnonthaonguyenxanh.com/api/sync.php';
const SYNC_TOKEN = 'your_secure_token_here';

// Function để sync nội dung
async function syncToHosting(data) {
    try {
        const response = await fetch(HOSTING_SYNC_URL, {
            method: 'POST',
            headers: {
                'Authorization': SYNC_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        console.log('Sync completed:', await response.json());
    } catch (error) {
        console.error('Sync failed:', error);
    }
}
```

### Bước 3: Tự Động Sync
Khi cập nhật nội dung trong admin Replit, dữ liệu sẽ tự động sync sang hosting thông qua webhook.

## 🔍 Tối Ưu SEO

### Meta Tags Tự Động
Website tự động tạo meta tags tối ưu cho từng trang:
- Title tags unique cho mỗi trang
- Meta descriptions phù hợp
- Open Graph tags cho social media
- Schema.org markup cho Google

### Keywords Chính
- "mầm non ninh bình"
- "trường mầm non uy tín"
- "giáo dục mầm non"
- "mầm non thảo nguyên xanh"

### Sitemap và Robots.txt
Tạo file `robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://mamnonthaonguyenxanh.com/sitemap.xml
```

## 📧 Cấu Hình Email

### Gmail SMTP
Cập nhật `config/settings.php`:
```php
$email_settings = [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_username' => 'mamnonthaonguyenxanh@gmail.com',
    'smtp_password' => 'your_app_password', // Google App Password
    'from_email' => 'mamnonthaonguyenxanh@gmail.com',
];
```

## 🚨 Bảo Mật

### 1. File Permissions
```bash
find . -type f -name "*.php" -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chmod 600 config/database.php
```

### 2. Disable Directory Listing
Tạo file `.htaccess`:
```apache
Options -Indexes
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 3. Backup Tự Động
Script backup database hàng ngày:
```bash
#!/bin/bash
mysqldump -u username -p password database_name > backup_$(date +%Y%m%d).sql
```

## 📊 Monitoring & Analytics

### Google Analytics
Thêm GA4 tracking code vào `index.php`:
```javascript
gtag('config', 'G-YOUR-GA4-ID');
```

### Performance Monitoring
- PageSpeed Insights
- GTmetrix
- Google Search Console

## 🆘 Troubleshooting

### Lỗi Database Connection
```php
// Kiểm tra kết nối
$pdo = new PDO($dsn, $username, $password);
echo "Database connected successfully!";
```

### Lỗi File Permissions
```bash
chown -R www-data:www-data /path/to/website
chmod -R 755 /path/to/website
```

### Lỗi SSL/HTTPS
Kiểm tra certificate trong hosting panel và force HTTPS redirect.

## 📞 Hỗ Trợ

### Liên Hệ Kỹ Thuật
- **Website:** mamnonthaonguyenxanh.com
- **Email:** mamnonthaonguyenxanh@gmail.com
- **Phone:** 0856318686

### Log Files
- Sync logs: `/logs/sync.log`
- Error logs: `/logs/error.log`
- Access logs: hosting control panel

## 🎯 Checklist Hoàn Thành

- [ ] Upload files lên hosting
- [ ] Cấu hình database
- [ ] Test kết nối database
- [ ] Cập nhật thông tin liên hệ
- [ ] Đổi mật khẩu admin
- [ ] Cấu hình SSL certificate
- [ ] Test auto-sync với Replit
- [ ] Cấu hình email SMTP
- [ ] Thêm Google Analytics
- [ ] Submit sitemap lên Google
- [ ] Test responsive design
- [ ] Check page loading speed

---

**Lưu ý:** Sau khi hoàn thành setup, website sẽ hoạt động độc lập trên hosting nhưng vẫn có thể nhận cập nhật từ Replit thông qua API sync.