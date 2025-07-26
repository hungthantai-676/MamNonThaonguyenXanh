<?php
require_once '../includes/affiliate_functions.php';

$db = getDB();

// Get all referrals with payment status
$referrals = $db->fetchAll("
    SELECT r.*, 
           am.name as referrer_name, 
           am.role as referrer_role,
           am.phone as referrer_phone,
           am.wallet_balance,
           am.points_balance,
           CASE 
               WHEN r.payment_status = 'pending' THEN 'Chờ thanh toán'
               WHEN r.payment_status = 'confirmed' THEN 'Đã xác nhận'
               WHEN r.payment_status = 'paid' THEN 'Đã thanh toán'
               ELSE 'Chưa xác định'
           END as payment_status_text
    FROM referrals r 
    JOIN affiliate_members am ON r.referrer_id = am.member_id 
    WHERE r.status IN ('confirmed', 'enrolled')
    ORDER BY r.created_at DESC
");

// Calculate totals
$totalPending = 0;
$totalConfirmed = 0;
$totalPaid = 0;

foreach ($referrals as $ref) {
    $amount = ($ref['referrer_role'] === 'teacher') ? 2000000 : 2000;
    
    switch ($ref['payment_status']) {
        case 'pending':
            $totalPending += $amount;
            break;
        case 'confirmed':
            $totalConfirmed += $amount;
            break;
        case 'paid':
            $totalPaid += $amount;
            break;
    }
}
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3">💰 Quản lý Thanh toán</h1>
    <div>
        <button class="btn btn-warning btn-sm" onclick="confirmAllPayments()">
            <i class="fas fa-check-double"></i> Xác nhận tất cả
        </button>
        <button class="btn btn-success btn-sm" onclick="exportPaymentReport()">
            <i class="fas fa-download"></i> Xuất báo cáo
        </button>
    </div>
</div>

<!-- Payment Statistics -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card bg-warning text-white">
            <div class="card-body text-center">
                <i class="fas fa-clock fa-2x mb-2"></i>
                <h4><?= formatCurrency($totalPending) ?></h4>
                <p class="mb-0">Chờ xác nhận</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body text-center">
                <i class="fas fa-check fa-2x mb-2"></i>
                <h4><?= formatCurrency($totalConfirmed) ?></h4>
                <p class="mb-0">Đã xác nhận</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-success text-white">
            <div class="card-body text-center">
                <i class="fas fa-money-bill-wave fa-2x mb-2"></i>
                <h4><?= formatCurrency($totalPaid) ?></h4>
                <p class="mb-0">Đã thanh toán</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body text-center">
                <i class="fas fa-calculator fa-2x mb-2"></i>
                <h4><?= formatCurrency($totalPending + $totalConfirmed + $totalPaid) ?></h4>
                <p class="mb-0">Tổng cộng</p>
            </div>
        </div>
    </div>
</div>

<!-- Filter Controls -->
<div class="card mb-4">
    <div class="card-body">
        <div class="row g-3">
            <div class="col-md-3">
                <select id="filterPaymentStatus" class="form-select">
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="paid">Đã thanh toán</option>
                </select>
            </div>
            <div class="col-md-3">
                <select id="filterRole" class="form-select">
                    <option value="">Tất cả vai trò</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="parent">Phụ huynh</option>
                </select>
            </div>
            <div class="col-md-4">
                <input type="text" id="searchPayment" class="form-control" placeholder="Tìm kiếm theo tên, SĐT...">
            </div>
            <div class="col-md-2">
                <button class="btn btn-primary w-100" onclick="filterPayments()">
                    <i class="fas fa-filter"></i> Lọc
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Payment List -->
<div class="card">
    <div class="card-header">
        <h5 class="mb-0"><i class="fas fa-list"></i> Danh sách Thanh toán</h5>
    </div>
    <div class="card-body">
        <?php if (empty($referrals)): ?>
            <div class="text-center py-5">
                <i class="fas fa-money-bill-wave fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Chưa có giao dịch nào</h5>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="table table-hover" id="paymentsTable">
                    <thead class="table-dark">
                        <tr>
                            <th>Thành viên</th>
                            <th>Học sinh</th>
                            <th>Vai trò</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($referrals as $ref): ?>
                            <tr data-payment-status="<?= $ref['payment_status'] ?>" data-role="<?= $ref['referrer_role'] ?>">
                                <td>
                                    <div>
                                        <strong><?= htmlspecialchars($ref['referrer_name']) ?></strong>
                                        <br>
                                        <small class="text-muted"><?= $ref['referrer_phone'] ?></small>
                                        <br>
                                        <small class="text-muted">ID: <?= $ref['referrer_id'] ?></small>
                                    </div>
                                </td>
                                <td>
                                    <strong><?= htmlspecialchars($ref['student_name']) ?></strong>
                                    <br>
                                    <small class="text-muted">Tuổi: <?= $ref['student_age'] ?></small>
                                </td>
                                <td>
                                    <span class="badge bg-<?= $ref['referrer_role'] === 'teacher' ? 'success' : 'warning' ?>">
                                        <?= $ref['referrer_role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?>
                                    </span>
                                </td>
                                <td>
                                    <strong class="text-primary">
                                        <?php if ($ref['referrer_role'] === 'teacher'): ?>
                                            <?= formatCurrency(2000000) ?>
                                        <?php else: ?>
                                            <?= formatPoints(2000) ?> điểm
                                        <?php endif; ?>
                                    </strong>
                                </td>
                                <td>
                                    <span class="badge payment-status-badge 
                                        <?php 
                                        switch($ref['payment_status']) {
                                            case 'pending': echo 'bg-warning'; break;
                                            case 'confirmed': echo 'bg-info'; break;
                                            case 'paid': echo 'bg-success'; break;
                                            default: echo 'bg-secondary';
                                        }
                                        ?>">
                                        <?= $ref['payment_status_text'] ?>
                                    </span>
                                </td>
                                <td>
                                    <?= date('d/m/Y H:i', strtotime($ref['created_at'])) ?>
                                </td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <?php if ($ref['payment_status'] === 'pending'): ?>
                                            <button class="btn btn-warning btn-sm" 
                                                    onclick="confirmPayment(<?= $ref['id'] ?>)"
                                                    title="Xác nhận đã nhận tiền">
                                                <i class="fas fa-check"></i> Xác nhận
                                            </button>
                                        <?php elseif ($ref['payment_status'] === 'confirmed'): ?>
                                            <button class="btn btn-success btn-sm" 
                                                    onclick="markAsPaid(<?= $ref['id'] ?>)"
                                                    title="Đánh dấu đã thanh toán">
                                                <i class="fas fa-money-bill-wave"></i> Thanh toán
                                            </button>
                                        <?php else: ?>
                                            <button class="btn btn-secondary btn-sm" disabled>
                                                <i class="fas fa-check-double"></i> Hoàn tất
                                            </button>
                                        <?php endif; ?>
                                        
                                        <button class="btn btn-info btn-sm" 
                                                onclick="viewPaymentDetails(<?= $ref['id'] ?>)"
                                                title="Xem chi tiết">
                                            <i class="fas fa-eye"></i>
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

<!-- Payment Details Modal -->
<div class="modal fade" id="paymentDetailsModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Chi tiết Thanh toán</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="paymentDetailsContent">
                <!-- Content loaded via AJAX -->
            </div>
        </div>
    </div>
</div>

<style>
.payment-status-badge {
    font-size: 0.9em;
    padding: 6px 12px;
}

.table td {
    vertical-align: middle;
}

.btn-group .btn {
    margin-right: 2px;
}

.payment-row-pending {
    background-color: #fff3cd;
}

.payment-row-confirmed {
    background-color: #d1ecf1;
}

.payment-row-paid {
    background-color: #d4edda;
}

.filtered-out {
    display: none !important;
}
</style>

<script>
function confirmPayment(referralId) {
    if (confirm('Xác nhận đã nhận được thanh toán từ khách hàng?\nHệ thống sẽ cộng tiền vào tài khoản thành viên.')) {
        fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=confirm_payment&referral_id=${referralId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', 'Xác nhận thành công! Đã cộng tiền vào tài khoản thành viên.');
                setTimeout(() => location.reload(), 1000);
            } else {
                showAlert('danger', data.message || 'Có lỗi xảy ra');
            }
        })
        .catch(error => {
            showAlert('danger', 'Lỗi kết nối: ' + error.message);
        });
    }
}

function markAsPaid(referralId) {
    if (confirm('Xác nhận đã thanh toán hoa hồng cho thành viên?\nHệ thống sẽ trừ tiền từ tài khoản thành viên.')) {
        fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=mark_as_paid&referral_id=${referralId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', 'Đã cập nhật trạng thái thanh toán!');
                setTimeout(() => location.reload(), 1000);
            } else {
                showAlert('danger', data.message || 'Có lỗi xảy ra');
            }
        })
        .catch(error => {
            showAlert('danger', 'Lỗi kết nối: ' + error.message);
        });
    }
}

function viewPaymentDetails(referralId) {
    fetch(`ajax/affiliate_actions.php?action=get_payment_details&referral_id=${referralId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('paymentDetailsContent').innerHTML = data.html;
                new bootstrap.Modal(document.getElementById('paymentDetailsModal')).show();
            } else {
                showAlert('danger', data.message);
            }
        });
}

function confirmAllPayments() {
    if (confirm('Xác nhận tất cả các thanh toán đang chờ?\nHành động này không thể hoàn tác.')) {
        fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=confirm_all_payments'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', `Đã xác nhận ${data.count} thanh toán!`);
                setTimeout(() => location.reload(), 1000);
            } else {
                showAlert('danger', data.message);
            }
        });
    }
}

function filterPayments() {
    const statusFilter = document.getElementById('filterPaymentStatus').value;
    const roleFilter = document.getElementById('filterRole').value;
    const searchTerm = document.getElementById('searchPayment').value.toLowerCase();
    
    const rows = document.querySelectorAll('#paymentsTable tbody tr');
    
    rows.forEach(row => {
        const status = row.getAttribute('data-payment-status');
        const role = row.getAttribute('data-role');
        const text = row.textContent.toLowerCase();
        
        let shouldShow = true;
        
        if (statusFilter && status !== statusFilter) {
            shouldShow = false;
        }
        
        if (roleFilter && role !== roleFilter) {
            shouldShow = false;
        }
        
        if (searchTerm && !text.includes(searchTerm)) {
            shouldShow = false;
        }
        
        row.classList.toggle('filtered-out', !shouldShow);
    });
}

function exportPaymentReport() {
    const csvData = [
        ['Thành viên', 'SĐT', 'Vai trò', 'Học sinh', 'Tuổi', 'Số tiền', 'Trạng thái', 'Ngày tạo']
    ];
    
    const rows = document.querySelectorAll('#paymentsTable tbody tr:not(.filtered-out)');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const memberName = cells[0].querySelector('strong').textContent;
        const phone = cells[0].querySelector('small').textContent;
        const role = cells[2].textContent.trim();
        const studentName = cells[1].querySelector('strong').textContent;
        const age = cells[1].querySelector('small').textContent;
        const amount = cells[3].textContent.trim();
        const status = cells[4].textContent.trim();
        const date = cells[5].textContent.trim();
        
        csvData.push([memberName, phone, role, studentName, age, amount, status, date]);
    });
    
    const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bao_cao_thanh_toan_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Real-time search
document.getElementById('searchPayment').addEventListener('input', filterPayments);
document.getElementById('filterPaymentStatus').addEventListener('change', filterPayments);
document.getElementById('filterRole').addEventListener('change', filterPayments);
</script>