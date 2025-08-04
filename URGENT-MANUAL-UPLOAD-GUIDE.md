# 🚨 HƯỚNG DẪN UPLOAD MANUAL - SỬA 404 NGAY

## ⚠️ TÌNH HUỐNG: Vite Deploy không sync routing được

**Vấn đề**: Assets (JS/CSS) đã lên nhưng thiếu .htaccess → tất cả pages trả về 404

## 📦 PACKAGE MANUAL UPLOAD

**File**: `MANUAL-UPLOAD-PACKAGE.zip` (đã tạo sẵn)

**Nội dung**:
- `index.html` - Trang chính React SPA
- `assets/index-D2wHOpLa.js` - JavaScript bundle  
- `assets/index-DOsqSj5W.css` - CSS bundle
- `assets/image_1753710172214-DZ_LOqgn.png` - Logo
- `.htaccess` - **QUAN TRỌNG**: Config routing cho SPA

## 🚀 CÁCH UPLOAD MANUAL (5 PHÚT)

### Bước 1: Download Package
1. Vào Replit file explorer
2. Tìm file `MANUAL-UPLOAD-PACKAGE.zip`
3. Right-click → Download

### Bước 2: Access Hosting File Manager
```
URL: https://s88d107.cloudnetwork.vn:8443/
Login → Domain → File Manager
```

### Bước 3: Backup & Clear Domain Root
```
1. Select tất cả files hiện tại
2. Create folder "backup-old" 
3. Move tất cả files vào backup-old/
```

### Bước 4: Upload New Package
```
1. Upload MANUAL-UPLOAD-PACKAGE.zip
2. Right-click file → Extract
3. Delete .zip file sau khi extract
```

### Bước 5: Set Permissions (QUAN TRỌNG)
```
File Manager → Select All → Properties:
- index.html: 644
- .htaccess: 644  
- assets/ folder: 755
- assets/* files: 644
```

## 🎯 KẾT QUẢ EXPECTED

Sau khi upload:
- ✅ https://mamnonthaonguyenxanh.com → Trang chủ
- ✅ https://mamnonthaonguyenxanh.com/affiliate-login → Trang đăng nhập đơn giản
- ✅ https://mamnonthaonguyenxanh.com/affiliate-register → Trang đăng ký

## 🔍 VERIFY UPLOAD SUCCESS

### Test trong browser:
```bash
# 1. Test homepage
https://mamnonthaonguyenxanh.com
# Expect: Trang chủ mầm non

# 2. Test login page  
https://mamnonthaonguyenxanh.com/affiliate-login
# Expect: Form đăng nhập sạch sẽ (KHÔNG phải 404)

# 3. Test assets
https://mamnonthaonguyenxanh.com/assets/index-D2wHOpLa.js
# Expect: JavaScript content (không phải 404)
```

## 🛠️ TROUBLESHOOTING

### Nếu vẫn 404 sau upload:
1. **Check .htaccess exists**: File Manager → verify .htaccess file có trong root
2. **Check permissions**: .htaccess phải có permission 644
3. **Apache mod_rewrite**: Contact hosting enable mod_rewrite
4. **Clear browser cache**: Ctrl+F5 hoặc private browsing

### Nếu CSS không load:
1. **Check assets folder**: Verify assets/ folder exists với files bên trong
2. **Check asset paths**: F12 → Network tab → xem files nào fail load
3. **Permission issues**: assets/ folder = 755, files = 644

## 📞 BACKUP PLAN 

### Nếu manual upload cũng fail:
```php
# Tạo file index.php như fallback:
<?php
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

if ($path !== '/' && file_exists(__DIR__ . $path)) {
    return false;
}

include_once 'index.html';
?>
```

---
🕐 Created: $(date)
🎯 Status: MANUAL UPLOAD PACKAGE READY  
📋 Action: Download MANUAL-UPLOAD-PACKAGE.zip và upload theo hướng dẫn