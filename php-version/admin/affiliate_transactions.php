<?php
// Affiliate Transactions Management
$db = getDB();

// Get transactions list with pagination
$page = (int)($_GET['p'] ?? 1);
$perPage = 50;
$offset = ($page - 1) * $perPage;

// Filter options
$typeFilter = $_GET['type'] ?? '';
$statusFilter = $_GET['status'] ?? '';
$memberFilter = $_GET['member'] ?? '';
$dateFilter = $_GET['date'] ?? '';

$whereClause = "WHERE 1=1";
$params = [];

if ($typeFilter) {
    $whereClause .= " AND at.type = ?";
    $params[] = $typeFilter;
}

if ($statusFilter) {
    $whereClause .= " AND at.status = ?";
    $params[] = $statusFilter;
}

if ($memberFilter) {
    $whereClause .= " AND (am.name LIKE ? OR am.phone LIKE ?)";
    $params[] = "%$memberFilter%";
    $params[] = "%$memberFilter%";
}

if ($dateFilter) {
    $whereClause .= " AND DATE(at.created_at) = ?";
    $params[] = $dateFilter;
}

// Get total count
$countStmt = $db->prepare("
    SELECT COUNT(*) as total
    FROM affiliate_transactions at
    JOIN affiliate_members am ON at.member_id = am.id
    $whereClause
");
$countStmt->execute($params);
$totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
$totalPages = ceil($totalCount / $perPage);

// Get transactions data
$stmt = $db->prepare("
    SELECT 
        at.*,
        am.name,
        am.phone,
        am.role
    FROM affiliate_transactions at
    JOIN affiliate_members am ON at.member_id = am.id
    $whereClause
    ORDER BY at.created_at DESC
    LIMIT ? OFFSET ?
");

$params[] = $perPage;
$params[] = $offset;
$stmt->execute($params);
$transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get transaction statistics
$statsStmt = $db->prepare("
    SELECT 
        at.type,
        at.status,
        COUNT(*) as count,
        SUM(at.amount) as total_amount
    FROM affiliate_transactions at
    GROUP BY at.type, at.status
");
$statsStmt->execute();
$stats = $statsStmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-exchange-alt text-primary"></i> Quản lý Giao dịch</h2>
    <div>
        <button class="btn btn-outline-primary" onclick="location.reload()">
            <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="btn btn-success" onclick="affiliateAdmin.exportData('transactions')">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Transaction Statistics -->
<div class="row mb-4">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <h5><i class="fas fa-chart-bar"></i> Thống kê giao dịch</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <?php
                    $typeStats = [];
                    foreach ($stats as $stat) {
                        $typeStats[$stat['type']][$stat['status']] = [
                            'count' => $stat['count'],
                            'amount' => $stat['total_amount']
                        ];
                    }
                    
                    $typeLabels = [
                        'referral_reward' => ['Thưởng giới thiệu', 'success'],
                        'withdrawal' => ['Rút tiền', 'warning'],
                        'withdrawal_rejected' => ['Hoàn tiền', 'danger'],
                        'bonus' => ['Thưởng milestone', 'info']
                    ];
                    
                    foreach ($typeLabels as $type => $config):
                        $totalCount = 0;
                        $totalAmount = 0;
                        if (isset($typeStats[$type])) {
                            foreach ($typeStats[$type] as $statusData) {
                                $totalCount += $statusData['count'];
                                $totalAmount += $statusData['amount'];
                            }
                        }
                    ?>
                    <div class="col-md-3 mb-3">
                        <div class="card bg-<?= $config[1] ?> text-white">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="card-title"><?= $config[0] ?></h6>
                                        <h3 class="mb-0"><?= number_format($totalCount) ?></h3>
                                        <small>Tổng: <?= number_format($totalAmount) ?></small>
                                    </div>
                                    <i class="fas fa-<?= $type === 'referral_reward' ? 'gift' : 
                                                      ($type === 'withdrawal' ? 'money-bill-wave' : 
                                                      ($type === 'withdrawal_rejected' ? 'undo' : 'star')) ?> fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Filters -->
<div class="card mb-4">
    <div class="card-body">
        <form method="GET" class="row g-3">
            <input type="hidden" name="page" value="admin_affiliate">
            <input type="hidden" name="action" value="transactions">
            
            <div class="col-md-2">
                <label class="form-label">Loại giao dịch</label>
                <select name="type" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="referral_reward" <?= $typeFilter === 'referral_reward' ? 'selected' : '' ?>>Thưởng giới thiệu</option>
                    <option value="withdrawal" <?= $typeFilter === 'withdrawal' ? 'selected' : '' ?>>Rút tiền</option>
                    <option value="withdrawal_rejected" <?= $typeFilter === 'withdrawal_rejected' ? 'selected' : '' ?>>Hoàn tiền</option>
                    <option value="bonus" <?= $typeFilter === 'bonus' ? 'selected' : '' ?>>Thưởng milestone</option>
                </select>
            </div>
            
            <div class="col-md-2">
                <label class="form-label">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="completed" <?= $statusFilter === 'completed' ? 'selected' : '' ?>>Hoàn thành</option>
                    <option value="pending" <?= $statusFilter === 'pending' ? 'selected' : '' ?>>Đang xử lý</option>
                    <option value="failed" <?= $statusFilter === 'failed' ? 'selected' : '' ?>>Thất bại</option>
                </select>
            </div>
            
            <div class="col-md-2">
                <label class="form-label">Thành viên</label>
                <input type="text" name="member" class="form-control" placeholder="Tên, SĐT..." value="<?= htmlspecialchars($memberFilter) ?>">
            </div>
            
            <div class="col-md-2">
                <label class="form-label">Ngày</label>
                <input type="date" name="date" class="form-control" value="<?= htmlspecialchars($dateFilter) ?>">
            </div>
            
            <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-filter"></i> Lọc
                    </button>
                </div>
            </div>
            
            <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <div>
                    <a href="?page=admin_affiliate&action=transactions" class="btn btn-outline-secondary">
                        <i class="fas fa-times"></i> Xóa lọc
                    </a>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Transactions Table -->
<div class="card">
    <div class="card-header">
        <h5><i class="fas fa-list"></i> Lịch sử giao dịch (<?= number_format($totalCount) ?> giao dịch)</h5>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Thành viên</th>
                        <th>Loại giao dịch</th>
                        <th>Số tiền</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($transactions)): ?>
                        <tr>
                            <td colspan="7" class="text-center py-4">
                                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                <p class="text-muted">Chưa có giao dịch nào</p>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($transactions as $transaction): ?>
                            <tr>
                                <td>
                                    <span class="badge bg-secondary">#<?= $transaction['id'] ?></span>
                                </td>
                                <td>
                                    <div>
                                        <strong><?= htmlspecialchars($transaction['name']) ?></strong>
                                        <br>
                                        <small class="text-muted">
                                            <i class="fas fa-phone"></i> <?= htmlspecialchars($transaction['phone']) ?>
                                        </small>
                                        <br>
                                        <span class="badge bg-<?= $transaction['role'] === 'teacher' ? 'info' : 'warning' ?> badge-sm">
                                            <?= $transaction['role'] === 'teacher' ? 'GV' : 'PH' ?>
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <?php
                                    $typeLabels = [
                                        'referral_reward' => ['Thưởng giới thiệu', 'success', 'gift'],
                                        'withdrawal' => ['Rút tiền', 'warning', 'money-bill-wave'],
                                        'withdrawal_rejected' => ['Hoàn tiền', 'danger', 'undo'],
                                        'bonus' => ['Thưởng milestone', 'info', 'star']
                                    ];
                                    $typeConfig = $typeLabels[$transaction['type']] ?? ['Unknown', 'secondary', 'question'];
                                    ?>
                                    <span class="badge bg-<?= $typeConfig[1] ?>">
                                        <i class="fas fa-<?= $typeConfig[2] ?>"></i>
                                        <?= $typeConfig[0] ?>
                                    </span>
                                </td>
                                <td>
                                    <strong class="text-<?= $transaction['amount'] > 0 ? 'success' : 'danger' ?>">
                                        <?= $transaction['amount'] > 0 ? '+' : '' ?><?= number_format($transaction['amount']) ?>
                                    </strong>
                                    <br>
                                    <small class="text-muted">
                                        <?= $transaction['role'] === 'teacher' ? 'VND' : 'Điểm' ?>
                                    </small>
                                </td>
                                <td>
                                    <small><?= htmlspecialchars($transaction['description']) ?></small>
                                </td>
                                <td>
                                    <?php
                                    $statusBadge = [
                                        'completed' => '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Hoàn thành</span>',
                                        'pending' => '<span class="badge bg-warning text-dark"><i class="fas fa-clock"></i> Đang xử lý</span>',
                                        'failed' => '<span class="badge bg-danger"><i class="fas fa-times-circle"></i> Thất bại</span>'
                                    ];
                                    echo $statusBadge[$transaction['status']] ?? '<span class="badge bg-secondary">Unknown</span>';
                                    ?>
                                </td>
                                <td>
                                    <?= date('d/m/Y H:i:s', strtotime($transaction['created_at'])) ?>
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
<nav aria-label="Transaction pagination" class="mt-4">
    <ul class="pagination justify-content-center">
        <?php if ($page > 1): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=transactions&p=<?= $page - 1 ?><?= $typeFilter ? '&type=' . $typeFilter : '' ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $memberFilter ? '&member=' . urlencode($memberFilter) : '' ?><?= $dateFilter ? '&date=' . $dateFilter : '' ?>">
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
                <a class="page-link" href="?page=admin_affiliate&action=transactions&p=<?= $i ?><?= $typeFilter ? '&type=' . $typeFilter : '' ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $memberFilter ? '&member=' . urlencode($memberFilter) : '' ?><?= $dateFilter ? '&date=' . $dateFilter : '' ?>">
                    <?= $i ?>
                </a>
            </li>
        <?php endfor; ?>
        
        <?php if ($page < $totalPages): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=transactions&p=<?= $page + 1 ?><?= $typeFilter ? '&type=' . $typeFilter : '' ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $memberFilter ? '&member=' . urlencode($memberFilter) : '' ?><?= $dateFilter ? '&date=' . $dateFilter : '' ?>">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        <?php endif; ?>
    </ul>
</nav>
<?php endif; ?>

<style>
.badge-sm {
    font-size: 0.7rem;
}
</style>