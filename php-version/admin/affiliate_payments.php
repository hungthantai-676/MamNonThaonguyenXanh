<?php
// Affiliate Payments Management
$db = getDB();

// Handle payment actions
if ($_POST && isset($_POST['action'])) {
    $response = ['success' => false, 'message' => ''];
    
    switch ($_POST['action']) {
        case 'process_withdrawal':
            $withdrawalId = (int)$_POST['withdrawal_id'];
            $status = $_POST['status'];
            $notes = $_POST['notes'] ?? '';
            
            try {
                $db->beginTransaction();
                
                // Get withdrawal details
                $stmt = $db->prepare("
                    SELECT aw.*, am.name, am.phone 
                    FROM affiliate_withdrawals aw 
                    JOIN affiliate_members am ON aw.member_id = am.id 
                    WHERE aw.id = ?
                ");
                $stmt->execute([$withdrawalId]);
                $withdrawal = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$withdrawal) {
                    throw new Exception('Không tìm thấy yêu cầu rút tiền!');
                }
                
                // Update withdrawal status
                $updateStmt = $db->prepare("
                    UPDATE affiliate_withdrawals 
                    SET status = ?, admin_notes = ?, processed_at = NOW(), updated_at = NOW()
                    WHERE id = ?
                ");
                $updateStmt->execute([$status, $notes, $withdrawalId]);
                
                // If rejected, return money to wallet
                if ($status === 'rejected') {
                    $walletStmt = $db->prepare("
                        UPDATE affiliate_wallets 
                        SET balance = balance + ? 
                        WHERE member_id = ?
                    ");
                    $walletStmt->execute([$withdrawal['amount'], $withdrawal['member_id']]);
                    
                    // Log transaction
                    $transactionStmt = $db->prepare("
                        INSERT INTO affiliate_transactions 
                        (member_id, type, amount, description, status, created_at)
                        VALUES (?, 'withdrawal_rejected', ?, ?, 'completed', NOW())
                    ");
                    $transactionStmt->execute([
                        $withdrawal['member_id'], 
                        $withdrawal['amount'], 
                        "Hoàn tiền rút bị từ chối - ID: {$withdrawalId}"
                    ]);
                }
                
                $db->commit();
                $response['success'] = true;
                $response['message'] = 'Xử lý yêu cầu rút tiền thành công!';
                
            } catch (Exception $e) {
                $db->rollBack();
                $response['message'] = 'Lỗi: ' . $e->getMessage();
            }
            
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
            break;
    }
}

// Get withdrawal requests with pagination
$page = (int)($_GET['p'] ?? 1);
$perPage = 20;
$offset = ($page - 1) * $perPage;

// Filter options
$statusFilter = $_GET['status'] ?? '';
$searchTerm = $_GET['search'] ?? '';

$whereClause = "WHERE 1=1";
$params = [];

if ($statusFilter) {
    $whereClause .= " AND aw.status = ?";
    $params[] = $statusFilter;
}

if ($searchTerm) {
    $whereClause .= " AND (am.name LIKE ? OR am.phone LIKE ?)";
    $params[] = "%$searchTerm%";
    $params[] = "%$searchTerm%";
}

// Get total count
$countStmt = $db->prepare("
    SELECT COUNT(*) as total
    FROM affiliate_withdrawals aw
    JOIN affiliate_members am ON aw.member_id = am.id
    $whereClause
");
$countStmt->execute($params);
$totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
$totalPages = ceil($totalCount / $perPage);

// Get withdrawals data
$stmt = $db->prepare("
    SELECT 
        aw.*,
        am.name,
        am.phone,
        am.role,
        am.bank_info
    FROM affiliate_withdrawals aw
    JOIN affiliate_members am ON aw.member_id = am.id
    $whereClause
    ORDER BY aw.created_at DESC
    LIMIT ? OFFSET ?
");

$params[] = $perPage;
$params[] = $offset;
$stmt->execute($params);
$withdrawals = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get payment statistics
$statsStmt = $db->prepare("
    SELECT 
        aw.status,
        COUNT(*) as count,
        SUM(aw.amount) as total_amount
    FROM affiliate_withdrawals aw
    GROUP BY aw.status
");
$statsStmt->execute();
$stats = $statsStmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-money-bill-wave text-success"></i> Quản lý Thanh toán</h2>
    <div>
        <button class="btn btn-outline-primary" onclick="location.reload()">
            <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="btn btn-success" onclick="affiliateAdmin.exportData('payments')">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Statistics Cards -->
<div class="row mb-4">
    <?php 
    $statusColors = [
        'pending' => ['bg-warning', 'text-dark', 'Chờ xử lý'],
        'approved' => ['bg-success', 'text-white', 'Đã duyệt'], 
        'rejected' => ['bg-danger', 'text-white', 'Từ chối'],
        'completed' => ['bg-info', 'text-white', 'Hoàn thành']
    ];
    
    foreach ($stats as $stat): 
        $colors = $statusColors[$stat['status']] ?? ['bg-secondary', 'text-white', ucfirst($stat['status'])];
    ?>
    <div class="col-md-3 mb-3">
        <div class="card <?= $colors[0] ?> <?= $colors[1] ?>">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6 class="card-title"><?= $colors[2] ?></h6>
                        <h3 class="mb-0"><?= number_format($stat['count']) ?></h3>
                        <small>Tổng: <?= number_format($stat['total_amount']) ?></small>
                    </div>
                    <div class="align-self-center">
                        <i class="fas fa-<?= $stat['status'] === 'pending' ? 'clock' : 
                                         ($stat['status'] === 'approved' ? 'check-circle' : 
                                         ($stat['status'] === 'completed' ? 'check-double' : 'times-circle')) ?> fa-2x"></i>
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
            <input type="hidden" name="action" value="payments">
            
            <div class="col-md-4">
                <label class="form-label">Tìm kiếm</label>
                <input type="text" name="search" class="form-control" placeholder="Tên, SĐT..." value="<?= htmlspecialchars($searchTerm) ?>">
            </div>
            
            <div class="col-md-3">
                <label class="form-label">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="pending" <?= $statusFilter === 'pending' ? 'selected' : '' ?>>Chờ xử lý</option>
                    <option value="approved" <?= $statusFilter === 'approved' ? 'selected' : '' ?>>Đã duyệt</option>
                    <option value="rejected" <?= $statusFilter === 'rejected' ? 'selected' : '' ?>>Từ chối</option>
                    <option value="completed" <?= $statusFilter === 'completed' ? 'selected' : '' ?>>Hoàn thành</option>
                </select>
            </div>
            
            <div class="col-md-3">
                <label class="form-label">&nbsp;</label>
                <div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-filter"></i> Lọc
                    </button>
                    <a href="?page=admin_affiliate&action=payments" class="btn btn-outline-secondary">
                        <i class="fas fa-times"></i> Xóa lọc
                    </a>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Withdrawals Table -->
<div class="card">
    <div class="card-header">
        <h5><i class="fas fa-list"></i> Danh sách yêu cầu rút tiền (<?= number_format($totalCount) ?> yêu cầu)</h5>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Thành viên</th>
                        <th>Số tiền</th>
                        <th>Thông tin NH</th>
                        <th>Ngày yêu cầu</th>
                        <th>Trạng thái</th>
                        <th>Ghi chú Admin</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($withdrawals)): ?>
                        <tr>
                            <td colspan="8" class="text-center py-4">
                                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                <p class="text-muted">Chưa có yêu cầu rút tiền nào</p>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($withdrawals as $withdrawal): ?>
                            <tr>
                                <td>
                                    <span class="badge bg-secondary">#<?= $withdrawal['id'] ?></span>
                                </td>
                                <td>
                                    <div>
                                        <strong><?= htmlspecialchars($withdrawal['name']) ?></strong>
                                        <br>
                                        <small class="text-muted">
                                            <i class="fas fa-phone"></i> <?= htmlspecialchars($withdrawal['phone']) ?>
                                        </small>
                                        <br>
                                        <span class="badge bg-<?= $withdrawal['role'] === 'teacher' ? 'info' : 'warning' ?> badge-sm">
                                            <?= $withdrawal['role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <strong class="text-success"><?= number_format($withdrawal['amount']) ?></strong>
                                    <br>
                                    <small class="text-muted">
                                        <?= $withdrawal['role'] === 'teacher' ? 'VND' : 'Điểm' ?>
                                    </small>
                                </td>
                                <td>
                                    <?php if ($withdrawal['bank_info']): ?>
                                        <?php $bankInfo = json_decode($withdrawal['bank_info'], true); ?>
                                        <div>
                                            <strong><?= htmlspecialchars($bankInfo['bank_name'] ?? '') ?></strong>
                                            <br>
                                            <small class="text-muted">STK: <?= htmlspecialchars($bankInfo['account_number'] ?? '') ?></small>
                                            <br>
                                            <small class="text-muted">Tên: <?= htmlspecialchars($bankInfo['account_name'] ?? '') ?></small>
                                        </div>
                                    <?php else: ?>
                                        <span class="text-danger">Chưa có thông tin NH</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?= date('d/m/Y H:i', strtotime($withdrawal['created_at'])) ?>
                                </td>
                                <td>
                                    <?php
                                    $statusBadge = [
                                        'pending' => '<span class="badge bg-warning text-dark"><i class="fas fa-clock"></i> Chờ xử lý</span>',
                                        'approved' => '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Đã duyệt</span>',
                                        'rejected' => '<span class="badge bg-danger"><i class="fas fa-times-circle"></i> Từ chối</span>',
                                        'completed' => '<span class="badge bg-info"><i class="fas fa-check-double"></i> Hoàn thành</span>'
                                    ];
                                    echo $statusBadge[$withdrawal['status']] ?? '<span class="badge bg-secondary">Unknown</span>';
                                    ?>
                                    <?php if ($withdrawal['processed_at']): ?>
                                        <br>
                                        <small class="text-muted"><?= date('d/m/Y H:i', strtotime($withdrawal['processed_at'])) ?></small>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($withdrawal['admin_notes']): ?>
                                        <small><?= htmlspecialchars($withdrawal['admin_notes']) ?></small>
                                    <?php else: ?>
                                        <span class="text-muted">-</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($withdrawal['status'] === 'pending'): ?>
                                        <div class="btn-group" role="group">
                                            <button class="btn btn-success btn-sm" 
                                                    onclick="processWithdrawal(<?= $withdrawal['id'] ?>, 'approved')"
                                                    title="Duyệt">
                                                <i class="fas fa-check"></i>
                                            </button>
                                            <button class="btn btn-danger btn-sm"
                                                    onclick="processWithdrawal(<?= $withdrawal['id'] ?>, 'rejected')"
                                                    title="Từ chối">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    <?php elseif ($withdrawal['status'] === 'approved'): ?>
                                        <button class="btn btn-info btn-sm"
                                                onclick="processWithdrawal(<?= $withdrawal['id'] ?>, 'completed')"
                                                title="Đánh dấu hoàn thành">
                                            <i class="fas fa-check-double"></i> Hoàn thành
                                        </button>
                                    <?php else: ?>
                                        <button class="btn btn-outline-secondary btn-sm" disabled>
                                            <i class="fas fa-<?= $withdrawal['status'] === 'completed' ? 'check-double' : 'times' ?>"></i>
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
<nav aria-label="Payment pagination" class="mt-4">
    <ul class="pagination justify-content-center">
        <?php if ($page > 1): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=payments&p=<?= $page - 1 ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $searchTerm ? '&search=' . urlencode($searchTerm) : '' ?>">
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
                <a class="page-link" href="?page=admin_affiliate&action=payments&p=<?= $i ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $searchTerm ? '&search=' . urlencode($searchTerm) : '' ?>">
                    <?= $i ?>
                </a>
            </li>
        <?php endfor; ?>
        
        <?php if ($page < $totalPages): ?>
            <li class="page-item">
                <a class="page-link" href="?page=admin_affiliate&action=payments&p=<?= $page + 1 ?><?= $statusFilter ? '&status=' . $statusFilter : '' ?><?= $searchTerm ? '&search=' . urlencode($searchTerm) : '' ?>">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        <?php endif; ?>
    </ul>
</nav>
<?php endif; ?>

<!-- Process Withdrawal Modal -->
<div class="modal fade" id="processWithdrawalModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Xử lý yêu cầu rút tiền</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="processWithdrawalForm">
                    <input type="hidden" id="withdrawalId" name="withdrawal_id">
                    <input type="hidden" id="withdrawalStatus" name="status">
                    
                    <div class="mb-3">
                        <label class="form-label">Ghi chú Admin</label>
                        <textarea class="form-control" name="notes" rows="3" placeholder="Nhập ghi chú (tùy chọn)"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                <button type="button" class="btn btn-primary" onclick="submitWithdrawalProcess()">Xác nhận</button>
            </div>
        </div>
    </div>
</div>

<script>
function processWithdrawal(withdrawalId, status) {
    const statusText = {
        'approved': 'duyệt',
        'rejected': 'từ chối',
        'completed': 'đánh dấu hoàn thành'
    };
    
    document.getElementById('withdrawalId').value = withdrawalId;
    document.getElementById('withdrawalStatus').value = status;
    document.querySelector('.modal-title').textContent = `${statusText[status].charAt(0).toUpperCase() + statusText[status].slice(1)} yêu cầu rút tiền`;
    
    new bootstrap.Modal(document.getElementById('processWithdrawalModal')).show();
}

function submitWithdrawalProcess() {
    const form = document.getElementById('processWithdrawalForm');
    const formData = new FormData(form);
    formData.append('action', 'process_withdrawal');
    
    fetch('?page=admin_affiliate&action=payments', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', data.message);
            bootstrap.Modal.getInstance(document.getElementById('processWithdrawalModal')).hide();
            setTimeout(() => location.reload(), 1500);
        } else {
            showAlert('danger', data.message);
        }
    })
    .catch(error => {
        showAlert('danger', 'Lỗi kết nối: ' + error.message);
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