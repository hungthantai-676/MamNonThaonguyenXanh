<?php
// Get current page for active navigation
$current_page = $_GET['page'] ?? 'home';

// Get contact info
$phone = getSetting('contact_info', 'phone');
$email = getSetting('contact_info', 'email');
?>

<header class="site-header">
    <!-- Top Bar -->
    <div class="top-bar">
        <div class="container">
            <div class="top-bar-content">
                <div class="contact-info">
                    <span class="contact-item">
                        <i class="icon-phone">📞</i>
                        <a href="tel:<?= $phone ?>"><?= $phone ?></a>
                    </span>
                    <span class="contact-item">
                        <i class="icon-email">📧</i>
                        <a href="mailto:<?= $email ?>"><?= $email ?></a>
                    </span>
                </div>
                <div class="social-links">
                    <?php
                    $social_media = getRecords("SELECT * FROM social_media WHERE is_active = 1 ORDER BY display_order");
                    foreach ($social_media as $social):
                    ?>
                    <a href="<?= htmlspecialchars($social['url']) ?>" target="_blank" rel="noopener" class="social-link">
                        <?php
                        switch ($social['platform']) {
                            case 'facebook': echo '📘'; break;
                            case 'youtube': echo '📺'; break;
                            case 'instagram': echo '📷'; break;
                            default: echo '🔗'; break;
                        }
                        ?>
                    </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Header -->
    <div class="main-header">
        <div class="container">
            <div class="header-content">
                <!-- Logo -->
                <div class="logo">
                    <a href="?page=home">
                        <img src="/assets/images/logo.png" alt="Mầm Non Thảo Nguyên Xanh" class="logo-img">
                        <div class="logo-text">
                            <h1>Mầm Non Thảo Nguyên Xanh</h1>
                            <p>Môi trường giáo dục tốt nhất cho bé</p>
                        </div>
                    </a>
                </div>

                <!-- Navigation -->
                <nav class="main-nav">
                    <div class="nav-toggle" id="nav-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <ul class="nav-menu" id="nav-menu">
                        <li class="nav-item">
                            <a href="?page=home" class="nav-link <?= $current_page === 'home' ? 'active' : '' ?>">Trang chủ</a>
                        </li>
                        <li class="nav-item">
                            <a href="?page=about" class="nav-link <?= $current_page === 'about' ? 'active' : '' ?>">Giới thiệu</a>
                        </li>
                        <li class="nav-item">
                            <a href="?page=programs" class="nav-link <?= $current_page === 'programs' ? 'active' : '' ?>">Chương trình</a>
                        </li>
                        <li class="nav-item">
                            <a href="?page=activities" class="nav-link <?= $current_page === 'activities' ? 'active' : '' ?>">Hoạt động</a>
                        </li>
                        <li class="nav-item">
                            <a href="?page=parents" class="nav-link <?= $current_page === 'parents' ? 'active' : '' ?>">Phụ huynh</a>
                        </li>
                        <li class="nav-item">
                            <a href="?page=admission" class="nav-link <?= $current_page === 'admission' ? 'active' : '' ?>">Tuyển sinh</a>
                        </li>
                        <li class="nav-item">
                            <a href="?page=news" class="nav-link <?= $current_page === 'news' ? 'active' : '' ?>">Tin tức</a>
                        </li>
                        <li class="nav-item">
                            <a href="?page=contact" class="nav-link <?= $current_page === 'contact' ? 'active' : '' ?>">Liên hệ</a>
                        </li>
                        <li class="nav-item">
                            <a href="?page=admin" class="nav-link admin-link">Quản trị</a>
                        </li>
                    </ul>
                </nav>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <a href="?page=admission" class="btn btn-primary">Đăng ký ngay</a>
                </div>
            </div>
        </div>
    </div>
</header>

<style>
/* Top Bar */
.top-bar {
    background: #f8f9fa;
    padding: 8px 0;
    font-size: 14px;
    border-bottom: 1px solid #dee2e6;
}

.top-bar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.contact-info {
    display: flex;
    gap: 20px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.contact-item a {
    color: #495057;
    text-decoration: none;
}

.contact-item a:hover {
    color: #007bff;
}

.social-links {
    display: flex;
    gap: 10px;
}

.social-link {
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 50%;
    background: #fff;
    color: #495057;
    text-decoration: none;
    transition: all 0.3s ease;
    font-size: 16px;
}

.social-link:hover {
    background: #007bff;
    color: white;
    transform: translateY(-2px);
}

/* Main Header */
.main-header {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
}

/* Logo */
.logo a {
    display: flex;
    align-items: center;
    gap: 15px;
    text-decoration: none;
    color: inherit;
}

.logo-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
}

.logo-text h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c5aa0;
    margin: 0;
    line-height: 1.2;
}

.logo-text p {
    font-size: 0.875rem;
    color: #6c757d;
    margin: 0;
}

/* Navigation */
.main-nav {
    flex: 1;
    display: flex;
    justify-content: center;
}

.nav-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 5px;
}

.nav-link {
    display: block;
    padding: 12px 16px;
    text-decoration: none;
    color: #495057;
    font-weight: 500;
    border-radius: 25px;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover,
.nav-link.active {
    color: #007bff;
    background: rgba(0, 123, 255, 0.1);
}

.nav-link.admin-link {
    color: #28a745;
}

.nav-link.admin-link:hover {
    color: white;
    background: #28a745;
}

/* Mobile Navigation Toggle */
.nav-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
    padding: 5px;
}

.nav-toggle span {
    width: 25px;
    height: 3px;
    background: #495057;
    margin: 3px 0;
    transition: 0.3s;
    border-radius: 2px;
}

.nav-toggle.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
}

.nav-toggle.active span:nth-child(2) {
    opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
}

/* Quick Actions */
.quick-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-size: 14px;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
    transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 992px) {
    .nav-menu {
        gap: 2px;
    }
    
    .nav-link {
        padding: 10px 12px;
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .top-bar {
        display: none;
    }
    
    .header-content {
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .logo {
        flex: 1;
    }
    
    .logo-text h1 {
        font-size: 1.25rem;
    }
    
    .nav-toggle {
        display: flex;
        order: 2;
    }
    
    .quick-actions {
        order: 3;
    }
    
    .main-nav {
        order: 4;
        width: 100%;
        justify-content: flex-start;
    }
    
    .nav-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        padding: 20px;
        margin: 0;
        gap: 5px;
    }
    
    .nav-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }
    
    .nav-link {
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 16px;
    }
    
    .quick-actions .btn {
        padding: 8px 16px;
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .logo a {
        gap: 10px;
    }
    
    .logo-img {
        width: 50px;
        height: 50px;
    }
    
    .logo-text h1 {
        font-size: 1.1rem;
    }
    
    .logo-text p {
        font-size: 0.75rem;
    }
}
</style>

<script>
// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});
</script>