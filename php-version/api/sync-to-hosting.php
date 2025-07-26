<?php
// API endpoint để đồng bộ từ Replit sang hosting
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $hostingUrl = 'https://mamnonthaonguyenxanh.com/webhook-update.php?secret=mamnon2025update';
    
    // Lấy danh sách files cần đồng bộ
    $filesToSync = [
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
    
    $updateData = [];
    $rootPath = dirname(__DIR__) . '/';
    
    foreach ($filesToSync as $file) {
        $fullPath = $rootPath . $file;
        if (file_exists($fullPath)) {
            $updateData[$file] = file_get_contents($fullPath);
        }
    }
    
    // Gửi dữ liệu cập nhật
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($updateData),
            'timeout' => 30
        ]
    ]);
    
    $result = @file_get_contents($hostingUrl, false, $context);
    
    if ($result) {
        $response = json_decode($result, true);
        echo json_encode([
            'success' => true,
            'message' => 'Đã đồng bộ ' . count($updateData) . ' files thành công',
            'files_synced' => count($updateData),
            'hosting_response' => $response
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Không thể kết nối với hosting để đồng bộ',
            'files_prepared' => count($updateData)
        ]);
    }
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Chỉ chấp nhận POST method'
    ]);
}
?>