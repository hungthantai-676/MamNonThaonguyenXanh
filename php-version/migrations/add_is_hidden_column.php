<?php
// Migration: Add is_hidden column to affiliate_members table
require_once '../config/database.php';

try {
    $db = getDB();
    
    // Check if column already exists
    $stmt = $db->prepare("SHOW COLUMNS FROM affiliate_members LIKE 'is_hidden'");
    $stmt->execute();
    $columnExists = $stmt->fetch();
    
    if (!$columnExists) {
        // Add is_hidden column
        $db->exec("ALTER TABLE affiliate_members ADD COLUMN is_hidden TINYINT(1) DEFAULT 0 AFTER status");
        echo "✅ Added is_hidden column to affiliate_members table successfully!\n";
    } else {
        echo "ℹ️ Column is_hidden already exists in affiliate_members table.\n";
    }
    
    // Update existing records to ensure they have is_hidden = 0
    $updateStmt = $db->prepare("UPDATE affiliate_members SET is_hidden = 0 WHERE is_hidden IS NULL");
    $updateStmt->execute();
    $updatedRows = $updateStmt->rowCount();
    
    if ($updatedRows > 0) {
        echo "✅ Updated $updatedRows existing records to set is_hidden = 0\n";
    }
    
    echo "✅ Migration completed successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>