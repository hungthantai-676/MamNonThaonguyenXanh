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
