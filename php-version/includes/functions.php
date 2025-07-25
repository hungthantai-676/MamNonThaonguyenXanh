<?php
require_once 'config/database.php';

// Page titles and descriptions
function getPageTitle($page) {
    $titles = [
        'home' => 'Trang chủ',
        'about' => 'Giới thiệu',
        'programs' => 'Chương trình học',
        'activities' => 'Hoạt động',
        'parents' => 'Dành cho phụ huynh',
        'admission' => 'Tuyển sinh',
        'news' => 'Tin tức',
        'contact' => 'Liên hệ',
        'admin' => 'Quản trị hệ thống'
    ];
    return $titles[$page] ?? 'Mầm Non Thảo Nguyên Xanh';
}

function getPageDescription($page) {
    $descriptions = [
        'home' => 'Mầm non Thảo Nguyên Xanh - Nơi ươm mầm tri thức, nuôi dưỡng tâm hồn cho trẻ em.',
        'about' => 'Tìm hiểu về lịch sử, sứ mệnh và đội ngũ giáo viên tại Mầm non Thảo Nguyên Xanh.',
        'programs' => 'Các chương trình giáo dục hiện đại và phù hợp cho từng lứa tuổi.',
        'activities' => 'Hoạt động ngoại khóa phong phú giúp trẻ phát triển toàn diện.',
        'parents' => 'Thông tin hữu ích và tài liệu tham khảo dành cho phụ huynh.',
        'admission' => 'Thông tin tuyển sinh và quy trình đăng ký học cho trẻ.',
        'news' => 'Tin tức mới nhất về hoạt động và sự kiện của trường.',
        'contact' => 'Thông tin liên hệ và địa chỉ của Mầm non Thảo Nguyên Xanh.'
    ];
    return $descriptions[$page] ?? 'Mầm non Thảo Nguyên Xanh';
}

// Contact information
function getContactInfo($type) {
    $contact = [
        'address' => '123 Đường Hoa Sữa, Phường Linh Tây, TP. Thủ Đức, TP.HCM',
        'phone' => '0912 345 678',
        'email' => 'info@mamnonthaonguyenxanh.com'
    ];
    return $contact[$type] ?? '';
}

// Social media links
function getSocialMedia($platform) {
    $db = getDB();
    $social = $db->fetch("SELECT url FROM social_media WHERE platform = ? AND status = 'active'", [$platform]);
    return $social ? $social['url'] : '#';
}

// Get all programs
function getPrograms() {
    $db = getDB();
    return $db->fetchAll("SELECT * FROM programs WHERE status = 'active' ORDER BY min_age");
}

// Get all activities
function getActivities() {
    $db = getDB();
    return $db->fetchAll("SELECT * FROM activities WHERE status = 'active' ORDER BY created_at DESC");
}

// Get latest news
function getLatestNews($limit = 5) {
    $db = getDB();
    return $db->fetchAll("SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC LIMIT ?", [$limit]);
}

// Get testimonials
function getTestimonials() {
    $db = getDB();
    return $db->fetchAll("SELECT * FROM testimonials WHERE status = 'active' ORDER BY created_at DESC");
}

// Format date to Vietnamese
function formatDate($date) {
    $months = [
        1 => 'tháng 1', 2 => 'tháng 2', 3 => 'tháng 3', 4 => 'tháng 4',
        5 => 'tháng 5', 6 => 'tháng 6', 7 => 'tháng 7', 8 => 'tháng 8',
        9 => 'tháng 9', 10 => 'tháng 10', 11 => 'tháng 11', 12 => 'tháng 12'
    ];
    
    $timestamp = strtotime($date);
    $day = date('d', $timestamp);
    $month = date('n', $timestamp);
    $year = date('Y', $timestamp);
    
    return $day . ' ' . $months[$month] . ', ' . $year;
}

// Format currency to Vietnamese
function formatCurrency($amount) {
    return number_format($amount, 0, ',', '.') . ' VNĐ';
}

// Sanitize input
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Generate safe slug from Vietnamese text
function createSlug($text) {
    // Convert Vietnamese characters
    $vietnamese = [
        'á', 'à', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ',
        'é', 'è', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ',
        'í', 'ì', 'ỉ', 'ĩ', 'ị',
        'ó', 'ò', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ',
        'ú', 'ù', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự',
        'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ', 'đ'
    ];
    
    $latin = [
        'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
        'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
        'i', 'i', 'i', 'i', 'i',
        'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
        'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u',
        'y', 'y', 'y', 'y', 'y', 'd'
    ];
    
    $text = str_replace($vietnamese, $latin, strtolower($text));
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    return trim($text, '-');
}

// Check if user is admin
function isAdmin() {
    return isset($_SESSION['admin']) && $_SESSION['admin'] === true;
}

// Save uploaded file
function saveUploadedFile($file, $directory = 'uploads') {
    if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }
    
    $uploadDir = "assets/{$directory}/";
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $destination = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        return "assets/{$directory}/" . $filename;
    }
    
    return false;
}

// Send email (simplified for shared hosting)
function sendEmail($to, $subject, $message, $fromName = 'Mầm Non Thảo Nguyên Xanh') {
    $headers = [
        'From' => $fromName . ' <info@mamnonthaonguyenxanh.com>',
        'Reply-To' => 'info@mamnonthaonguyenxanh.com',
        'X-Mailer' => 'PHP/' . phpversion(),
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/html; charset=UTF-8'
    ];
    
    return mail($to, $subject, $message, implode("\r\n", $headers));
}

// Log activity (for admin actions)
function logActivity($action, $details = '') {
    $db = getDB();
    $db->insert(
        "INSERT INTO activity_logs (action, details, ip_address, created_at) VALUES (?, ?, ?, NOW())",
        [$action, $details, $_SERVER['REMOTE_ADDR']]
    );
}
?>