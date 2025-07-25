<!-- Hero Section -->
<section class="hero bg-primary text-white py-5">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6">
                <h1 class="display-4 fw-bold mb-3">Chào mừng đến với Mầm Non Thảo Nguyên Xanh</h1>
                <p class="lead mb-4">Nơi ươm mầm tri thức, nuôi dưỡng tâm hồn, phát triển toàn diện cho con trẻ trong môi trường an toàn và yêu thương.</p>
                <div class="d-flex gap-3">
                    <a href="?page=admission" class="btn btn-warning btn-lg">
                        <i class="fas fa-graduation-cap"></i> Đăng ký học
                    </a>
                    <a href="?page=contact" class="btn btn-outline-light btn-lg">
                        <i class="fas fa-phone"></i> Liên hệ tư vấn
                    </a>
                </div>
            </div>
            <div class="col-lg-6 text-center">
                <img src="assets/images/hero-children.jpg" alt="Trẻ em vui chơi" class="img-fluid rounded shadow">
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-5">
    <div class="container">
        <div class="row text-center mb-5">
            <div class="col-12">
                <h2 class="fw-bold text-primary">Tại sao chọn Thảo Nguyên Xanh?</h2>
                <p class="text-muted">Chúng tôi cam kết mang đến môi trường giáo dục tốt nhất cho con trẻ</p>
            </div>
        </div>
        <div class="row g-4">
            <div class="col-md-4 text-center">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-primary text-white rounded-circle mb-3 mx-auto">
                            <i class="fas fa-heart fa-2x"></i>
                        </div>
                        <h5 class="fw-bold">Yêu thương và an toàn</h5>
                        <p class="text-muted">Môi trường an toàn, sạch sẽ với đội ngũ giáo viên tận tâm, yêu nghề yêu trẻ.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 text-center">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-success text-white rounded-circle mb-3 mx-auto">
                            <i class="fas fa-graduation-cap fa-2x"></i>
                        </div>
                        <h5 class="fw-bold">Phương pháp hiện đại</h5>
                        <p class="text-muted">Áp dụng phương pháp giáo dục tiên tiến, phát triển tư duy sáng tạo cho trẻ.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 text-center">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-warning text-white rounded-circle mb-3 mx-auto">
                            <i class="fas fa-users fa-2x"></i>
                        </div>
                        <h5 class="fw-bold">Phát triển toàn diện</h5>
                        <p class="text-muted">Chương trình giáo dục toàn diện: thể chất, trí tuệ, cảm xúc và xã hội.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Programs Preview -->
<section class="bg-light py-5">
    <div class="container">
        <div class="row text-center mb-5">
            <div class="col-12">
                <h2 class="fw-bold text-primary">Chương trình học</h2>
                <p class="text-muted">Các lớp học được thiết kế phù hợp với từng độ tuổi</p>
            </div>
        </div>
        <div class="row g-4">
            <?php $programs = getPrograms(); ?>
            <?php foreach($programs as $program): ?>
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-primary text-white rounded-circle p-2 me-3">
                                <i class="fas fa-child"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold mb-1"><?= htmlspecialchars($program['name']) ?></h5>
                                <small class="text-muted"><?= $program['min_age'] ?>-<?= $program['max_age'] ?> tuổi</small>
                            </div>
                        </div>
                        <p class="text-muted mb-3"><?= htmlspecialchars($program['description']) ?></p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h6 text-primary fw-bold"><?= formatCurrency($program['tuition']) ?>/tháng</span>
                            <a href="?page=programs" class="btn btn-outline-primary btn-sm">Xem chi tiết</a>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <div class="text-center mt-4">
            <a href="?page=programs" class="btn btn-primary">Xem tất cả chương trình</a>
        </div>
    </div>
</section>

<!-- Testimonials -->
<section class="py-5">
    <div class="container">
        <div class="row text-center mb-5">
            <div class="col-12">
                <h2 class="fw-bold text-primary">Phụ huynh nói gì về chúng tôi</h2>
                <p class="text-muted">Những chia sẻ chân thành từ các gia đình</p>
            </div>
        </div>
        <div class="row g-4">
            <?php $testimonials = getTestimonials(); ?>
            <?php foreach(array_slice($testimonials, 0, 3) as $testimonial): ?>
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4 text-center">
                        <div class="mb-3">
                            <i class="fas fa-quote-left fa-2x text-primary"></i>
                        </div>
                        <p class="text-muted mb-4">"<?= htmlspecialchars($testimonial['content']) ?>"</p>
                        <div class="d-flex align-items-center justify-content-center">
                            <img src="<?= $testimonial['avatar'] ?: 'assets/images/default-avatar.png' ?>" 
                                 alt="<?= htmlspecialchars($testimonial['name']) ?>" 
                                 class="rounded-circle me-3" width="50" height="50">
                            <div>
                                <h6 class="fw-bold mb-0"><?= htmlspecialchars($testimonial['name']) ?></h6>
                                <small class="text-muted"><?= htmlspecialchars($testimonial['role']) ?></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Latest News -->
<section class="bg-light py-5">
    <div class="container">
        <div class="row align-items-center mb-4">
            <div class="col-md-6">
                <h2 class="fw-bold text-primary mb-0">Tin tức mới nhất</h2>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="?page=news" class="btn btn-outline-primary">Xem tất cả tin tức</a>
            </div>
        </div>
        <div class="row g-4">
            <?php $news = getLatestNews(3); ?>
            <?php foreach($news as $article): ?>
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 border-0 shadow-sm">
                    <?php if($article['featured_image']): ?>
                    <img src="<?= htmlspecialchars($article['featured_image']) ?>" 
                         class="card-img-top" alt="<?= htmlspecialchars($article['title']) ?>" style="height: 200px; object-fit: cover;">
                    <?php endif; ?>
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary"><?= htmlspecialchars($article['category']) ?></span>
                            <small class="text-muted"><?= formatDate($article['created_at']) ?></small>
                        </div>
                        <h5 class="card-title fw-bold">
                            <a href="?page=news&id=<?= $article['id'] ?>" class="text-decoration-none text-dark">
                                <?= htmlspecialchars($article['title']) ?>
                            </a>
                        </h5>
                        <p class="card-text text-muted"><?= htmlspecialchars(substr($article['summary'], 0, 120)) ?>...</p>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="bg-primary text-white py-5">
    <div class="container text-center">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <h2 class="fw-bold mb-3">Sẵn sàng cho con bắt đầu hành trình học tập?</h2>
                <p class="lead mb-4">Liên hệ ngay với chúng tôi để được tư vấn chi tiết về chương trình học và thủ tục đăng ký.</p>
                <div class="d-flex gap-3 justify-content-center flex-wrap">
                    <a href="?page=admission" class="btn btn-warning btn-lg">
                        <i class="fas fa-edit"></i> Đăng ký ngay
                    </a>
                    <a href="tel:<?= getContactInfo('phone') ?>" class="btn btn-outline-light btn-lg">
                        <i class="fas fa-phone"></i> Gọi tư vấn
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>