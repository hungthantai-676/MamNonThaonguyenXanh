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
