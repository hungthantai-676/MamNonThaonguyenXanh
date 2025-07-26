<?php
require_once '../includes/affiliate_functions.php';

$db = getDB();

// Get affiliate statistics
$totalMembers = $db->fetch("SELECT COUNT(*) as count FROM affiliate_members WHERE status = 'active'")['count'];
$totalTeachers = $db->fetch("SELECT COUNT(*) as count FROM affiliate_members WHERE role = 'teacher' AND status = 'active'")['count'];
$totalParents = $db->fetch("SELECT COUNT(*) as count FROM affiliate_members WHERE role = 'parent' AND status = 'active'")['count'];
$totalReferrals = $db->fetch("SELECT COUNT(*) as count FROM referrals WHERE status IN ('confirmed', 'enrolled')")['count'];
$totalRewards = $db->fetch("SELECT SUM(wallet_balance) as total FROM affiliate_members WHERE role = 'teacher'")['total'] ?: 0;
$totalPoints = $db->fetch("SELECT SUM(points_balance) as total FROM affiliate_members WHERE role = 'parent'")['total'] ?: 0;

// Get recent activities
$recentReferrals = $db->fetchAll("
    SELECT r.*, am.name as referrer_name, am.role as referrer_role 
    FROM referrals r 
    JOIN affiliate_members am ON r.referrer_id = am.member_id 
    ORDER BY r.created_at DESC 
    LIMIT 10
");

// Get top performers
$topTeachers = $db->fetchAll("
    SELECT * FROM affiliate_members 
    WHERE role = 'teacher' AND status = 'active' 
    ORDER BY total_referrals DESC, wallet_balance DESC 
    LIMIT 5
");

$topParents = $db->fetchAll("
    SELECT * FROM affiliate_members 
    WHERE role = 'parent' AND status = 'active' 
    ORDER BY total_referrals DESC, points_balance DESC 
    LIMIT 5
");
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3">📊 Tổng quan Affiliate</h1>
    <div>
        <button class="btn btn-outline-primary btn-sm" onclick="window.print()">
            <i class="fas fa-print"></i> In báo cáo
        </button>
        <button class="btn btn-success btn-sm" onclick="affiliateAdmin.exportData('overview')">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Statistics Cards -->
<div class="row g-4 mb-4">
    <div class="col-lg-2 col-md-4 col-sm-6">
        <div class="card bg-primary text-white h-100">
            <div class="card-body text-center">
                <i class="fas fa-users fa-3x mb-3"></i>
                <h4 class="card-title"><?= number_format($totalMembers) ?></h4>
                <p class="card-text">Tổng thành viên</p>
            </div>
        </div>
    </div>
    
    <div class="col-lg-2 col-md-4 col-sm-6">
        <div class="card bg-success text-white h-100">
            <div class="card-body text-center">
                <i class="fas fa-chalkboard-teacher fa-3x mb-3"></i>
                <h4 class="card-title"><?= number_format($totalTeachers) ?></h4>
                <p class="card-text">Giáo viên</p>
            </div>
        </div>
    </div>
    
    <div class="col-lg-2 col-md-4 col-sm-6">
        <div class="card bg-warning text-white h-100">
            <div class="card-body text-center">
                <i class="fas fa-user-friends fa-3x mb-3"></i>
                <h4 class="card-title"><?= number_format($totalParents) ?></h4>
                <p class="card-text">Phụ huynh</p>
            </div>
        </div>
    </div>
    
    <div class="col-lg-2 col-md-4 col-sm-6">
        <div class="card bg-info text-white h-100">
            <div class="card-body text-center">
                <i class="fas fa-handshake fa-3x mb-3"></i>
                <h4 class="card-title"><?= number_format($totalReferrals) ?></h4>
                <p class="card-text">Giới thiệu thành công</p>
            </div>
        </div>
    </div>
    
    <div class="col-lg-2 col-md-4 col-sm-6">
        <div class="card bg-success text-white h-100">
            <div class="card-body text-center">
                <i class="fas fa-money-bill-wave fa-3x mb-3"></i>
                <h4 class="card-title"><?= formatCurrency($totalRewards) ?></h4>
                <p class="card-text">Tổng thưởng VNĐ</p>
            </div>
        </div>
    </div>
    
    <div class="col-lg-2 col-md-4 col-sm-6">
        <div class="card bg-warning text-white h-100">
            <div class="card-body text-center">
                <i class="fas fa-star fa-3x mb-3"></i>
                <h4 class="card-title"><?= formatPoints($totalPoints) ?></h4>
                <p class="card-text">Tổng điểm thưởng</p>
            </div>
        </div>
    </div>
</div>

<!-- Current Reward Rates -->
<div class="row mb-4">
    <div class="col-md-6">
        <div class="card border-success">
            <div class="card-header bg-success text-white">
                <h5 class="mb-0"><i class="fas fa-chalkboard-teacher"></i> Thưởng Giáo Viên</h5>
            </div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-6">
                        <h3 class="text-success">2,000,000 VNĐ</h3>
                        <p class="text-muted">Mỗi học sinh</p>
                    </div>
                    <div class="col-6">
                        <h3 class="text-warning">+10,000,000 VNĐ</h3>
                        <p class="text-muted">Thưởng mốc 5 HS</p>
                    </div>
                </div>
                <hr>
                <p class="text-center mb-0"><strong>Ví dụ:</strong> 5 học sinh = 20,000,000 VNĐ total</p>
            </div>
        </div>
    </div>
    
    <div class="col-md-6">
        <div class="card border-warning">
            <div class="card-header bg-warning text-white">
                <h5 class="mb-0"><i class="fas fa-users"></i> Thưởng Phụ Huynh</h5>
            </div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-6">
                        <h3 class="text-warning">2,000 điểm</h3>
                        <p class="text-muted">Mỗi học sinh</p>
                    </div>
                    <div class="col-6">
                        <h3 class="text-success">+10,000 điểm</h3>
                        <p class="text-muted">Thưởng mốc 5 HS</p>
                    </div>
                </div>
                <hr>
                <p class="text-center mb-0"><strong>Ví dụ:</strong> 5 học sinh = 20,000 điểm total</p>
            </div>
        </div>
    </div>
</div>

<!-- Top Performers -->
<div class="row mb-4">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header bg-success text-white">
                <h5 class="mb-0"><i class="fas fa-trophy"></i> Top Giáo Viên</h5>
            </div>
            <div class="card-body">
                <?php if (empty($topTeachers)): ?>
                    <p class="text-center text-muted">Chưa có dữ liệu</p>
                <?php else: ?>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>HS</th>
                                    <th>Thưởng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($topTeachers as $teacher): ?>
                                <tr>
                                    <td>
                                        <strong><?= htmlspecialchars($teacher['name']) ?></strong><br>
                                        <small class="text-muted"><?= $teacher['member_id'] ?></small>
                                    </td>
                                    <td><?= $teacher['total_referrals'] ?></td>
                                    <td class="text-success"><?= formatCurrency($teacher['wallet_balance']) ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <div class="col-md-6">
        <div class="card">
            <div class="card-header bg-warning text-white">
                <h5 class="mb-0"><i class="fas fa-star"></i> Top Phụ Huynh</h5>
            </div>
            <div class="card-body">
                <?php if (empty($topParents)): ?>
                    <p class="text-center text-muted">Chưa có dữ liệu</p>
                <?php else: ?>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>HS</th>
                                    <th>Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($topParents as $parent): ?>
                                <tr>
                                    <td>
                                        <strong><?= htmlspecialchars($parent['name']) ?></strong><br>
                                        <small class="text-muted"><?= $parent['member_id'] ?></small>
                                    </td>
                                    <td><?= $parent['total_referrals'] ?></td>
                                    <td class="text-warning"><?= formatPoints($parent['points_balance']) ?> điểm</td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Recent Activity -->
<div class="card">
    <div class="card-header">
        <h5 class="mb-0"><i class="fas fa-clock"></i> Hoạt động gần đây</h5>
    </div>
    <div class="card-body">
        <?php if (empty($recentReferrals)): ?>
            <div class="text-center py-4">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Chưa có hoạt động nào</h5>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Người giới thiệu</th>
                            <th>Học sinh</th>
                            <th>Phụ huynh</th>
                            <th>Trạng thái</th>
                            <th>Thưởng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recentReferrals as $referral): ?>
                        <tr>
                            <td><?= formatDate($referral['created_at']) ?></td>
                            <td>
                                <strong><?= htmlspecialchars($referral['referrer_name']) ?></strong><br>
                                <small class="text-muted">
                                    <i class="fas fa-<?= $referral['referrer_role'] === 'teacher' ? 'chalkboard-teacher' : 'users' ?>"></i>
                                    <?= $referral['referrer_role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                                </small>
                            </td>
                            <td><?= htmlspecialchars($referral['student_name']) ?></td>
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
                                <?php if ($referral['referrer_role'] === 'teacher'): ?>
                                    <span class="text-success"><?= formatCurrency($referral['reward_amount']) ?></span>
                                <?php else: ?>
                                    <span class="text-warning"><?= number_format($referral['reward_points']) ?> điểm</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>