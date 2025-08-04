#!/bin/bash

# Script tự động deploy từ Replit lên hosting
echo "🚀 Bắt đầu deploy lên hosting..."

# Kiểm tra biến môi trường cần thiết
if [ -z "$HOSTING_FTP_HOST" ] || [ -z "$HOSTING_FTP_USER" ] || [ -z "$HOSTING_FTP_PASS" ]; then
    echo "❌ Thiếu thông tin FTP hosting. Vui lòng thiết lập:"
    echo "- HOSTING_FTP_HOST"
    echo "- HOSTING_FTP_USER"  
    echo "- HOSTING_FTP_PASS"
    echo "- HOSTING_REMOTE_DIR (optional, default: /public_html)"
    exit 1
fi

REMOTE_DIR=${HOSTING_REMOTE_DIR:-"/public_html"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "📋 Thông tin deploy:"
echo "- Host: $HOSTING_FTP_HOST"
echo "- User: $HOSTING_FTP_USER"
echo "- Remote dir: $REMOTE_DIR"
echo "- Time: $TIMESTAMP"

# 1. Build project
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 2. Tạo thư mục deploy
DEPLOY_DIR="deploy-$TIMESTAMP"
mkdir -p $DEPLOY_DIR

echo "📦 Chuẩn bị files deploy..."

# 3. Copy files cần thiết
cp -r dist/public $DEPLOY_DIR/
cp -r server $DEPLOY_DIR/
cp -r shared $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/

# 4. Tạo production start script
cat > $DEPLOY_DIR/start.js << 'EOF'
const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const { registerRoutes } = require('./server/routes.js');

// Register API routes
registerRoutes(app).then(server => {
  console.log(`🚀 Server running on port ${PORT}`);
}).catch(error => {
  console.error('❌ Server failed to start:', error);
});

// Catch all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
EOF

# 5. Tạo production package.json
cat > $DEPLOY_DIR/package.json << 'EOF'
{
  "name": "mam-non-thao-nguyen-xanh",
  "version": "1.0.0",
  "description": "Vietnamese Preschool Website - Production",
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
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# 6. Tạo .env example
cat > $DEPLOY_DIR/.env.example << 'EOF'
# Database connection
DATABASE_URL=postgresql://username:password@host:port/database

# Environment
NODE_ENV=production
PORT=3000

# Optional: Webhook secret for auto-deploy
WEBHOOK_SECRET=your-secret-key-here
EOF

# 7. Tạo PM2 ecosystem file
cat > $DEPLOY_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'preschool-website',
    script: 'start.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# 8. Tạo hướng dẫn cài đặt
cat > $DEPLOY_DIR/SETUP.md << 'EOF'
# Hướng dẫn cài đặt trên hosting

## 1. Upload files
Upload tất cả files trong thư mục này lên hosting

## 2. Cài đặt Node.js dependencies
```bash
npm install
```

## 3. Thiết lập biến môi trường
Copy .env.example thành .env và cập nhật thông tin database:
```bash
cp .env.example .env
nano .env
```

## 4. Chạy website
### Option 1: Chạy trực tiếp
```bash
npm start
```

### Option 2: Chạy với PM2 (khuyến nghị)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 5. Kiểm tra
Website sẽ chạy trên port 3000 (hoặc PORT trong .env)
Truy cập: http://your-domain.com:3000

## Troubleshooting
- Kiểm tra logs: `pm2 logs preschool-website`
- Restart: `pm2 restart preschool-website`
- Monitor: `pm2 monit`
EOF

echo "📤 Uploading to hosting..."

# 9. Upload lên hosting qua FTP
# Tạo script FTP
cat > ftp_script.txt << EOF
open $HOSTING_FTP_HOST
user $HOSTING_FTP_USER $HOSTING_FTP_PASS
binary
cd $REMOTE_DIR
lcd $DEPLOY_DIR
mput -r *
quit
EOF

# Chạy FTP upload
if command -v ftp &> /dev/null; then
    ftp -n < ftp_script.txt
    echo "✅ Upload completed via FTP"
elif command -v lftp &> /dev/null; then
    lftp -f ftp_script.txt
    echo "✅ Upload completed via LFTP"
else
    echo "⚠️  FTP client not found. Manual upload required:"
    echo "📁 Files ready in: $DEPLOY_DIR"
    echo "📋 Upload these files to your hosting: $REMOTE_DIR"
fi

# 10. Cleanup
rm -f ftp_script.txt

echo ""
echo "🎉 Deploy completed!"
echo "📁 Files deployed from: $DEPLOY_DIR"
echo "🌐 Remote path: $HOSTING_FTP_HOST$REMOTE_DIR"
echo ""
echo "📋 Next steps on hosting:"
echo "1. SSH vào hosting"
echo "2. cd $REMOTE_DIR"
echo "3. npm install"
echo "4. npm start (hoặc pm2 start ecosystem.config.js)"
echo ""
echo "🔗 Website sẽ accessible tại domain của bạn!"

# 11. Optional: Trigger restart webhook
if [ ! -z "$HOSTING_WEBHOOK_URL" ]; then
    echo "🔄 Triggering restart webhook..."
    curl -X POST "$HOSTING_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -H "x-webhook-secret: ${WEBHOOK_SECRET:-default}" \
        -d '{"action":"deploy","timestamp":"'$TIMESTAMP'"}'
    echo "✅ Webhook triggered"
fi