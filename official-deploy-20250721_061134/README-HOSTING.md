# 🎯 TRIỂN KHAI CHÍNH THỨC - mamnonthaonguyenxanh.com

## ⚡ Quick Start

```bash
# 1. Upload tất cả files lên server
# 2. Chạy script cài đặt:
chmod +x deploy.sh
./deploy.sh

# 3. Cấu hình domain và SSL
# 4. Website ready: https://mamnonthaonguyenxanh.com
```

## 📋 Checklist Setup

- [ ] Node.js 18+ installed
- [ ] PostgreSQL database ready
- [ ] Domain DNS trỏ về server IP
- [ ] SSL certificate configured
- [ ] Files uploaded và permissions set
- [ ] .env configured với DATABASE_URL
- [ ] PM2 process running
- [ ] Nginx reverse proxy setup

## 🔧 Commands

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit
pm2 logs mamnonthaonguyenxanh

# Restart
pm2 restart mamnonthaonguyenxanh

# Update from Replit
curl -X POST https://mamnonthaonguyenxanh.com/api/deploy-webhook \
  -H "x-webhook-secret: mamnon2025secure"
```

## 📞 Support

Website: https://mamnonthaonguyenxanh.com
Admin: https://mamnonthaonguyenxanh.com/admin/login (admin/admin123)
