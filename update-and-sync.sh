#!/bin/bash

echo "🔄 Starting update and sync process..."

# Build the React app
echo "📦 Building React application..."
cd client
npm run build
cd ..

# Copy built files to vite-deploy-ready
echo "📁 Copying files to deployment directory..."
cp -r client/dist/* vite-deploy-ready/

# Create deployment package
echo "🗜️ Creating deployment package..."
cd vite-deploy-ready
tar -czf ../hosting-package-$(date +%Y%m%d_%H%M%S).tar.gz *
cd ..

# Git operations
echo "📤 Syncing with Git repository..."
git add .
git commit -m "Fix affiliate login cookie handling and update deployment"

# Try to push to remote
echo "🚀 Pushing to remote repository..."
if git push origin main; then
    echo "✅ Successfully pushed to GitHub"
else
    echo "⚠️  Git push failed - authentication issue"
    echo "📦 Manual upload package is ready: hosting-package-*.tar.gz"
fi

echo "✅ Update and sync process completed!"