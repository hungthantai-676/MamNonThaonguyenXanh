# 🚀 GÓI TRIỂN KHAI CHÍNH THỨC - mamnonthaonguyenxanh.com

## 📦 File cần triển khai

**File chính:** `website-backup-20250721_060053.tar.gz`

**Domain:** `mamnonthaonguyenxanh.com`

## 🔧 YÊU CẦU HỆ THỐNG

### Server Requirements:
- **OS:** Ubuntu 20.04+ hoặc CentOS 7+
- **Node.js:** Version 18.0.0 trở lên
- **RAM:** Tối thiểu 2GB (khuyến nghị 4GB)
- **Storage:** Tối thiểu 10GB SSD
- **Database:** PostgreSQL 13+
- **SSL:** Let's Encrypt hoặc SSL certificate
- **Port:** 80 (HTTP), 443 (HTTPS), 3000 (Application)

### Network Requirements:
- **SSH Access:** Cần thiết cho cài đặt và maintenance
- **FTP/SFTP:** Cho việc upload files và auto-update
- **Domain DNS:** A record trỏ về IP hosting

## 🛠️ CÀI ĐẶT BƯỚC 1: UPLOAD VÀ GIẢI NÉN

```bash
# 1. Upload file backup lên server
# 2. Giải nén tại thư mục web root
cd /var/www/html  # hoặc thư mục web root của hosting
tar -xzf website-backup-20250721_060053.tar.gz

# 3. Set permissions
chown -R www-data:www-data .
chmod -R 755 .
```

## 🛠️ CÀI ĐẶT BƯỚC 2: NODE.JS VÀ DEPENDENCIES

```bash
# Cài đặt Node.js 18 (nếu chưa có)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2 (Process Manager)
sudo npm install -g pm2

# Cài đặt dependencies
npm install --production

# Verify installation
node --version  # Phải >= 18.0.0
npm --version
```

## 🛠️ CÀI ĐẶT BƯỚC 3: DATABASE

```bash
# Cài đặt PostgreSQL (nếu chưa có)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Tạo database và user
sudo -u postgres psql
CREATE DATABASE mamnonthaonguyenxanh;
CREATE USER webapp WITH PASSWORD 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE mamnonthaonguyenxanh TO webapp;
\q

# Hoặc sử dụng database cloud hiện tại (Neon)
# DATABASE_URL=postgresql://user:pass@host/db (sẽ cung cấp)
```

## 🛠️ CÀI ĐẶT BƯỚC 4: BIẾN MÔI TRƯỜNG

```bash
# Tạo file .env
cat > .env << 'EOF'
# Database - SẼ CUNG CẤP CONNECTION STRING CHÍNH XÁC
DATABASE_URL=postgresql://webapp:STRONG_PASSWORD_HERE@localhost:5432/mamnonthaonguyenxanh

# Production environment
NODE_ENV=production
PORT=3000

# Domain cho CORS và links
DOMAIN=mamnonthaonguyenxanh.com
BASE_URL=https://mamnonthaonguyenxanh.com

# Auto-update webhook (quan trọng cho sync)
WEBHOOK_SECRET=mamnon2025secure
REPLIT_WEBHOOK_URL=https://your-replit-url.replit.dev/api/deploy-webhook

# FTP cho auto-sync (điền thông tin hosting)
HOSTING_FTP_HOST=ftp.mamnonthaonguyenxanh.com
HOSTING_FTP_USER=hosting_username
HOSTING_FTP_PASS=hosting_password
HOSTING_REMOTE_DIR=/var/www/html
EOF

# Set permissions cho .env
chmod 600 .env
```

## 🛠️ CÀI ĐẶT BƯỚC 5: CHẠY WEBSITE

```bash
# Start với PM2
pm2 start ecosystem.config.js

# Lưu config PM2
pm2 save

# Auto-start khi server reboot
pm2 startup
# Copy và chạy command mà PM2 hiển thị

# Check status
pm2 status
pm2 logs preschool-website

# Website sẽ chạy trên http://localhost:3000
```

## 🛠️ CÀI ĐẶT BƯỚC 6: NGINX REVERSE PROXY

```bash
# Cài đặt Nginx
sudo apt install nginx

# Tạo config cho domain
sudo nano /etc/nginx/sites-available/mamnonthaonguyenxanh.com

# Nội dung config:
server {
    listen 80;
    server_name mamnonthaonguyenxanh.com www.mamnonthaonguyenxanh.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mamnonthaonguyenxanh.com www.mamnonthaonguyenxanh.com;
    
    # SSL Configuration (sẽ setup ở bước 7)
    ssl_certificate /etc/letsencrypt/live/mamnonthaonguyenxanh.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mamnonthaonguyenxanh.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/mamnonthaonguyenxanh.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🛠️ CÀI ĐẶT BƯỚC 7: SSL CERTIFICATE

```bash
# Cài đặt Certbot
sudo apt install certbot python3-certbot-nginx

# Tạo SSL certificate
sudo certbot --nginx -d mamnonthaonguyenxanh.com -d www.mamnonthaonguyenxanh.com

# Auto-renewal
sudo crontab -e
# Thêm dòng:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🛠️ CÀI ĐẶT BƯỚC 8: FIREWALL

```bash
# Cấu hình UFW firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP  
sudo ufw allow 443   # HTTPS
sudo ufw allow 21    # FTP (cho auto-update)
sudo ufw enable
```

## 🔄 HỆ THỐNG AUTO-UPDATE

### Setup Webhook Endpoint (Quan trọng!)

```bash
# File webhook đã có sẵn trong package
# Endpoint: POST /api/deploy-webhook
# Secret: mamnon2025secure (trong .env)

# Test webhook:
curl -X POST https://mamnonthaonguyenxanh.com/api/deploy-webhook \
  -H "x-webhook-secret: mamnon2025secure" \
  -H "Content-Type: application/json" \
  -d '{"action":"test"}'

# Response thành công: {"success": true, "message": "Deployment started"}
```

### FTP Auto-Sync Setup

```bash
# Cài đặt FTP server (cho auto-update từ Replit)
sudo apt install vsftpd

# Cấu hình FTP
sudo nano /etc/vsftpd.conf

# Thêm/sửa các dòng:
write_enable=YES
local_enable=YES
chroot_local_user=YES
allow_writeable_chroot=YES

# Restart FTP
sudo systemctl restart vsftpd

# Tạo FTP user cho auto-update
sudo useradd -m -s /bin/bash deployer
sudo passwd deployer  # Set password
sudo usermod -a -G www-data deployer
```

## 📱 DOMAIN CONFIGURATION

### DNS Records cần thiết:

```
Type: A
Name: @
Value: [IP_ADDRESS_CUA_HOSTING]
TTL: 300

Type: A  
Name: www
Value: [IP_ADDRESS_CUA_HOSTING]
TTL: 300

Type: CNAME
Name: api
Value: mamnonthaonguyenxanh.com
TTL: 300
```

## ✅ KIỂM TRA SAU CÀI ĐẶT

### 1. Website hoạt động:
- https://mamnonthaonguyenxanh.com
- https://www.mamnonthaonguyenxanh.com

### 2. Admin panel:
- https://mamnonthaonguyenxanh.com/admin/login
- Username: admin
- Password: admin123

### 3. API endpoints:
- https://mamnonthaonguyenxanh.com/api/articles
- https://mamnonthaonguyenxanh.com/api/programs

### 4. Auto-update webhook:
- https://mamnonthaonguyenxanh.com/api/deploy-webhook

### 5. Services running:
```bash
pm2 status          # Node.js app running
sudo nginx -t       # Nginx config OK
sudo ufw status     # Firewall active
```

## 🔄 WORKFLOW CẬP NHẬT TỰ ĐỘNG

### Từ Replit (Sau khi hosting setup xong):

```bash
# 1. Phát triển tính năng mới trên Replit
# 2. Test local
# 3. Chạy deploy script:
./deploy-to-hosting.sh

# Script sẽ tự động:
# - Build production
# - Upload via FTP
# - Trigger webhook restart
# - Website cập nhật ngay lập tức
```

### Monitoring:

```bash
# Xem logs realtime
pm2 logs preschool-website

# Monitor performance  
pm2 monit

# Server status
htop
df -h
```

## 🆘 SUPPORT & TROUBLESHOOTING

### Các lệnh hữu ích:

```bash
# Restart website
pm2 restart preschool-website

# Restart Nginx
sudo systemctl restart nginx

# Check database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check disk space
df -h

# Check memory
free -h

# View error logs
pm2 logs preschool-website --err
tail -f /var/log/nginx/error.log
```

### Backup tự động:

```bash
# Thêm vào crontab:
0 2 * * * pg_dump $DATABASE_URL > /backup/db-$(date +\%Y\%m\%d).sql
0 3 * * * tar -czf /backup/files-$(date +\%Y\%m\%d).tar.gz /var/www/html
```

---

## 📋 CHECKLIST HOÀN THÀNH

- [ ] Server đáp ứng requirements
- [ ] File backup uploaded và extracted  
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (npm install)
- [ ] Database created và connected
- [ ] Environment variables configured
- [ ] PM2 process manager setup
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] Domain DNS pointing correctly
- [ ] Firewall configured
- [ ] FTP server setup for auto-update
- [ ] Webhook endpoint tested
- [ ] Website accessible: https://mamnonthaonguyenxanh.com
- [ ] Admin panel working
- [ ] Auto-update tested từ Replit

## 🎉 KẾT QUẢ CUỐI CÙNG

✅ Website chạy hoàn toàn độc lập tại: **https://mamnonthaonguyenxanh.com**

✅ Cập nhật tự động từ Replit chỉ với 1 lệnh: `./deploy-to-hosting.sh`

✅ Hiệu suất cao, bảo mật SSL, backup tự động

**Website sẵn sàng phục vụ học sinh và phụ huynh!**