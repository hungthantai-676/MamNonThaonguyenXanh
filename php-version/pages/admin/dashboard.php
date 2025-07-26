<?php
// Simple client-side authentication check
$isAuthenticated = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

// Handle login
if ($_POST && isset($_POST['username']) && isset($_POST['password'])) {
    if ($_POST['username'] === 'admin' && $_POST['password'] === 'admin123') {
        $_SESSION['admin_logged_in'] = true;
        $isAuthenticated = true;
    } else {
        $loginError = 'Tên đăng nhập hoặc mật khẩu không đúng';
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    $_SESSION['admin_logged_in'] = false;
    unset($_SESSION['admin_logged_in']);
    $isAuthenticated = false;
}

if (!$isAuthenticated): ?>
    <!-- Login Form -->
    <div class="container-fluid">
        <div class="row justify-content-center min-vh-100 align-items-center bg-light">
            <div class="col-md-4">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white text-center">
                        <h4><i class="fas fa-user-shield"></i> Đăng nhập Admin</h4>
                    </div>
                    <div class="card-body">
                        <?php if (isset($loginError)): ?>
                            <div class="alert alert-danger"><?= $loginError ?></div>
                        <?php endif; ?>
                        
                        <form method="POST">
                            <div class="mb-3">
                                <label for="username" class="form-label">Tên đăng nhập</label>
                                <input type="text" class="form-control" id="username" name="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Mật khẩu</label>
                                <input type="password" class="form-control" id="password" name="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php else: ?>
    <!-- Admin Dashboard -->
    <div class="container-fluid p-0">
        <div class="bg-primary text-white p-3">
            <div class="d-flex justify-content-between align-items-center">
                <h2 class="mb-0"><i class="fas fa-tachometer-alt"></i> Quản trị Mầm Non Thảo Nguyên Xanh</h2>
                <div>
                    <span class="me-3">Xin chào, Admin</span>
                    <a href="?page=admin&logout=1" class="btn btn-outline-light btn-sm">Đăng xuất</a>
                </div>
            </div>
        </div>
        
        <div class="container-fluid py-4">
            <!-- Navigation Tabs -->
            <ul class="nav nav-tabs" id="adminTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab">
                        <i class="fas fa-phone"></i> Liên hệ
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="media-tab" data-bs-toggle="tab" data-bs-target="#media" type="button" role="tab">
                        <i class="fas fa-images"></i> Ảnh/Video
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="homepage-tab" data-bs-toggle="tab" data-bs-target="#homepage" type="button" role="tab">
                        <i class="fas fa-home"></i> Trang chủ
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="about-tab" data-bs-toggle="tab" data-bs-target="#about" type="button" role="tab">
                        <i class="fas fa-info-circle"></i> Giới thiệu
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="library-tab" data-bs-toggle="tab" data-bs-target="#library" type="button" role="tab">
                        <i class="fas fa-book"></i> Thư viện
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="admission-tab" data-bs-toggle="tab" data-bs-target="#admission" type="button" role="tab">
                        <i class="fas fa-graduation-cap"></i> Tuyển sinh
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="articles-tab" data-bs-toggle="tab" data-bs-target="#articles" type="button" role="tab">
                        <i class="fas fa-newspaper"></i> Bài viết
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="programs-tab" data-bs-toggle="tab" data-bs-target="#programs" type="button" role="tab">
                        <i class="fas fa-graduation-cap"></i> Chương trình
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="activities-tab" data-bs-toggle="tab" data-bs-target="#activities" type="button" role="tab">
                        <i class="fas fa-calendar"></i> Hoạt động
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="media-coverage-tab" data-bs-toggle="tab" data-bs-target="#media-coverage" type="button" role="tab">
                        <i class="fas fa-tv"></i> Báo chí
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link text-warning fw-bold" id="affiliate-tab" data-bs-toggle="tab" data-bs-target="#affiliate" type="button" role="tab">
                        <i class="fas fa-handshake"></i> 🎯 Affiliate
                    </button>
                </li>
            </ul>
            
            <!-- Tab Content -->
            <div class="tab-content" id="adminTabsContent">
                <!-- Contact Tab -->
                <div class="tab-pane fade show active" id="contact" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-phone"></i> Thông tin liên hệ</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng cập nhật thông tin liên hệ đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Media Tab -->
                <div class="tab-pane fade" id="media" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-images"></i> Quản lý Ảnh/Video</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng upload ảnh/video đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Homepage Tab -->
                <div class="tab-pane fade" id="homepage" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-home"></i> Chỉnh sửa Trang chủ</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng chỉnh sửa trang chủ đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- About Tab -->
                <div class="tab-pane fade" id="about" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-info-circle"></i> Chỉnh sửa Giới thiệu</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng chỉnh sửa giới thiệu đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Library Tab -->
                <div class="tab-pane fade" id="library" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-book"></i> Quản lý Thư viện</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng quản lý thư viện đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Admission Tab -->
                <div class="tab-pane fade" id="admission" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-graduation-cap"></i> Quản lý Tuyển sinh</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng quản lý tuyển sinh đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Articles Tab -->
                <div class="tab-pane fade" id="articles" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-newspaper"></i> Quản lý Bài viết</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng quản lý bài viết đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Programs Tab -->
                <div class="tab-pane fade" id="programs" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-graduation-cap"></i> Quản lý Chương trình</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng quản lý chương trình đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Activities Tab -->
                <div class="tab-pane fade" id="activities" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-calendar"></i> Quản lý Hoạt động</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng quản lý hoạt động đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Media Coverage Tab -->
                <div class="tab-pane fade" id="media-coverage" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header">
                            <h5><i class="fas fa-tv"></i> Quản lý Báo chí</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Tính năng quản lý báo chí đang được phát triển...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Affiliate Tab -->
                <div class="tab-pane fade" id="affiliate" role="tabpanel">
                    <div class="card mt-3">
                        <div class="card-header bg-warning text-white">
                            <h5><i class="fas fa-handshake"></i> 🎯 Quản lý Affiliate & Thanh toán</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="card h-100 border-primary">
                                        <div class="card-body text-center">
                                            <i class="fas fa-tachometer-alt fa-3x text-primary mb-3"></i>
                                            <h5>Dashboard Affiliate</h5>
                                            <p class="text-muted">Tổng quan hệ thống affiliate, thống kê và báo cáo</p>
                                            <a href="?page=admin_affiliate&action=overview" class="btn btn-primary">
                                                <i class="fas fa-eye"></i> Xem Dashboard
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card h-100 border-success">
                                        <div class="card-body text-center">
                                            <i class="fas fa-users fa-3x text-success mb-3"></i>
                                            <h5>Quản lý Thành viên</h5>
                                            <p class="text-muted">Xem danh sách, chỉnh sửa thông tin thành viên affiliate</p>
                                            <a href="?page=admin_affiliate&action=members" class="btn btn-success">
                                                <i class="fas fa-users-cog"></i> Quản lý
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card h-100 border-info">
                                        <div class="card-body text-center">
                                            <i class="fas fa-handshake fa-3x text-info mb-3"></i>
                                            <h5>Quản lý Giới thiệu</h5>
                                            <p class="text-muted">Xác nhận học sinh, quản lý conversion và trạng thái</p>
                                            <a href="?page=admin_affiliate&action=referrals" class="btn btn-info">
                                                <i class="fas fa-check-circle"></i> Xác nhận
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card h-100 border-warning">
                                        <div class="card-body text-center">
                                            <i class="fas fa-money-bill-wave fa-3x text-warning mb-3"></i>
                                            <h5>Quản lý Thanh toán</h5>
                                            <p class="text-muted">Xử lý thanh toán, xuất báo cáo, quản lý ví</p>
                                            <a href="?page=admin_affiliate&action=payments" class="btn btn-warning">
                                                <i class="fas fa-credit-card"></i> Thanh toán
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-12">
                                    <div class="card border-danger">
                                        <div class="card-body">
                                            <div class="row align-items-center">
                                                <div class="col-md-8">
                                                    <h5 class="text-danger mb-2">
                                                        <i class="fas fa-exclamation-triangle"></i> Truy cập nhanh Affiliate Admin
                                                    </h5>
                                                    <p class="mb-0">Quản lý toàn bộ hệ thống affiliate trong giao diện chuyên dụng với đầy đủ tính năng xác nhận conversion và thanh toán.</p>
                                                </div>
                                                <div class="col-md-4 text-md-end">
                                                    <a href="?page=admin_affiliate" class="btn btn-danger btn-lg">
                                                        <i class="fas fa-rocket"></i> Vào Affiliate Admin
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php endif; ?>

<script>
// Auto-save form data
document.addEventListener('DOMContentLoaded', function() {
    // Add form auto-save functionality here
    console.log('Admin dashboard loaded');
});
</script>