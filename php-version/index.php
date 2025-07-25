<?php
session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

// Get page from URL
$page = $_GET['page'] ?? 'home';

// Security: whitelist allowed pages
$allowed_pages = ['home', 'about', 'programs', 'activities', 'parents', 'admission', 'news', 'contact', 'admin'];
if (!in_array($page, $allowed_pages)) {
    $page = 'home';
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= getPageTitle($page) ?> - Mầm Non Thảo Nguyên Xanh</title>
    <meta name="description" content="<?= getPageDescription($page) ?>">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>

<!-- Header -->
<header class="bg-primary text-white">
    <div class="container">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <a class="navbar-brand d-flex align-items-center" href="?page=home">
                <img src="assets/images/logo.png" alt="Logo" height="50" class="me-2">
                <span class="fw-bold">Mầm Non Thảo Nguyên Xanh</span>
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link <?= $page == 'home' ? 'active' : '' ?>" href="?page=home">Trang chủ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= $page == 'about' ? 'active' : '' ?>" href="?page=about">Giới thiệu</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= $page == 'programs' ? 'active' : '' ?>" href="?page=programs">Chương trình</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= $page == 'activities' ? 'active' : '' ?>" href="?page=activities">Hoạt động</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= $page == 'parents' ? 'active' : '' ?>" href="?page=parents">Phụ huynh</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= $page == 'admission' ? 'active' : '' ?>" href="?page=admission">Tuyển sinh</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= $page == 'news' ? 'active' : '' ?>" href="?page=news">Tin tức</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= $page == 'contact' ? 'active' : '' ?>" href="?page=contact">Liên hệ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-warning" href="?page=admin">
                            <i class="fas fa-user-shield"></i> Quản trị
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</header>

<!-- Main Content -->
<main>
    <?php include "pages/{$page}.php"; ?>
</main>

<!-- Footer -->
<footer class="bg-dark text-white py-4 mt-5">
    <div class="container">
        <div class="row">
            <div class="col-md-4 mb-3">
                <h5>Liên hệ</h5>
                <p><i class="fas fa-map-marker-alt"></i> <?= getContactInfo('address') ?></p>
                <p><i class="fas fa-phone"></i> <?= getContactInfo('phone') ?></p>
                <p><i class="fas fa-envelope"></i> <?= getContactInfo('email') ?></p>
            </div>
            <div class="col-md-4 mb-3">
                <h5>Giờ học</h5>
                <p>Thứ 2 - Thứ 6: 7:00 - 17:00</p>
                <p>Thứ 7: 7:00 - 11:00</p>
                <p>Chủ nhật: Nghỉ</p>
            </div>
            <div class="col-md-4 mb-3">
                <h5>Theo dõi chúng tôi</h5>
                <div class="d-flex gap-2">
                    <a href="<?= getSocialMedia('facebook') ?>" class="text-white" target="_blank">
                        <i class="fab fa-facebook fa-2x"></i>
                    </a>
                    <a href="<?= getSocialMedia('youtube') ?>" class="text-white" target="_blank">
                        <i class="fab fa-youtube fa-2x"></i>
                    </a>
                    <a href="<?= getSocialMedia('instagram') ?>" class="text-white" target="_blank">
                        <i class="fab fa-instagram fa-2x"></i>
                    </a>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-12 text-center">
                <p>&copy; 2025 Mầm Non Thảo Nguyên Xanh. Tất cả quyền được bảo lưu.</p>
            </div>
        </div>
    </div>
</footer>

<!-- Chatbot -->
<div id="chatbot" class="chatbot-container">
    <div class="chatbot-header">
        <i class="fas fa-robot"></i>
        <span>Tư vấn online</span>
        <button id="chatbot-close" class="btn-close btn-close-white"></button>
    </div>
    <div class="chatbot-body">
        <div id="chatbot-messages"></div>
        <div class="chatbot-input">
            <input type="text" id="chatbot-input" placeholder="Nhập câu hỏi...">
            <button id="chatbot-send"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
</div>
<button id="chatbot-toggle" class="chatbot-toggle">
    <i class="fas fa-comments"></i>
</button>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<!-- Custom JS -->
<script src="assets/js/main.js"></script>
<script src="assets/js/chatbot.js"></script>

</body>
</html>