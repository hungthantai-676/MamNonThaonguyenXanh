<?php
// Affiliate Overview Dashboard
$db = getDB();

// Get statistics
$stats = [];

// Total members
$stmt = $db->query("SELECT COUNT(*) as total FROM affiliate_members WHERE status = 'active'");
$stats['total_members'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Total referrals
$stmt = $db->query("SELECT COUNT(*) as total FROM affiliate_referrals");
$stats['total_referrals'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Pending conversions
$stmt = $db->query("SELECT COUNT(*) as total FROM affiliate_conversions WHERE manual_status = 'pending'");
$stats['pending_conversions'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Total rewards paid
$stmt = $db->query("SELECT SUM(amount) as total FROM affiliate_transactions WHERE type = 'referral_reward' AND status = 'completed'");
$stats['total_rewards'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

// Recent activity
$recentStmt = $db->prepare("
    SELECT 
        ac.*,
        ar.referrer_id,
        am.name as referrer_name,
        am.role as referrer_role
    FROM affiliate_conversions ac
    JOIN affiliate_referrals ar ON ac.referral_id = ar.id
    JOIN affiliate_members am ON ar.referrer_id = am.id
    ORDER BY ac.created_at DESC
    LIMIT 10
");
$recentStmt->execute();
$recentActivity = $recentStmt->fetchAll(PDO::FETCH_ASSOC);

// Top performers
$topStmt = $db->prepare("
    SELECT 
        am.name,
        am.role,
        COUNT(ar.id) as referral_count,
        aw.balance,
        aw.total_earned
    FROM affiliate_members am
    LEFT JOIN affiliate_referrals ar ON am.id = ar.referrer_id
    LEFT JOIN affiliate_wallets aw ON am.id = aw.member_id
    WHERE am.status = 'active'
    GROUP BY am.id
    ORDER BY referral_count DESC, aw.total_earned DESC
    LIMIT 10
");
$topStmt->execute();
$topPerformers = $topStmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-chart-line text-primary"></i> Dashboard Affiliate</h2>
    <div>
        <button class="btn btn-outline-primary" onclick="location.reload()">
            <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="btn btn-success" onclick="affiliateAdmin.exportData('overview')">
            <i class="fas fa-download"></i> Xuất báo cáo
        </button>
    </div>
</div>

<!-- Statistics Cards -->
<div class="row mb-4">
    <div class="col-md-3 mb-3">
        <div class="card bg-primary text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6 class="card-title">Tổng thành viên</h6>
                        <h3 class="mb-0"><?= number_format($stats['total_members']) ?></h3>
                        <small>Thành viên đang hoạt động</small>
                    </div>
                    <div class="align-self-center">
                        <i class="fas fa-users fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-3 mb-3">
        <div class="card bg-success text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6 class="card-title">Tổng giới thiệu</h6>
                        <h3 class="mb-0"><?= number_format($stats['total_referrals']) ?></h3>
                        <small>Học sinh được giới thiệu</small>
                    </div>
                    <div class="align-self-center">
                        <i class="fas fa-handshake fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-3 mb-3">
        <div class="card bg-warning text-dark">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6 class="card-title">Chờ xác nhận</h6>
                        <h3 class="mb-0"><?= number_format($stats['pending_conversions']) ?></h3>
                        <small>Conversion cần xử lý</small>
                    </div>
                    <div class="align-self-center">
                        <i class="fas fa-clock fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-3 mb-3">
        <div class="card bg-info text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6 class="card-title">Tổng thưởng</h6>
                        <h3 class="mb-0"><?= number_format($stats['total_rewards']) ?></h3>
                        <small>VND/Điểm đã trả</small>
                    </div>
                    <div class="align-self-center">
                        <i class="fas fa-money-bill-wave fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Quick Actions -->
<div class="row mb-4">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <h5><i class="fas fa-rocket"></i> Thao tác nhanh</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <a href="?page=admin_affiliate&action=conversions&status=pending" class="btn btn-warning btn-lg w-100">
                            <i class="fas fa-user-check d-block fa-2x mb-2"></i>
                            Xác nhận Conversion
                            <?php if ($stats['pending_conversions'] > 0): ?>
                                <span class="badge bg-danger"><?= $stats['pending_conversions'] ?></span>
                            <?php endif; ?>
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="?page=admin_affiliate&action=members" class="btn btn-primary btn-lg w-100">
                            <i class="fas fa-users d-block fa-2x mb-2"></i>
                            Quản lý Thành viên
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="?page=admin_affiliate&action=payments" class="btn btn-success btn-lg w-100">
                            <i class="fas fa-money-bill-wave d-block fa-2x mb-2"></i>
                            Xử lý Thanh toán
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="?page=admin_affiliate&action=genealogy" class="btn btn-info btn-lg w-100">
                            <i class="fas fa-sitemap d-block fa-2x mb-2"></i>
                            Xem Cây Phả Hệ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <!-- Recent Activity -->
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h5><i class="fas fa-history"></i> Hoạt động gần đây</h5>
            </div>
            <div class="card-body">
                <?php if (empty($recentActivity)): ?>
                    <div class="text-center py-4">
                        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Chưa có hoạt động nào</p>
                    </div>
                <?php else: ?>
                    <div class="timeline">
                        <?php foreach ($recentActivity as $activity): ?>
                            <div class="timeline-item mb-3">
                                <div class="d-flex">
                                    <div class="timeline-icon">
                                        <span class="badge bg-<?= $activity['manual_status'] === 'pending' ? 'warning' : 
                                                                ($activity['manual_status'] === 'confirmed' ? 'success' : 'danger') ?> rounded-pill">
                                            <i class="fas fa-<?= $activity['manual_status'] === 'pending' ? 'clock' : 
                                                                ($activity['manual_status'] === 'confirmed' ? 'check' : 'times') ?>"></i>
                                        </span>
                                    </div>
                                    <div class="timeline-content ms-3 flex-grow-1">
                                        <div class="d-flex justify-content-between">
                                            <h6 class="mb-1">
                                                <strong><?= htmlspecialchars($activity['referrer_name']) ?></strong>
                                                (<?= $activity['referrer_role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>)
                                            </h6>
                                            <small class="text-muted"><?= date('d/m/Y H:i', strtotime($activity['created_at'])) ?></small>
                                        </div>
                                        <p class="mb-1">Giới thiệu học sinh: <strong><?= htmlspecialchars($activity['student_name']) ?></strong></p>
                                        <small class="text-muted">
                                            Trạng thái: 
                                            <?php
                                            $statusText = [
                                                'pending' => 'Chờ xác nhận',
                                                'confirmed' => 'Đã xác nhận',
                                                'rejected' => 'Từ chối'
                                            ];
                                            echo $statusText[$activity['manual_status']] ?? 'Unknown';
                                            ?>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="text-center">
                        <a href="?page=admin_affiliate&action=conversions" class="btn btn-outline-primary">
                            Xem tất cả hoạt động
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <!-- Top Performers -->
    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <h5><i class="fas fa-trophy"></i> Top Affiliate</h5>
            </div>
            <div class="card-body">
                <?php if (empty($topPerformers)): ?>
                    <div class="text-center py-4">
                        <i class="fas fa-trophy fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Chưa có dữ liệu</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($topPerformers as $index => $performer): ?>
                        <div class="d-flex align-items-center mb-3 <?= $index < 3 ? 'border-bottom pb-3' : '' ?>">
                            <div class="me-3">
                                <?php if ($index < 3): ?>
                                    <span class="badge bg-<?= $index === 0 ? 'warning' : ($index === 1 ? 'secondary' : 'dark') ?> rounded-pill">
                                        #<?= $index + 1 ?>
                                    </span>
                                <?php else: ?>
                                    <span class="badge bg-light text-dark rounded-pill">#<?= $index + 1 ?></span>
                                <?php endif; ?>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="mb-1"><?= htmlspecialchars($performer['name']) ?></h6>
                                <small class="text-muted">
                                    <i class="fas fa-<?= $performer['role'] === 'teacher' ? 'chalkboard-teacher' : 'user-friends' ?>"></i>
                                    <?= $performer['role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                                </small>
                                <div class="mt-1">
                                    <small class="text-success">
                                        <i class="fas fa-handshake"></i> <?= (int)$performer['referral_count'] ?> giới thiệu
                                    </small>
                                    <br>
                                    <small class="text-info">
                                        <i class="fas fa-wallet"></i> <?= number_format($performer['total_earned'] ?? 0) ?>
                                    </small>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                    <div class="text-center">
                        <a href="?page=admin_affiliate&action=members" class="btn btn-outline-primary btn-sm">
                            Xem tất cả thành viên
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<style>
.timeline-item {
    position: relative;
}

.timeline-icon {
    flex-shrink: 0;
}

.timeline-content {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    border-left: 3px solid #007bff;
}

.card-body .btn-lg {
    height: auto;
    padding: 20px 15px;
}

.card-body .btn-lg i {
    font-size: 2rem;
    margin-bottom: 10px;
}

.badge.position-absolute {
    top: -5px;
    right: -5px;
}
</style>