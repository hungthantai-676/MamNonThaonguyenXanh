// Hệ thống đồng bộ từ Replit sang hosting
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class HostingSyncService {
  constructor() {
    this.hostingConfig = {
      // Cập nhật thông tin hosting của bạn
      ftpHost: process.env.HOSTING_FTP_HOST || 'your-hosting-ftp.com',
      ftpUser: process.env.HOSTING_FTP_USER || 'your-username',
      ftpPass: process.env.HOSTING_FTP_PASS || 'your-password',
      remoteDir: process.env.HOSTING_REMOTE_DIR || '/public_html',
    };
  }

  // Build và chuẩn bị files
  async buildForProduction() {
    console.log('🔨 Building for production...');
    
    return new Promise((resolve, reject) => {
      exec('npm run build', (error, stdout, stderr) => {
        if (error) {
          console.error('Build error:', error);
          reject(error);
          return;
        }
        console.log('✅ Build completed');
        resolve(stdout);
      });
    });
  }

  // Tạo package deployment
  async createDeploymentPackage() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const packageName = `deployment-${timestamp}.tar.gz`;
    
    console.log('📦 Creating deployment package...');
    
    // Tạo thư mục temp
    const tempDir = './temp-deployment';
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
    fs.mkdirSync(tempDir);

    // Copy các file cần thiết
    const filesToCopy = [
      { src: 'dist/public', dest: `${tempDir}/public` },
      { src: 'server', dest: `${tempDir}/server` },
      { src: 'shared', dest: `${tempDir}/shared` },
      { src: 'package.json', dest: `${tempDir}/package.json` },
      { src: 'tsconfig.json', dest: `${tempDir}/tsconfig.json` },
    ];

    for (const file of filesToCopy) {
      if (fs.existsSync(file.src)) {
        this.copyRecursive(file.src, file.dest);
      }
    }

    // Tạo production start script
    const startScript = `
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import and register API routes
const { registerRoutes } = require('./server/routes.js');
registerRoutes(app);

// Catch all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});
`;

    fs.writeFileSync(`${tempDir}/start.js`, startScript);

    // Tạo production package.json
    const prodPackage = {
      name: "mam-non-thao-nguyen-xanh",
      version: "1.0.0",
      description: "Vietnamese Preschool Website",
      main: "start.js",
      scripts: {
        start: "node start.js"
      },
      dependencies: {
        "express": "^4.18.2",
        "drizzle-orm": "^0.30.0",
        "@neondatabase/serverless": "^0.9.0",
        "zod": "^3.22.0",
        "uuid": "^9.0.0",
        "qrcode": "^1.5.0",
        "ethers": "^6.7.0",
        "ws": "^8.14.0"
      }
    };

    fs.writeFileSync(`${tempDir}/package.json`, JSON.stringify(prodPackage, null, 2));

    return packageName;
  }

  // Copy files recursively
  copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const files = fs.readdirSync(src);
      for (const file of files) {
        this.copyRecursive(path.join(src, file), path.join(dest, file));
      }
    } else {
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
    }
  }

  // Upload to hosting via FTP (cần cài đặt ftp client)
  async uploadToHosting(packagePath) {
    console.log('📤 Uploading to hosting...');
    
    // Tạo script upload
    const ftpScript = `
#!/bin/bash
echo "🔄 Connecting to hosting server..."
lftp -e "
set ftp:ssl-allow no;
open ftp://${this.hostingConfig.ftpHost};
user ${this.hostingConfig.ftpUser} ${this.hostingConfig.ftpPass};
cd ${this.hostingConfig.remoteDir};
mirror -R temp-deployment .;
quit;
"
echo "✅ Upload completed!"
`;

    fs.writeFileSync('./upload.sh', ftpScript);
    exec('chmod +x upload.sh');
    
    return new Promise((resolve, reject) => {
      exec('./upload.sh', (error, stdout, stderr) => {
        if (error) {
          console.error('Upload error:', error);
          reject(error);
          return;
        }
        console.log('✅ Successfully uploaded to hosting');
        resolve(stdout);
      });
    });
  }

  // Webhook để trigger deployment
  setupWebhook(app) {
    app.post('/api/deploy-webhook', async (req, res) => {
      try {
        console.log('🔔 Deployment webhook triggered');
        
        // Verify secret
        const secret = req.headers['x-webhook-secret'];
        if (secret !== process.env.WEBHOOK_SECRET) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Start deployment
        await this.deployToHosting();
        
        res.json({ 
          success: true, 
          message: 'Deployment started',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Deployment error:', error);
        res.status(500).json({ error: 'Deployment failed' });
      }
    });
  }

  // Main deployment function
  async deployToHosting() {
    try {
      console.log('🚀 Starting deployment...');
      
      // 1. Build for production
      await this.buildForProduction();
      
      // 2. Create deployment package
      const packageName = await this.createDeploymentPackage();
      
      // 3. Upload to hosting
      await this.uploadToHosting(packageName);
      
      // 4. Cleanup
      fs.rmSync('./temp-deployment', { recursive: true, force: true });
      fs.rmSync('./upload.sh', { force: true });
      
      console.log('🎉 Deployment completed successfully!');
      
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      throw error;
    }
  }
}

module.exports = HostingSyncService;