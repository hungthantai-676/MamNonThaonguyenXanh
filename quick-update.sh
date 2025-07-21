#!/bin/bash

# Script cập nhật nhanh cho hosting
echo "⚡ Quick Update cho hosting..."

# Build frontend mới nhất
echo "🔨 Building frontend..."
npm run build

# Tạo thư mục update
UPDATE_DIR="quick-update-$(date +%Y%m%d_%H%M%S)"
mkdir -p $UPDATE_DIR

# Copy frontend files
echo "📦 Copying frontend files..."
cp -r dist/public $UPDATE_DIR/

# Copy backend files đã thay đổi
echo "📦 Copying backend files..."
cp -r server $UPDATE_DIR/
cp -r shared $UPDATE_DIR/

# Tạo file zip cho download dễ dàng
if command -v zip &> /dev/null; then
    cd $UPDATE_DIR
    zip -r ../update-$(date +%Y%m%d_%H%M%S).zip .
    cd ..
    echo "📦 Tạo file zip: update-$(date +%Y%m%d_%H%M%S).zip"
else
    tar -czf update-$(date +%Y%m%d_%H%M%S).tar.gz -C $UPDATE_DIR .
    echo "📦 Tạo file tar.gz: update-$(date +%Y%m%d_%H%M%S).tar.gz"
fi

# Hướng dẫn cập nhật
echo ""
echo "✅ Files đã sẵn sàng để upload!"
echo ""
echo "🔄 Cách cập nhật trên hosting:"
echo "1. Download file zip/tar.gz từ Replit"
echo "2. Upload lên hosting (overwrite files cũ)"
echo "3. SSH vào hosting và restart:"
echo "   pm2 restart preschool-website"
echo "   # hoặc"
echo "   npm start"
echo ""
echo "📁 Hoặc dùng thư mục: $UPDATE_DIR"
echo "🌐 Upload thẳng lên hosting qua FTP/cPanel"