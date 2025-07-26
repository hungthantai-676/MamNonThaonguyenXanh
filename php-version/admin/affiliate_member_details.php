<?php
// Member Details Page
$db = getDB();

if (!isset($_GET['id'])) {
    echo '<div class="alert alert-danger">Không tìm thấy ID thành viên!</div>';
    exit();
}

$memberId = (int)$_GET['id'];

// Get member detailed information
$stmt = $db->prepare("
    SELECT 
        am.*,
        aw.balance,
        aw.total_earned,
        aw.total_withdrawn,
        aw.created_at as wallet_created,
        COALESCE(am.is_hidden, 0) as is_hidden
    FROM affiliate_members am
    LEFT JOIN affiliate_wallets aw ON am.id = aw.member_id
    WHERE am.id = ?
");
$stmt->execute([$memberId]);
$member = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$member) {
    echo '<div class="alert alert-danger">Không tìm thấy thông tin thành viên!</div>';
    exit();
}

// Get referrals data
$referralsStmt = $db->prepare("
    SELECT 
        ar.*,
        ac.manual_status,
        ac.created_at as conversion_date,
        ac.confirmed_at
    FROM affiliate_referrals ar
    LEFT JOIN affiliate_conversions ac ON ar.id = ac.referral_id
    WHERE ar.referrer_id = ?
    ORDER BY ar.created_at DESC
    LIMIT 10
");
$referralsStmt->execute([$memberId]);
$referrals = $referralsStmt->fetchAll(PDO::FETCH_ASSOC);

// Get transactions data
$transactionsStmt = $db->prepare("
    SELECT *
    FROM affiliate_transactions
    WHERE member_id = ?
    ORDER BY created_at DESC
    LIMIT 10
");
$transactionsStmt->execute([$memberId]);
$transactions = $transactionsStmt->fetchAll(PDO::FETCH_ASSOC);

// Get statistics
$statsStmt = $db->prepare("
    SELECT 
        COUNT(ar.id) as total_referrals,
        COUNT(CASE WHEN ac.manual_status = 'confirmed' THEN 1 END) as confirmed_referrals,
        COUNT(CASE WHEN ac.manual_status = 'pending' THEN 1 END) as pending_referrals,
        COUNT(CASE WHEN ac.manual_status = 'rejected' THEN 1 END) as rejected_referrals
    FROM affiliate_referrals ar
    LEFT JOIN affiliate_conversions ac ON ar.id = ac.referral_id
    WHERE ar.referrer_id = ?
");
$statsStmt->execute([$memberId]);
$stats = $statsStmt->fetch(PDO::FETCH_ASSOC);
?>

<div class="row">
    <!-- Member Info -->
    <div class="col-md-6">
        <div class="card h-100">
            <div class="card-header bg-primary text-white">
                <h5><i class="fas fa-user"></i> Thông tin cơ bản</h5>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-4"><strong>ID:</strong></div>
                    <div class="col-8">
                        <span class="badge bg-secondary">#<?= $member['id'] ?></span>
                        <?php if ($member['is_hidden']): ?>
                            <span class="badge bg-warning ms-2">Đã ẩn</span>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-4"><strong>Họ tên:</strong></div>
                    <div class="col-8"><?= htmlspecialchars($member['name']) ?></div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-4"><strong>Vai trò:</strong></div>
                    <div class="col-8">
                        <span class="badge bg-<?= $member['role'] === 'teacher' ? 'info' : 'warning' ?>">
                            <i class="fas fa-<?= $member['role'] === 'teacher' ? 'chalkboard-teacher' : 'user-friends' ?>"></i>
                            <?= $member['role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                        </span>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-4"><strong>Số điện thoại:</strong></div>
                    <div class="col-8">
                        <a href="tel:<?= $member['phone'] ?>" class="text-decoration-none">
                            <i class="fas fa-phone text-success"></i> <?= htmlspecialchars($member['phone']) ?>
                        </a>
                    </div>
                </div>
                
                <?php if ($member['email']): ?>
                <div class="row mb-3">
                    <div class="col-4"><strong>Email:</strong></div>
                    <div class="col-8">
                        <a href="mailto:<?= $member['email'] ?>" class="text-decoration-none">
                            <i class="fas fa-envelope text-primary"></i> <?= htmlspecialchars($member['email']) ?>
                        </a>
                    </div>
                </div>
                <?php endif; ?>
                
                <div class="row mb-3">
                    <div class="col-4"><strong>Trạng thái:</strong></div>
                    <div class="col-8">
                        <span class="badge bg-<?= $member['status'] === 'active' ? 'success' : 
                                                ($member['status'] === 'inactive' ? 'warning' : 'danger') ?>">
                            <?= $member['status'] === 'active' ? 'Hoạt động' : 
                                ($member['status'] === 'inactive' ? 'Tạm ngưng' : 'Bị cấm') ?>
                        </span>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-4"><strong>Ngày tham gia:</strong></div>
                    <div class="col-8"><?= date('d/m/Y H:i', strtotime($member['created_at'])) ?></div>
                </div>
                
                <?php if ($member['qr_code']): ?>
                <div class="row mb-3">
                    <div class="col-4"><strong>QR Code:</strong></div>
                    <div class="col-8">
                        <img src="<?= htmlspecialchars($member['qr_code']) ?>" 
                             alt="QR Code" class="img-thumbnail" style="max-width: 100px;">
                    </div>
                </div>
                <?php endif; ?>
                
                <?php if ($member['bank_info']): ?>
                <div class="row mb-3">
                    <div class="col-4"><strong>Thông tin NH:</strong></div>
                    <div class="col-8">
                        <small class="text-muted">
                            <i class="fas fa-credit-card"></i> Đã cập nhật thông tin ngân hàng
                        </small>
                    </div>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <!-- Wallet Info -->
    <div class="col-md-6">
        <div class="card h-100">
            <div class="card-header bg-success text-white">
                <h5><i class="fas fa-wallet"></i> Thông tin ví</h5>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-6"><strong>Số dư hiện tại:</strong></div>
                    <div class="col-6">
                        <h4 class="text-success mb-0"><?= number_format($member['balance'] ?? 0) ?></h4>
                        <small class="text-muted"><?= $member['role'] === 'teacher' ? 'VND' : 'Điểm' ?></small>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-6"><strong>Tổng đã kiếm:</strong></div>
                    <div class="col-6">
                        <h5 class="text-primary mb-0"><?= number_format($member['total_earned'] ?? 0) ?></h5>
                        <small class="text-muted"><?= $member['role'] === 'teacher' ? 'VND' : 'Điểm' ?></small>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-6"><strong>Tổng đã rút:</strong></div>
                    <div class="col-6">
                        <h5 class="text-warning mb-0"><?= number_format($member['total_withdrawn'] ?? 0) ?></h5>
                        <small class="text-muted"><?= $member['role'] === 'teacher' ? 'VND' : 'Điểm' ?></small>
                    </div>
                </div>
                
                <?php if ($member['wallet_created']): ?>
                <div class="row mb-3">
                    <div class="col-6"><strong>Ví tạo lúc:</strong></div>
                    <div class="col-6"><?= date('d/m/Y H:i', strtotime($member['wallet_created'])) ?></div>
                </div>
                <?php endif; ?>
                
                <hr>
                
                <!-- Performance Stats -->
                <h6><i class="fas fa-chart-bar"></i> Thống kê hiệu suất</h6>
                <div class="row">
                    <div class="col-6 text-center">
                        <div class="border rounded p-2 mb-2">
                            <h4 class="text-primary mb-0"><?= $stats['total_referrals'] ?></h4>
                            <small>Tổng giới thiệu</small>
                        </div>
                    </div>
                    <div class="col-6 text-center">
                        <div class="border rounded p-2 mb-2">
                            <h4 class="text-success mb-0"><?= $stats['confirmed_referrals'] ?></h4>
                            <small>Thành công</small>
                        </div>
                    </div>
                    <div class="col-6 text-center">
                        <div class="border rounded p-2 mb-2">
                            <h4 class="text-warning mb-0"><?= $stats['pending_referrals'] ?></h4>
                            <small>Chờ duyệt</small>
                        </div>
                    </div>
                    <div class="col-6 text-center">
                        <div class="border rounded p-2 mb-2">
                            <h4 class="text-danger mb-0"><?= $stats['rejected_referrals'] ?></h4>
                            <small>Từ chối</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Recent Activities -->
<div class="row mt-4">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5><i class="fas fa-handshake"></i> Giới thiệu gần đây (10 mới nhất)</h5>
            </div>
            <div class="card-body">
                <?php if (empty($referrals)): ?>
                    <p class="text-muted text-center">Chưa có giới thiệu nào</p>
                <?php else: ?>
                    <div class="list-group list-group-flush">
                        <?php foreach ($referrals as $referral): ?>
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1"><?= htmlspecialchars($referral['referee_name']) ?></h6>
                                        <p class="mb-1">
                                            <small class="text-muted">
                                                <i class="fas fa-phone"></i> <?= htmlspecialchars($referral['referee_phone']) ?>
                                            </small>
                                        </p>
                                        <small class="text-muted"><?= date('d/m/Y H:i', strtotime($referral['created_at'])) ?></small>
                                    </div>
                                    <div>
                                        <?php if ($referral['manual_status']): ?>
                                            <?php
                                            $statusBadge = [
                                                'pending' => '<span class="badge bg-warning text-dark">Chờ duyệt</span>',
                                                'confirmed' => '<span class="badge bg-success">Thành công</span>',
                                                'rejected' => '<span class="badge bg-danger">Từ chối</span>'
                                            ];
                                            echo $statusBadge[$referral['manual_status']] ?? '';
                                            ?>
                                        <?php else: ?>
                                            <span class="badge bg-secondary">Chưa conversion</span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <?php if ($referral['notes']): ?>
                                    <small class="text-info d-block mt-1">
                                        <i class="fas fa-note-sticky"></i> <?= htmlspecialchars($referral['notes']) ?>
                                    </small>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="text-center mt-3">
                        <a href="?page=admin_affiliate&action=referrals&search=<?= urlencode($member['name']) ?>" 
                           class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-external-link-alt"></i> Xem tất cả giới thiệu
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5><i class="fas fa-exchange-alt"></i> Giao dịch gần đây (10 mới nhất)</h5>
            </div>
            <div class="card-body">
                <?php if (empty($transactions)): ?>
                    <p class="text-muted text-center">Chưa có giao dịch nào</p>
                <?php else: ?>
                    <div class="list-group list-group-flush">
                        <?php foreach ($transactions as $transaction): ?>
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="mb-1">
                                            <?php
                                            $typeLabels = [
                                                'referral_reward' => 'Thưởng giới thiệu',
                                                'withdrawal' => 'Rút tiền',
                                                'withdrawal_rejected' => 'Hoàn tiền',
                                                'bonus' => 'Thưởng milestone'
                                            ];
                                            echo $typeLabels[$transaction['type']] ?? $transaction['type'];
                                            ?>
                                        </h6>
                                        <p class="mb-1">
                                            <small class="text-muted"><?= htmlspecialchars($transaction['description']) ?></small>
                                        </p>
                                        <small class="text-muted"><?= date('d/m/Y H:i', strtotime($transaction['created_at'])) ?></small>
                                    </div>
                                    <div class="text-end">
                                        <h6 class="mb-1 text-<?= $transaction['amount'] > 0 ? 'success' : 'danger' ?>">
                                            <?= $transaction['amount'] > 0 ? '+' : '' ?><?= number_format($transaction['amount']) ?>
                                        </h6>
                                        <span class="badge bg-<?= $transaction['status'] === 'completed' ? 'success' : 
                                                                  ($transaction['status'] === 'pending' ? 'warning' : 'danger') ?>">
                                            <?= $transaction['status'] === 'completed' ? 'Hoàn thành' : 
                                                ($transaction['status'] === 'pending' ? 'Đang xử lý' : 'Thất bại') ?>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="text-center mt-3">
                        <a href="?page=admin_affiliate&action=transactions&member=<?= urlencode($member['name']) ?>" 
                           class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-external-link-alt"></i> Xem tất cả giao dịch
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Action Buttons -->
<div class="row mt-4">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <h5><i class="fas fa-tools"></i> Hành động quản trị</h5>
                <div class="btn-group" role="group">
                    <?php if ($member['is_hidden']): ?>
                        <button class="btn btn-success" onclick="toggleMemberVisibility(<?= $member['id'] ?>, false)">
                            <i class="fas fa-eye"></i> Hiện thành viên
                        </button>
                    <?php else: ?>
                        <button class="btn btn-outline-secondary" onclick="toggleMemberVisibility(<?= $member['id'] ?>, true)">
                            <i class="fas fa-eye-slash"></i> Ẩn thành viên
                        </button>
                    <?php endif; ?>
                    
                    <a href="?page=admin_affiliate&action=genealogy&search=<?= urlencode($member['phone']) ?>" 
                       class="btn btn-outline-info">
                        <i class="fas fa-sitemap"></i> Xem cây phả hệ
                    </a>
                    
                    <a href="?page=admin_affiliate&action=payments&member=<?= urlencode($member['name']) ?>" 
                       class="btn btn-outline-warning">
                        <i class="fas fa-money-bill-wave"></i> Quản lý thanh toán
                    </a>
                    
                    <a href="?page=admin_affiliate&action=conversions&referrer=<?= $member['id'] ?>" 
                       class="btn btn-outline-primary">
                        <i class="fas fa-check-circle"></i> Xem conversion
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function toggleMemberVisibility(memberId, isHidden) {
    const message = isHidden ? 'Bạn có chắc muốn ẩn thành viên này?' : 'Bạn có chắc muốn hiện thành viên này?';
    
    if (confirm(message)) {
        const formData = new FormData();
        formData.append('action', 'toggle_visibility');
        formData.append('member_id', memberId);
        formData.append('is_hidden', isHidden);
        
        fetch('?page=admin_affiliate&action=members', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', data.message);
                setTimeout(() => {
                    // Reload the modal content
                    fetch(`?page=admin_affiliate&action=member_details&id=${memberId}`)
                        .then(response => response.text())
                        .then(html => {
                            document.getElementById('memberDetailsContent').innerHTML = html;
                        });
                }, 1500);
            } else {
                showAlert('danger', data.message);
            }
        })
        .catch(error => {
            showAlert('danger', 'Lỗi kết nối: ' + error.message);
        });
    }
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 5000);
}
</script>