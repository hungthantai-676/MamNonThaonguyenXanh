// Direct sync to hosting - Bypass API approach
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Direct file sync to hosting...');

// Tạo package static website
function createStaticWebsite() {
    const distPath = path.join(__dirname, 'dist');
    const outputPath = path.join(__dirname, 'hosting-ready');
    
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
    
    // Copy HTML file
    const indexPath = path.join(distPath, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Update asset paths to current built files
        const assetsPath = path.join(distPath, 'public', 'assets');
        if (fs.existsSync(assetsPath)) {
            const assetFiles = fs.readdirSync(assetsPath);
            
            assetFiles.forEach(file => {
                if (file.endsWith('.js')) {
                    indexContent = indexContent.replace(/\/assets\/index-[^"']+\.js/g, `/assets/${file}`);
                }
                if (file.endsWith('.css')) {
                    indexContent = indexContent.replace(/\/assets\/index-[^"']+\.css/g, `/assets/${file}`);
                }
            });
        }
        
        fs.writeFileSync(path.join(outputPath, 'index.html'), indexContent);
        console.log('✅ HTML file updated with correct asset paths');
    }
    
    // Copy assets folder
    const assetsSource = path.join(distPath, 'public', 'assets');
    const assetsTarget = path.join(outputPath, 'assets');
    
    if (fs.existsSync(assetsSource)) {
        if (!fs.existsSync(assetsTarget)) {
            fs.mkdirSync(assetsTarget, { recursive: true });
        }
        
        const assetFiles = fs.readdirSync(assetsSource);
        assetFiles.forEach(file => {
            const sourcePath = path.join(assetsSource, file);
            const targetPath = path.join(assetsTarget, file);
            fs.copyFileSync(sourcePath, targetPath);
        });
        
        console.log(`✅ Copied ${assetFiles.length} asset files`);
    }
    
    // Create simple .htaccess for SPA routing
    const htaccessContent = `RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
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

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>`;
    
    fs.writeFileSync(path.join(outputPath, '.htaccess'), htaccessContent);
    console.log('✅ .htaccess created for SPA routing');
    
    // Create deployment instructions
    const instructions = `# 📋 Hướng dẫn deploy lên hosting

## Files cần upload:
- index.html (trang chính)
- assets/ (folder chứa CSS, JS)
- .htaccess (cấu hình routing)

## Cách deploy:
1. Upload tất cả files trong folder này lên thư mục gốc của domain
2. Đảm bảo file .htaccess được upload và có permission 644
3. Test website tại: https://mamnonthaonguyenxanh.com

## Lưu ý:
- Website này là Single Page Application (SPA)
- .htaccess đảm bảo tất cả routes đều trỏ về index.html
- Static files được cache 1 năm để tăng tốc

## Troubleshooting:
- Nếu routes không hoạt động, kiểm tra .htaccess
- Nếu assets không load, kiểm tra paths trong index.html
- Nếu cần API endpoints, phải thêm backend PHP/Node.js

Created: ${new Date().toISOString()}
`;
    
    fs.writeFileSync(path.join(outputPath, 'DEPLOY-INSTRUCTIONS.md'), instructions);
    
    return outputPath;
}

// Main execution
try {
    const outputDir = createStaticWebsite();
    
    console.log('');
    console.log('🎉 Hosting package ready!');
    console.log(`📁 Location: ${outputDir}`);
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Compress the hosting-ready folder to .zip');
    console.log('2. Upload to mamnonthaonguyenxanh.com hosting panel');
    console.log('3. Extract to domain root directory');  
    console.log('4. Test website functionality');
    console.log('');
    console.log('🌐 Expected URL: https://mamnonthaonguyenxanh.com');
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}