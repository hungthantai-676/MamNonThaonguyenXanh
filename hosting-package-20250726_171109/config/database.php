<?php
/**
 * Database Configuration for MySQL/MariaDB
 * Optimized for standard hosting providers
 */

// Database configuration
$db_config = [
    'host' => 'localhost', // Usually localhost on shared hosting
    'dbname' => 'mamnon_db', // Database name provided by hosting
    'username' => 'mamnon_user', // Database username
    'password' => 'your_password_here', // Database password
    'charset' => 'utf8mb4',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
];

try {
    $dsn = "mysql:host={$db_config['host']};dbname={$db_config['dbname']};charset={$db_config['charset']}";
    $pdo = new PDO($dsn, $db_config['username'], $db_config['password'], $db_config['options']);
} catch (PDOException $e) {
    // Log error (don't show to users in production)
    error_log("Database connection failed: " . $e->getMessage());
    
    // Show user-friendly message
    die('Hệ thống đang bảo trì. Vui lòng thử lại sau.');
}

/**
 * Execute database query safely
 */
function executeQuery($sql, $params = []) {
    global $pdo;
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        error_log("Query failed: " . $e->getMessage());
        return false;
    }
}

/**
 * Get single record
 */
function getRecord($sql, $params = []) {
    $stmt = executeQuery($sql, $params);
    return $stmt ? $stmt->fetch() : false;
}

/**
 * Get multiple records
 */
function getRecords($sql, $params = []) {
    $stmt = executeQuery($sql, $params);
    return $stmt ? $stmt->fetchAll() : [];
}

/**
 * Insert record and return ID
 */
function insertRecord($sql, $params = []) {
    global $pdo;
    $stmt = executeQuery($sql, $params);
    return $stmt ? $pdo->lastInsertId() : false;
}

/**
 * Update/Delete record and return affected rows
 */
function updateRecord($sql, $params = []) {
    $stmt = executeQuery($sql, $params);
    return $stmt ? $stmt->rowCount() : false;
}