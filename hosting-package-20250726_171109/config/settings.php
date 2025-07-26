<?php
/**
 * Website Settings and Configuration
 * Easy to modify for hosting providers
 */

// Site Information
define('SITE_NAME', 'Mầm Non Thảo Nguyên Xanh');
define('SITE_URL', 'https://mamnonthaonguyenxanh.com');
define('SITE_EMAIL', 'mamnonthaonguyenxanh@gmail.com');
define('SITE_PHONE', '0856318686');

// Contact Information
$contact_info = [
    'name' => 'Mầm Non Thảo Nguyên Xanh',
    'phone' => '0856318686',
    'email' => 'mamnonthaonguyenxanh@gmail.com',
    'address' => 'Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình',
    'working_hours' => 'Thứ 2 - Thứ 6: 7:00 - 17:00',
    'facebook' => 'https://www.facebook.com/mamnonthaonguyenxanh',
    'youtube' => 'https://www.youtube.com/@mamnonthaonguyenxanh',
    'map_embed' => 'https://maps.google.com/maps?q=Lý+Thái+Tổ,+Phù+Vân,+Ninh+Bình,+Vietnam&output=embed'
];

// School Information
$school_info = [
    'founding_year' => '2020',
    'age_range' => '18 tháng - 6 tuổi',
    'tuition' => '4,000,000 VNĐ/tháng',
    'class_size' => '15-20 học sinh/lớp',
    'teachers' => '15+ giáo viên',
    'facilities' => ['Sân chơi an toàn', 'Phòng học hiện đại', 'Khu vực ăn uống', 'Phòng y tế', 'Camera an ninh']
];

// SEO Settings
$seo_settings = [
    'default_title' => 'Mầm Non Thảo Nguyên Xanh - Trường Mầm Non Uy Tín Tại Ninh Bình',
    'default_description' => 'Mầm Non Thảo Nguyên Xanh - Môi trường giáo dục an toàn, chuyên nghiệp cho trẻ 18 tháng - 6 tuổi tại Ninh Bình.',
    'default_keywords' => 'mầm non ninh bình, trường mầm non uy tín, giáo dục mầm non, mầm non thảo nguyên xanh',
    'og_image' => '/assets/images/og-image.jpg'
];

// Admin Settings
$admin_settings = [
    'username' => 'admin',
    'password' => password_hash('admin123', PASSWORD_DEFAULT), // Hashed password
    'session_timeout' => 28800, // 8 hours in seconds
    'max_file_size' => '10MB',
    'allowed_file_types' => ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
];

// Email Settings (for contact forms)
$email_settings = [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_username' => 'mamnonthaonguyenxanh@gmail.com',
    'smtp_password' => '', // Add your app password here
    'from_email' => 'mamnonthaonguyenxanh@gmail.com',
    'from_name' => 'Mầm Non Thảo Nguyên Xanh',
    'admin_email' => 'mamnonthaonguyenxanh@gmail.com'
];

// Security Settings
$security_settings = [
    'enable_csrf' => true,
    'session_name' => 'MNTNX_SESSION',
    'cookie_lifetime' => 0, // Session cookie
    'cookie_secure' => true, // HTTPS only
    'cookie_httponly' => true,
    'ip_whitelist' => [], // Empty = allow all IPs
    'rate_limit' => [
        'contact_form' => 5, // 5 submissions per hour
        'admin_login' => 10   // 10 attempts per hour
    ]
];

// Backup and Sync Settings
$sync_settings = [
    'enable_auto_sync' => true,
    'replit_webhook_url' => '', // Will be provided by Replit
    'backup_frequency' => 'daily',
    'backup_retention' => 30, // days
    'sync_token' => '', // Secret token for secure sync
    'sync_endpoints' => [
        'articles' => '/api/sync/articles',
        'programs' => '/api/sync/programs',
        'activities' => '/api/sync/activities',
        'testimonials' => '/api/sync/testimonials'
    ]
];

// Performance Settings
$performance_settings = [
    'cache_enabled' => true,
    'cache_duration' => 3600, // 1 hour
    'compress_images' => true,
    'minify_css' => true,
    'minify_js' => true,
    'enable_gzip' => true
];

// Helper functions
function getSetting($category, $key = null) {
    global ${$category};
    if ($key === null) {
        return ${$category};
    }
    return ${$category}[$key] ?? null;
}

function formatPrice($amount) {
    return number_format($amount, 0, ',', '.') . ' VNĐ';
}

function formatDate($date, $format = 'd/m/Y') {
    return date($format, strtotime($date));
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}