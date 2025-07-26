<?php
// Get homepage content from database
$hero_title = getRecord("SELECT value FROM site_content WHERE section = 'homepage' AND key_name = 'hero_title'")['value'] ?? 'Chào mừng đến với Mầm Non Thảo Nguyên Xanh';
$hero_subtitle = getRecord("SELECT value FROM site_content WHERE section = 'homepage' AND key_name = 'hero_subtitle'")['value'] ?? 'Môi trường giáo dục an toàn, thân thiện và chuyên nghiệp cho bé yêu';

// Get latest articles and testimonials
$latest_articles = getRecords("SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC LIMIT 3");
$testimonials = getRecords("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC LIMIT 3");
$featured_programs = getRecords("SELECT * FROM programs WHERE is_active = 1 ORDER BY display_order LIMIT 3");
?>

<!-- Hero Section -->
<section class="hero-section" style="background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/assets/images/hero-banner.jpg') center/cover;">
    <div class="container">
        <div class="hero-content">
            <h1 class="hero-title"><?= htmlspecialchars($hero_title) ?></h1>
            <p class="hero-subtitle"><?= htmlspecialchars($hero_subtitle) ?></p>
            <div class="hero-buttons">
                <a href="?page=admission" class="btn btn-primary">Đăng ký ngay</a>
                <a href="?page=programs" class="btn btn-secondary">Xem chương trình</a>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="features-section">
    <div class="container">
        <h2 class="section-title">Tại sao chọn Mầm Non Thảo Nguyên Xanh?</h2>
        <div class="features-grid">
            <div class="feature-item">
                <div class="feature-icon">🎓</div>
                <h3>Giáo dục toàn diện</h3>
                <p>Phương pháp giáo dục tiên tiến kết hợp giữa truyền thống và hiện đại</p>
            </div>
            <div class="feature-item">
                <div class="feature-icon">🛡️</div>
                <h3>Môi trường an toàn</h3>
                <p>Cơ sở vật chất khang trang, an toàn tuyệt đối cho trẻ em</p>
            </div>
            <div class="feature-item">
                <div class="feature-icon">👨‍🏫</div>
                <h3>Đội ngũ chuyên nghiệp</h3>
                <p>Giáo viên giàu kinh nghiệm, yêu trẻ và nhiệt huyết</p>
            </div>
        </div>
    </div>
</section>

<!-- Programs Section -->
<section class="programs-section">
    <div class="container">
        <h2 class="section-title">Chương trình học</h2>
        <div class="programs-grid">
            <?php foreach ($featured_programs as $program): ?>
            <div class="program-card">
                <?php if ($program['image_url']): ?>
                <img src="<?= htmlspecialchars($program['image_url']) ?>" alt="<?= htmlspecialchars($program['name']) ?>" class="program-image">
                <?php endif; ?>
                <div class="program-content">
                    <h3><?= htmlspecialchars($program['name']) ?></h3>
                    <p class="program-age"><?= htmlspecialchars($program['age_range']) ?></p>
                    <p><?= htmlspecialchars($program['description']) ?></p>
                    <div class="program-price">
                        <?= formatPrice($program['tuition']) ?>/tháng
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <div class="text-center">
            <a href="?page=programs" class="btn btn-primary">Xem tất cả chương trình</a>
        </div>
    </div>
</section>

<!-- Testimonials Section -->
<section class="testimonials-section">
    <div class="container">
        <h2 class="section-title">Phụ huynh nói gì về chúng tôi</h2>
        <div class="testimonials-grid">
            <?php foreach ($testimonials as $testimonial): ?>
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>"<?= htmlspecialchars($testimonial['content']) ?>"</p>
                </div>
                <div class="testimonial-author">
                    <?php if ($testimonial['image_url']): ?>
                    <img src="<?= htmlspecialchars($testimonial['image_url']) ?>" alt="<?= htmlspecialchars($testimonial['name']) ?>" class="author-avatar">
                    <?php endif; ?>
                    <div class="author-info">
                        <h4><?= htmlspecialchars($testimonial['name']) ?></h4>
                        <p><?= htmlspecialchars($testimonial['role']) ?></p>
                    </div>
                </div>
                <div class="testimonial-rating">
                    <?php for ($i = 1; $i <= 5; $i++): ?>
                        <span class="star <?= $i <= $testimonial['rating'] ? 'filled' : '' ?>">⭐</span>
                    <?php endfor; ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- News Section -->
<section class="news-section">
    <div class="container">
        <h2 class="section-title">Tin tức & Thông báo</h2>
        <div class="news-grid">
            <?php foreach ($latest_articles as $article): ?>
            <div class="news-card">
                <?php if ($article['image_url']): ?>
                <img src="<?= htmlspecialchars($article['image_url']) ?>" alt="<?= htmlspecialchars($article['title']) ?>" class="news-image">
                <?php endif; ?>
                <div class="news-content">
                    <span class="news-category"><?= ucfirst($article['category']) ?></span>
                    <h3><a href="?page=news&id=<?= $article['id'] ?>"><?= htmlspecialchars($article['title']) ?></a></h3>
                    <p><?= htmlspecialchars($article['excerpt']) ?></p>
                    <div class="news-meta">
                        <span class="news-date"><?= formatDate($article['created_at']) ?></span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <div class="text-center">
            <a href="?page=news" class="btn btn-primary">Xem tất cả tin tức</a>
        </div>
    </div>
</section>

<!-- Call to Action Section -->
<section class="cta-section">
    <div class="container">
        <div class="cta-content">
            <h2>Sẵn sàng cho con bước vào môi trường học tập tuyệt vời?</h2>
            <p>Liên hệ với chúng tôi ngay để được tư vấn và đăng ký học</p>
            <div class="cta-buttons">
                <a href="?page=contact" class="btn btn-primary">Liên hệ ngay</a>
                <a href="tel:<?= getSetting('contact_info', 'phone') ?>" class="btn btn-secondary">
                    📞 <?= getSetting('contact_info', 'phone') ?>
                </a>
            </div>
        </div>
    </div>
</section>

<style>
/* Hero Section */
.hero-section {
    min-height: 80vh;
    display: flex;
    align-items: center;
    color: white;
    text-align: center;
    position: relative;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Features Section */
.features-section {
    padding: 80px 0;
    background: #f8f9fa;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.feature-item {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.feature-item:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

/* Programs Section */
.programs-section {
    padding: 80px 0;
}

.programs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.program-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.program-card:hover {
    transform: translateY(-5px);
}

.program-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.program-content {
    padding: 1.5rem;
}

.program-age {
    color: #666;
    font-weight: bold;
    margin-bottom: 1rem;
}

.program-price {
    font-size: 1.25rem;
    font-weight: bold;
    color: #28a745;
    margin-top: 1rem;
}

/* Testimonials Section */
.testimonials-section {
    padding: 80px 0;
    background: #f8f9fa;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
}

.author-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.testimonial-rating {
    margin-top: 1rem;
}

.star.filled {
    color: #ffc107;
}

/* News Section */
.news-section {
    padding: 80px 0;
}

.news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.news-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.news-card:hover {
    transform: translateY(-5px);
}

.news-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.news-content {
    padding: 1.5rem;
}

.news-category {
    background: #007bff;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.875rem;
    font-weight: bold;
}

.news-content h3 a {
    color: inherit;
    text-decoration: none;
}

.news-content h3 a:hover {
    color: #007bff;
}

.news-meta {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    color: #666;
    font-size: 0.875rem;
}

/* CTA Section */
.cta-section {
    padding: 80px 0;
    background: linear-gradient(135deg, #007bff, #28a745);
    color: white;
    text-align: center;
}

.cta-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 2rem;
}

/* Common Styles */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #333;
}

.btn {
    display: inline-block;
    padding: 12px 30px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #007bff;
}

.text-center {
    text-align: center;
    margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1.25rem;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .features-grid,
    .programs-grid,
    .testimonials-grid,
    .news-grid {
        grid-template-columns: 1fr;
    }
    
    .hero-buttons,
    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }
}
</style>