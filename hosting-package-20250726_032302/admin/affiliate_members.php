<?php
require_once '../includes/affiliate_functions.php';

$db = getDB();
$search = $_GET['search'] ?? '';
$role = $_GET['role'] ?? '';
$status = $_GET['status'] ?? 'active';

// Build query
$whereConditions = ["status = ?"];
$params = [$status];

if ($search) {
    $whereConditions[] = "(name LIKE ? OR phone LIKE ? OR email LIKE ? OR member_id LIKE ?)";
    $searchTerm = "%$search%";
    $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
}

if ($role) {
    $whereConditions[] = "role = ?";
    $params[] = $role;
}

$whereClause = implode(' AND ', $whereConditions);

$members = $db->fetchAll("
    SELECT * FROM affiliate_members 
    WHERE $whereClause 
    ORDER BY registered_at DESC
", $params);

$totalMembers = count($members);
$totalTeachers = count(array_filter($members, fn($m) => $m['role'] === 'teacher'));
$totalParents = count(array_filter($members, fn($m) => $m['role'] === 'parent'));
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3">👥 Quản lý Thành viên</h1>
    <div>
        <a href="?page=affiliate_register" class="btn btn-primary">
            <i class="fas fa-plus"></i> Thêm thành viên
        </a>
        <button class="btn btn-success btn-sm" onclick="affiliateAdmin.exportData('members')">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Statistics -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body text-center">
                <h4><?= $totalMembers ?></h4>
                <p class="mb-0">Tổng thành viên</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-success text-white">
            <div class="card-body text-center">
                <h4><?= $totalTeachers ?></h4>
                <p class="mb-0">Giáo viên</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-warning text-white">
            <div class="card-body text-center">
                <h4><?= $totalParents ?></h4>
                <p class="mb-0">Phụ huynh</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body text-center">
                <h4><?= array_sum(array_column($members, 'total_referrals')) ?></h4>
                <p class="mb-0">Tổng giới thiệu</p>
            </div>
        </div>
    </div>
</div>

<!-- Search and Filters -->
<div class="card mb-4">
    <div class="card-body">
        <form method="GET" class="row g-3">
            <input type="hidden" name="action" value="members">
            
            <div class="col-md-4">
                <label class="form-label">Tìm kiếm</label>
                <input type="text" name="search" class="form-control" 
                       placeholder="Tên, SĐT, Email, Mã TV..." value="<?= htmlspecialchars($search) ?>">
            </div>
            
            <div class="col-md-3">
                <label class="form-label">Vai trò</label>
                <select name="role" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="teacher" <?= $role === 'teacher' ? 'selected' : '' ?>>Giáo viên</option>
                    <option value="parent" <?= $role === 'parent' ? 'selected' : '' ?>>Phụ huynh</option>
                </select>
            </div>
            
            <div class="col-md-3">
                <label class="form-label">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="active" <?= $status === 'active' ? 'selected' : '' ?>>Hoạt động</option>
                    <option value="inactive" <?= $status === 'inactive' ? 'selected' : '' ?>>Tạm khóa</option>
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

<!-- Members Table -->
<div class="card">
    <div class="card-body">
        <?php if (empty($members)): ?>
            <div class="text-center py-5">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Không tìm thấy thành viên nào</h5>
                <p class="text-muted">Thử thay đổi bộ lọc hoặc thêm thành viên mới</p>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Thành viên</th>
                            <th>Liên hệ</th>
                            <th>Vai trò</th>
                            <th>Giới thiệu</th>
                            <th>Thưởng</th>
                            <th>Trạng thái</th>
                            <th>Ngày ĐK</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($members as $member): ?>
                        <tr>
                            <td>
                                <div>
                                    <strong><?= htmlspecialchars($member['name']) ?></strong><br>
                                    <small class="text-muted">
                                        <i class="fas fa-id-card"></i> <?= $member['member_id'] ?>
                                    </small><br>
                                    <small class="text-primary">
                                        <i class="fas fa-qrcode"></i> <?= $member['referral_code'] ?>
                                    </small>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <i class="fas fa-phone text-success"></i> <?= $member['phone'] ?><br>
                                    <?php if ($member['email']): ?>
                                        <i class="fas fa-envelope text-info"></i> 
                                        <small><?= htmlspecialchars($member['email']) ?></small>
                                    <?php endif; ?>
                                </div>
                            </td>
                            <td>
                                <span class="badge bg-<?= $member['role'] === 'teacher' ? 'success' : 'warning' ?> p-2">
                                    <i class="fas fa-<?= $member['role'] === 'teacher' ? 'chalkboard-teacher' : 'users' ?>"></i>
                                    <?= $member['role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                                </span>
                            </td>
                            <td>
                                <div class="text-center">
                                    <h5 class="mb-1"><?= $member['total_referrals'] ?></h5>
                                    <small class="text-muted">học sinh</small><br>
                                    <small class="text-info">Mốc: <?= $member['current_milestone'] ?></small>
                                </div>
                            </td>
                            <td>
                                <?php if ($member['role'] === 'teacher'): ?>
                                    <div class="text-success">
                                        <strong><?= formatCurrency($member['wallet_balance']) ?></strong><br>
                                        <small>Ví tiền mặt</small>
                                    </div>
                                <?php else: ?>
                                    <div class="text-warning">
                                        <strong><?= formatPoints($member['points_balance']) ?> điểm</strong><br>
                                        <small>Điểm tích lũy</small>
                                    </div>
                                <?php endif; ?>
                            </td>
                            <td>
                                <span class="badge bg-<?= $member['status'] === 'active' ? 'success' : 'secondary' ?>">
                                    <?= $member['status'] === 'active' ? 'Hoạt động' : 'Tạm khóa' ?>
                                </span>
                            </td>
                            <td>
                                <small><?= formatDate($member['registered_at']) ?></small>
                            </td>
                            <td>
                                <div class="btn-group btn-group-sm">
                                    <a href="?page=affiliate_dashboard&member_id=<?= $member['member_id'] ?>" 
                                       class="btn btn-outline-primary" title="Xem dashboard">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <button class="btn btn-outline-info" 
                                            onclick="showMemberDetails('<?= $member['member_id'] ?>')" 
                                            title="Chi tiết">
                                        <i class="fas fa-info-circle"></i>
                                    </button>
                                    <button class="btn btn-outline-<?= $member['status'] === 'active' ? 'warning' : 'success' ?>" 
                                            onclick="toggleMemberStatus('<?= $member['member_id'] ?>', '<?= $member['status'] ?>')"
                                            title="<?= $member['status'] === 'active' ? 'Khóa' : 'Kích hoạt' ?>">
                                        <i class="fas fa-<?= $member['status'] === 'active' ? 'lock' : 'unlock' ?>"></i>
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
function showMemberDetails(memberId) {
    // Load member details via AJAX
    fetch(`ajax/affiliate_actions.php?action=get_member_details&member_id=${memberId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('memberDetailsContent').innerHTML = data.html;
                new bootstrap.Modal(document.getElementById('memberDetailsModal')).show();
            } else {
                showAlert('danger', 'Không thể tải thông tin thành viên');
            }
        });
}

function toggleMemberStatus(memberId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'kích hoạt' : 'khóa';
    
    if (confirm(`Bạn có chắc muốn ${action} thành viên này?`)) {
        const formData = new FormData();
        formData.append('action', 'toggle_member_status');
        formData.append('member_id', memberId);
        formData.append('status', newStatus);
        
        fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', `Đã ${action} thành viên thành công`);
                location.reload();
            } else {
                showAlert('danger', data.message);
            }
        });
    }
}
</script>