# 📧 TÓM TẮT THIẾT LẬP EMAIL CHO HOSTING

## 🎯 THÔNG TIN GỬI CHO NHÀ CUNG CẤP HOSTING

**Domain:** mamnonthaonguyenxanh.com  
**Loại:** Website trường mầm non với hệ thống quản lý hoàn chỉnh

---

## 📦 FILES CẦN TRIỂN KHAI

### File 1: Website Package
**Tên file:** `FINAL-mamnonthaonguyenxanh-com.tar.gz`  
**Kích thước:** 512KB  
**Nội dung:** Website đầy đủ đã build sẵn

### File 2: Hướng dẫn
**Tên file:** `setup-instructions.txt`  
**Nội dung:** (Copy nội dung bên dưới vào file text)

---

## 📋 NỘI DUNG FILE HƯỚNG DẪN (setup-instructions.txt)

```
=== HƯỚNG DẪN TRIỂN KHAI WEBSITE mamnonthaonguyenxanh.com ===

YÊU CẦU HỆ THỐNG:
- Ubuntu 20.04+ hoặc CentOS 7+
- Node.js 18.0.0+
- PostgreSQL 13+
- RAM: 2GB
- Storage: 10GB SSD
- Port: 80, 443, 3000

CÀI ĐẶT:

1. UPLOAD VÀ GIẢI NÉN
cd /var/www/html
tar -xzf FINAL-mamnonthaonguyenxanh-com.tar.gz
chown -R www-data:www-data .

2. CÀI NODE.JS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

3. CÀI POSTGRESQL
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb mamnonthaonguyenxanh
sudo -u postgres createuser webapp
sudo -u postgres psql
ALTER USER webapp PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE mamnonthaonguyenxanh TO webapp;
\q

4. CẤU HÌNH ENVIRONMENT
cp .env.production .env
nano .env

Sửa file .env:
DATABASE_URL=postgresql://webapp:password123@localhost:5432/mamnonthaonguyenxanh
NODE_ENV=production
PORT=3000
DOMAIN=mamnonthaonguyenxanh.com

5. CHẠY WEBSITE
npm install --production
chmod +x deploy.sh
./deploy.sh

6. CẤU HÌNH NGINX
sudo apt install nginx
sudo cp nginx-mamnonthaonguyenxanh.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/nginx-mamnonthaonguyenxanh.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

7. SSL CERTIFICATE
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d mamnonthaonguyenxanh.com -d www.mamnonthaonguyenxanh.com

DNS RECORDS:
Type: A, Name: @, Value: [IP_SERVER]
Type: A, Name: www, Value: [IP_SERVER]

KIỂM TRA:
- Website: https://mamnonthaonguyenxanh.com
- Admin: https://mamnonthaonguyenxanh.com/admin/login
- Username: admin, Password: admin123

COMMANDS:
pm2 status
pm2 logs mamnonthaonguyenxanh
pm2 restart mamnonthaonguyenxanh

```

---

## 🔄 CÁCH DOWNLOAD FILES

### Từ Replit (Đúng cách):

1. **Vào Replit project này**
2. **Click vào "Files" ở sidebar trái**  
3. **Tìm file:** `FINAL-mamnonthaonguyenxanh-com.tar.gz`
4. **Right-click → Download**
5. **Tạo file text:** `setup-instructions.txt` và copy nội dung ở trên

### Hoặc Download từ thư mục:

1. **Vào thư mục:** `official-deploy-20250721_061134`
2. **Select all files** trong thư mục
3. **Right-click → Download as ZIP**

---

## 📞 GỬI CHO HOSTING PROVIDER

**Email mẫu:**

```
Chào anh/chị,

Tôi cần triển khai website trường mầm non với domain: mamnonthaonguyenxanh.com

Đính kèm:
1. File website: FINAL-mamnonthaonguyenxanh-com.tar.gz
2. Hướng dẫn cài đặt: setup-instructions.txt

Website cần:
- Node.js 18+
- PostgreSQL 
- SSL certificate
- Domain pointing

Vui lòng báo phí và thời gian triển khai.

Cảm ơn!
```

---

## ✅ KẾT QUẢ MONG MUỐN

- Website chạy tại: https://mamnonthaonguyenxanh.com
- Admin panel: https://mamnonthaonguyenxanh.com/admin/login  
- Tự động cập nhật từ Replit
- SSL security
- Full functionality

**🎯 Sau khi hosting setup xong, website sẽ hoạt động độc lập hoàn toàn!**