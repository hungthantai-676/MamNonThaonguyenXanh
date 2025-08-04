#!/usr/bin/env node

// Script đồng bộ ngay lập tức lên mamnonthaonguyenxanh.com
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Bắt đầu đồng bộ code lên mamnonthaonguyenxanh.com...');

// Cấu hình
const HOSTING_API = 'https://mamnonthaonguyenxanh.com/api/webhook-update.php';
const SECRET_KEY = 'mamnon2025update';

// Lấy nội dung các files React đã build
function getDistFiles() {
    const distPath = path.join(__dirname, 'dist');
    const files = {};
    
    try {
        // Index.html
        const indexPath = path.join(distPath, 'public', 'index.html');
        if (fs.existsSync(indexPath)) {
            files['index.html'] = fs.readFileSync(indexPath, 'utf8');
        }
        
        // Assets folder
        const assetsPath = path.join(distPath, 'public', 'assets');
        if (fs.existsSync(assetsPath)) {
            const assetFiles = fs.readdirSync(assetsPath);
            assetFiles.forEach(file => {
                const filePath = path.join(assetsPath, file);
                if (fs.statSync(filePath).isFile()) {
                    if (file.endsWith('.js') || file.endsWith('.css')) {
                        files[`assets/${file}`] = fs.readFileSync(filePath, 'utf8');
                    }
                }
            });
        }
        
        // Server files
        const serverPath = path.join(distPath, 'index.js');
        if (fs.existsSync(serverPath)) {
            files['server.js'] = fs.readFileSync(serverPath, 'utf8');
        }
        
    } catch (error) {
        console.error('❌ Error reading dist files:', error.message);
        return null;
    }
    
    return files;
}

// Gửi files lên hosting
function uploadFiles(files) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            action: 'full_update',
            secret: SECRET_KEY,
            files: files,
            timestamp: new Date().toISOString()
        });
        
        const options = {
            hostname: 'mamnonthaonguyenxanh.com',
            port: 443,
            path: '/api/webhook-update.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Replit-Sync/1.0'
            },
            timeout: 60000
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (error) {
                    resolve({ success: false, message: 'Invalid JSON response', raw: data });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.write(postData);
        req.end();
    });
}

// Main execution
async function main() {
    try {
        console.log('📦 Đọc files từ dist folder...');
        const files = getDistFiles();
        
        if (!files || Object.keys(files).length === 0) {
            console.error('❌ Không tìm thấy files để đồng bộ. Vui lòng chạy npm run build trước.');
            process.exit(1);
        }
        
        console.log(`📤 Đồng bộ ${Object.keys(files).length} files...`);
        console.log('Files:', Object.keys(files));
        
        const result = await uploadFiles(files);
        
        if (result.success) {
            console.log('✅ Đồng bộ thành công!');
            console.log('🌐 Website đã được cập nhật: https://mamnonthaonguyenxanh.com');
            console.log('📋 Message:', result.message);
        } else {
            console.error('❌ Đồng bộ thất bại:', result.message);
            if (result.raw) {
                console.error('Raw response:', result.raw);
            }
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { uploadFiles, getDistFiles };