<?php
// Affiliate Members Management
$db = getDB();

// Handle member actions
if ($_POST && isset($_POST['action'])) {
    $response = ['success' => false, 'message' => ''];
    
    switch ($_POST['action']) {
        case 'update_status':
            $memberId = (int)$_POST['member_id'];
            $status = $_POST['status'];
            
            try {
                $stmt = $db->prepare("UPDATE affiliate_members SET status = ?, updated_at = NOW() WHERE id = ?");
                if ($stmt->execute([$status, $memberId])) {
                    $response['success'] = true;
                    $response['message'] = 'Cập nhật trạng thái thành công!';
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
            
        case 'toggle_visibility':
            $memberId = (int)$_POST['member_id'];
            $isHidden = $_POST['is_hidden'] === 'true';
            
            try {
                $stmt = $db->prepare("UPDATE affiliate_members SET is_hidden = ?, updated_at = NOW() WHERE id = ?");
                if ($stmt->execute([$isHidden ? 1 : 0, $memberId])) {
                    $response['success'] = true;
                    $response['message'] = $isHidden ? 'Đã ẩn thành viên!' : 'Đã hiện thành viên!';
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

// Get members list with pagination
$page = (int)($_GET['p'] ?? 1);
$perPage = 20;
$offset = ($page - 1) * $perPage;

// Filter options
$statusFilter = $_GET['status'] ?? '';
$roleFilter = $_GET['role'] ?? '';
$searchTerm = $_GET['search'] ?? '';
$showHidden = $_GET['show_hidden'] ?? '0'; // Only super admin can see hidden members

$whereClause = "WHERE 1=1";
$params = [];

// Show hidden members only if super admin requests it
if ($showHidden !== '1') {
    $whereClause .= " AND (am.is_hidden = 0 OR am.is_hidden IS NULL)";
}

if ($statusFilter) {
    $whereClause .= " AND am.status = ?";
    $params[] = $statusFilter;
}

if ($roleFilter) {
    $whereClause .= " AND am.role = ?";
    $params[] = $roleFilter;
}

if ($searchTerm) {
    $whereClause .= " AND (am.name LIKE ? OR am.phone LIKE ? OR am.email LIKE ?)";
    $params[] = "%$searchTerm%";
    $params[] = "%$searchTerm%";
    $params[] = "%$searchTerm%";
}

// Get total count
$countStmt = $db->prepare("
    SELECT COUNT(*) as total
    FROM affiliate_members am
    $whereClause
");
$countStmt->execute($params);
$totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
$totalPages = ceil($totalCount / $perPage);

// Get members data
$stmt = $db->prepare("
    SELECT 
        am.*,
        aw.balance,
        aw.total_earned,
        aw.total_withdrawn,
        COUNT(ar.id) as referral_count,
        COUNT(CASE WHEN ac.manual_status = 'confirmed' THEN 1 END) as confirmed_count,
        COALESCE(am.is_hidden, 0) as is_hidden
    FROM affiliate_members am
    LEFT JOIN affiliate_wallets aw ON am.id = aw.member_id
    LEFT JOIN affiliate_referrals ar ON am.id = ar.referrer_id
    LEFT JOIN affiliate_conversions ac ON ar.id = ac.referral_id
    $whereClause
    GROUP BY am.id
    ORDER BY am.created_at DESC
    LIMIT ? OFFSET ?
");

$params[] = $perPage;
$params[] = $offset;
$stmt->execute($params);
$members = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-users text-primary"></i> Quản lý Thành viên</h2>
    <div>
        <?php if ($showHidden === '1'): ?>
            <a href="?page=admin_affiliate&action=members" class="btn btn-outline-warning">
                <i class="fas fa-eye"></i> Chỉ xem thành viên hoạt động
            </a>
        <?php else: ?>
            <a href="?page=admin_affiliate&action=members&show_hidden=1" class="btn btn-outline-secondary">
                <i class="fas fa-eye-slash"></i> Xem thành viên đã ẩn
            </a>
        <?php endif; ?>
        <button class="btn btn-outline-primary" onclick="location.reload()">
            <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="btn btn-success" onclick="affiliateAdmin.exportData('members')">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Filters -->
<div class="card mb-4">
    <div class="card-body">
        <form method="GET" class="row g-3">
            <input type="hidden" name="page" value="admin_affiliate">
            <input type="hidden" name="action" value="members">
            
            <div class="col-md-3">
                <label class="form-label">Tìm kiếm</label>
                <input type="text" name="search" class="form-control" placeholder="Tên, SĐT, Email..." value="<?= htmlspecialchars($searchTerm) ?>">
            </div>
            
            <div class="col-md-2">
                <label class="form-label">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="active" <?= $statusFilter === 'active' ? 'selected' : '' ?>>Hoạt động</option>
                    <option value="inactive" <?= $statusFilter === 'inactive' ? 'selected' : '' ?>>Tạm ngưng</option>
                    <option value="banned" <?= $statusFilter === 'banned' ? 'selected' : '' ?>>Bị cấm</option>
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
                        <i class="fas fa-search"></i> Tìm kiếm
                    </button>
                    <a href="?page=admin_affiliate&action=members" class="btn btn-outline-secondary">
                        <i class="fas fa-times"></i> Xóa lọc
                    </a>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Members Table -->
<div class="card">
    <div class="card-header">
        <h5><i class="fas fa-list"></i> Danh sách Thành viên (<?= number_format($totalCount) ?> thành viên)</h5>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Thông tin thành viên</th>
                        <th>Vai trò</th>
                        <th>Giới thiệu</th>
                        <th>Ví tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày tham gia</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($members)): ?>
                        <tr>
                            <td colspan="8" class="text-center py-4">
                                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                <p class="text-muted">Chưa có thành viên nào</p>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($members as $member): ?>
                            <tr>
                                <td>
                                    <span class="badge bg-secondary">#<?= $member['id'] ?></span>
                                </td>
                                <td>
                                    <div>
                                        <strong><?= htmlspecialchars($member['name']) ?></strong>
                                        <br>
                                        <small class="text-muted">
                                            <i class="fas fa-phone"></i> <?= htmlspecialchars($member['phone']) ?>
                                        </small>
                                        <?php if ($member['email']): ?>
                                            <br>
                                            <small class="text-muted">
                                                <i class="fas fa-envelope"></i> <?= htmlspecialchars($member['email']) ?>
                                            </small>
                                        <?php endif; ?>
                                        <?php if ($member['bank_info']): ?>
                                            <br>
                                            <small class="text-info">
                                                <i class="fas fa-credit-card"></i> Có TK ngân hàng
                                            </small>
                                        <?php endif; ?>
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
                                        <small class="text-muted d-block">
                                            Tổng kiếm: <?= number_format($member['total_earned'] ?? 0) ?>
                                        </small>
                                        <small class="text-muted d-block">
                                            Đã rút: <?= number_format($member['total_withdrawn'] ?? 0) ?>
                                        </small>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-<?= $member['status'] === 'active' ? 'success' : 
                                                            ($member['status'] === 'inactive' ? 'warning' : 'danger') ?>">
                                        <?= $member['status'] === 'active' ? 'Hoạt động' : 
                                            ($member['status'] === 'inactive' ? 'Tạm ngưng' : 'Bị cấm') ?>
                                    </span>
                                </td>
                                <td>
                                    <?= date('d/m/Y', strtotime($member['created_at'])) ?>
                                </td>
                                <td>
                                    <div class="btn-group-vertical btn-group-sm w-100" role="group">
                                        <button class="btn btn-outline-primary btn-sm" 
                                                onclick="viewMemberDetails(<?= $member['id'] ?>)"
                                                title="Xem chi tiết đầy đủ">
                                            <i class="fas fa-info-circle"></i> Chi tiết
                                        </button>
                                        
                                        <?php if ($member['is_hidden']): ?>
                                            <button class="btn btn-outline-success btn-sm"
                                                    onclick="toggleMemberVisibility(<?= $member['id'] ?>, false)"
                                                    title="Hiện thành viên">
                                                <i class="fas fa-eye"></i> Hiện
                                            </button>
                                        <?php else: ?>
                                            <button class="btn btn-outline-secondary btn-sm"
                                                    onclick="toggleMemberVisibility(<?= $member['id'] ?>, true)"
                                                    title="Ẩn thành viên">
                                                <i class="fas fa-eye-slash"></i> Ẩn
                                            </button>
                                        <?php endif; ?>
                                        
                                        <?php if ($member['status'] === 'active'): ?>
                                            <button class="btn btn-outline-warning btn-sm"
                                                    onclick="updateMemberStatus(<?= $member['id'] ?>, 'inactive')"
                                                    title="Tạm ngưng">
                                                <i class="fas fa-pause"></i> Ngưng
                                            </button>
                                        <?php else: ?>
                                            <button class="btn btn-outline-success btn-sm"
                                                    onclick="updateMemberStatus(<?= $member['id'] ?>, 'active')"
                                                    title="Kích hoạt">
                                                <i class="fas fa-play"></i> Hoạt động
                                            </button>
                                        <?php endif; ?>
                                                title="Cấm tài khoản">
                                            <i class="fas fa-ban"></i>
                                        </button>
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
<nav aria-label="Member pagination" class="mt-4">
    <ul class="pagination justify-content-center">
        <?php if ($page > 1): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=members&p=<?= $page - 1 ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $roleFilter ? '&role=' . $roleFilter : '' ?><?= $searchTerm ? '&search=' . urlencode($searchTerm) : '' ?>">
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
                <a class="page-link" href="?page=admin_affiliate&action=members&p=<?= $i ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $roleFilter ? '&role=' . $roleFilter : '' ?><?= $searchTerm ? '&search=' . urlencode($searchTerm) : '' ?>">
                    <?= $i ?>
                </a>
            </li>
        <?php endfor; ?>
        
        <?php if ($page < $totalPages): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=members&p=<?= $page + 1 ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $roleFilter ? '&role=' . $roleFilter : '' ?><?= $searchTerm ? '&search=' . urlencode($searchTerm) : '' ?>">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        <?php endif; ?>
    </ul>
</nav>
<?php endif; ?>

<!-- Member Details Modal -->
<div class="modal fade" id="memberDetailsModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Chi tiết thành viên</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="memberDetailsContent">
                <!-- Content will be loaded here -->
            </div>
        </div>
    </div>
</div>

<script>
function updateMemberStatus(memberId, status) {
    const statusText = {
        'active': 'kích hoạt',
        'inactive': 'tạm ngưng',
        'banned': 'cấm'
    };
    
    const message = `Bạn có chắc muốn ${statusText[status]} thành viên này?`;
    
    if (confirm(message)) {
        const formData = new FormData();
        formData.append('action', 'update_status');
        formData.append('member_id', memberId);
        formData.append('status', status);
        
        fetch('?page=admin_affiliate&action=members', {
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

function viewMemberDetails(memberId) {
    // Show loading
    document.getElementById('memberDetailsContent').innerHTML = `
        <div class="text-center py-4">
            <i class="fas fa-spinner fa-spin fa-3x text-primary mb-3"></i>
            <p>Đang tải thông tin...</p>
        </div>
    `;
    new bootstrap.Modal(document.getElementById('memberDetailsModal')).show();
    
    // Load member details
    fetch(`?page=admin_affiliate&action=member_details&id=${memberId}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('memberDetailsContent').innerHTML = html;
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