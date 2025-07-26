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
            <a href="?page=admin_affiliate&action=members" 
               class="btn btn-outline-warning"
               data-bs-toggle="tooltip" 
               data-bs-placement="bottom"
               title="Chỉ hiển thị thành viên đang hoạt động. Ẩn các thành viên đã nghỉ việc hoặc không còn tham gia.">
                <i class="fas fa-eye"></i> Chỉ xem thành viên hoạt động
            </a>
        <?php else: ?>
            <a href="?page=admin_affiliate&action=members&show_hidden=1" 
               class="btn btn-outline-secondary"
               data-bs-toggle="tooltip" 
               data-bs-placement="bottom"
               title="Xem danh sách thành viên đã được ẩn (giáo viên cũ, phụ huynh không còn hoạt động). Chỉ admin có thể xem.">
                <i class="fas fa-eye-slash"></i> Xem thành viên đã ẩn
            </a>
        <?php endif; ?>
        <button class="btn btn-outline-primary" 
                onclick="location.reload()"
                data-bs-toggle="tooltip" 
                data-bs-placement="bottom"
                title="Tải lại trang để cập nhật dữ liệu mới nhất từ database">
            <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="btn btn-success" 
                onclick="affiliateAdmin.exportData('members')"
                data-bs-toggle="tooltip" 
                data-bs-placement="bottom"
                title="Xuất danh sách thành viên ra file Excel để lưu trữ hoặc in ấn">
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
                <input type="text" name="search" class="form-control" 
                       placeholder="Tên, SĐT, Email..." 
                       value="<?= htmlspecialchars($searchTerm) ?>"
                       data-bs-toggle="tooltip" 
                       data-bs-placement="top"
                       title="💡 Nhập tên, số điện thoại hoặc email để tìm kiếm nhanh thành viên">
            </div>
            
            <div class="col-md-2">
                <label class="form-label">Trạng thái</label>
                <select name="status" class="form-select"
                        data-bs-toggle="tooltip" 
                        data-bs-placement="top"
                        title="🔍 Lọc theo trạng thái: Hoạt động (có thể giới thiệu), Tạm ngưng (không hoạt động), Bị cấm (vi phạm)">
                    <option value="">Tất cả</option>
                    <option value="active" <?= $statusFilter === 'active' ? 'selected' : '' ?>>Hoạt động</option>
                    <option value="inactive" <?= $statusFilter === 'inactive' ? 'selected' : '' ?>>Tạm ngưng</option>
                    <option value="banned" <?= $statusFilter === 'banned' ? 'selected' : '' ?>>Bị cấm</option>
                </select>
            </div>
            
            <div class="col-md-2">
                <label class="form-label">Vai trò</label>
                <select name="role" class="form-select"
                        data-bs-toggle="tooltip" 
                        data-bs-placement="top"
                        title="👥 Lọc theo vai trò: Giáo viên (thưởng tiền mặt), Phụ huynh (thưởng điểm tích lũy)">
                    <option value="">Tất cả</option>
                    <option value="teacher" <?= $roleFilter === 'teacher' ? 'selected' : '' ?>>Giáo viên</option>
                    <option value="parent" <?= $roleFilter === 'parent' ? 'selected' : '' ?>>Phụ huynh</option>
                </select>
            </div>
            
            <div class="col-md-3">
                <label class="form-label">&nbsp;</label>
                <div>
                    <button type="submit" class="btn btn-primary"
                            data-bs-toggle="tooltip" 
                            data-bs-placement="top"
                            title="🔍 Áp dụng các bộ lọc đã chọn để tìm kiếm">
                        <i class="fas fa-search"></i> Tìm kiếm
                    </button>
                    <a href="?page=admin_affiliate&action=members" class="btn btn-outline-secondary"
                       data-bs-toggle="tooltip" 
                       data-bs-placement="top"
                       title="🗑️ Xóa tất cả bộ lọc và hiển thị toàn bộ thành viên">
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
                        <th data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="📋 Mã định danh duy nhất của thành viên trong hệ thống">
                            ID
                        </th>
                        <th data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="👤 Tên, số điện thoại, email và thông tin ngân hàng (nếu có)">
                            Thông tin thành viên
                        </th>
                        <th data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="🎭 Giáo viên: nhận thưởng tiền mặt | Phụ huynh: nhận điểm tích lũy">
                            Vai trò
                        </th>
                        <th data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="📊 Tổng số lượt giới thiệu và số lượng thành công (đã xác nhận)">
                            Giới thiệu
                        </th>
                        <th data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="💰 Số dư hiện tại, tổng đã kiếm được và tổng đã rút">
                            Ví tiền
                        </th>
                        <th data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="🔴🟡🟢 Hoạt động: có thể giới thiệu | Tạm ngưng: không hoạt động | Bị cấm: vi phạm">
                            Trạng thái
                        </th>
                        <th data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="📅 Ngày tham gia chương trình affiliate">
                            Ngày tham gia
                        </th>
                        <th data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="⚙️ Các hành động quản lý: xem chi tiết, ẩn/hiện, thay đổi trạng thái">
                            Hành động
                        </th>
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
                                                data-bs-toggle="tooltip" 
                                                data-bs-placement="left"
                                                title="Xem toàn bộ thông tin chi tiết: ví tiền, lịch sử giao dịch, danh sách giới thiệu, thống kê hiệu suất">
                                            <i class="fas fa-info-circle"></i> Chi tiết
                                        </button>
                                        
                                        <?php if ($member['is_hidden']): ?>
                                            <button class="btn btn-outline-success btn-sm"
                                                    onclick="toggleMemberVisibility(<?= $member['id'] ?>, false)"
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="left"
                                                    title="Hiện thành viên này trở lại danh sách chính. Dùng khi họ quay lại hoạt động hoặc làm việc lại">
                                                <i class="fas fa-eye"></i> Hiện
                                            </button>
                                        <?php else: ?>
                                            <button class="btn btn-outline-secondary btn-sm"
                                                    onclick="toggleMemberVisibility(<?= $member['id'] ?>, true)"
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="left"
                                                    title="Ẩn thành viên khỏi danh sách chính. Dùng cho giáo viên đã nghỉ việc hoặc phụ huynh không còn hoạt động. Dữ liệu vẫn được lưu trữ.">
                                                <i class="fas fa-eye-slash"></i> Ẩn
                                            </button>
                                        <?php endif; ?>
                                        
                                        <?php if ($member['status'] === 'active'): ?>
                                            <button class="btn btn-outline-warning btn-sm"
                                                    onclick="updateMemberStatus(<?= $member['id'] ?>, 'inactive')"
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="left"
                                                    title="Tạm ngưng hoạt động affiliate của thành viên này. Họ sẽ không thể tham gia giới thiệu mới">
                                                <i class="fas fa-pause"></i> Ngưng
                                            </button>
                                        <?php else: ?>
                                            <button class="btn btn-outline-success btn-sm"
                                                    onclick="updateMemberStatus(<?= $member['id'] ?>, 'active')"
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="left"
                                                    title="Kích hoạt lại hoạt động affiliate. Thành viên có thể tiếp tục giới thiệu và nhận thưởng">
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

// Initialize tooltips and help system
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            html: true,
            delay: { "show": 300, "hide": 100 }
        });
    });
    
    // Show welcome guide on first visit
    if (!localStorage.getItem('affiliate_members_guide_seen')) {
        setTimeout(showWelcomeGuide, 1500);
    }
});

function showWelcomeGuide() {
    const guideModal = `
        <div class="modal fade" id="welcomeGuideModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-graduation-cap"></i> Hướng dẫn Quản lý Thành viên Affiliate
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6><i class="fas fa-search text-primary"></i> Tìm kiếm & Lọc</h6>
                                <ul class="small">
                                    <li><strong>Tìm kiếm:</strong> Nhập tên, SĐT hoặc email</li>
                                    <li><strong>Lọc trạng thái:</strong> Hoạt động/Tạm ngưng/Bị cấm</li>
                                    <li><strong>Lọc vai trò:</strong> Giáo viên/Phụ huynh</li>
                                </ul>
                                
                                <h6><i class="fas fa-eye text-info"></i> Ẩn/Hiện Thành viên</h6>
                                <ul class="small">
                                    <li><strong>Ẩn:</strong> Dành cho giáo viên đã nghỉ việc hoặc phụ huynh không còn hoạt động</li>
                                    <li><strong>Hiện:</strong> Khôi phục thành viên về danh sách chính</li>
                                    <li><strong>Dữ liệu được bảo toàn:</strong> Không mất lịch sử giao dịch</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6><i class="fas fa-cogs text-warning"></i> Quản lý Trạng thái</h6>
                                <ul class="small">
                                    <li><strong>Hoạt động:</strong> Có thể giới thiệu và nhận thưởng</li>
                                    <li><strong>Tạm ngưng:</strong> Không thể tham gia affiliate</li>
                                    <li><strong>Bị cấm:</strong> Vi phạm quy định</li>
                                </ul>
                                
                                <h6><i class="fas fa-info-circle text-success"></i> Chi tiết Thành viên</h6>
                                <ul class="small">
                                    <li><strong>Ví tiền:</strong> Số dư, tổng kiếm được, đã rút</li>
                                    <li><strong>Lịch sử:</strong> Giao dịch và giới thiệu</li>
                                    <li><strong>Thống kê:</strong> Hiệu suất và milestone</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="alert alert-info mt-3">
                            <strong><i class="fas fa-lightbulb"></i> Mẹo:</strong> 
                            Di chuột vào bất kỳ nút hoặc biểu tượng nào để xem hướng dẫn chi tiết!
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đã hiểu</button>
                        <button type="button" class="btn btn-primary" onclick="startTooltipTour()">Xem tour hướng dẫn</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', guideModal);
    const modal = new bootstrap.Modal(document.getElementById('welcomeGuideModal'));
    modal.show();
    
    document.getElementById('welcomeGuideModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
        localStorage.setItem('affiliate_members_guide_seen', 'true');
    });
}

function startTooltipTour() {
    bootstrap.Modal.getInstance(document.getElementById('welcomeGuideModal')).hide();
    
    showAlert('info', 'Tour hướng dẫn bắt đầu! Quan sát các phần tử được tô sáng...');
    
    const tourSteps = [
        { selector: '[name="search"]', message: '💡 Nhập tên, SĐT hoặc email để tìm kiếm nhanh' },
        { selector: '[name="status"]', message: '🔍 Lọc theo trạng thái hoạt động của thành viên' },
        { selector: '[name="role"]', message: '👥 Lọc theo vai trò: Giáo viên hoặc Phụ huynh' },
        { selector: '.btn-outline-secondary', message: '👁️ Xem danh sách thành viên đã được ẩn' },
        { selector: '.table th:nth-child(5)', message: '💰 Thông tin tài chính của từng thành viên' },
        { selector: '.btn-outline-primary', message: 'ℹ️ Xem chi tiết đầy đủ của thành viên' }
    ];
    
    let currentStep = 0;
    
    function showTourStep() {
        if (currentStep >= tourSteps.length) {
            showAlert('success', 'Tour hướng dẫn hoàn thành! Bạn có thể click vào nút ? để xem lại.');
            return;
        }
        
        const step = tourSteps[currentStep];
        const element = document.querySelector(step.selector);
        
        if (element) {
            // Highlight element
            element.style.transition = 'all 0.3s ease';
            element.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.5)';
            element.style.backgroundColor = 'rgba(0,123,255,0.1)';
            element.style.zIndex = '1050';
            
            // Show tooltip message
            showAlert('info', step.message);
            
            setTimeout(() => {
                element.style.boxShadow = '';
                element.style.backgroundColor = '';
                element.style.zIndex = '';
                currentStep++;
                showTourStep();
            }, 2500);
        } else {
            currentStep++;
            showTourStep();
        }
    }
    
    setTimeout(showTourStep, 1000);
}

// Add help button functionality
function showQuickHelp() {
    showWelcomeGuide();
}
</script>

<!-- Quick Help Button -->
<div class="position-fixed" style="bottom: 20px; right: 20px; z-index: 1040;">
    <button class="btn btn-info btn-sm rounded-circle" 
            onclick="showQuickHelp()"
            data-bs-toggle="tooltip" 
            data-bs-placement="left"
            title="📚 Hiển thị hướng dẫn sử dụng trang này"
            style="width: 50px; height: 50px;">
        <i class="fas fa-question"></i>
    </button>
</div>