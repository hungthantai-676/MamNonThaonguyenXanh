#!/bin/bash

# Deploy Package Creator for mamnonthaonguyenxanh.com
# Creates complete hosting package with auto-update capability

echo "🚀 Tạo package triển khai hosting..."

# Create package directory
PACKAGE_DIR="hosting-package-$(date +%Y%m%d_%H%M%S)"
mkdir -p $PACKAGE_DIR

echo "📁 Tạo thư mục: $PACKAGE_DIR"

# Copy PHP application files
echo "📋 Sao chép ứng dụng PHP..."
cp -r php-version/* $PACKAGE_DIR/

# Create deployment configuration
echo "⚙️ Tạo cấu hình triển khai..."

# Database configuration for hosting
cat > $PACKAGE_DIR/config.hosting.php << 'EOF'
<?php
// Hosting Database Configuration
// Thay đổi các thông tin này theo hosting của bạn

define('DB_HOST', 'localhost');          // Thường là localhost
define('DB_NAME', 'your_database_name'); // Tên database trên hosting
define('DB_USER', 'your_db_username');   // Username database
define('DB_PASS', 'your_db_password');   // Password database

// Cập nhật config chính
$configFile = __DIR__ . '/includes/config.php';
$config = file_get_contents($configFile);

// Thay thế Neon database bằng MySQL hosting
$newConfig = '<?php
// Database configuration for hosting
$host = "' . DB_HOST . '";
$dbname = "' . DB_NAME . '";
$username = "' . DB_USER . '";
$password = "' . DB_PASS . '";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

class Database {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function fetch($query, $params = []) {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetch();
    }
    
    public function fetchAll($query, $params = []) {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    public function execute($query, $params = []) {
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute($params);
    }
    
    public function insert($query, $params = []) {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }
    
    public function update($query, $params = []) {
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute($params);
    }
}

function getDB() {
    global $pdo;
    return new Database($pdo);
}
?>';

file_put_contents($configFile, $newConfig);
echo "✅ Database configuration updated for hosting\n";
?>
EOF

# Auto-update webhook system
cat > $PACKAGE_DIR/webhook-update.php << 'EOF'
<?php
// Auto-update webhook from Replit
// URL: https://yourdomain.com/webhook-update.php?secret=your_secret_key

$secret = $_GET['secret'] ?? '';
$validSecret = 'mamnon2025update'; // Thay đổi secret này

if ($secret !== $validSecret) {
    http_response_code(403);
    die('Access denied');
}

// Log update request
$logFile = __DIR__ . '/update-log.txt';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Update request received\n", FILE_APPEND);

// Get update data from Replit
$replitUrl = 'https://mamnonthaonguyenxanh.replit.app/api/get-updates';
$context = stream_context_create([
    'http' => [
        'timeout' => 30,
        'method' => 'GET'
    ]
]);

$updateData = file_get_contents($replitUrl, false, $context);

if ($updateData) {
    // Process updates
    $updates = json_decode($updateData, true);
    
    foreach ($updates as $file => $content) {
        $filePath = __DIR__ . '/' . $file;
        $dir = dirname($filePath);
        
        // Create directory if not exists
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        // Update file
        file_put_contents($filePath, $content);
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Updated: $file\n", FILE_APPEND);
    }
    
    echo json_encode(['success' => true, 'message' => 'Website updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to get updates']);
}
?>
EOF

# Update configuration script
cat > $PACKAGE_DIR/setup-hosting.php << 'EOF'
<?php
// Setup script for hosting configuration
echo "<h2>🏠 Cấu hình Hosting - Mầm Non Thảo Nguyên Xanh</h2>";

if ($_POST['setup'] ?? false) {
    $dbHost = $_POST['db_host'];
    $dbName = $_POST['db_name'];
    $dbUser = $_POST['db_user'];
    $dbPass = $_POST['db_pass'];
    
    // Update config file
    $configContent = "<?php
// Database configuration for hosting
\$host = \"$dbHost\";
\$dbname = \"$dbName\";
\$username = \"$dbUser\";
\$password = \"$dbPass\";

try {
    \$pdo = new PDO(\"mysql:host=\$host;dbname=\$dbname;charset=utf8mb4\", \$username, \$password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException \$e) {
    die(\"Database connection failed: \" . \$e->getMessage());
}

class Database {
    private \$pdo;
    
    public function __construct(\$pdo) {
        \$this->pdo = \$pdo;
    }
    
    public function fetch(\$query, \$params = []) {
        \$stmt = \$this->pdo->prepare(\$query);
        \$stmt->execute(\$params);
        return \$stmt->fetch();
    }
    
    public function fetchAll(\$query, \$params = []) {
        \$stmt = \$this->pdo->prepare(\$query);
        \$stmt->execute(\$params);
        return \$stmt->fetchAll();
    }
    
    public function execute(\$query, \$params = []) {
        \$stmt = \$this->pdo->prepare(\$query);
        return \$stmt->execute(\$params);
    }
    
    public function insert(\$query, \$params = []) {
        \$stmt = \$this->pdo->prepare(\$query);
        \$stmt->execute(\$params);
        return \$this->pdo->lastInsertId();
    }
    
    public function update(\$query, \$params = []) {
        \$stmt = \$this->pdo->prepare(\$query);
        return \$stmt->execute(\$params);
    }
}

function getDB() {
    global \$pdo;
    return new Database(\$pdo);
}
?>";
    
    file_put_contents('includes/config.php', $configContent);
    
    // Test database connection
    try {
        $testPdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
        echo "<div style='color: green; padding: 10px; border: 1px solid green; margin: 10px 0;'>✅ Kết nối database thành công!</div>";
        
        // Import database
        $sqlFile = 'database.sql';
        if (file_exists($sqlFile)) {
            $sql = file_get_contents($sqlFile);
            // Remove CREATE DATABASE statement for hosting
            $sql = preg_replace('/CREATE DATABASE.*?;/i', '', $sql);
            $sql = preg_replace('/USE.*?;/i', '', $sql);
            
            $testPdo->exec($sql);
            echo "<div style='color: green; padding: 10px; border: 1px solid green; margin: 10px 0;'>✅ Database đã được import thành công!</div>";
        }
        
        echo "<div style='color: blue; padding: 10px; border: 1px solid blue; margin: 10px 0;'>🎉 <strong>Cài đặt hoàn tất!</strong><br>
        Website đã sẵn sàng tại: <a href='index.php'>mamnonthaonguyenxanh.com</a><br>
        Admin panel: <a href='admin.php'>admin.php</a> (admin/admin123)</div>";
        
        // Remove setup file for security
        echo "<p><a href='?remove_setup=1' style='color: red;'>🗑️ Xóa file setup này (bảo mật)</a></p>";
        
    } catch (Exception $e) {
        echo "<div style='color: red; padding: 10px; border: 1px solid red; margin: 10px 0;'>❌ Lỗi: " . $e->getMessage() . "</div>";
    }
} elseif ($_GET['remove_setup'] ?? false) {
    unlink(__FILE__);
    echo "<div style='color: green; padding: 20px; text-align: center;'>✅ File setup đã được xóa. Chuyển hướng đến <a href='index.php'>trang chủ</a></div>";
    echo "<script>setTimeout(() => window.location.href = 'index.php', 2000);</script>";
} else {
?>
<form method="POST" style="max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ddd;">
    <h3>Cấu hình Database</h3>
    
    <div style="margin: 10px 0;">
        <label>Database Host:</label><br>
        <input type="text" name="db_host" value="localhost" required style="width: 100%; padding: 5px;">
    </div>
    
    <div style="margin: 10px 0;">
        <label>Database Name:</label><br>
        <input type="text" name="db_name" required style="width: 100%; padding: 5px;">
    </div>
    
    <div style="margin: 10px 0;">
        <label>Username:</label><br>
        <input type="text" name="db_user" required style="width: 100%; padding: 5px;">
    </div>
    
    <div style="margin: 10px 0;">
        <label>Password:</label><br>
        <input type="password" name="db_pass" required style="width: 100%; padding: 5px;">
    </div>
    
    <button type="submit" name="setup" value="1" style="background: #007cba; color: white; padding: 10px 20px; border: none; cursor: pointer;">
        🚀 Cài đặt Website
    </button>
</form>

<div style="max-width: 500px; margin: 20px auto; padding: 15px; background: #f0f8ff; border: 1px solid #007cba;">
    <h4>📋 Hướng dẫn:</h4>
    <ol>
        <li>Tạo database MySQL trên hosting của bạn</li>
        <li>Nhập thông tin database vào form trên</li>
        <li>Nhấn "Cài đặt Website" để hoàn tất</li>
        <li>Website sẽ tự động import database và cấu hình</li>
    </ol>
</div>
<?php } ?>
EOF

# Create README for hosting
cat > $PACKAGE_DIR/README-HOSTING.md << 'EOF'
# 🏠 Hướng dẫn Triển khai Hosting - Mầm Non Thảo Nguyên Xanh

## 📋 Bước 1: Upload Files
1. Upload tất cả files trong thư mục này lên hosting
2. Đảm bảo file `index.php` ở thư mục gốc của domain

## 🗄️ Bước 2: Cấu hình Database
1. Tạo database MySQL trên hosting (UTF8MB4)
2. Truy cập: `https://yourdomain.com/setup-hosting.php`
3. Nhập thông tin database và nhấn "Cài đặt Website"

## 🔗 Bước 3: Cấu hình Auto-Update từ Replit
1. Webhook URL: `https://yourdomain.com/webhook-update.php?secret=mamnon2025update`
2. Khi cập nhật trên Replit, gọi URL này để đồng bộ

## 🎯 Truy cập Website
- **Trang chủ**: https://yourdomain.com
- **Admin**: https://yourdomain.com/admin.php
  - Username: `admin`
  - Password: `admin123`

## 📞 Thông tin liên hệ
- **Trường**: Mầm Non Thảo Nguyên Xanh
- **Địa chỉ**: 123 Đường ABC, Quận XYZ, TP.HCM
- **Điện thoại**: 0123 456 789
- **Email**: contact@mamnonthaonguyenxanh.com

## 🔧 Cấu hình Hosting Đề xuất
- **PHP**: 7.4+ hoặc 8.0+
- **MySQL**: 5.7+ hoặc MariaDB 10.3+
- **Dung lượng**: Tối thiểu 100MB
- **Bandwidth**: Tối thiểu 1GB/tháng

## 🆘 Hỗ trợ
Nếu cần hỗ trợ, liên hệ qua Replit hoặc email hỗ trợ.
EOF

# Create update sync script for Replit side
cat > update-replit-sync.php << 'EOF'
<?php
// Sync script - Add this to Replit to push updates to hosting
// URL: /api/push-to-hosting

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $hostingUrl = 'https://mamnonthaonguyenxanh.com/webhook-update.php?secret=mamnon2025update';
    
    // Get changed files
    $changedFiles = [
        'index.php' => file_get_contents('php-version/index.php'),
        'admin.php' => file_get_contents('php-version/admin.php'),
        'admin_affiliate.php' => file_get_contents('php-version/admin_affiliate.php'),
        // Add more files as needed
    ];
    
    // Send update to hosting
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($changedFiles)
        ]
    ]);
    
    $result = file_get_contents($hostingUrl, false, $context);
    
    header('Content-Type: application/json');
    echo $result ?: json_encode(['success' => false, 'message' => 'Failed to sync']);
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'POST method required']);
}
?>
EOF

# Create htaccess for hosting
cat > $PACKAGE_DIR/.htaccess << 'EOF'
# Apache configuration for mamnonthaonguyenxanh.com
RewriteEngine On

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options SAMEORIGIN
Header always set X-XSS-Protection "1; mode=block"

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Gzip compression
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

# Hide sensitive files
<Files "database.sql">
    Order Allow,Deny
    Deny from all
</Files>

<Files "config.hosting.php">
    Order Allow,Deny
    Deny from all
</Files>

<Files "*.log">
    Order Allow,Deny
    Deny from all
</Files>

# Pretty URLs (if needed)
# RewriteCond %{REQUEST_FILENAME} !-f
# RewriteCond %{REQUEST_FILENAME} !-d
# RewriteRule ^([^/]+)/?$ index.php?page=$1 [L,QSA]
EOF

# Create auto-update button for admin
cat > $PACKAGE_DIR/admin-update-button.php << 'EOF'
<!-- Add this to admin panel for manual sync -->
<div class="card mt-3">
    <div class="card-header">
        <h5>🔄 Đồng bộ từ Replit</h5>
    </div>
    <div class="card-body">
        <p>Cập nhật website từ phiên bản mới nhất trên Replit.com</p>
        <button class="btn btn-primary" onclick="syncFromReplit()">
            <i class="fas fa-sync"></i> Đồng bộ ngay
        </button>
        <div id="sync-status" class="mt-2"></div>
    </div>
</div>

<script>
function syncFromReplit() {
    const button = event.target;
    const status = document.getElementById('sync-status');
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đồng bộ...';
    
    fetch('webhook-update.php?secret=mamnon2025update')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                status.innerHTML = '<div class="alert alert-success">✅ Đồng bộ thành công!</div>';
                setTimeout(() => location.reload(), 2000);
            } else {
                status.innerHTML = '<div class="alert alert-danger">❌ Lỗi: ' + data.message + '</div>';
            }
        })
        .catch(error => {
            status.innerHTML = '<div class="alert alert-danger">❌ Lỗi kết nối: ' + error + '</div>';
        })
        .finally(() => {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-sync"></i> Đồng bộ ngay';
        });
}
</script>
EOF

# Package compression
echo "📦 Nén package..."
tar -czf "${PACKAGE_DIR}.tar.gz" "$PACKAGE_DIR"
zip -r "${PACKAGE_DIR}.zip" "$PACKAGE_DIR"

echo "✅ Package hosting đã được tạo:"
echo "📁 Thư mục: $PACKAGE_DIR"
echo "📦 File nén: ${PACKAGE_DIR}.tar.gz và ${PACKAGE_DIR}.zip"
echo ""
echo "🚀 Hướng dẫn triển khai:"
echo "1. Upload package lên hosting"
echo "2. Giải nén và chạy setup-hosting.php"
echo "3. Cấu hình database"
echo "4. Website sẵn sàng với tính năng tự động cập nhật!"
echo ""
echo "🔄 Webhook URL cho auto-update:"
echo "https://yourdomain.com/webhook-update.php?secret=mamnon2025update"
EOF