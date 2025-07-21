#!/bin/bash

# Script deploy chính thức cho mamnonthaonguyenxanh.com
echo "🚀 Deploying to OFFICIAL DOMAIN: mamnonthaonguyenxanh.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="mamnonthaonguyenxanh.com"
WEBHOOK_SECRET="mamnon2025secure"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOY_DIR="official-deploy-$TIMESTAMP"

echo -e "${BLUE}📋 Deploy Configuration:${NC}"
echo -e "   Domain: ${GREEN}$DOMAIN${NC}"
echo -e "   Time: $TIMESTAMP"
echo -e "   Deploy dir: $DEPLOY_DIR"
echo ""

# Check if hosting FTP credentials are set
if [ -z "$OFFICIAL_FTP_HOST" ] || [ -z "$OFFICIAL_FTP_USER" ] || [ -z "$OFFICIAL_FTP_PASS" ]; then
    echo -e "${YELLOW}⚠️  FTP credentials not set. Will create manual package.${NC}"
    echo -e "${BLUE}To enable auto-deploy, set these in Replit Secrets:${NC}"
    echo "   OFFICIAL_FTP_HOST=ftp.mamnonthaonguyenxanh.com"
    echo "   OFFICIAL_FTP_USER=your_username"
    echo "   OFFICIAL_FTP_PASS=your_password"
    echo "   OFFICIAL_REMOTE_DIR=/var/www/html"
    echo ""
    MANUAL_DEPLOY=true
else
    echo -e "${GREEN}✅ FTP credentials found${NC}"
    MANUAL_DEPLOY=false
fi

# 1. Build production
echo -e "${BLUE}🔨 Building for production...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build completed${NC}"

# 2. Create deployment directory
mkdir -p $DEPLOY_DIR
echo -e "${BLUE}📦 Creating deployment package...${NC}"

# 3. Copy essential files
cp -r dist/public $DEPLOY_DIR/
cp -r server $DEPLOY_DIR/
cp -r shared $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp drizzle.config.ts $DEPLOY_DIR/

# 4. Create production start script
cat > $DEPLOY_DIR/start.js << 'EOF'
const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for production
app.set('trust proxy', 1);

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Import and register routes
const { registerRoutes } = require('./server/routes.js');

// Initialize server
async function startServer() {
  try {
    const server = await registerRoutes(app);
    
    // Catch all handler for SPA
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Mầm Non Thảo Nguyên Xanh server running on port ${PORT}`);
      console.log(`🌐 Domain: https://mamnonthaonguyenxanh.com`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
    });
    
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}

startServer();
EOF

# 5. Create production package.json
cat > $DEPLOY_DIR/package.json << 'EOF'
{
  "name": "mam-non-thao-nguyen-xanh-official",
  "version": "1.0.0",
  "description": "Mầm Non Thảo Nguyên Xanh - Official Website",
  "main": "start.js",
  "scripts": {
    "start": "node start.js",
    "dev": "node start.js",
    "migrate": "drizzle-kit push:pg"
  },
  "dependencies": {
    "express": "^4.18.2",
    "drizzle-orm": "^0.30.0",
    "drizzle-kit": "^0.20.0",
    "@neondatabase/serverless": "^0.9.0",
    "zod": "^3.22.0",
    "uuid": "^9.0.0",
    "qrcode": "^1.5.0",
    "ethers": "^6.7.0",
    "ws": "^8.14.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hook-form": "^7.47.0",
    "zod-validation-error": "^2.1.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "keywords": ["preschool", "education", "vietnam", "mamnon"],
  "author": "Mầm Non Thảo Nguyên Xanh",
  "license": "Private"
}
EOF

# 6. Create PM2 ecosystem file for production
cat > $DEPLOY_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'mamnonthaonguyenxanh',
    script: 'start.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# 7. Create environment template
cat > $DEPLOY_DIR/.env.production << 'EOF'
# Database Connection (QUAN TRỌNG - cần cập nhật)
DATABASE_URL=postgresql://username:password@host:port/database

# Production Environment
NODE_ENV=production
PORT=3000

# Domain Configuration
DOMAIN=mamnonthaonguyenxanh.com
BASE_URL=https://mamnonthaonguyenxanh.com

# Auto-Update Webhook
WEBHOOK_SECRET=mamnon2025secure
REPLIT_WEBHOOK_URL=https://replit-url.replit.dev/api/deploy-webhook

# SSL and Security
HTTPS_ONLY=true
TRUST_PROXY=true

# Session Security
SESSION_SECRET=mamnon2025session_very_secure_key

# Optional: Email configuration (nếu cần)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=info@mamnonthaonguyenxanh.com
# SMTP_PASS=app_password

# Optional: Analytics
# GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
EOF

# 8. Create deployment script for hosting
cat > $DEPLOY_DIR/deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying Mầm Non Thảo Nguyên Xanh..."

# Create logs directory
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create .env from template if not exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.production .env
    echo "❗ IMPORTANT: Edit .env file with correct DATABASE_URL"
fi

# Start with PM2
echo "🔄 Starting application..."
pm2 delete mamnonthaonguyenxanh 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

echo "✅ Deployment completed!"
echo "🌐 Website: https://mamnonthaonguyenxanh.com"
echo "📊 Monitor: pm2 monit"
echo "📋 Logs: pm2 logs mamnonthaonguyenxanh"
EOF

chmod +x $DEPLOY_DIR/deploy.sh

# 9. Create Nginx configuration
cat > $DEPLOY_DIR/nginx-mamnonthaonguyenxanh.conf << 'EOF'
# Nginx configuration for mamnonthaonguyenxanh.com
server {
    listen 80;
    server_name mamnonthaonguyenxanh.com www.mamnonthaonguyenxanh.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mamnonthaonguyenxanh.com www.mamnonthaonguyenxanh.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/mamnonthaonguyenxanh.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mamnonthaonguyenxanh.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Main proxy to Node.js
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Static files with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Security
    location ~ /\.ht {
        deny all;
    }
    
    # Favicon
    location = /favicon.ico {
        proxy_pass http://localhost:3000;
        expires 1M;
        access_log off;
    }
}
EOF

# 10. Create comprehensive README
cat > $DEPLOY_DIR/README-HOSTING.md << 'EOF'
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
EOF

# 11. Create archive
echo -e "${BLUE}📦 Creating deployment archive...${NC}"
tar -czf "mamnonthaonguyenxanh-official-$TIMESTAMP.tar.gz" -C $DEPLOY_DIR .

# 12. Auto-deploy if FTP credentials available
if [ "$MANUAL_DEPLOY" = false ]; then
    echo -e "${BLUE}📤 Auto-deploying to hosting...${NC}"
    
    REMOTE_DIR=${OFFICIAL_REMOTE_DIR:-"/var/www/html"}
    
    # Create FTP script
    cat > ftp_deploy.sh << EOF
#!/bin/bash
lftp -e "
set ftp:ssl-allow no;
open ftp://$OFFICIAL_FTP_HOST;
user $OFFICIAL_FTP_USER $OFFICIAL_FTP_PASS;
cd $REMOTE_DIR;
mirror -R $DEPLOY_DIR .;
quit;
"
EOF
    
    chmod +x ftp_deploy.sh
    
    if command -v lftp &> /dev/null; then
        ./ftp_deploy.sh
        echo -e "${GREEN}✅ Auto-deploy completed!${NC}"
        
        # Trigger restart webhook
        if [ ! -z "$OFFICIAL_WEBHOOK_URL" ]; then
            echo -e "${BLUE}🔄 Triggering restart...${NC}"
            curl -X POST "$OFFICIAL_WEBHOOK_URL" \
                -H "x-webhook-secret: $WEBHOOK_SECRET" \
                -H "Content-Type: application/json" \
                -d '{"action":"restart","timestamp":"'$TIMESTAMP'"}' \
                --silent --output /dev/null
            echo -e "${GREEN}✅ Restart triggered${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  lftp not available, created FTP script: ftp_deploy.sh${NC}"
    fi
    
    rm -f ftp_deploy.sh
fi

# 13. Summary
echo ""
echo -e "${GREEN}🎉 OFFICIAL DEPLOYMENT PACKAGE READY!${NC}"
echo ""
echo -e "${BLUE}📦 Archive created:${NC} mamnonthaonguyenxanh-official-$TIMESTAMP.tar.gz"
echo -e "${BLUE}📁 Deploy directory:${NC} $DEPLOY_DIR"
echo ""

if [ "$MANUAL_DEPLOY" = true ]; then
    echo -e "${YELLOW}📋 MANUAL STEPS:${NC}"
    echo "1. Download: mamnonthaonguyenxanh-official-$TIMESTAMP.tar.gz"
    echo "2. Send to hosting provider with OFFICIAL-DEPLOYMENT-PACKAGE.md"
    echo "3. They follow setup instructions"
    echo "4. Website live at: https://mamnonthaonguyenxanh.com"
else
    echo -e "${GREEN}✅ AUTO-DEPLOYED TO: https://mamnonthaonguyenxanh.com${NC}"
    echo -e "${BLUE}🔄 Auto-update enabled via webhook${NC}"
fi

echo ""
echo -e "${BLUE}🔗 Important URLs:${NC}"
echo "   Website: https://mamnonthaonguyenxanh.com"
echo "   Admin:   https://mamnonthaonguyenxanh.com/admin/login"
echo "   API:     https://mamnonthaonguyenxanh.com/api/"
echo ""
echo -e "${GREEN}🚀 Ready for production!${NC}"

# Cleanup
rm -rf $DEPLOY_DIR