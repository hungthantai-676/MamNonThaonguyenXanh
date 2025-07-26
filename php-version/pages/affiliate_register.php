<?php
require_once 'includes/affiliate_functions.php';

$success = false;
$error = '';
$memberData = null;

if ($_POST) {
    $name = sanitize($_POST['name']);
    $phone = sanitize($_POST['phone']);
    $email = sanitize($_POST['email']);
    $role = sanitize($_POST['role']);
    
    if (empty($name) || empty($phone) || empty($role)) {
        $error = 'Vui lòng điền đầy đủ thông tin bắt buộc';
    } elseif (!in_array($role, ['teacher', 'parent'])) {
        $error = 'Vai trò không hợp lệ';
    } else {
        $result = registerAffiliateMember($name, $phone, $email, $role);
        
        if ($result['success']) {
            $success = true;
            $memberData = $result;
        } else {
            $error = $result['message'];
        }
    }
}
?>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card border-0 shadow-lg">
                <div class="card-header bg-primary text-white text-center py-4">
                    <h2 class="mb-0">🎯 Đăng Ký Chương Trình Affiliate</h2>
                    <p class="mb-0 mt-2">Kiếm thưởng từ việc giới thiệu học sinh</p>
                </div>
                
                <div class="card-body p-5">
                    <?php if ($success): ?>
                        <!-- Success Message -->
                        <div class="alert alert-success">
                            <h4><i class="fas fa-check-circle"></i> Đăng ký thành công!</h4>
                            <p>Chúc mừng bạn đã trở thành thành viên chương trình affiliate!</p>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-body text-center">
                                        <h5>Thông tin tài khoản</h5>
                                        <p><strong>Mã thành viên:</strong> <?= $memberData['member_id'] ?></p>
                                        <p><strong>Mã giới thiệu:</strong> <span class="badge bg-primary fs-6"><?= $memberData['referral_code'] ?></span></p>
                                        <p><strong>Link giới thiệu:</strong></p>
                                        <div class="input-group mb-3">
                                            <input type="text" class="form-control" value="https://mamnonthaonguyenxanh.com/?ref=<?= $memberData['referral_code'] ?>" id="referralLink" readonly>
                                            <button class="btn btn-outline-primary" onclick="copyToClipboard(document.getElementById('referralLink').value)">
                                                <i class="fas fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-body text-center">
                                        <h5>QR Code của bạn</h5>
                                        <?php if ($memberData['qr_code']): ?>
                                            <img src="<?= $memberData['qr_code'] ?>" alt="QR Code" class="img-fluid mb-3">
                                            <a href="<?= $memberData['qr_code'] ?>" download class="btn btn-primary btn-sm">
                                                <i class="fas fa-download"></i> Tải QR Code
                                            </a>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-center mt-4">
                            <a href="?page=affiliate_dashboard&member_id=<?= $memberData['member_id'] ?>" class="btn btn-success btn-lg">
                                <i class="fas fa-tachometer-alt"></i> Xem Dashboard
                            </a>
                        </div>
                        
                    <?php else: ?>
                        <!-- Registration Form -->
                        <?php if ($error): ?>
                            <div class="alert alert-danger">
                                <i class="fas fa-exclamation-triangle"></i> <?= $error ?>
                            </div>
                        <?php endif; ?>
                        
                        <!-- Program Overview -->
                        <div class="row mb-5">
                            <div class="col-md-6">
                                <div class="card border-success h-100 guide-element" data-guide="commission-rates">
                                    <div class="card-header bg-success text-white text-center">
                                        <h5><i class="fas fa-chalkboard-teacher"></i> Giáo Viên</h5>
                                    </div>
                                    <div class="card-body">
                                        <h6 class="text-success">💰 Thưởng bằng tiền mặt</h6>
                                        <ul class="list-unstyled">
                                            <li><i class="fas fa-check text-success"></i> <strong>2.000.000 VNĐ</strong> cho mỗi học sinh</li>
                                            <li><i class="fas fa-check text-success"></i> <strong>+10.000.000 VNĐ</strong> thưởng mốc 5 HS</li>
                                            <li><i class="fas fa-check text-success"></i> <strong>+10.000.000 VNĐ</strong> thưởng mốc 10 HS</li>
                                            <li><i class="fas fa-check text-success"></i> Tiếp tục tăng theo từng mốc 5 HS</li>
                                        </ul>
                                        <div class="text-center">
                                            <p class="fw-bold text-success">Ví dụ: 5 HS = 20 triệu VNĐ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="card border-warning h-100">
                                    <div class="card-header bg-warning text-white text-center">
                                        <h5><i class="fas fa-users"></i> Phụ Huynh</h5>
                                    </div>
                                    <div class="card-body">
                                        <h6 class="text-warning">🎁 Thưởng bằng điểm</h6>
                                        <ul class="list-unstyled">
                                            <li><i class="fas fa-check text-warning"></i> <strong>2.000 điểm</strong> cho mỗi học sinh</li>
                                            <li><i class="fas fa-check text-warning"></i> <strong>+10.000 điểm</strong> thưởng mốc 5 HS</li>
                                            <li><i class="fas fa-check text-warning"></i> <strong>+10.000 điểm</strong> thưởng mốc 10 HS</li>
                                            <li><i class="fas fa-check text-warning"></i> Đổi điểm thành khóa học</li>
                                        </ul>
                                        <div class="text-center">
                                            <p class="fw-bold text-warning">Ví dụ: 5 HS = 20.000 điểm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Registration Form -->
                        <form method="POST" class="needs-validation guide-element" data-guide="referral-form" id="referralForm" novalidate>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="name" class="form-label">Họ và tên <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control guide-element" data-guide="student-name" id="name" name="name" required>
                                        <div class="invalid-feedback">Vui lòng nhập họ tên</div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="phone" class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                                        <input type="tel" class="form-control guide-element" data-guide="parent-info" id="phone" name="phone" required>
                                        <div class="invalid-feedback">Vui lòng nhập số điện thoại</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control guide-element" data-guide="parent-info" id="email" name="email">
                            </div>
                            
                            <div class="mb-4">
                                <label class="form-label">Vai trò của bạn <span class="text-danger">*</span></label>
                                <div class="row guide-element" data-guide="student-age">
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="role" id="teacher" value="teacher" required>
                                            <label class="form-check-label" for="teacher">
                                                <i class="fas fa-chalkboard-teacher text-success"></i> Giáo viên
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="role" id="parent" value="parent" required>
                                            <label class="form-check-label" for="parent">
                                                <i class="fas fa-users text-warning"></i> Phụ huynh / Đại sứ thương hiệu
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary btn-lg px-5 guide-element" data-guide="submit-referral">
                                    <i class="fas fa-user-plus"></i> Đăng ký ngay
                                </button>
                            </div>
                        </form>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Benefits Section -->
<section class="bg-light py-5">
    <div class="container">
        <div class="row text-center mb-4">
            <div class="col-12">
                <h3 class="fw-bold text-primary">🎯 Mục tiêu chương trình</h3>
            </div>
        </div>
        
        <div class="row g-4">
            <div class="col-md-4 text-center">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-primary text-white rounded-circle mb-3 mx-auto">
                            <i class="fas fa-bullhorn fa-2x"></i>
                        </div>
                        <h5 class="fw-bold">Lan tỏa thương hiệu</h5>
                        <p class="text-muted">Khuyến khích sự lan tỏa thương hiệu một cách tự nhiên, hiệu quả thông qua mạng lưới tin cậy.</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 text-center">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-success text-white rounded-circle mb-3 mx-auto">
                            <i class="fas fa-handshake fa-2x"></i>
                        </div>
                        <h5 class="fw-bold">Ghi nhận công bằng</h5>
                        <p class="text-muted">Ghi nhận công bằng và đúng thực tế những nỗ lực giới thiệu từ giáo viên và phụ huynh.</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 text-center">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-warning text-white rounded-circle mb-3 mx-auto">
                            <i class="fas fa-heart fa-2x"></i>
                        </div>
                        <h5 class="fw-bold">Cộng đồng đồng hành</h5>
                        <p class="text-muted">Tạo cộng đồng đồng hành cùng phát triển, cùng chia sẻ giá trị giáo dục cho cộng đồng.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Include Guide CSS and JS -->
<link rel="stylesheet" href="assets/css/affiliate-guide.css">
<script src="assets/js/affiliate-guide.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Format phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
});

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Đã sao chép vào clipboard!');
    });
}

// Format phone number
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
    } else if (value.length >= 4) {
        value = value.replace(/(\d{3})(\d+)/, '$1 $2');
    }
    input.value = value;
}
</script>