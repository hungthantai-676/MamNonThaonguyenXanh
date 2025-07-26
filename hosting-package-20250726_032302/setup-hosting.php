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
