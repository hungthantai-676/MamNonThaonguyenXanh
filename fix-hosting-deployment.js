#!/usr/bin/env node

// Script để sửa deployment lên hosting với Vite Deploy module
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Sửa deployment cho hosting Vite Deploy module...');

// Tạo structure tương thích với Vite Deploy
function createViteDeployStructure() {
    const outputPath = path.join(__dirname, 'vite-deploy-ready');
    
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
    
    // Copy package.json cho Vite Deploy
    fs.copyFileSync(
        path.join(__dirname, 'hosting-vite-deploy-package.json'),
        path.join(outputPath, 'package.json')
    );
    
    // Copy built files
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        // Copy public assets
        const publicSource = path.join(distPath, 'public');
        const publicTarget = path.join(outputPath, 'public');
        
        if (fs.existsSync(publicSource)) {
            copyDirectorySync(publicSource, publicTarget);
        }
        
        // Copy server files
        const serverSource = path.join(distPath, 'index.js');
        if (fs.existsSync(serverSource)) {
            fs.copyFileSync(serverSource, path.join(outputPath, 'server.js'));
        }
    }
    
    // Create .gitignore
    const gitignoreContent = `node_modules/
.env
.env.local
*.log
dist/
.cache/
`;
    fs.writeFileSync(path.join(outputPath, '.gitignore'), gitignoreContent);
    
    // Create deployment script
    const deployScript = `#!/bin/bash
# Auto deployment script for Vite Deploy hosting
npm install
npm run build
npm start
`;
    fs.writeFileSync(path.join(outputPath, 'deploy.sh'), deployScript);
    fs.chmodSync(path.join(outputPath, 'deploy.sh'), 0o755);
    
    // Create .env example
    const envExample = `# Database connection
DATABASE_URL=postgresql://username:password@host:port/database

# Environment
NODE_ENV=production
PORT=3000

# Application settings
SESSION_SECRET=your-session-secret-here
`;
    fs.writeFileSync(path.join(outputPath, '.env.example'), envExample);
    
    return outputPath;
}

// Copy directory recursively
function copyDirectorySync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectorySync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Test hosting connectivity
async function testHostingConnection() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'mamnonthaonguyenxanh.com',
            port: 443,
            path: '/',
            method: 'HEAD',
            timeout: 10000
        };
        
        const req = https.request(options, (res) => {
            resolve({
                success: true,
                statusCode: res.statusCode,
                headers: res.headers
            });
        });
        
        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Connection timeout'
            });
        });
        
        req.end();
    });
}

// Main execution
async function main() {
    try {
        console.log('📡 Testing hosting connection...');
        const connectionTest = await testHostingConnection();
        
        if (connectionTest.success) {
            console.log(`✅ Hosting accessible (Status: ${connectionTest.statusCode})`);
            console.log(`🌐 Server: ${connectionTest.headers.server || 'Unknown'}`);
        } else {
            console.log(`❌ Connection failed: ${connectionTest.error}`);
        }
        
        console.log('📦 Creating Vite Deploy compatible structure...');
        const outputDir = createViteDeployStructure();
        
        console.log('');
        console.log('🎉 Vite Deploy package ready!');
        console.log(`📁 Location: ${outputDir}`);
        console.log('');
        console.log('📋 Instructions for hosting panel:');
        console.log('1. Upload all files from vite-deploy-ready/ to hosting');
        console.log('2. In hosting Vite Deploy panel:');
        console.log('   - Set build command: npm run build');
        console.log('   - Set start command: npm start');
        console.log('   - Set port: 3000 (or hosting default)');
        console.log('3. Configure environment variables in hosting panel');
        console.log('4. Deploy and test');
        console.log('');
        console.log('🔍 Debug steps if still 404:');
        console.log('- Check hosting logs for build errors');
        console.log('- Verify .htaccess or nginx config for SPA routing');
        console.log('- Test direct asset URLs first');
        console.log('- Check if PORT environment variable is set correctly');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { createViteDeployStructure };