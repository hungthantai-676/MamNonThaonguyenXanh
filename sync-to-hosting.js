// Node.js service để tự động đồng bộ từ Replit sang hosting
// Chạy: node sync-to-hosting.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
app.use(express.json());

// Cấu hình
const CONFIG = {
    port: 3001,
    hostingUrl: 'https://mamnonthaonguyenxanh.com/webhook-update.php?secret=mamnon2025update',
    watchPaths: [
        'php-version'
    ],
    syncInterval: 60000, // 1 phút
    logFile: 'sync-log.txt'
};

// Log function
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(CONFIG.logFile, logMessage);
}

// Lấy danh sách files cần đồng bộ
function getFilesToSync() {
    const files = [];
    const phpVersionPath = path.join(__dirname, 'php-version');
    
    // Danh sách files quan trọng
    const importantFiles = [
        'index.php',
        'admin.php',
        'admin_affiliate.php',
        'pages/home.php',
        'pages/about.php',
        'pages/programs.php',
        'pages/activities.php',
        'pages/parents.php',
        'pages/admission.php',
        'pages/news.php',
        'pages/contact.php',
        'pages/affiliate_dashboard.php',
        'pages/affiliate_register.php',
        'includes/functions.php',
        'includes/affiliate_functions.php',
        'includes/header.php',
        'includes/footer.php',
        'admin/affiliate_overview.php',
        'admin/affiliate_members.php',
        'admin/affiliate_referrals.php',
        'ajax/affiliate_actions.php',
        'ajax/admin_actions.php',
        'assets/css/style.css',
        'assets/js/admin.js'
    ];
    
    importantFiles.forEach(file => {
        const fullPath = path.join(phpVersionPath, file);
        if (fs.existsSync(fullPath)) {
            files.push({
                relativePath: file,
                fullPath: fullPath,
                lastModified: fs.statSync(fullPath).mtime
            });
        }
    });
    
    return files;
}

// Đọc nội dung files
function getFileContents() {
    const files = getFilesToSync();
    const contents = {};
    
    files.forEach(file => {
        try {
            contents[file.relativePath] = fs.readFileSync(file.fullPath, 'utf8');
        } catch (error) {
            log(`Error reading file ${file.relativePath}: ${error.message}`);
        }
    });
    
    return contents;
}

// Gửi update lên hosting
function sendUpdateToHosting(fileContents) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(fileContents);
        const url = new URL(CONFIG.hostingUrl);
        
        const options = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 30000
        };
        
        const client = url.protocol === 'https:' ? https : http;
        
        const req = client.request(options, (res) => {
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

// Kiểm tra và đồng bộ
async function checkAndSync() {
    try {
        log('Checking for updates...');
        
        const fileContents = getFileContents();
        const fileCount = Object.keys(fileContents).length;
        
        if (fileCount === 0) {
            log('No files to sync');
            return;
        }
        
        log(`Syncing ${fileCount} files to hosting...`);
        
        const result = await sendUpdateToHosting(fileContents);
        
        if (result.success) {
            log(`✅ Sync successful: ${result.message}`);
        } else {
            log(`❌ Sync failed: ${result.message}`);
        }
        
    } catch (error) {
        log(`❌ Sync error: ${error.message}`);
    }
}

// API endpoints
app.post('/sync', async (req, res) => {
    try {
        await checkAndSync();
        res.json({ success: true, message: 'Sync completed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/status', (req, res) => {
    const files = getFilesToSync();
    res.json({
        success: true,
        filesCount: files.length,
        lastSync: fs.existsSync(CONFIG.logFile) ? 
            fs.readFileSync(CONFIG.logFile, 'utf8').split('\n').slice(-5) : [],
        config: {
            syncInterval: CONFIG.syncInterval,
            hostingUrl: CONFIG.hostingUrl
        }
    });
});

app.get('/logs', (req, res) => {
    if (fs.existsSync(CONFIG.logFile)) {
        const logs = fs.readFileSync(CONFIG.logFile, 'utf8').split('\n').slice(-50);
        res.json({ success: true, logs: logs.filter(log => log.trim()) });
    } else {
        res.json({ success: true, logs: [] });
    }
});

// Web interface
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Mầm Non Thảo Nguyên Xanh - Auto Sync</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .card { border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 5px; }
        .success { color: green; } .error { color: red; }
        button { background: #007cba; color: white; padding: 10px 20px; border: none; cursor: pointer; margin: 5px; }
        .logs { background: #f5f5f5; padding: 10px; height: 300px; overflow-y: scroll; font-family: monospace; }
        .status { display: inline-block; padding: 5px 10px; border-radius: 3px; margin: 5px; }
        .status.active { background: #28a745; color: white; }
    </style>
</head>
<body>
    <h1>🚀 Auto Sync - Mầm Non Thảo Nguyên Xanh</h1>
    
    <div class="card">
        <h3>📊 Trạng thái hệ thống</h3>
        <div class="status active">🟢 Đang hoạt động</div>
        <p><strong>Hosting URL:</strong> ${CONFIG.hostingUrl}</p>
        <p><strong>Tần suất sync:</strong> ${CONFIG.syncInterval / 1000} giây</p>
    </div>
    
    <div class="card">
        <h3>🔄 Điều khiển</h3>
        <button onclick="manualSync()">Đồng bộ ngay</button>
        <button onclick="loadStatus()">Làm mới trạng thái</button>
        <button onclick="loadLogs()">Tải logs</button>
        <div id="sync-result"></div>
    </div>
    
    <div class="card">
        <h3>📋 Files đang theo dõi</h3>
        <div id="files-status">Đang tải...</div>
    </div>
    
    <div class="card">
        <h3>📝 Logs gần đây</h3>
        <div id="logs" class="logs">Đang tải logs...</div>
    </div>
    
    <script>
        function manualSync() {
            document.getElementById('sync-result').innerHTML = '<div style="color: blue;">⏳ Đang đồng bộ...</div>';
            fetch('/sync', { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                    const status = data.success ? 'success' : 'error';
                    document.getElementById('sync-result').innerHTML = 
                        '<div class="' + status + '">' + (data.success ? '✅' : '❌') + ' ' + data.message + '</div>';
                    if (data.success) loadLogs();
                });
        }
        
        function loadStatus() {
            fetch('/status')
                .then(r => r.json())
                .then(data => {
                    document.getElementById('files-status').innerHTML = 
                        '<p><strong>Số files:</strong> ' + data.filesCount + '</p>';
                });
        }
        
        function loadLogs() {
            fetch('/logs')
                .then(r => r.json())
                .then(data => {
                    document.getElementById('logs').innerHTML = data.logs.join('\\n');
                    document.getElementById('logs').scrollTop = document.getElementById('logs').scrollHeight;
                });
        }
        
        // Load initial data
        loadStatus();
        loadLogs();
        
        // Auto refresh logs every 30 seconds
        setInterval(loadLogs, 30000);
    </script>
</body>
</html>
    `);
});

// Khởi chạy server
app.listen(CONFIG.port, () => {
    log(`🚀 Auto-sync service started on port ${CONFIG.port}`);
    log(`📊 Dashboard: http://localhost:${CONFIG.port}`);
    log(`🔄 Sync interval: ${CONFIG.syncInterval / 1000} seconds`);
    
    // Chạy sync định kỳ
    setInterval(checkAndSync, CONFIG.syncInterval);
    
    // Sync ngay khi khởi động
    setTimeout(checkAndSync, 5000);
});

// Graceful shutdown
process.on('SIGINT', () => {
    log('🛑 Auto-sync service stopping...');
    process.exit(0);
});

module.exports = app;