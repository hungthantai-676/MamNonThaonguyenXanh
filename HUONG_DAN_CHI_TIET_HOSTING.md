# 🎯 HƯỚNG DẪN GỬI CHO NHÀ CUNG CẤP HOSTING

## 📦 TÀI LIỆU CẦN GỬI

**1. File website:** `FINAL-mamnonthaonguyenxanh-com.tar.gz`  
**2. File hướng dẫn:** `HUONG_DAN_CHI_TIET_HOSTING.md` (file này)

## 🏗️ YÊU CẦU HỆ THỐNG

- **Hệ điều hành:** Ubuntu 20.04+ hoặc CentOS 7+
- **Node.js:** Version 18.0.0 trở lên  
- **Database:** PostgreSQL 13+
- **Memory:** Tối thiểu 2GB RAM
- **Storage:** Tối thiểu 10GB SSD
- **Network:** Port 80, 443, 3000

## 🔧 CÀI ĐẶT TỪNG BƯỚC

### BƯỚC 1: Upload và giải nén
```bash
# Upload file FINAL-mamnonthaonguyenxanh-com.tar.gz lên server
# Giải nén tại thư mục web root
cd /var/www/html
tar -xzf FINAL-mamnonthaonguyenxanh-com.tar.gz
chown -R www-data:www-data .
chmod -R 755 .
```

### BƯỚC 2: Cài đặt Node.js
```bash
# Cài Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài PM2
sudo npm install -g pm2

# Kiểm tra version
node --version  # >= 18.0.0
```

### BƯỚC 3: Cài đặt PostgreSQL
```bash
# Cài PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Tạo database
sudo -u postgres createdb mamnonthaonguyenxanh
sudo -u postgres createuser webapp
sudo -u postgres psql
ALTER USER webapp PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE mamnonthaonguyenxanh TO webapp;
\q
```

### BƯỚC 4: Cấu hình môi trường
```bash
# Copy template .env
cp .env.production .env

# Sửa file .env với thông tin database thực tế
nano .env

# Nội dung file .env:
DATABASE_URL=postgresql://webapp:password123@localhost:5432/mamnonthaonguyenxanh
NODE_ENV=production
PORT=3000
DOMAIN=mamnonthaonguyenxanh.com
BASE_URL=https://mamnonthaonguyenxanh.com
```

### BƯỚC 5: Cài dependencies và chạy
```bash
# Cài dependencies
npm install --production

# Chạy script deploy
chmod +x deploy.sh
./deploy.sh

# Kiểm tra status
pm2 status
pm2 logs mamnonthaonguyenxanh
```

### BƯỚC 6: Cấu hình Nginx
```bash
# Cài Nginx
sudo apt install nginx

# Copy config
sudo cp nginx-mamnonthaonguyenxanh.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/nginx-mamnonthaonguyenxanh.conf /etc/nginx/sites-enabled/

# Test và reload
sudo nginx -t
sudo systemctl reload nginx
```

### BƯỚC 7: SSL Certificate
```bash
# Cài Certbot
sudo apt install certbot python3-certbot-nginx

# Tạo SSL
sudo certbot --nginx -d mamnonthaonguyenxanh.com -d www.mamnonthaonguyenxanh.com

# Auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## 🌐 DOMAIN CONFIGURATION

### DNS Records cần thiết:
```
Type: A
Name: @
Value: [IP_SERVER]
TTL: 300

Type: A  
Name: www
Value: [IP_SERVER]
TTL: 300
```

## ✅ KIỂM TRA HOÀN THÀNH

### 1. Website chạy:
- https://mamnonthaonguyenxanh.com ✅
- https://www.mamnonthaonguyenxanh.com ✅

### 2. Admin panel:
- https://mamnonthaonguyenxanh.com/admin/login ✅
- Username: admin
- Password: admin123

### 3. Services running:
```bash
pm2 status                    # App running
sudo systemctl status nginx  # Nginx active
sudo systemctl status postgresql  # DB active
```

## 🔄 HỆ THỐNG CẬP NHẬT

### Auto-update từ Replit:
```bash
# Webhook endpoint sẵn sàng:
POST https://mamnonthaonguyenxanh.com/api/deploy-webhook
Header: x-webhook-secret: mamnon2025secure

# Test webhook:
curl -X POST https://mamnonthaonguyenxanh.com/api/deploy-webhook \
  -H "x-webhook-secret: mamnon2025secure" \
  -d '{"action":"restart"}'
```

## 🚨 TROUBLESHOOTING

### Lỗi thường gặp:

**1. Port đã sử dụng:**
```bash
sudo pkill -f node
pm2 kill
pm2 start ecosystem.config.js
```

**2. Database connection failed:**
```bash
# Kiểm tra PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT 1;"
```

**3. Nginx 502 Error:**
```bash
# Kiểm tra Node.js app
pm2 logs mamnonthaonguyenxanh
pm2 restart mamnonthaonguyenxanh
```

**4. SSL certificate issue:**
```bash
sudo certbot renew --dry-run
sudo systemctl reload nginx
```

## 📞 SUPPORT

### Commands hữu ích:
```bash
# Monitor app
pm2 monit

# View logs
pm2 logs mamnonthaonguyenxanh

# Restart app
pm2 restart mamnonthaonguyenxanh

# Check disk space
df -h

# Check memory
free -h
```

## 🎯 KẾT QUẢ CUỐI CÙNG

✅ **Website:** https://mamnonthaonguyenxanh.com  
✅ **Admin:** https://mamnonthaonguyenxanh.com/admin/login  
✅ **API:** https://mamnonthaonguyenxanh.com/api/  
✅ **Auto-update:** Enabled via webhook  

**🎉 Website sẵn sàng phục vụ!**