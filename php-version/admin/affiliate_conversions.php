<?php
// Affiliate Conversions Management Page
$db = getDB();

// Handle conversion confirmation/update
if ($_POST && isset($_POST['action'])) {
    $response = ['success' => false, 'message' => ''];
    
    switch ($_POST['action']) {
        case 'confirm_conversion':
            $conversionId = (int)$_POST['conversion_id'];
            $manualStatus = $_POST['manual_status'] ?? 'confirmed';
            
            try {
                // Update conversion status
                $stmt = $db->prepare("
                    UPDATE affiliate_conversions 
                    SET manual_status = ?, 
                        confirmed_at = NOW(), 
                        confirmed_by = 'admin',
                        updated_at = NOW()
                    WHERE id = ?
                ");
                
                if ($stmt->execute([$manualStatus, $conversionId])) {
                    // Get conversion details for reward calculation
                    $conversionStmt = $db->prepare("
                        SELECT ac.*, ar.referrer_id, ar.referee_id, u.role
                        FROM affiliate_conversions ac
                        JOIN affiliate_referrals ar ON ac.referral_id = ar.id
                        JOIN affiliate_members u ON ar.referrer_id = u.id
                        WHERE ac.id = ?
                    ");
                    $conversionStmt->execute([$conversionId]);
                    $conversion = $conversionStmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($conversion && $manualStatus === 'confirmed') {
                        // Calculate and add rewards
                        $rewardAmount = 0;
                        if ($conversion['role'] === 'teacher') {
                            $rewardAmount = 2000000; // 2M VND
                        } else {
                            $rewardAmount = 2000; // 2000 points
                        }
                        
                        // Add reward to wallet
                        $walletStmt = $db->prepare("
                            UPDATE affiliate_wallets 
                            SET balance = balance + ?, 
                                total_earned = total_earned + ?,
                                updated_at = NOW()
                            WHERE member_id = ?
                        ");
                        $walletStmt->execute([$rewardAmount, $rewardAmount, $conversion['referrer_id']]);
                        
                        // Log transaction
                        $transactionStmt = $db->prepare("
                            INSERT INTO affiliate_transactions 
                            (member_id, type, amount, description, status, conversion_id, created_at)
                            VALUES (?, 'referral_reward', ?, ?, 'completed', ?, NOW())
                        ");
                        $description = $conversion['role'] === 'teacher' ? 
                            "Thưởng giới thiệu học sinh - 2M VND" : 
                            "Thưởng giới thiệu học sinh - 2000 điểm";
                        $transactionStmt->execute([
                            $conversion['referrer_id'], 
                            $rewardAmount, 
                            $description,
                            $conversionId
                        ]);
                        
                        $response['success'] = true;
                        $response['message'] = 'Conversion đã được xác nhận và thưởng đã được cộng vào ví!';
                    } else {
                        $response['success'] = true;
                        $response['message'] = 'Trạng thái conversion đã được cập nhật!';
                    }
                } else {
                    $response['message'] = 'Lỗi cập nhật database!';
                }
            } catch (Exception $e) {
                $response['message'] = 'Lỗi: ' . $e->getMessage();
            }
            
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
            break;
    }
}

// Get conversions list with pagination
$page = (int)($_GET['p'] ?? 1);
$perPage = 20;
$offset = ($page - 1) * $perPage;

// Filter options
$statusFilter = $_GET['status'] ?? '';
$roleFilter = $_GET['role'] ?? '';

$whereClause = "WHERE 1=1";
$params = [];

if ($statusFilter) {
    $whereClause .= " AND ac.manual_status = ?";
    $params[] = $statusFilter;
}

if ($roleFilter) {
    $whereClause .= " AND am.role = ?";
    $params[] = $roleFilter;
}

// Get total count
$countStmt = $db->prepare("
    SELECT COUNT(*) as total
    FROM affiliate_conversions ac
    JOIN affiliate_referrals ar ON ac.referral_id = ar.id  
    JOIN affiliate_members am ON ar.referrer_id = am.id
    $whereClause
");
$countStmt->execute($params);
$totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
$totalPages = ceil($totalCount / $perPage);

// Get conversions data
$stmt = $db->prepare("
    SELECT 
        ac.*,
        ar.referrer_id,
        ar.referee_id,
        ar.created_at as referral_date,
        am.name as referrer_name,
        am.role as referrer_role,
        am.phone as referrer_phone,
        aw.balance as referrer_balance
    FROM affiliate_conversions ac
    JOIN affiliate_referrals ar ON ac.referral_id = ar.id
    JOIN affiliate_members am ON ar.referrer_id = am.id
    LEFT JOIN affiliate_wallets aw ON am.id = aw.member_id
    $whereClause
    ORDER BY ac.created_at DESC
    LIMIT ? OFFSET ?
");

$params[] = $perPage;
$params[] = $offset;
$stmt->execute($params);
$conversions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get status counts for statistics
$statsStmt = $db->prepare("
    SELECT 
        ac.manual_status,
        COUNT(*) as count,
        SUM(CASE WHEN am.role = 'teacher' THEN 2000000 ELSE 2000 END) as total_rewards
    FROM affiliate_conversions ac
    JOIN affiliate_referrals ar ON ac.referral_id = ar.id
    JOIN affiliate_members am ON ar.referrer_id = am.id
    GROUP BY ac.manual_status
");
$statsStmt->execute();
$stats = $statsStmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-user-check text-success"></i> Quản lý Conversion</h2>
    <div>
        <button class="btn btn-outline-primary" onclick="location.reload()">
            <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="btn btn-success" onclick="affiliateAdmin.exportData('conversions')">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Statistics Cards -->
<div class="row mb-4">
    <?php 
    $statusColors = [
        'pending' => ['bg-warning', 'text-dark', 'Chờ xác nhận'],
        'confirmed' => ['bg-success', 'text-white', 'Đã xác nhận'], 
        'rejected' => ['bg-danger', 'text-white', 'Từ chối']
    ];
    
    foreach ($stats as $stat): 
        $colors = $statusColors[$stat['manual_status']] ?? ['bg-secondary', 'text-white', ucfirst($stat['manual_status'])];
    ?>
    <div class="col-md-4 mb-3">
        <div class="card <?= $colors[0] ?> <?= $colors[1] ?>">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6 class="card-title"><?= $colors[2] ?></h6>
                        <h3 class="mb-0"><?= number_format($stat['count']) ?></h3>
                        <small>Tổng thưởng: <?= number_format($stat['total_rewards']) ?></small>
                    </div>
                    <div class="align-self-center">
                        <i class="fas fa-<?= $stat['manual_status'] === 'pending' ? 'clock' : 
                                         ($stat['manual_status'] === 'confirmed' ? 'check-circle' : 'times-circle') ?> fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<!-- Filters -->
<div class="card mb-4">
    <div class="card-body">
        <form method="GET" class="row g-3">
            <input type="hidden" name="page" value="admin_affiliate">
            <input type="hidden" name="action" value="conversions">
            
            <div class="col-md-3">
                <label class="form-label">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="pending" <?= $statusFilter === 'pending' ? 'selected' : '' ?>>Chờ xác nhận</option>
                    <option value="confirmed" <?= $statusFilter === 'confirmed' ? 'selected' : '' ?>>Đã xác nhận</option>
                    <option value="rejected" <?= $statusFilter === 'rejected' ? 'selected' : '' ?>>Từ chối</option>
                </select>
            </div>
            
            <div class="col-md-3">
                <label class="form-label">Vai trò</label>
                <select name="role" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="teacher" <?= $roleFilter === 'teacher' ? 'selected' : '' ?>>Giáo viên</option>
                    <option value="parent" <?= $roleFilter === 'parent' ? 'selected' : '' ?>>Phụ huynh</option>
                </select>
            </div>
            
            <div class="col-md-3">
                <label class="form-label">&nbsp;</label>
                <div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-filter"></i> Lọc
                    </button>
                    <a href="?page=admin_affiliate&action=conversions" class="btn btn-outline-secondary">
                        <i class="fas fa-times"></i> Xóa lọc
                    </a>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Conversions Table -->
<div class="card">
    <div class="card-header">
        <h5><i class="fas fa-list"></i> Danh sách Conversion (<?= number_format($totalCount) ?> bản ghi)</h5>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Người giới thiệu</th>
                        <th>Thông tin học sinh</th>
                        <th>Vai trò</th>
                        <th>Ngày giới thiệu</th>
                        <th>Trạng thái</th>
                        <th>Thưởng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($conversions)): ?>
                        <tr>
                            <td colspan="8" class="text-center py-4">
                                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                <p class="text-muted">Chưa có conversion nào</p>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($conversions as $conversion): ?>
                            <tr>
                                <td>
                                    <span class="badge bg-secondary">#<?= $conversion['id'] ?></span>
                                </td>
                                <td>
                                    <div>
                                        <strong><?= htmlspecialchars($conversion['referrer_name']) ?></strong>
                                        <br>
                                        <small class="text-muted"><?= htmlspecialchars($conversion['referrer_phone']) ?></small>
                                        <br>
                                        <small class="text-success">Ví: <?= number_format($conversion['referrer_balance'] ?? 0) ?></small>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong><?= htmlspecialchars($conversion['student_name']) ?></strong>
                                        <br>
                                        <small class="text-muted">SĐT PH: <?= htmlspecialchars($conversion['parent_phone']) ?></small>
                                        <?php if ($conversion['notes']): ?>
                                            <br>
                                            <small class="text-info"><i class="fas fa-note-sticky"></i> <?= htmlspecialchars($conversion['notes']) ?></small>
                                        <?php endif; ?>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-<?= $conversion['referrer_role'] === 'teacher' ? 'info' : 'warning' ?>">
                                        <i class="fas fa-<?= $conversion['referrer_role'] === 'teacher' ? 'chalkboard-teacher' : 'user-friends' ?>"></i>
                                        <?= $conversion['referrer_role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                                    </span>
                                </td>
                                <td>
                                    <?= date('d/m/Y H:i', strtotime($conversion['referral_date'])) ?>
                                </td>
                                <td>
                                    <?php
                                    $statusBadge = [
                                        'pending' => '<span class="badge bg-warning text-dark"><i class="fas fa-clock"></i> Chờ xác nhận</span>',
                                        'confirmed' => '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Đã xác nhận</span>',
                                        'rejected' => '<span class="badge bg-danger"><i class="fas fa-times-circle"></i> Từ chối</span>'
                                    ];
                                    echo $statusBadge[$conversion['manual_status']] ?? '<span class="badge bg-secondary">Unknown</span>';
                                    ?>
                                    <?php if ($conversion['confirmed_at']): ?>
                                        <br>
                                        <small class="text-muted"><?= date('d/m/Y H:i', strtotime($conversion['confirmed_at'])) ?></small>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <span class="text-success fw-bold">
                                        <?= $conversion['referrer_role'] === 'teacher' ? '2,000,000 VND' : '2,000 điểm' ?>
                                    </span>
                                </td>
                                <td>
                                    <?php if ($conversion['manual_status'] === 'pending'): ?>
                                        <div class="btn-group" role="group">
                                            <button class="btn btn-success btn-sm" 
                                                    onclick="confirmConversion(<?= $conversion['id'] ?>, 'confirmed')"
                                                    title="Xác nhận và cộng thưởng">
                                                <i class="fas fa-check"></i>
                                            </button>
                                            <button class="btn btn-danger btn-sm"
                                                    onclick="confirmConversion(<?= $conversion['id'] ?>, 'rejected')"
                                                    title="Từ chối">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    <?php else: ?>
                                        <button class="btn btn-outline-secondary btn-sm" disabled>
                                            <i class="fas fa-<?= $conversion['manual_status'] === 'confirmed' ? 'check' : 'times' ?>"></i>
                                            Đã xử lý
                                        </button>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Pagination -->
<?php if ($totalPages > 1): ?>
<nav aria-label="Conversion pagination" class="mt-4">
    <ul class="pagination justify-content-center">
        <?php if ($page > 1): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=conversions&p=<?= $page - 1 ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $roleFilter ? '&role=' . $roleFilter : '' ?>">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        <?php endif; ?>
        
        <?php
        $startPage = max(1, $page - 2);
        $endPage = min($totalPages, $page + 2);
        
        for ($i = $startPage; $i <= $endPage; $i++):
        ?>
            <li class="page-item <?= $i === $page ? 'active' : '' ?>">
                <a class="page-link" href="?page=admin_affiliate&action=conversions&p=<?= $i ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $roleFilter ? '&role=' . $roleFilter : '' ?>">
                    <?= $i ?>
                </a>
            </li>
        <?php endfor; ?>
        
        <?php if ($page < $totalPages): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=conversions&p=<?= $page + 1 ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $roleFilter ? '&role=' . $roleFilter : '' ?>">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        <?php endif; ?>
    </ul>
</nav>
<?php endif; ?>

<script>
function confirmConversion(conversionId, status) {
    const statusText = status === 'confirmed' ? 'xác nhận và cộng thưởng' : 'từ chối';
    const message = `Bạn có chắc muốn ${statusText} conversion này?`;
    
    if (confirm(message)) {
        const formData = new FormData();
        formData.append('action', 'confirm_conversion');
        formData.append('conversion_id', conversionId);
        formData.append('manual_status', status);
        
        fetch('?page=admin_affiliate&action=conversions', {
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
        });
    }
}

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