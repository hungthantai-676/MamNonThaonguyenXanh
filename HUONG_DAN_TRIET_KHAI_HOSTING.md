# 🚀 Hướng dẫn triển khai Website lên Hosting riêng

## 📦 1. File cần gửi cho nhà cung cấp hosting

**File backup đã tạo:** `website-backup-20250721_060053.tar.gz`

### Nội dung file backup bao gồm:
- ✅ Frontend đã build (thư mục `public/`)
- ✅ Backend server code (thư mục `server/`)
- ✅ Shared schemas (thư mục `shared/`)
- ✅ Package.json với dependencies
- ✅ Start script cho production
- ✅ Hướng dẫn cài đặt chi tiết

## 🏗️ 2. Yêu cầu hosting cần có

### Hệ thống yêu cầu:
- ✅ **Node.js** version 18 trở lên
- ✅ **PostgreSQL** database (có thể dùng Neon, Supabase, hoặc local)
- ✅ **SSL certificate** (cho HTTPS)
- ✅ **Domain pointing** (A record hoặc CNAME)

### Ports:
- ✅ Port 3000 (hoặc port được hosting cung cấp)
- ✅ HTTP/HTTPS access

## 🔧 3. Các bước triển khai

### Bước 1: Upload files
```bash
# Giải nén file backup
tar -xzf website-backup-20250721_060053.tar.gz

# Upload tất cả files lên hosting
# (Thông qua FTP, cPanel File Manager, hoặc SSH)
```

### Bước 2: Cài đặt dependencies
```bash
# SSH vào hosting và chạy:
cd /path/to/your/website
npm install
```

### Bước 3: Thiết lập biến môi trường
Tạo file `.env`:
```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=3000
```

### Bước 4: Chạy website
```bash
# Chạy một lần:
npm start

# Hoặc dùng PM2 để chạy liên tục:
npm install -g pm2
pm2 start start.js --name "preschool-website"
pm2 save
pm2 startup
```

## 🌐 4. Cấu hình domain

### Option 1: A Record (Recommend)
```
Type: A
Name: @ (hoặc www)
Value: IP_ADDRESS_CUA_HOSTING
TTL: 300
```

### Option 2: CNAME (nếu hosting hỗ trợ)
```
Type: CNAME
Name: www
Value: your-hosting-domain.com
TTL: 300
```

## 🔄 5. Hệ thống cập nhật từ Replit

### Phương án 1: Manual Sync (Đơn giản nhất)
```bash
# Trong Replit, chạy script build:
./build-for-hosting.sh

# Download file backup mới
# Upload lên hosting thay thế file cũ
# Restart server
```

### Phương án 2: Auto-Sync với Webhook (Tự động)

**Bước 1:** Thiết lập webhook trên hosting
```javascript
// Thêm vào server hosting
app.post('/api/deploy-webhook', async (req, res) => {
  // Verify secret
  if (req.headers['x-webhook-secret'] !== 'YOUR_SECRET_KEY') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Trigger deployment
  exec('npm run deploy', (error, stdout, stderr) => {
    if (error) {
      console.error('Deploy error:', error);
      return res.status(500).json({ error: 'Deploy failed' });
    }
    res.json({ success: true, message: 'Deployed successfully' });
  });
});
```

**Bước 2:** Tạo script deploy trong Replit
```bash
# Trong Replit
curl -X POST https://your-domain.com/api/deploy-webhook \
  -H "x-webhook-secret: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

### Phương án 3: GitHub Actions (Chuyên nghiệp)

**Bước 1:** Push code lên GitHub
**Bước 2:** Tạo `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Hosting
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build project
      run: npm run build
      
    - name: Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.0.0
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
```

## 🔧 6. Quản lý database

### Option 1: Sử dụng database hiện tại (Neon)
```env
# Giữ nguyên DATABASE_URL từ Replit
DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/database
```

### Option 2: Database hosting riêng
```bash
# Backup data từ Neon
pg_dump "postgresql://old-url" > backup.sql

# Restore vào database mới
psql "postgresql://new-url" < backup.sql
```

## 📱 7. Mobile và Performance

### Tối ưu hóa:
- ✅ Gzip compression đã bật
- ✅ Static files caching
- ✅ CDN nếu cần thiết
- ✅ Database indexing

## 🔐 8. Bảo mật

### SSL Certificate:
```bash
# Nếu hosting chưa có SSL
certbot --nginx -d your-domain.com
```

### Environment Variables:
- ✅ Không commit `.env` vào Git
- ✅ Sử dụng hosting environment panel
- ✅ Rotate API keys định kỳ

## 🚨 9. Monitoring và Backup

### Log monitoring:
```bash
# Xem logs
pm2 logs preschool-website

# Monitor performance
pm2 monit
```

### Auto backup:
```bash
# Tạo cron job backup database hàng ngày
0 2 * * * pg_dump DATABASE_URL > /backup/db-$(date +\%Y\%m\%d).sql
```

## 📞 10. Hỗ trợ và troubleshooting

### Các lỗi thường gặp:

**❌ Port already in use:**
```bash
# Kill process
pkill -f node
# Hoặc
pm2 kill
```

**❌ Database connection failed:**
```bash
# Kiểm tra connection string
node -e "console.log(process.env.DATABASE_URL)"
```

**❌ 502 Bad Gateway:**
```bash
# Restart application
pm2 restart preschool-website
```

## 🎯 Tóm tắt workflow cập nhật hiệu quả:

1. **Phát triển trên Replit** (như hiện tại)
2. **Test tính năng mới**
3. **Chạy build script** (`./build-for-hosting.sh`)
4. **Upload/sync lên hosting** (manual hoặc auto)
5. **Restart server** trên hosting
6. **Kiểm tra website** hoạt động OK

---

## 📋 Checklist trước khi go-live:

- [ ] Database backup completed
- [ ] DNS pointing configured
- [ ] SSL certificate installed  
- [ ] Environment variables set
- [ ] Server running stable
- [ ] All pages loading correctly
- [ ] Admin panel accessible
- [ ] Forms working (contact, admission)
- [ ] Email system functional
- [ ] Performance optimized

**🎉 Sau khi hoàn thành, website sẽ chạy độc lập hoàn toàn trên hosting của bạn!**