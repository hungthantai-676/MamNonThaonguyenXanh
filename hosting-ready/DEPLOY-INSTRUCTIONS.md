# 📋 Hướng dẫn deploy lên hosting

## Files cần upload:
- index.html (trang chính)
- assets/ (folder chứa CSS, JS)
- .htaccess (cấu hình routing)

## Cách deploy:
1. Upload tất cả files trong folder này lên thư mục gốc của domain
2. Đảm bảo file .htaccess được upload và có permission 644
3. Test website tại: https://mamnonthaonguyenxanh.com

## Lưu ý:
- Website này là Single Page Application (SPA)
- .htaccess đảm bảo tất cả routes đều trỏ về index.html
- Static files được cache 1 năm để tăng tốc

## Troubleshooting:
- Nếu routes không hoạt động, kiểm tra .htaccess
- Nếu assets không load, kiểm tra paths trong index.html
- Nếu cần API endpoints, phải thêm backend PHP/Node.js

Created: 2025-08-04T07:22:56.206Z
