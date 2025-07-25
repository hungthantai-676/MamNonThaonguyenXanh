<?php
require_once 'includes/affiliate_functions.php';

$memberId = $_GET['member_id'] ?? '';
$dashboard = null;
$error = '';

if ($memberId) {
    $dashboard = getMemberDashboard($memberId);
    
    if (!$dashboard) {
        $error = 'Không tìm thấy thông tin thành viên';
    }
} else {
    $error = 'Vui lòng cung cấp mã thành viên';
}
?>

<?php if ($error): ?>
    <div class="container py-5">
        <div class="alert alert-danger text-center">
            <h4>Lỗi</h4>
            <p><?= $error ?></p>
            <a href="?page=affiliate_register" class="btn btn-primary">Đăng ký ngay</a>
        </div>
    </div>
<?php else: ?>
    
<!-- Dashboard Header -->
<section class="bg-primary text-white py-4">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-8">
                <h2 class="mb-1">🎯 Dashboard Affiliate</h2>
                <p class="mb-0">Chào mừng, <strong><?= htmlspecialchars($dashboard['member']['name']) ?></strong> (<?= $dashboard['member']['member_id'] ?>)</p>
            </div>
            <div class="col-md-4 text-md-end">
                <span class="badge bg-success fs-6">
                    <?= $dashboard['member']['role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                </span>
            </div>
        </div>
    </div>
</section>

<!-- Stats Overview -->
<section class="py-4 bg-light">
    <div class="container">
        <div class="row g-4">
            <!-- Total Referrals -->
            <div class="col-lg-3 col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <div class="text-primary mb-2">
                            <i class="fas fa-users fa-3x"></i>
                        </div>
                        <h3 class="fw-bold text-dark"><?= $dashboard['member']['total_referrals'] ?></h3>
                        <p class="text-muted mb-0">Học sinh đã giới thiệu</p>
                    </div>
                </div>
            </div>
            
            <!-- Wallet Balance -->
            <div class="col-lg-3 col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <div class="text-success mb-2">
                            <?php if ($dashboard['member']['role'] === 'teacher'): ?>
                                <i class="fas fa-wallet fa-3x"></i>
                            <?php else: ?>
                                <i class="fas fa-star fa-3x"></i>
                            <?php endif; ?>
                        </div>
                        <h3 class="fw-bold text-dark">
                            <?php if ($dashboard['member']['role'] === 'teacher'): ?>
                                <?= formatCurrency($dashboard['member']['wallet_balance']) ?>
                            <?php else: ?>
                                <?= number_format($dashboard['member']['points_balance']) ?> điểm
                            <?php endif; ?>
                        </h3>
                        <p class="text-muted mb-0">
                            <?= $dashboard['member']['role'] === 'teacher' ? 'Số dư ví' : 'Điểm tích lũy' ?>
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Current Milestone -->
            <div class="col-lg-3 col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <div class="text-warning mb-2">
                            <i class="fas fa-trophy fa-3x"></i>
                        </div>
                        <h3 class="fw-bold text-dark"><?= $dashboard['member']['current_milestone'] ?></h3>
                        <p class="text-muted mb-0">Mốc đã đạt</p>
                    </div>
                </div>
            </div>
            
            <!-- Next Milestone Progress -->
            <div class="col-lg-3 col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                        <div class="text-info mb-2">
                            <i class="fas fa-target fa-3x"></i>
                        </div>
                        <h3 class="fw-bold text-dark"><?= $dashboard['referrals_to_next'] ?></h3>
                        <p class="text-muted mb-0">Còn lại đến mốc <?= $dashboard['next_milestone'] ?></p>
                        <div class="progress mt-2">
                            <div class="progress-bar" style="width: <?= $dashboard['progress_percent'] ?>%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Referral Tools -->
<section class="py-5">
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="fas fa-share-alt"></i> Link giới thiệu của bạn</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <label class="form-label">Mã giới thiệu:</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" value="<?= $dashboard['member']['referral_code'] ?>" readonly>
                                        <button class="btn btn-outline-primary" onclick="copyToClipboard('<?= $dashboard['member']['referral_code'] ?>')">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Link đầy đủ:</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" value="https://mamnonthaonguyenxanh.com/?ref=<?= $dashboard['member']['referral_code'] ?>" id="fullLink" readonly>
                                        <button class="btn btn-outline-primary" onclick="copyToClipboard(document.getElementById('fullLink').value)">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="d-flex gap-2">
                                    <button class="btn btn-success" onclick="shareContent('Mầm Non Thảo Nguyên Xanh', document.getElementById('fullLink').value)">
                                        <i class="fas fa-share"></i> Chia sẻ
                                    </button>
                                    <a href="https://www.facebook.com/sharer/sharer.php?u=https://mamnonthaonguyenxanh.com/?ref=<?= $dashboard['member']['referral_code'] ?>" target="_blank" class="btn btn-primary">
                                        <i class="fab fa-facebook"></i> Facebook
                                    </a>
                                    <a href="https://zalo.me/share?url=https://mamnonthaonguyenxanh.com/?ref=<?= $dashboard['member']['referral_code'] ?>" target="_blank" class="btn btn-info">
                                        <i class="fas fa-comment"></i> Zalo
                                    </a>
                                </div>
                            </div>
                            
                            <div class="col-md-4 text-center">
                                <?php if ($dashboard['member']['qr_code_path']): ?>
                                    <h6>QR Code</h6>
                                    <img src="<?= $dashboard['member']['qr_code_path'] ?>" alt="QR Code" class="img-fluid mb-2" style="max-width: 150px;">
                                    <br>
                                    <a href="<?= $dashboard['member']['qr_code_path'] ?>" download class="btn btn-outline-primary btn-sm">
                                        <i class="fas fa-download"></i> Tải về
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0"><i class="fas fa-gift"></i> Thưởng hiện tại</h5>
                    </div>
                    <div class="card-body">
                        <?php if ($dashboard['member']['role'] === 'teacher'): ?>
                            <div class="text-center">
                                <i class="fas fa-money-bill-wave fa-3x text-success mb-3"></i>
                                <h4 class="text-success">2.000.000 VNĐ</h4>
                                <p class="text-muted">cho mỗi học sinh</p>
                                <hr>
                                <h5 class="text-warning">+10.000.000 VNĐ</h5>
                                <p class="text-muted">thưởng mốc 5 HS</p>
                            </div>
                        <?php else: ?>
                            <div class="text-center">
                                <i class="fas fa-star fa-3x text-warning mb-3"></i>
                                <h4 class="text-warning">2.000 điểm</h4>
                                <p class="text-muted">cho mỗi học sinh</p>
                                <hr>
                                <h5 class="text-success">+10.000 điểm</h5>
                                <p class="text-muted">thưởng mốc 5 HS</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Recent Referrals -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <div class="card border-0 shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0"><i class="fas fa-list"></i> Học sinh đã giới thiệu</h5>
                        <span class="badge bg-primary"><?= count($dashboard['referrals']) ?> đơn</span>
                    </div>
                    <div class="card-body">
                        <?php if (empty($dashboard['referrals'])): ?>
                            <div class="text-center py-4">
                                <i class="fas fa-user-plus fa-3x text-muted mb-3"></i>
                                <h5 class="text-muted">Chưa có học sinh nào</h5>
                                <p class="text-muted">Chia sẻ link của bạn để bắt đầu kiếm thưởng!</p>
                            </div>
                        <?php else: ?>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Học sinh</th>
                                            <th>Phụ huynh</th>
                                            <th>Trạng thái</th>
                                            <th>Thưởng</th>
                                            <th>Ngày</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($dashboard['referrals'] as $referral): ?>
                                        <tr>
                                            <td>
                                                <strong><?= htmlspecialchars($referral['student_name']) ?></strong>
                                            </td>
                                            <td>
                                                <?= htmlspecialchars($referral['parent_name']) ?><br>
                                                <small class="text-muted"><?= $referral['parent_phone'] ?></small>
                                            </td>
                                            <td>
                                                <?php
                                                $statusClass = [
                                                    'pending' => 'warning',
                                                    'confirmed' => 'success',
                                                    'enrolled' => 'primary'
                                                ];
                                                $statusText = [
                                                    'pending' => 'Chờ xác nhận',
                                                    'confirmed' => 'Đã xác nhận',
                                                    'enrolled' => 'Đã nhập học'
                                                ];
                                                ?>
                                                <span class="badge bg-<?= $statusClass[$referral['status']] ?>">
                                                    <?= $statusText[$referral['status']] ?>
                                                </span>
                                            </td>
                                            <td>
                                                <?php if ($dashboard['member']['role'] === 'teacher'): ?>
                                                    <strong class="text-success"><?= formatCurrency($referral['reward_amount']) ?></strong>
                                                    <?php if ($referral['milestone_bonus'] > 0): ?>
                                                        <br><small class="text-warning">+<?= formatCurrency($referral['milestone_bonus']) ?> (mốc)</small>
                                                    <?php endif; ?>
                                                <?php else: ?>
                                                    <strong class="text-warning"><?= number_format($referral['reward_points']) ?> điểm</strong>
                                                    <?php if ($referral['milestone_bonus_points'] > 0): ?>
                                                        <br><small class="text-success">+<?= number_format($referral['milestone_bonus_points']) ?> (mốc)</small>
                                                    <?php endif; ?>
                                                <?php endif; ?>
                                            </td>
                                            <td>
                                                <small><?= formatDate($referral['created_at']) ?></small>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0"><i class="fas fa-chart-line"></i> Thống kê</h5>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-6">
                                <h4 class="text-success"><?= count(array_filter($dashboard['referrals'], fn($r) => $r['status'] === 'confirmed')) ?></h4>
                                <small class="text-muted">Đã xác nhận</small>
                            </div>
                            <div class="col-6">
                                <h4 class="text-warning"><?= count(array_filter($dashboard['referrals'], fn($r) => $r['status'] === 'pending')) ?></h4>
                                <small class="text-muted">Chờ xử lý</small>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <h6>Mốc tiếp theo:</h6>
                        <div class="progress mb-2">
                            <div class="progress-bar bg-success" style="width: <?= $dashboard['progress_percent'] ?>%"></div>
                        </div>
                        <small class="text-muted">
                            <?= $dashboard['member']['total_referrals'] ?>/<?= $dashboard['next_milestone'] ?> học sinh
                        </small>
                        
                        <div class="mt-3">
                            <h6>Thưởng mốc tiếp theo:</h6>
                            <?php if ($dashboard['member']['role'] === 'teacher'): ?>
                                <p class="text-success fw-bold">+10.000.000 VNĐ</p>
                            <?php else: ?>
                                <p class="text-warning fw-bold">+10.000 điểm</p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="card border-0 shadow-sm mt-4">
                    <div class="card-header bg-warning text-white">
                        <h5 class="mb-0"><i class="fas fa-rocket"></i> Hành động nhanh</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <a href="?page=contact" class="btn btn-primary">
                                <i class="fas fa-phone"></i> Liên hệ hỗ trợ
                            </a>
                            <a href="?page=affiliate_register" class="btn btn-success">
                                <i class="fas fa-user-plus"></i> Mời bạn bè tham gia
                            </a>
                            <button class="btn btn-info" onclick="printPage()">
                                <i class="fas fa-print"></i> In thông tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php endif; ?>

<script>
// Auto refresh every 5 minutes
setTimeout(() => {
    location.reload();
}, 300000);
</script>