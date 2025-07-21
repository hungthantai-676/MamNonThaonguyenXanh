# 📋 Thông tin gửi cho nhà cung cấp hosting

## 🎯 Yêu cầu hệ thống

### Phần mềm cần thiết:
- ✅ **Node.js** version 18 trở lên
- ✅ **PostgreSQL** database 
- ✅ **SSL certificate** (HTTPS)
- ✅ **SSH access** để cài đặt

### Cấu hình server:
- ✅ **RAM**: Tối thiểu 1GB, khuyến nghị 2GB
- ✅ **Storage**: Tối thiểu 5GB SSD
- ✅ **Port**: 3000 (hoặc port do hosting cung cấp)
- ✅ **Bandwidth**: Không giới hạn

## 📦 File website cần upload

**File đính kèm:** `website-backup-20250721_060053.tar.gz`

### Nội dung file backup:
- Frontend đã build sẵn (static files)
- Backend API server (Node.js)
- Database schemas và migrations
- Dependencies và configuration
- Hướng dẫn cài đặt chi tiết

## 🔧 Các bước cài đặt

### 1. Giải nén file
```bash
tar -xzf website-backup-20250721_060053.tar.gz
```

### 2. Cài đặt dependencies
```bash
cd /path/to/website
npm install
```

### 3. Thiết lập database
- Tạo PostgreSQL database mới
- Import schema từ file backup
- Cập nhật connection string

### 4. Thiết lập biến môi trường
```bash
# Tạo file .env
DATABASE_URL=postgresql://user:pass@host:port/dbname
NODE_ENV=production
PORT=3000
```

### 5. Chạy website
```bash
# Cài đặt PM2 (process manager)
npm install -g pm2

# Chạy website
pm2 start start.js --name "preschool-website"
pm2 save
pm2 startup
```

## 🌐 Cấu hình domain

### DNS Records cần thiết:
```
Type: A
Name: @ (hoặc www)
Value: [IP address của hosting]
TTL: 300
```

### SSL Certificate:
- Tự động qua Let's Encrypt
- Hoặc upload certificate riêng

## 📱 Thông tin website

- **Tên**: Mầm Non Thảo Nguyên Xanh
- **Loại**: Website trường mầm non
- **Framework**: React + Node.js + PostgreSQL
- **Port**: 3000
- **Protocol**: HTTPS (bắt buộc)

## 🔐 Yêu cầu bảo mật

- ✅ SSL/TLS certificate
- ✅ Database password mạnh
- ✅ Regular backups
- ✅ Firewall protection

## 💬 Hỗ trợ kỹ thuật

Nếu gặp vấn đề trong quá trình cài đặt, vui lòng liên hệ:
- File hướng dẫn chi tiết: `HUONG_DAN_TRIET_KHAI_HOSTING.md`
- Hoặc liên hệ trực tiếp để được hỗ trợ

---

## ✅ Checklist hoàn thành

- [ ] Server đáp ứng yêu cầu hệ thống
- [ ] File backup đã upload và giải nén
- [ ] Dependencies đã cài đặt (npm install)
- [ ] Database đã thiết lập và kết nối
- [ ] Biến môi trường đã cấu hình
- [ ] Website chạy thành công (pm2 status)
- [ ] Domain đã trỏ về hosting
- [ ] SSL certificate đã cài đặt
- [ ] Tất cả trang web hoạt động bình thường

**🎉 Website sẽ sẵn sàng hoạt động sau khi hoàn thành checklist!**