<?php
require_once '../includes/affiliate_functions.php';

$db = getDB();
$status = $_GET['status'] ?? 'pending';
$search = $_GET['search'] ?? '';

// Build query
$whereConditions = ["status = ?"];
$params = [$status];

if ($search) {
    $whereConditions[] = "(student_name LIKE ? OR parent_name LIKE ? OR parent_phone LIKE ?)";
    $searchTerm = "%$search%";
    $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
}

$whereClause = implode(' AND ', $whereConditions);

$referrals = $db->fetchAll("
    SELECT r.*, am.name as referrer_name, am.role as referrer_role 
    FROM referrals r 
    JOIN affiliate_members am ON r.referrer_id = am.member_id 
    WHERE $whereClause 
    ORDER BY r.created_at DESC
", $params);

// Get statistics
$totalPending = $db->fetch("SELECT COUNT(*) as count FROM referrals WHERE status = 'pending'")['count'];
$totalConfirmed = $db->fetch("SELECT COUNT(*) as count FROM referrals WHERE status = 'confirmed'")['count'];
$totalEnrolled = $db->fetch("SELECT COUNT(*) as count FROM referrals WHERE status = 'enrolled'")['count'];
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3">🎯 Quản lý Giới thiệu</h1>
    <div>
        <button class="btn btn-success btn-sm" onclick="exportReferrals()">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Statistics -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card bg-warning text-white">
            <div class="card-body text-center">
                <h4><?= $totalPending ?></h4>
                <p class="mb-0">Chờ xác nhận</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-success text-white">
            <div class="card-body text-center">
                <h4><?= $totalConfirmed ?></h4>
                <p class="mb-0">Đã xác nhận</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body text-center">
                <h4><?= $totalEnrolled ?></h4>
                <p class="mb-0">Đã nhập học</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body text-center">
                <h4><?= $totalPending + $totalConfirmed + $totalEnrolled ?></h4>
                <p class="mb-0">Tổng giới thiệu</p>
            </div>
        </div>
    </div>
</div>

<!-- Filters -->
<div class="card mb-4">
    <div class="card-body">
        <form method="GET" class="row g-3">
            <input type="hidden" name="action" value="referrals">
            
            <div class="col-md-4">
                <label class="form-label">Tìm kiếm</label>
                <input type="text" name="search" class="form-control" 
                       placeholder="Tên học sinh, phụ huynh, SĐT..." value="<?= htmlspecialchars($search) ?>">
            </div>
            
            <div class="col-md-3">
                <label class="form-label">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="pending" <?= $status === 'pending' ? 'selected' : '' ?>>Chờ xác nhận</option>
                    <option value="confirmed" <?= $status === 'confirmed' ? 'selected' : '' ?>>Đã xác nhận</option>
                    <option value="enrolled" <?= $status === 'enrolled' ? 'selected' : '' ?>>Đã nhập học</option>
                </select>
            </div>
            
            <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button type="submit" class="btn btn-primary d-block w-100">
                    <i class="fas fa-search"></i> Tìm
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Reward Information -->
<div class="row mb-4">
    <div class="col-md-6">
        <div class="alert alert-info">
            <h6><i class="fas fa-info-circle"></i> Quy tắc thưởng</h6>
            <p class="mb-1"><strong>Giáo viên:</strong> 2,000,000 VNĐ mỗi học sinh + 10,000,000 VNĐ mỗi 5 học sinh</p>
            <p class="mb-0"><strong>Phụ huynh:</strong> 2,000 điểm mỗi học sinh + 10,000 điểm mỗi 5 học sinh</p>
        </div>
    </div>
    <div class="col-md-6">
        <div class="alert alert-warning">
            <h6><i class="fas fa-exclamation-triangle"></i> Lưu ý quan trọng</h6>
            <p class="mb-0">Chỉ cộng thưởng khi chuyển trạng thái từ <strong>"Chờ xác nhận"</strong> → <strong>"Đã xác nhận"</strong></p>
        </div>
    </div>
</div>

<!-- Referrals Table -->
<div class="card">
    <div class="card-body">
        <?php if (empty($referrals)): ?>
            <div class="text-center py-5">
                <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Không có giới thiệu nào</h5>
                <p class="text-muted">Thử thay đổi bộ lọc hoặc chờ có giới thiệu mới</p>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Ngày</th>
                            <th>Người giới thiệu</th>
                            <th>Học sinh</th>
                            <th>Phụ huynh</th>
                            <th>Thưởng sẽ nhận</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($referrals as $referral): ?>
                        <tr>
                            <td>
                                <small><?= formatDate($referral['created_at']) ?></small>
                            </td>
                            <td>
                                <div>
                                    <strong><?= htmlspecialchars($referral['referrer_name']) ?></strong><br>
                                    <small class="text-muted">
                                        <i class="fas fa-<?= $referral['referrer_role'] === 'teacher' ? 'chalkboard-teacher' : 'users' ?>"></i>
                                        <?= $referral['referrer_role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                                        - <?= $referral['referrer_id'] ?>
                                    </small>
                                </div>
                            </td>
                            <td>
                                <strong><?= htmlspecialchars($referral['student_name']) ?></strong>
                            </td>
                            <td>
                                <div>
                                    <?= htmlspecialchars($referral['parent_name']) ?><br>
                                    <small class="text-muted">
                                        <i class="fas fa-phone"></i> <?= $referral['parent_phone'] ?>
                                    </small>
                                    <?php if ($referral['parent_email']): ?>
                                        <br><small class="text-muted">
                                            <i class="fas fa-envelope"></i> <?= htmlspecialchars($referral['parent_email']) ?>
                                        </small>
                                    <?php endif; ?>
                                </div>
                            </td>
                            <td>
                                <div class="text-center">
                                    <?php if ($referral['referrer_role'] === 'teacher'): ?>
                                        <strong class="text-success"><?= formatCurrency($referral['reward_amount']) ?></strong>
                                    <?php else: ?>
                                        <strong class="text-warning"><?= formatPoints($referral['reward_points']) ?> điểm</strong>
                                    <?php endif; ?>
                                    
                                    <?php if ($referral['reward_paid'] === 'yes'): ?>
                                        <br><small class="text-success"><i class="fas fa-check"></i> Đã trả</small>
                                    <?php else: ?>
                                        <br><small class="text-muted"><i class="fas fa-clock"></i> Chưa trả</small>
                                    <?php endif; ?>
                                </div>
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
                                <span class="badge bg-<?= $statusClass[$referral['status']] ?> p-2">
                                    <?= $statusText[$referral['status']] ?>
                                </span>
                                
                                <?php if ($referral['confirmed_at']): ?>
                                    <br><small class="text-muted">
                                        <?= formatDate($referral['confirmed_at']) ?>
                                    </small>
                                <?php endif; ?>
                            </td>
                            <td>
                                <div class="btn-group-vertical btn-group-sm">
                                    <?php if ($referral['status'] === 'pending'): ?>
                                        <button class="btn btn-success" 
                                                onclick="confirmReferral(<?= $referral['id'] ?>)"
                                                title="Xác nhận và cộng thưởng">
                                            <i class="fas fa-check"></i> Xác nhận
                                        </button>
                                    <?php endif; ?>
                                    
                                    <?php if ($referral['status'] === 'confirmed'): ?>
                                        <button class="btn btn-primary" 
                                                onclick="enrollStudent(<?= $referral['id'] ?>)"
                                                title="Đánh dấu đã nhập học">
                                            <i class="fas fa-graduation-cap"></i> Nhập học
                                        </button>
                                    <?php endif; ?>
                                    
                                    <button class="btn btn-outline-info" 
                                            onclick="viewDetails(<?= $referral['id'] ?>)"
                                            title="Xem chi tiết">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

<script>
function confirmReferral(referralId) {
    if (confirm('Xác nhận giới thiệu này? Thưởng sẽ được cộng vào tài khoản người giới thiệu.')) {
        const formData = new FormData();
        formData.append('action', 'confirm_referral');
        formData.append('referral_id', referralId);
        
        fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', 'Đã xác nhận giới thiệu và cộng thưởng thành công!');
                location.reload();
            } else {
                showAlert('danger', data.message);
            }
        });
    }
}

function enrollStudent(referralId) {
    if (confirm('Đánh dấu học sinh đã nhập học?')) {
        const formData = new FormData();
        formData.append('action', 'enroll_student');
        formData.append('referral_id', referralId);
        
        fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', 'Đã cập nhật trạng thái nhập học!');
                location.reload();
            } else {
                showAlert('danger', data.message);
            }
        });
    }
}

function viewDetails(referralId) {
    // Implementation for viewing referral details
    window.open(`?page=referral_details&id=${referralId}`, '_blank');
}

function exportReferrals() {
    window.open(`ajax/affiliate_actions.php?action=export_referrals&status=<?= $status ?>&search=<?= urlencode($search) ?>`, '_blank');
}
</script>