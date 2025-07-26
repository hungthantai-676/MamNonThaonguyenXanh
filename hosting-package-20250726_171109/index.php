<?php
/**
 * Mầm Non Thảo Nguyên Xanh - Main Entry Point
 * Optimized for standard hosting with PHP/MySQL
 * SEO-optimized with meta tags and schema markup
 */

// Start session and set headers
session_start();
header('Content-Type: text/html; charset=UTF-8');

// Include configuration
require_once 'config/database.php';
require_once 'config/settings.php';

// Get current page
$page = $_GET['page'] ?? 'home';
$allowed_pages = ['home', 'about', 'programs', 'activities', 'parents', 'admission', 'news', 'contact', 'admin'];

if (!in_array($page, $allowed_pages)) {
    $page = 'home';
}

// SEO Configuration per page
$seo_config = [
    'home' => [
        'title' => 'Mầm Non Thảo Nguyên Xanh - Trường Mầm Non Uy Tín Tại Ninh Bình',
        'description' => 'Mầm Non Thảo Nguyên Xanh - Môi trường giáo dục an toàn, chuyên nghiệp cho trẻ 18 tháng - 6 tuổi tại Ninh Bình. Đội ngũ giáo viên giàu kinh nghiệm, cơ sở vật chất hiện đại.',
        'keywords' => 'mầm non ninh bình, trường mầm non uy tín, giáo dục mầm non, mầm non thảo nguyên xanh',
        'image' => '/assets/images/hero-banner.jpg'
    ],
    'about' => [
        'title' => 'Giới Thiệu - Mầm Non Thảo Nguyên Xanh',
        'description' => 'Tìm hiểu về lịch sử, sứ mệnh và tầm nhìn của Mầm Non Thảo Nguyên Xanh. Đội ngũ giáo viên chuyên nghiệp, môi trường học tập an toàn.',
        'keywords' => 'giới thiệu mầm non, lịch sử trường học, đội ngũ giáo viên',
        'image' => '/assets/images/about-school.jpg'
    ],
    'programs' => [
        'title' => 'Chương Trình Học - Mầm Non Thảo Nguyên Xanh',
        'description' => 'Các chương trình giáo dục mầm non toàn diện cho trẻ từ 18 tháng đến 6 tuổi. Học phí 4.000.000 VNĐ/tháng với nhiều hoạt động phong phú.',
        'keywords' => 'chương trình mầm non, học phí mầm non, giáo dục toàn diện',
        'image' => '/assets/images/programs.jpg'
    ],
    'admission' => [
        'title' => 'Tuyển Sinh - Mầm Non Thảo Nguyên Xanh',
        'description' => 'Thông tin tuyển sinh mầm non năm học 2024-2025. Độ tuổi 18 tháng - 6 tuổi, học phí 4.000.000 VNĐ/tháng. Đăng ký ngay!',
        'keywords' => 'tuyển sinh mầm non, đăng ký mầm non, thủ tục nhập học',
        'image' => '/assets/images/admission.jpg'
    ]
];

$current_seo = $seo_config[$page] ?? $seo_config['home'];
?>
<!DOCTYPE html>
<html lang="vi" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary SEO Tags -->
    <title><?= htmlspecialchars($current_seo['title']) ?></title>
    <meta name="description" content="<?= htmlspecialchars($current_seo['description']) ?>">
    <meta name="keywords" content="<?= htmlspecialchars($current_seo['keywords']) ?>">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Mầm Non Thảo Nguyên Xanh">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?= "https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}" ?>">
    <meta property="og:title" content="<?= htmlspecialchars($current_seo['title']) ?>">
    <meta property="og:description" content="<?= htmlspecialchars($current_seo['description']) ?>">
    <meta property="og:image" content="<?= "https://{$_SERVER['HTTP_HOST']}{$current_seo['image']}" ?>">
    <meta property="og:locale" content="vi_VN">
    <meta property="og:site_name" content="Mầm Non Thảo Nguyên Xanh">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="<?= "https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}" ?>">
    <meta property="twitter:title" content="<?= htmlspecialchars($current_seo['title']) ?>">
    <meta property="twitter:description" content="<?= htmlspecialchars($current_seo['description']) ?>">
    <meta property="twitter:image" content="<?= "https://{$_SERVER['HTTP_HOST']}{$current_seo['image']}" ?>">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="<?= "https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}" ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
    <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
    
    <!-- CSS -->
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/responsive.css">
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Mầm Non Thảo Nguyên Xanh",
        "description": "Trường mầm non uy tín tại Ninh Bình với môi trường giáo dục an toàn và chuyên nghiệp",
        "url": "https://mamnonthaonguyenxanh.com",
        "logo": "https://mamnonthaonguyenxanh.com/assets/images/logo.png",
        "image": "https://mamnonthaonguyenxanh.com/assets/images/hero-banner.jpg",
        "telephone": "+84856318686",
        "email": "mamnonthaonguyenxanh@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4",
            "addressLocality": "Phù Vân",
            "addressRegion": "Ninh Bình",
            "addressCountry": "VN"
        },
        "sameAs": [
            "https://www.facebook.com/mamnonthaonguyenxanh",
            "https://www.youtube.com/@mamnonthaonguyenxanh"
        ],
        "offers": {
            "@type": "Offer",
            "name": "Chương trình giáo dục mầm non",
            "price": "4000000",
            "priceCurrency": "VND",
            "priceValidUntil": "2025-12-31"
        }
    }
    </script>
    
    <!-- Google Analytics (replace with actual GA4 code) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
</head>
<body>
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="skip-link">Chuyển đến nội dung chính</a>
    
    <!-- Header -->
    <?php include 'components/header.php'; ?>
    
    <!-- Main Content -->
    <main id="main-content" role="main">
        <?php
        // Include the appropriate page content
        $page_file = "pages/{$page}.php";
        if (file_exists($page_file)) {
            include $page_file;
        } else {
            include 'pages/404.php';
        }
        ?>
    </main>
    
    <!-- Footer -->
    <?php include 'components/footer.php'; ?>
    
    <!-- Chatbot -->
    <?php include 'components/chatbot.php'; ?>
    
    <!-- JavaScript -->
    <script src="/assets/js/main.js"></script>
    <script src="/assets/js/chatbot.js"></script>
    
    <!-- Live Chat / Support -->
    <div id="live-chat-widget">
        <button id="chat-toggle" class="chat-button">
            💬 Tư vấn
        </button>
        <div id="chat-box" class="chat-box hidden">
            <div class="chat-header">
                <h4>Tư vấn tuyển sinh</h4>
                <button id="chat-close">✕</button>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot-message">
                    Xin chào! Tôi có thể hỗ trợ gì cho bạn về việc tuyển sinh mầm non?
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chat-input" placeholder="Nhập câu hỏi...">
                <button id="chat-send">Gửi</button>
            </div>
        </div>
    </div>
</body>
</html>