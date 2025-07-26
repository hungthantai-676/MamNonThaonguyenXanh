<?php
// Affiliate Referrals Management
$db = getDB();

// Get referrals list with pagination
$page = (int)($_GET['p'] ?? 1);
$perPage = 20;
$offset = ($page - 1) * $perPage;

// Filter options
$statusFilter = $_GET['status'] ?? '';
$roleFilter = $_GET['role'] ?? '';
$searchTerm = $_GET['search'] ?? '';

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

if ($searchTerm) {
    $whereClause .= " AND (am.name LIKE ? OR ar.referee_name LIKE ? OR ar.referee_phone LIKE ?)";
    $params[] = "%$searchTerm%";
    $params[] = "%$searchTerm%";
    $params[] = "%$searchTerm%";
}

// Get total count
$countStmt = $db->prepare("
    SELECT COUNT(*) as total
    FROM affiliate_referrals ar
    JOIN affiliate_members am ON ar.referrer_id = am.id
    LEFT JOIN affiliate_conversions ac ON ar.id = ac.referral_id
    $whereClause
");
$countStmt->execute($params);
$totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
$totalPages = ceil($totalCount / $perPage);

// Get referrals data
$stmt = $db->prepare("
    SELECT 
        ar.*,
        am.name as referrer_name,
        am.role as referrer_role,
        am.phone as referrer_phone,
        ac.manual_status,
        ac.created_at as conversion_date,
        ac.confirmed_at
    FROM affiliate_referrals ar
    JOIN affiliate_members am ON ar.referrer_id = am.id
    LEFT JOIN affiliate_conversions ac ON ar.id = ac.referral_id
    $whereClause
    ORDER BY ar.created_at DESC
    LIMIT ? OFFSET ?
");

$params[] = $perPage;
$params[] = $offset;
$stmt->execute($params);
$referrals = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get referral statistics
$statsStmt = $db->prepare("
    SELECT 
        COALESCE(ac.manual_status, 'no_conversion') as status,
        COUNT(*) as count
    FROM affiliate_referrals ar
    LEFT JOIN affiliate_conversions ac ON ar.id = ac.referral_id
    GROUP BY ac.manual_status
");
$statsStmt->execute();
$stats = $statsStmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-handshake text-info"></i> Quản lý Giới thiệu</h2>
    <div>
        <button class="btn btn-outline-primary" onclick="location.reload()">
            <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="btn btn-success" onclick="affiliateAdmin.exportData('referrals')">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Statistics Cards -->
<div class="row mb-4">
    <?php 
    $statusColors = [
        'no_conversion' => ['bg-secondary', 'text-white', 'Chưa conversion'],
        'pending' => ['bg-warning', 'text-dark', 'Chờ xác nhận'],
        'confirmed' => ['bg-success', 'text-white', 'Đã xác nhận'], 
        'rejected' => ['bg-danger', 'text-white', 'Từ chối']
    ];
    
    foreach ($stats as $stat): 
        $colors = $statusColors[$stat['status']] ?? ['bg-light', 'text-dark', ucfirst($stat['status'])];
    ?>
    <div class="col-md-3 mb-3">
        <div class="card <?= $colors[0] ?> <?= $colors[1] ?>">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6 class="card-title"><?= $colors[2] ?></h6>
                        <h3 class="mb-0"><?= number_format($stat['count']) ?></h3>
                        <small>Giới thiệu</small>
                    </div>
                    <div class="align-self-center">
                        <i class="fas fa-<?= $stat['status'] === 'no_conversion' ? 'user-plus' :
                                         ($stat['status'] === 'pending' ? 'clock' : 
                                         ($stat['status'] === 'confirmed' ? 'check-circle' : 'times-circle')) ?> fa-2x"></i>
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
            <input type="hidden" name="action" value="referrals">
            
            <div class="col-md-3">
                <label class="form-label">Tìm kiếm</label>
                <input type="text" name="search" class="form-control" placeholder="Tên người giới thiệu, học sinh..." value="<?= htmlspecialchars($searchTerm) ?>">
            </div>
            
            <div class="col-md-2">
                <label class="form-label">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="no_conversion" <?= $statusFilter === 'no_conversion' ? 'selected' : '' ?>>Chưa conversion</option>
                    <option value="pending" <?= $statusFilter === 'pending' ? 'selected' : '' ?>>Chờ xác nhận</option>
                    <option value="confirmed" <?= $statusFilter === 'confirmed' ? 'selected' : '' ?>>Đã xác nhận</option>
                    <option value="rejected" <?= $statusFilter === 'rejected' ? 'selected' : '' ?>>Từ chối</option>
                </select>
            </div>
            
            <div class="col-md-2">
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
                    <a href="?page=admin_affiliate&action=referrals" class="btn btn-outline-secondary">
                        <i class="fas fa-times"></i> Xóa lọc
                    </a>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Referrals Table -->
<div class="card">
    <div class="card-header">
        <h5><i class="fas fa-list"></i> Danh sách Giới thiệu (<?= number_format($totalCount) ?> bản ghi)</h5>
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
                        <th>Trạng thái conversion</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($referrals)): ?>
                        <tr>
                            <td colspan="7" class="text-center py-4">
                                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                <p class="text-muted">Chưa có giới thiệu nào</p>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($referrals as $referral): ?>
                            <tr>
                                <td>
                                    <span class="badge bg-secondary">#<?= $referral['id'] ?></span>
                                </td>
                                <td>
                                    <div>
                                        <strong><?= htmlspecialchars($referral['referrer_name']) ?></strong>
                                        <br>
                                        <small class="text-muted">
                                            <i class="fas fa-phone"></i> <?= htmlspecialchars($referral['referrer_phone']) ?>
                                        </small>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong><?= htmlspecialchars($referral['referee_name']) ?></strong>
                                        <br>
                                        <small class="text-muted">
                                            <i class="fas fa-phone"></i> PH: <?= htmlspecialchars($referral['referee_phone']) ?>
                                        </small>
                                        <?php if ($referral['notes']): ?>
                                            <br>
                                            <small class="text-info">
                                                <i class="fas fa-note-sticky"></i> <?= htmlspecialchars($referral['notes']) ?>
                                            </small>
                                        <?php endif; ?>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-<?= $referral['referrer_role'] === 'teacher' ? 'info' : 'warning' ?>">
                                        <i class="fas fa-<?= $referral['referrer_role'] === 'teacher' ? 'chalkboard-teacher' : 'user-friends' ?>"></i>
                                        <?= $referral['referrer_role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                                    </span>
                                </td>
                                <td>
                                    <?= date('d/m/Y H:i', strtotime($referral['created_at'])) ?>
                                </td>
                                <td>
                                    <?php if ($referral['manual_status']): ?>
                                        <?php
                                        $statusBadge = [
                                            'pending' => '<span class="badge bg-warning text-dark"><i class="fas fa-clock"></i> Chờ xác nhận</span>',
                                            'confirmed' => '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Đã xác nhận</span>',
                                            'rejected' => '<span class="badge bg-danger"><i class="fas fa-times-circle"></i> Từ chối</span>'
                                        ];
                                        echo $statusBadge[$referral['manual_status']] ?? '<span class="badge bg-secondary">Unknown</span>';
                                        ?>
                                        <?php if ($referral['confirmed_at']): ?>
                                            <br>
                                            <small class="text-muted"><?= date('d/m/Y H:i', strtotime($referral['confirmed_at'])) ?></small>
                                        <?php endif; ?>
                                    <?php else: ?>
                                        <span class="badge bg-secondary">
                                            <i class="fas fa-user-plus"></i> Chưa conversion
                                        </span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-outline-primary btn-sm" 
                                                onclick="viewReferralDetails(<?= $referral['id'] ?>)"
                                                title="Xem chi tiết">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        
                                        <?php if (!$referral['manual_status']): ?>
                                            <a href="?page=admin_affiliate&action=conversions" 
                                               class="btn btn-outline-success btn-sm"
                                               title="Tạo conversion">
                                                <i class="fas fa-plus"></i> Conversion
                                            </a>
                                        <?php else: ?>
                                            <a href="?page=admin_affiliate&action=conversions&status=<?= $referral['manual_status'] ?>" 
                                               class="btn btn-outline-info btn-sm"
                                               title="Xem conversion">
                                                <i class="fas fa-external-link-alt"></i>
                                            </a>
                                        <?php endif; ?>
                                    </div>
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
<nav aria-label="Referral pagination" class="mt-4">
    <ul class="pagination justify-content-center">
        <?php if ($page > 1): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=referrals&p=<?= $page - 1 ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $roleFilter ? '&role=' . $roleFilter : '' ?><?= $searchTerm ? '&search=' . urlencode($searchTerm) : '' ?>">
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
                <a class="page-link" href="?page=admin_affiliate&action=referrals&p=<?= $i ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $roleFilter ? '&role=' . $roleFilter : '' ?><?= $searchTerm ? '&search=' . urlencode($searchTerm) : '' ?>">
                    <?= $i ?>
                </a>
            </li>
        <?php endfor; ?>
        
        <?php if ($page < $totalPages): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=referrals&p=<?= $page + 1 ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $roleFilter ? '&role=' . $roleFilter : '' ?><?= $searchTerm ? '&search=' . urlencode($searchTerm) : '' ?>">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        <?php endif; ?>
    </ul>
</nav>
<?php endif; ?>

<!-- Referral Details Modal -->
<div class="modal fade" id="referralDetailsModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Chi tiết giới thiệu</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="referralDetailsContent">
                <!-- Content will be loaded here -->
            </div>
        </div>
    </div>
</div>

<script>
function viewReferralDetails(referralId) {
    // Load referral details via AJAX
    fetch(`ajax/get_referral_details.php?id=${referralId}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('referralDetailsContent').innerHTML = html;
            new bootstrap.Modal(document.getElementById('referralDetailsModal')).show();
        })
        .catch(error => {
            showAlert('danger', 'Lỗi tải thông tin: ' + error.message);
        });
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