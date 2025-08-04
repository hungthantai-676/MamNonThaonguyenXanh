#!/bin/bash

echo "Building React app for hosting deployment..."

# Build the React app
npm run build

# Create hosting directory
rm -rf hosting-ready
mkdir -p hosting-ready

# Copy built files
cp -r client/dist/* hosting-ready/

# Create .htaccess for SPA routing
cat > hosting-ready/.htaccess << 'EOF'
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/html "access plus 0 seconds"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
</IfModule>
EOF

# Create deployment package
cd hosting-ready
tar -czf ../hosting-package-$(date +%Y%m%d_%H%M%S).tar.gz *
cd ..

echo "Hosting package created successfully!"
ls -la hosting-package-*.tar.gz | tail -1