<?php
// Check for referral code in URL
$referralCode = $_GET['ref'] ?? '';
$referrerInfo = null;

if ($referralCode) {
    require_once 'includes/affiliate_functions.php';
    $referrerId = isValidReferralCode($referralCode);
    if ($referrerId) {
        $db = getDB();
        $referrerInfo = $db->fetch("SELECT * FROM affiliate_members WHERE member_id = ?", [$referrerId]);
    }
}

$success = false;
$error = '';

if ($_POST) {
    $parentName = sanitize($_POST['parent_name']);
    $phone = sanitize($_POST['phone']);
    $email = sanitize($_POST['email']);
    $address = sanitize($_POST['address']);
    $childName = sanitize($_POST['child_name']);
    $childBirthdate = sanitize($_POST['child_birthdate']);
    $childGender = sanitize($_POST['child_gender']);
    $programId = (int)$_POST['program_id'];
    $preferredStartDate = sanitize($_POST['preferred_start_date']);
    $specialNeeds = sanitize($_POST['special_needs']);
    $submittedReferralCode = sanitize($_POST['referral_code']);
    
    if (empty($parentName) || empty($phone) || empty($childName) || empty($childBirthdate)) {
        $error = 'Vui lòng điền đầy đủ thông tin bắt buộc';
    } else {
        $db = getDB();
        
        $admissionId = $db->insert(
            "INSERT INTO admission_forms (parent_name, phone, email, address, child_name, child_birthdate, child_gender, program_id, preferred_start_date, special_needs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$parentName, $phone, $email, $address, $childName, $childBirthdate, $childGender, $programId, $preferredStartDate, $specialNeeds]
        );
        
        if ($admissionId) {
            // Process referral if exists
            if ($submittedReferralCode) {
                require_once 'includes/affiliate_functions.php';
                processReferral($admissionId, $submittedReferralCode);
            }
            
            $success = true;
        } else {
            $error = 'Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại.';
        }
    }
}
?>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <?php if ($referrerInfo): ?>
                <!-- Referral Info -->
                <div class="alert alert-info">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5><i class="fas fa-user-friends"></i> Bạn được giới thiệu bởi</h5>
                            <p class="mb-0">
                                <strong><?= htmlspecialchars($referrerInfo['name']) ?></strong> 
                                (<?= $referrerInfo['role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>)
                            </p>
                        </div>
                        <div class="col-md-4 text-md-end">
                            <span class="badge bg-success fs-6">Mã: <?= $referralCode ?></span>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
            
            <div class="card border-0 shadow-lg">
                <div class="card-header bg-primary text-white text-center py-4">
                    <h2 class="mb-0">📝 Đơn đăng ký nhập học</h2>
                    <p class="mb-0 mt-2">Mầm Non Thảo Nguyên Xanh</p>
                </div>
                
                <div class="card-body p-5">
                    <?php if ($success): ?>
                        <div class="alert alert-success text-center">
                            <h4><i class="fas fa-check-circle"></i> Đăng ký thành công!</h4>
                            <p>Cảm ơn bạn đã đăng ký cho con. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                            <?php if ($referrerInfo): ?>
                                <p class="text-muted">
                                    <i class="fas fa-gift"></i> 
                                    Người giới thiệu <strong><?= htmlspecialchars($referrerInfo['name']) ?></strong> 
                                    sẽ nhận được thưởng khi con bạn chính thức nhập học.
                                </p>
                            <?php endif; ?>
                        </div>
                    <?php else: ?>
                        <?php if ($error): ?>
                            <div class="alert alert-danger">
                                <i class="fas fa-exclamation-triangle"></i> <?= $error ?>
                            </div>
                        <?php endif; ?>
                        
                        <form method="POST" class="needs-validation" novalidate>
                            <!-- Hidden referral code -->
                            <input type="hidden" name="referral_code" value="<?= $referralCode ?>">
                            
                            <!-- Parent Information -->
                            <div class="mb-4">
                                <h5 class="text-primary mb-3">👨‍👩‍👧‍👦 Thông tin phụ huynh</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="parent_name" class="form-label">Họ tên phụ huynh <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="parent_name" name="parent_name" required>
                                            <div class="invalid-feedback">Vui lòng nhập họ tên phụ huynh</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="phone" class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                                            <input type="tel" class="form-control" id="phone" name="phone" required>
                                            <div class="invalid-feedback">Vui lòng nhập số điện thoại</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="email" class="form-label">Email</label>
                                            <input type="email" class="form-control" id="email" name="email">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="address" class="form-label">Địa chỉ</label>
                                            <input type="text" class="form-control" id="address" name="address">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Child Information -->
                            <div class="mb-4">
                                <h5 class="text-primary mb-3">👶 Thông tin trẻ</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="child_name" class="form-label">Họ tên bé <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="child_name" name="child_name" required>
                                            <div class="invalid-feedback">Vui lòng nhập họ tên bé</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="child_birthdate" class="form-label">Ngày sinh <span class="text-danger">*</span></label>
                                            <input type="date" class="form-control" id="child_birthdate" name="child_birthdate" required>
                                            <div class="invalid-feedback">Vui lòng chọn ngày sinh</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="child_gender" class="form-label">Giới tính</label>
                                            <select class="form-select" id="child_gender" name="child_gender">
                                                <option value="">Chọn giới tính</option>
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="program_id" class="form-label">Chương trình học</label>
                                            <select class="form-select" id="program_id" name="program_id">
                                                <option value="">Chọn chương trình</option>
                                                <?php $programs = getPrograms(); ?>
                                                <?php foreach($programs as $program): ?>
                                                    <option value="<?= $program['id'] ?>">
                                                        <?= htmlspecialchars($program['name']) ?> (<?= $program['min_age'] ?>-<?= $program['max_age'] ?> tuổi)
                                                    </option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Additional Information -->
                            <div class="mb-4">
                                <h5 class="text-primary mb-3">📅 Thông tin bổ sung</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="preferred_start_date" class="form-label">Ngày nhập học mong muốn</label>
                                            <input type="date" class="form-control" id="preferred_start_date" name="preferred_start_date">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="special_needs" class="form-label">Nhu cầu đặc biệt hoặc ghi chú</label>
                                    <textarea class="form-control" id="special_needs" name="special_needs" rows="3" placeholder="Ví dụ: dị ứng thực phẩm, tình trạng sức khỏe đặc biệt..."></textarea>
                                </div>
                            </div>
                            
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary btn-lg px-5">
                                    <i class="fas fa-paper-plane"></i> Gửi đơn đăng ký
                                </button>
                            </div>
                        </form>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Admission Information -->
<section class="bg-light py-5">
    <div class="container">
        <div class="row text-center mb-5">
            <div class="col-12">
                <h3 class="fw-bold text-primary">📋 Thông tin tuyển sinh</h3>
                <p class="text-muted">Những thông tin cần biết về quá trình đăng ký và nhập học</p>
            </div>
        </div>
        
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                        <i class="fas fa-calendar-alt fa-3x text-primary mb-3"></i>
                        <h5 class="fw-bold">Thời gian tuyển sinh</h5>
                        <p class="text-muted">Nhận học sinh quanh năm. Khuyến khích đăng ký trước ít nhất 1 tháng.</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                        <i class="fas fa-child fa-3x text-success mb-3"></i>
                        <h5 class="fw-bold">Độ tuổi nhận học</h5>
                        <p class="text-muted">Từ 2 - 5 tuổi. Chia thành các lớp phù hợp với từng độ tuổi và sự phát triển.</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                        <i class="fas fa-money-bill-wave fa-3x text-warning mb-3"></i>
                        <h5 class="fw-bold">Học phí</h5>
                        <p class="text-muted"><?= formatCurrency(4000000) ?>/tháng cho tất cả các lớp. Bao gồm ăn và các hoạt động.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-5">
            <div class="col-md-6">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">📄 Hồ sơ cần thiết</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li><i class="fas fa-check text-success"></i> Giấy khai sinh (bản sao)</li>
                            <li><i class="fas fa-check text-success"></i> Sổ khám sức khỏe</li>
                            <li><i class="fas fa-check text-success"></i> Giấy chứng nhận tiêm chủng</li>
                            <li><i class="fas fa-check text-success"></i> 4 ảnh 3x4 của bé</li>
                            <li><i class="fas fa-check text-success"></i> CMND/CCCD phụ huynh (bản sao)</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">📞 Liên hệ tư vấn</h5>
                    </div>
                    <div class="card-body">
                        <p><i class="fas fa-phone text-success"></i> <strong>Hotline:</strong> <?= getContactInfo('phone') ?></p>
                        <p><i class="fas fa-envelope text-success"></i> <strong>Email:</strong> <?= getContactInfo('email') ?></p>
                        <p><i class="fas fa-clock text-success"></i> <strong>Giờ tiếp đón:</strong><br>
                        Thứ 2 - Thứ 6: 7:00 - 17:00<br>
                        Thứ 7: 7:00 - 11:00</p>
                        <a href="?page=contact" class="btn btn-success btn-sm">
                            <i class="fas fa-phone"></i> Liên hệ ngay
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>