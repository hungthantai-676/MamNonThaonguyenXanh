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
