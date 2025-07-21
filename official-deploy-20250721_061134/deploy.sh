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