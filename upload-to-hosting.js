#!/usr/bin/env node

// Script upload trực tiếp lên hosting qua Git push hoặc FTP
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Upload website lên hosting...');

// Tạo package cuối cùng với cấu hình chính xác
function createFinalPackage() {
    const packagePath = path.join(__dirname, 'final-hosting-package');
    
    if (!fs.existsSync(packagePath)) {
        fs.mkdirSync(packagePath, { recursive: true });
    }
    
    // Copy index.html từ dist
    const distIndex = path.join(__dirname, 'dist', 'public', 'index.html');
    if (fs.existsSync(distIndex)) {
        fs.copyFileSync(distIndex, path.join(packagePath, 'index.html'));
        console.log('✅ Copied index.html');
    }
    
    // Copy assets
    const assetsSource = path.join(__dirname, 'dist', 'public', 'assets');
    const assetsTarget = path.join(packagePath, 'assets');
    
    if (fs.existsSync(assetsSource)) {
        if (!fs.existsSync(assetsTarget)) {
            fs.mkdirSync(assetsTarget, { recursive: true });
        }
        
        const files = fs.readdirSync(assetsSource);
        files.forEach(file => {
            fs.copyFileSync(
                path.join(assetsSource, file),
                path.join(assetsTarget, file)
            );
        });
        console.log(`✅ Copied ${files.length} asset files`);
    }
    
    // Tạo .htaccess mạnh mẽ hơn
    const htaccessContent = `# Enable URL Rewriting
RewriteEngine On

# Handle Angular and React Router
# If the requested resource doesn't exist as a file or directory
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Rewrite everything else to index.html to allow HTML5 state links
RewriteRule . index.html [L]

# Force HTTPS (if available)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css  
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Custom 404 fallback for SPA
ErrorDocument 404 /index.html

# Disable directory browsing
Options -Indexes`;
    
    fs.writeFileSync(path.join(packagePath, '.htaccess'), htaccessContent);
    console.log('✅ Created enhanced .htaccess');
    
    // Tạo index.php fallback cho hosting PHP
    const phpFallback = `<?php
// PHP fallback for React SPA routing
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Check if requesting an asset file
if (preg_match('/\\.(js|css|png|jpg|jpeg|gif|ico|svg)$/', $path)) {
    // Let server handle static files normally
    return false;
}

// For all other requests, serve index.html
$index_file = __DIR__ . '/index.html';
if (file_exists($index_file)) {
    // Set proper content type
    header('Content-Type: text/html; charset=UTF-8');
    readfile($index_file);
    exit;
}

// If index.html not found, show 404
http_response_code(404);
echo "Website not found. Please check deployment.";
?>`;
    
    fs.writeFileSync(path.join(packagePath, 'index.php'), phpFallback);
    console.log('✅ Created PHP fallback');
    
    // Tạo hướng dẫn deployment
    const instructions = `# 🚀 HƯỚNG DẪN DEPLOYMENT CUỐI CÙNG

## Files trong package này:
- index.html - React SPA entry point
- assets/ - JS, CSS và image files  
- .htaccess - Apache URL rewriting (quan trọng!)
- index.php - PHP fallback cho SPA routing

## Cách deploy:

### Option 1: Upload qua hosting File Manager
1. Đăng nhập hosting control panel
2. Vào File Manager
3. Upload tất cả files vào thư mục public_html/ (hoặc domain root)
4. Đảm bảo .htaccess có permission 644
5. Test website

### Option 2: Git deployment (nếu hosting support)
1. Commit và push tất cả files
2. Trong hosting panel, sync từ Git repository
3. Đảm bảo deploy vào correct directory

## Test checklist:
- [ ] https://mamnonthaonguyenxanh.com loads homepage
- [ ] https://mamnonthaonguyenxanh.com/affiliate-login loads (không 404)
- [ ] https://mamnonthaonguyenxanh.com/affiliate-register loads
- [ ] Browser console không có JS errors
- [ ] CSS styling hoạt động correct

## Troubleshooting:
1. **Vẫn 404**: Check .htaccess có được upload không và có permission đúng
2. **CSS/JS không load**: Check paths trong index.html và assets/ folder
3. **Routing không hoạt động**: Verify Apache mod_rewrite enabled trên hosting
4. **PHP errors**: Hosting có thể không support PHP fallback

Created: ${new Date().toISOString()}
`;
    
    fs.writeFileSync(path.join(packagePath, 'DEPLOYMENT-GUIDE.md'), instructions);
    
    return packagePath;
}

// Commit to Git if possible
async function commitToGit(packagePath) {
    try {
        console.log('🔄 Committing to Git...');
        
        // Copy files to root for git commit
        const files = ['index.html', '.htaccess', 'index.php'];
        files.forEach(file => {
            const source = path.join(packagePath, file);
            if (fs.existsSync(source)) {
                fs.copyFileSync(source, path.join(__dirname, file));
            }
        });
        
        // Copy assets  
        const assetsSource = path.join(packagePath, 'assets');
        const assetsTarget = path.join(__dirname, 'assets');
        
        if (fs.existsSync(assetsSource)) {
            if (fs.existsSync(assetsTarget)) {
                fs.rmSync(assetsTarget, { recursive: true });
            }
            fs.cpSync(assetsSource, assetsTarget, { recursive: true });
        }
        
        await execAsync('git add .');
        await execAsync('git commit -m "Deploy: Updated website with affiliate system fixes"');
        
        console.log('✅ Committed to Git');
        return true;
    } catch (error) {
        console.log('⚠️ Git commit failed:', error.message);
        return false;
    }
}

// Main execution
async function main() {
    try {
        console.log('📦 Creating final hosting package...');
        const packagePath = createFinalPackage();
        
        console.log('📁 Git integration...');
        const gitSuccess = await commitToGit(packagePath);
        
        console.log('');
        console.log('🎉 Deployment package ready!');
        console.log('📁 Package location:', packagePath);
        
        if (gitSuccess) {
            console.log('✅ Files committed to Git - ready for hosting Git sync');
        }
        
        console.log('');
        console.log('📋 Manual upload steps:');
        console.log('1. Zip the final-hosting-package/ folder');
        console.log('2. Upload via hosting File Manager to domain root');
        console.log('3. Extract and verify .htaccess permissions');
        console.log('4. Test https://mamnonthaonguyenxanh.com/affiliate-login');
        
        console.log('');
        console.log('🔧 Hosting panel Vite Deploy settings:');
        console.log('- Build command: npm run build');
        console.log('- Output directory: dist/public');
        console.log('- Install command: npm install');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}