<?php
// Affiliate Settings Management
$db = getDB();

// Handle settings update
if ($_POST && isset($_POST['action'])) {
    $response = ['success' => false, 'message' => ''];
    
    switch ($_POST['action']) {
        case 'update_rewards':
            $teacherReward = (int)$_POST['teacher_reward'];
            $parentReward = (int)$_POST['parent_reward'];
            $teacherBonus = (int)$_POST['teacher_bonus'];
            $parentBonus = (int)$_POST['parent_bonus'];
            $milestoneCount = (int)$_POST['milestone_count'];
            
            try {
                // Check if settings exist
                $checkStmt = $db->query("SELECT COUNT(*) as count FROM affiliate_settings WHERE setting_key LIKE 'reward_%'");
                $exists = $checkStmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
                
                if ($exists) {
                    // Update existing settings
                    $updateData = [
                        'reward_teacher_per_referral' => $teacherReward,
                        'reward_parent_per_referral' => $parentReward,
                        'bonus_teacher_milestone' => $teacherBonus,
                        'bonus_parent_milestone' => $parentBonus,
                        'milestone_count' => $milestoneCount
                    ];
                    
                    foreach ($updateData as $key => $value) {
                        $stmt = $db->prepare("
                            UPDATE affiliate_settings 
                            SET setting_value = ?, updated_at = NOW() 
                            WHERE setting_key = ?
                        ");
                        $stmt->execute([$value, $key]);
                    }
                } else {
                    // Insert new settings
                    $insertData = [
                        'reward_teacher_per_referral' => $teacherReward,
                        'reward_parent_per_referral' => $parentReward,
                        'bonus_teacher_milestone' => $teacherBonus,
                        'bonus_parent_milestone' => $parentBonus,
                        'milestone_count' => $milestoneCount
                    ];
                    
                    foreach ($insertData as $key => $value) {
                        $stmt = $db->prepare("
                            INSERT INTO affiliate_settings (setting_key, setting_value, created_at) 
                            VALUES (?, ?, NOW())
                        ");
                        $stmt->execute([$key, $value]);
                    }
                }
                
                $response['success'] = true;
                $response['message'] = 'Cập nhật cài đặt thưởng thành công!';
                
            } catch (Exception $e) {
                $response['message'] = 'Lỗi: ' . $e->getMessage();
            }
            
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
            break;
    }
}

// Get current settings
$stmt = $db->query("SELECT setting_key, setting_value FROM affiliate_settings WHERE setting_key LIKE 'reward_%' OR setting_key = 'milestone_count'");
$settingsData = $stmt->fetchAll(PDO::FETCH_ASSOC);

$settings = [];
foreach ($settingsData as $setting) {
    $settings[$setting['setting_key']] = $setting['setting_value'];
}

// Default values if not set
$settings = array_merge([
    'reward_teacher_per_referral' => 2000000,
    'reward_parent_per_referral' => 2000,
    'bonus_teacher_milestone' => 10000000,
    'bonus_parent_milestone' => 10000,
    'milestone_count' => 5
], $settings);

// Get recent statistics
$statsStmt = $db->prepare("
    SELECT 
        COUNT(DISTINCT am.id) as total_members,
        COUNT(ar.id) as total_referrals,
        COUNT(CASE WHEN ac.manual_status = 'confirmed' THEN 1 END) as confirmed_conversions,
        SUM(CASE WHEN at.type = 'referral_reward' AND at.status = 'completed' THEN at.amount ELSE 0 END) as total_rewards_paid
    FROM affiliate_members am
    LEFT JOIN affiliate_referrals ar ON am.id = ar.referrer_id
    LEFT JOIN affiliate_conversions ac ON ar.id = ac.referral_id
    LEFT JOIN affiliate_transactions at ON am.id = at.member_id
    WHERE am.status = 'active'
");
$statsStmt->execute();
$stats = $statsStmt->fetch(PDO::FETCH_ASSOC);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-cogs text-secondary"></i> Cài đặt Affiliate</h2>
    <div>
        <button class="btn btn-outline-primary" onclick="location.reload()">
            <i class="fas fa-sync-alt"></i> Làm mới
        </button>
    </div>
</div>

<!-- Current Statistics -->
<div class="row mb-4">
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title">Tổng thành viên</h6>
                        <h3 class="mb-0"><?= number_format($stats['total_members']) ?></h3>
                        <small>Đang hoạt động</small>
                    </div>
                    <i class="fas fa-users fa-2x"></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-3">
        <div class="card bg-success text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title">Giới thiệu thành công</h6>
                        <h3 class="mb-0"><?= number_format($stats['confirmed_conversions']) ?></h3>
                        <small>Conversion xác nhận</small>
                    </div>
                    <i class="fas fa-check-circle fa-2x"></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-3">
        <div class="card bg-warning text-dark">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title">Tổng thưởng đã trả</h6>
                        <h3 class="mb-0"><?= number_format($stats['total_rewards_paid']) ?></h3>
                        <small>VND/Điểm</small>
                    </div>
                    <i class="fas fa-money-bill-wave fa-2x"></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title">Tỷ lệ chuyển đổi</h6>
                        <h3 class="mb-0">
                            <?= $stats['total_referrals'] > 0 ? number_format(($stats['confirmed_conversions'] / $stats['total_referrals']) * 100, 1) : 0 ?>%
                        </h3>
                        <small>Conversion rate</small>
                    </div>
                    <i class="fas fa-chart-line fa-2x"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Reward Settings -->
<div class="card mb-4">
    <div class="card-header">
        <h5><i class="fas fa-gift"></i> Cài đặt thưởng</h5>
    </div>
    <div class="card-body">
        <form id="rewardSettingsForm">
            <div class="row">
                <div class="col-md-6">
                    <h6 class="text-info mb-3">
                        <i class="fas fa-chalkboard-teacher"></i> Thưởng cho Giáo viên
                    </h6>
                    
                    <div class="mb-3">
                        <label class="form-label">Thưởng mỗi học sinh giới thiệu</label>
                        <div class="input-group">
                            <input type="number" class="form-control" name="teacher_reward" 
                                   value="<?= $settings['reward_teacher_per_referral'] ?>" min="0" step="100000">
                            <span class="input-group-text">VND</span>
                        </div>
                        <small class="text-muted">Hiện tại: <?= number_format($settings['reward_teacher_per_referral']) ?> VND</small>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Thưởng milestone</label>
                        <div class="input-group">
                            <input type="number" class="form-control" name="teacher_bonus" 
                                   value="<?= $settings['bonus_teacher_milestone'] ?>" min="0" step="1000000">
                            <span class="input-group-text">VND</span>
                        </div>
                        <small class="text-muted">Hiện tại: <?= number_format($settings['bonus_teacher_milestone']) ?> VND</small>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <h6 class="text-warning mb-3">
                        <i class="fas fa-user-friends"></i> Thưởng cho Phụ huynh
                    </h6>
                    
                    <div class="mb-3">
                        <label class="form-label">Thưởng mỗi học sinh giới thiệu</label>
                        <div class="input-group">
                            <input type="number" class="form-control" name="parent_reward" 
                                   value="<?= $settings['reward_parent_per_referral'] ?>" min="0" step="100">
                            <span class="input-group-text">Điểm</span>
                        </div>
                        <small class="text-muted">Hiện tại: <?= number_format($settings['reward_parent_per_referral']) ?> điểm</small>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Thưởng milestone</label>
                        <div class="input-group">
                            <input type="number" class="form-control" name="parent_bonus" 
                                   value="<?= $settings['bonus_parent_milestone'] ?>" min="0" step="1000">
                            <span class="input-group-text">Điểm</span>
                        </div>
                        <small class="text-muted">Hiện tại: <?= number_format($settings['bonus_parent_milestone']) ?> điểm</small>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Số học sinh để đạt milestone</label>
                        <input type="number" class="form-control" name="milestone_count" 
                               value="<?= $settings['milestone_count'] ?>" min="1" max="20">
                        <small class="text-muted">Hiện tại: Mỗi <?= $settings['milestone_count'] ?> học sinh thành công</small>
                    </div>
                </div>
            </div>
            
            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Lưu cài đặt
                </button>
            </div>
        </form>
    </div>
</div>

<!-- System Information -->
<div class="card">
    <div class="card-header">
        <h5><i class="fas fa-info-circle"></i> Thông tin hệ thống</h5>
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-md-6">
                <h6>Cơ chế hoạt động</h6>
                <ul class="list-unstyled">
                    <li><i class="fas fa-check text-success"></i> Tự động tạo ví khi đăng ký</li>
                    <li><i class="fas fa-check text-success"></i> QR code cá nhân cho mỗi thành viên</li>
                    <li><i class="fas fa-check text-success"></i> Tracking giới thiệu real-time</li>
                    <li><i class="fas fa-check text-success"></i> Xác nhận thủ công từ admin</li>
                    <li><i class="fas fa-check text-success"></i> Tự động cộng thưởng khi xác nhận</li>
                </ul>
            </div>
            
            <div class="col-md-6">
                <h6>Tính năng đặc biệt</h6>
                <ul class="list-unstyled">
                    <li><i class="fas fa-star text-warning"></i> Milestone bonus tự động</li>
                    <li><i class="fas fa-star text-warning"></i> Rút tiền linh hoạt</li>
                    <li><i class="fas fa-star text-warning"></i> Báo cáo chi tiết</li>
                    <li><i class="fas fa-star text-warning"></i> Dashboard trực quan</li>
                    <li><i class="fas fa-star text-warning"></i> Quản lý cây phả hệ</li>
                </ul>
            </div>
        </div>
        
        <hr>
        
        <div class="row">
            <div class="col-md-12">
                <h6>Luật chơi hiện tại:</h6>
                <div class="alert alert-info">
                    <strong>Giáo viên:</strong> Mỗi học sinh giới thiệu thành công nhận <?= number_format($settings['reward_teacher_per_referral']) ?> VND. 
                    Cứ <?= $settings['milestone_count'] ?> học sinh thành công sẽ có thêm <?= number_format($settings['bonus_teacher_milestone']) ?> VND bonus.
                    <br><br>
                    <strong>Phụ huynh:</strong> Mỗi học sinh giới thiệu thành công nhận <?= number_format($settings['reward_parent_per_referral']) ?> điểm. 
                    Cứ <?= $settings['milestone_count'] ?> học sinh thành công sẽ có thêm <?= number_format($settings['bonus_parent_milestone']) ?> điểm bonus.
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.getElementById('rewardSettingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    formData.append('action', 'update_rewards');
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    submitBtn.disabled = true;
    
    fetch('?page=admin_affiliate&action=settings', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', data.message);
            setTimeout(() => location.reload(), 1500);
        } else {
            showAlert('danger', data.message);
        }
    })
    .catch(error => {
        showAlert('danger', 'Lỗi kết nối: ' + error.message);
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 5000);
}
</script>