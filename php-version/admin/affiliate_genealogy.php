<?php
// Affiliate Genealogy Tree Management
$db = getDB();

// Get member data for tree visualization
$stmt = $db->prepare("
    SELECT 
        am.id,
        am.name,
        am.role,
        am.phone,
        am.status,
        am.created_at,
        aw.balance,
        aw.total_earned,
        COUNT(ar.id) as referral_count,
        COUNT(CASE WHEN ac.manual_status = 'confirmed' THEN 1 END) as confirmed_count,
        GROUP_CONCAT(ar2.referee_name SEPARATOR ', ') as referrals_list
    FROM affiliate_members am
    LEFT JOIN affiliate_wallets aw ON am.id = aw.member_id
    LEFT JOIN affiliate_referrals ar ON am.id = ar.referrer_id
    LEFT JOIN affiliate_conversions ac ON ar.id = ac.referral_id
    LEFT JOIN affiliate_referrals ar2 ON am.id = ar2.referrer_id
    WHERE am.status = 'active'
    GROUP BY am.id
    ORDER BY aw.total_earned DESC, am.created_at ASC
");
$stmt->execute();
$members = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get top performers for highlight
$topPerformers = array_slice($members, 0, 10);

// Get recent activity
$recentStmt = $db->prepare("
    SELECT 
        ar.created_at,
        am.name as referrer_name,
        ar.referee_name,
        ac.manual_status,
        am.role
    FROM affiliate_referrals ar
    JOIN affiliate_members am ON ar.referrer_id = am.id
    LEFT JOIN affiliate_conversions ac ON ar.id = ac.referral_id
    ORDER BY ar.created_at DESC
    LIMIT 20
");
$recentStmt->execute();
$recentActivity = $recentStmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-sitemap text-info"></i> Cây Phả Hệ Affiliate</h2>
    <div>
        <button class="btn btn-outline-primary" onclick="location.reload()">
            <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="btn btn-info" onclick="toggleTreeView()">
            <i class="fas fa-exchange-alt"></i> Chuyển view
        </button>
        <button class="btn btn-success" onclick="affiliateAdmin.exportData('genealogy')">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Network Statistics -->
<div class="row mb-4">
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title">Tổng thành viên</h6>
                        <h3 class="mb-0"><?= number_format(count($members)) ?></h3>
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
                        <h6 class="card-title">Tổng giới thiệu</h6>
                        <h3 class="mb-0"><?= number_format(array_sum(array_column($members, 'referral_count'))) ?></h3>
                        <small>Học sinh được giới thiệu</small>
                    </div>
                    <i class="fas fa-handshake fa-2x"></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title">Thành công</h6>
                        <h3 class="mb-0"><?= number_format(array_sum(array_column($members, 'confirmed_count'))) ?></h3>
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
                        <h6 class="card-title">Tổng thưởng</h6>
                        <h3 class="mb-0"><?= number_format(array_sum(array_column($members, 'total_earned'))) ?></h3>
                        <small>VND/Điểm đã trả</small>
                    </div>
                    <i class="fas fa-money-bill-wave fa-2x"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- View Toggle Buttons -->
<div class="card mb-4">
    <div class="card-body">
        <div class="btn-group w-100" role="group">
            <button type="button" class="btn btn-outline-primary active" id="treeViewBtn" onclick="showTreeView()">
                <i class="fas fa-sitemap"></i> Cây phả hệ
            </button>
            <button type="button" class="btn btn-outline-success" id="listViewBtn" onclick="showListView()">
                <i class="fas fa-list"></i> Danh sách thành viên
            </button>
            <button type="button" class="btn btn-outline-info" id="activityViewBtn" onclick="showActivityView()">
                <i class="fas fa-history"></i> Hoạt động gần đây
            </button>
        </div>
    </div>
</div>

<!-- Tree View -->
<div id="treeView" class="view-content">
    <div class="card">
        <div class="card-header">
            <h5><i class="fas fa-sitemap"></i> Cây phả hệ Top 10 Performer</h5>
        </div>
        <div class="card-body">
            <div class="row">
                <?php foreach ($topPerformers as $index => $member): ?>
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card border-<?= $member['role'] === 'teacher' ? 'info' : 'warning' ?> h-100">
                            <div class="card-header bg-<?= $member['role'] === 'teacher' ? 'info' : 'warning' ?> text-white">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0">
                                        <i class="fas fa-<?= $index < 3 ? 'crown' : 'user' ?>"></i>
                                        #<?= $index + 1 ?> <?= htmlspecialchars($member['name']) ?>
                                    </h6>
                                    <span class="badge bg-light text-dark">
                                        <?= $member['role'] === 'teacher' ? 'GV' : 'PH' ?>
                                    </span>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="mb-2">
                                    <strong>📞 SĐT:</strong> <?= htmlspecialchars($member['phone']) ?>
                                </div>
                                <div class="mb-2">
                                    <strong>💰 Ví:</strong> 
                                    <span class="text-success"><?= number_format($member['balance'] ?? 0) ?></span>
                                </div>
                                <div class="mb-2">
                                    <strong>🎯 Tổng kiếm:</strong> 
                                    <span class="text-primary"><?= number_format($member['total_earned'] ?? 0) ?></span>
                                </div>
                                <div class="mb-2">
                                    <strong>🤝 Giới thiệu:</strong> 
                                    <span class="badge bg-primary"><?= (int)$member['referral_count'] ?> tổng</span>
                                    <span class="badge bg-success"><?= (int)$member['confirmed_count'] ?> thành công</span>
                                </div>
                                
                                <?php if ($member['referrals_list']): ?>
                                    <div class="mt-3">
                                        <strong>👥 Học sinh:</strong>
                                        <div class="small text-muted mt-1">
                                            <?= htmlspecialchars(substr($member['referrals_list'], 0, 100)) ?>
                                            <?= strlen($member['referrals_list']) > 100 ? '...' : '' ?>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                
                                <div class="mt-3">
                                    <small class="text-muted">
                                        <i class="fas fa-calendar"></i> 
                                        Tham gia: <?= date('d/m/Y', strtotime($member['created_at'])) ?>
                                    </small>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="btn-group w-100">
                                    <a href="?page=admin_affiliate&action=members&search=<?= urlencode($member['phone']) ?>" 
                                       class="btn btn-outline-primary btn-sm">
                                        <i class="fas fa-eye"></i> Chi tiết
                                    </a>
                                    <a href="?page=admin_affiliate&action=referrals&search=<?= urlencode($member['name']) ?>" 
                                       class="btn btn-outline-success btn-sm">
                                        <i class="fas fa-handshake"></i> Giới thiệu
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>

<!-- List View -->
<div id="listView" class="view-content" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5><i class="fas fa-list"></i> Danh sách tất cả thành viên</h5>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>Thứ hạng</th>
                            <th>Thành viên</th>
                            <th>Vai trò</th>
                            <th>Giới thiệu</th>
                            <th>Ví tiền</th>
                            <th>Tham gia</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($members as $index => $member): ?>
                            <tr>
                                <td>
                                    <span class="badge bg-<?= $index < 3 ? 'warning' : 'secondary' ?>">
                                        <?php if ($index < 3): ?>
                                            <i class="fas fa-crown"></i>
                                        <?php endif; ?>
                                        #<?= $index + 1 ?>
                                    </span>
                                </td>
                                <td>
                                    <div>
                                        <strong><?= htmlspecialchars($member['name']) ?></strong>
                                        <br>
                                        <small class="text-muted">
                                            <i class="fas fa-phone"></i> <?= htmlspecialchars($member['phone']) ?>
                                        </small>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-<?= $member['role'] === 'teacher' ? 'info' : 'warning' ?>">
                                        <i class="fas fa-<?= $member['role'] === 'teacher' ? 'chalkboard-teacher' : 'user-friends' ?>"></i>
                                        <?= $member['role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                                    </span>
                                </td>
                                <td>
                                    <div>
                                        <span class="badge bg-primary"><?= (int)$member['referral_count'] ?> tổng</span>
                                        <br>
                                        <span class="badge bg-success"><?= (int)$member['confirmed_count'] ?> thành công</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong class="text-success"><?= number_format($member['balance'] ?? 0) ?></strong>
                                        <br>
                                        <small class="text-muted">Tổng: <?= number_format($member['total_earned'] ?? 0) ?></small>
                                    </div>
                                </td>
                                <td>
                                    <?= date('d/m/Y', strtotime($member['created_at'])) ?>
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <a href="?page=admin_affiliate&action=members&search=<?= urlencode($member['phone']) ?>" 
                                           class="btn btn-outline-primary btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="?page=admin_affiliate&action=referrals&search=<?= urlencode($member['name']) ?>" 
                                           class="btn btn-outline-success btn-sm">
                                            <i class="fas fa-handshake"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Activity View -->
<div id="activityView" class="view-content" style="display: none;">
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
                                <div class="timeline-icon me-3">
                                    <span class="badge bg-<?= $activity['manual_status'] === 'pending' ? 'warning' : 
                                                            ($activity['manual_status'] === 'confirmed' ? 'success' : 
                                                            ($activity['manual_status'] === 'rejected' ? 'danger' : 'secondary')) ?> rounded-pill">
                                        <i class="fas fa-<?= $activity['manual_status'] === 'pending' ? 'clock' : 
                                                            ($activity['manual_status'] === 'confirmed' ? 'check' : 
                                                            ($activity['manual_status'] === 'rejected' ? 'times' : 'user-plus')) ?>"></i>
                                    </span>
                                </div>
                                <div class="timeline-content flex-grow-1">
                                    <div class="card">
                                        <div class="card-body p-3">
                                            <div class="d-flex justify-content-between">
                                                <h6 class="mb-1">
                                                    <strong><?= htmlspecialchars($activity['referrer_name']) ?></strong>
                                                    <span class="badge badge-sm bg-<?= $activity['role'] === 'teacher' ? 'info' : 'warning' ?>">
                                                        <?= $activity['role'] === 'teacher' ? 'GV' : 'PH' ?>
                                                    </span>
                                                </h6>
                                                <small class="text-muted"><?= date('d/m/Y H:i', strtotime($activity['created_at'])) ?></small>
                                            </div>
                                            <p class="mb-1">Giới thiệu học sinh: <strong><?= htmlspecialchars($activity['referee_name']) ?></strong></p>
                                            <small class="text-muted">
                                                Trạng thái: 
                                                <?php
                                                $statusText = [
                                                    'pending' => 'Chờ xác nhận',
                                                    'confirmed' => 'Đã xác nhận',
                                                    'rejected' => 'Từ chối',
                                                    null => 'Chưa conversion'
                                                ];
                                                echo $statusText[$activity['manual_status']] ?? 'Chưa conversion';
                                                ?>
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<script>
function showTreeView() {
    document.getElementById('treeView').style.display = 'block';
    document.getElementById('listView').style.display = 'none';
    document.getElementById('activityView').style.display = 'none';
    
    document.getElementById('treeViewBtn').classList.add('active');
    document.getElementById('listViewBtn').classList.remove('active');
    document.getElementById('activityViewBtn').classList.remove('active');
}

function showListView() {
    document.getElementById('treeView').style.display = 'none';
    document.getElementById('listView').style.display = 'block';
    document.getElementById('activityView').style.display = 'none';
    
    document.getElementById('treeViewBtn').classList.remove('active');
    document.getElementById('listViewBtn').classList.add('active');
    document.getElementById('activityViewBtn').classList.remove('active');
}

function showActivityView() {
    document.getElementById('treeView').style.display = 'none';
    document.getElementById('listView').style.display = 'none';
    document.getElementById('activityView').style.display = 'block';
    
    document.getElementById('treeViewBtn').classList.remove('active');
    document.getElementById('listViewBtn').classList.remove('active');
    document.getElementById('activityViewBtn').classList.add('active');
}

function toggleTreeView() {
    if (document.getElementById('treeView').style.display !== 'none') {
        showListView();
    } else if (document.getElementById('listView').style.display !== 'none') {
        showActivityView();
    } else {
        showTreeView();
    }
}
</script>

<style>
.timeline-item {
    position: relative;
}

.timeline-icon {
    flex-shrink: 0;
}

.timeline-content .card {
    background: #f8f9fa;
    border-left: 3px solid #007bff;
    margin-left: 10px;
}

.badge-sm {
    font-size: 0.7rem;
}

.view-content {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card-header.bg-info,
.card-header.bg-warning {
    color: white !important;
}

.btn-group .btn {
    font-size: 0.8rem;
}
</style>