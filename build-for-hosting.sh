#!/bin/bash

# Script tạo file backup cho hosting
echo "🚀 Đang tạo file backup cho hosting..."

# Tạo thư mục build
mkdir -p hosting-backup

# Build frontend
echo "📦 Building frontend..."
npm run build

# Copy frontend build
cp -r dist/public hosting-backup/public

# Copy backend files
echo "📦 Copying backend files..."
cp -r server hosting-backup/
cp -r shared hosting-backup/
cp package.json hosting-backup/
cp package-lock.json hosting-backup/
cp tsconfig.json hosting-backup/
cp drizzle.config.ts hosting-backup/

# Copy configuration files
cp .replit hosting-backup/ 2>/dev/null || echo "No .replit file"
cp replit.md hosting-backup/ 2>/dev/null || echo "No replit.md file"

# Tạo file start script cho hosting
cat > hosting-backup/start.js << 'EOF'
const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
require('./server/index.js');

// Catch all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Tạo file package.json cho hosting
cat > hosting-backup/hosting-package.json << 'EOF'
{
  "name": "mam-non-thao-nguyen-xanh",
  "version": "1.0.0",
  "description": "Vietnamese Preschool Website",
  "main": "start.js",
  "scripts": {
    "start": "node start.js",
    "dev": "node start.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "drizzle-orm": "^0.30.0",
    "@neondatabase/serverless": "^0.9.0",
    "zod": "^3.22.0",
    "uuid": "^9.0.0",
    "qrcode": "^1.5.0",
    "ethers": "^6.7.0",
    "ws": "^8.14.0"
  }
}
EOF

# Tạo file hướng dẫn
cat > hosting-backup/HOSTING-GUIDE.md << 'EOF'
# Hướng dẫn triển khai Website Mầm Non Thảo Nguyên Xanh

## 1. Upload files
- Upload tất cả files trong thư mục này lên hosting
- Đảm bảo file start.js ở thư mục root

## 2. Cài đặt dependencies
```bash
npm install
```

## 3. Thiết lập biến môi trường
Tạo file .env với nội dung:
```
DATABASE_URL=your_postgres_connection_string
NODE_ENV=production
```

## 4. Chạy website
```bash
npm start
```

## 5. Domain pointing
- Point domain A record to server IP
- Or use CNAME if hosting supports it

## Lưu ý
- Cần PostgreSQL database
- Node.js version 18+ required
- Port mặc định: 3000
EOF

# Nén file backup
echo "📦 Tạo file nén..."
cd hosting-backup
zip -r ../website-backup-$(date +%Y%m%d_%H%M%S).zip .
cd ..

echo "✅ Hoàn thành! File backup đã được tạo:"
ls -la website-backup-*.zip

echo ""
echo "🎯 Gửi file .zip này cho nhà cung cấp hosting của bạn"
echo "📋 Kèm theo file HOSTING-GUIDE.md để hướng dẫn cài đặt"