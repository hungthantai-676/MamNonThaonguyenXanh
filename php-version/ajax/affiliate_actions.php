<?php
require_once '../includes/config.php';
require_once '../includes/affiliate_functions.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'confirm_referral':
        handleConfirmReferral();
        break;
    case 'enroll_student':
        handleEnrollStudent();
        break;
    case 'get_member_details':
        handleGetMemberDetails();
        break;
    case 'toggle_member_status':
        handleToggleMemberStatus();
        break;
    case 'export_referrals':
        handleExportReferrals();
        break;
    case 'confirm_payment':
        handleConfirmPayment();
        break;
    case 'mark_as_paid':
        handleMarkAsPaid();
        break;
    case 'confirm_all_payments':
        handleConfirmAllPayments();
        break;
    case 'get_payment_details':
        handleGetPaymentDetails();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function handleConfirmReferral() {
    $referralId = $_POST['referral_id'] ?? '';
    
    if (!$referralId) {
        echo json_encode(['success' => false, 'message' => 'Thiếu ID giới thiệu']);
        return;
    }
    
    $result = confirmReferral($referralId);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Đã xác nhận giới thiệu và cộng thưởng thành công']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không thể xác nhận giới thiệu']);
    }
}

function handleEnrollStudent() {
    $referralId = $_POST['referral_id'] ?? '';
    
    if (!$referralId) {
        echo json_encode(['success' => false, 'message' => 'Thiếu ID giới thiệu']);
        return;
    }
    
    $db = getDB();
    $result = $db->update(
        "UPDATE referrals SET status = 'enrolled', updated_at = NOW() WHERE id = ?",
        [$referralId]
    );
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Đã cập nhật trạng thái nhập học']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không thể cập nhật trạng thái']);
    }
}

function handleGetMemberDetails() {
    $memberId = $_GET['member_id'] ?? '';
    
    if (!$memberId) {
        echo json_encode(['success' => false, 'message' => 'Thiếu ID thành viên']);
        return;
    }
    
    $db = getDB();
    
    // Get member info
    $member = $db->fetch("SELECT * FROM affiliate_members WHERE member_id = ?", [$memberId]);
    if (!$member) {
        echo json_encode(['success' => false, 'message' => 'Không tìm thấy thành viên']);
        return;
    }
    
    // Get referrals
    $referrals = $db->fetchAll(
        "SELECT * FROM referrals WHERE referrer_id = ? ORDER BY created_at DESC LIMIT 10",
        [$memberId]
    );
    
    // Get transactions
    $transactions = $db->fetchAll(
        "SELECT * FROM wallet_transactions WHERE member_id = ? ORDER BY created_at DESC LIMIT 10",
        [$memberId]
    );
    
    ob_start();
    ?>
    <div class="row">
        <div class="col-md-6">
            <h6>Thông tin cơ bản</h6>
            <table class="table table-sm">
                <tr><td>ID:</td><td><?= $member['member_id'] ?></td></tr>
                <tr><td>Tên:</td><td><?= htmlspecialchars($member['name']) ?></td></tr>
                <tr><td>SĐT:</td><td><?= $member['phone'] ?></td></tr>
                <tr><td>Email:</td><td><?= htmlspecialchars($member['email'] ?? '') ?></td></tr>
                <tr><td>Vai trò:</td><td><?= $member['role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh' ?></td></tr>
                <tr><td>Mã giới thiệu:</td><td><code><?= $member['referral_code'] ?></code></td></tr>
                <tr><td>Tổng giới thiệu:</td><td><?= $member['total_referrals'] ?></td></tr>
                <tr><td>Trạng thái:</td><td>
                    <span class="badge bg-<?= $member['status'] === 'active' ? 'success' : 'secondary' ?>">
                        <?= $member['status'] === 'active' ? 'Hoạt động' : 'Tạm khóa' ?>
                    </span>
                </td></tr>
                <tr><td>Ngày ĐK:</td><td><?= formatDate($member['registered_at']) ?></td></tr>
            </table>
        </div>
        
        <div class="col-md-6">
            <h6>Số dư hiện tại</h6>
            <div class="card bg-light">
                <div class="card-body text-center">
                    <?php if ($member['role'] === 'teacher'): ?>
                        <h4 class="text-success"><?= formatCurrency($member['wallet_balance']) ?></h4>
                        <p class="text-muted mb-0">Ví tiền mặt</p>
                    <?php else: ?>
                        <h4 class="text-warning"><?= formatPoints($member['points_balance']) ?> điểm</h4>
                        <p class="text-muted mb-0">Điểm tích lũy</p>
                    <?php endif; ?>
                </div>
            </div>
            
            <h6 class="mt-3">Mốc thưởng</h6>
            <div class="progress mb-2">
                <?php
                $nextTarget = $member['next_milestone_target'];
                $current = $member['total_referrals'];
                $progress = $nextTarget > 0 ? ($current % 5) / 5 * 100 : 0;
                ?>
                <div class="progress-bar" style="width: <?= $progress ?>%"></div>
            </div>
            <small class="text-muted">
                Đã đạt <?= $member['current_milestone'] ?> mốc. 
                Còn <?= max(0, $nextTarget - $current) ?> giới thiệu nữa để đạt mốc tiếp theo.
            </small>
        </div>
    </div>
    
    <hr>
    
    <div class="row">
        <div class="col-md-6">
            <h6>Giới thiệu gần đây</h6>
            <?php if (empty($referrals)): ?>
                <p class="text-muted">Chưa có giới thiệu nào</p>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Học sinh</th>
                                <th>Trạng thái</th>
                                <th>Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($referrals as $ref): ?>
                            <tr>
                                <td><?= htmlspecialchars($ref['student_name']) ?></td>
                                <td>
                                    <span class="badge bg-<?= $ref['status'] === 'confirmed' ? 'success' : ($ref['status'] === 'pending' ? 'warning' : 'primary') ?>">
                                        <?= $ref['status'] === 'confirmed' ? 'Đã xác nhận' : ($ref['status'] === 'pending' ? 'Chờ' : 'Nhập học') ?>
                                    </span>
                                </td>
                                <td><small><?= formatDate($ref['created_at']) ?></small></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="col-md-6">
            <h6>Giao dịch gần đây</h6>
            <?php if (empty($transactions)): ?>
                <p class="text-muted">Chưa có giao dịch nào</p>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Loại</th>
                                <th>Số tiền/điểm</th>
                                <th>Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($transactions as $trans): ?>
                            <tr>
                                <td>
                                    <small><?= 
                                        $trans['transaction_type'] === 'referral_reward' ? 'Thưởng giới thiệu' :
                                        ($trans['transaction_type'] === 'milestone_bonus' ? 'Thưởng mốc' : $trans['transaction_type'])
                                    ?></small>
                                </td>
                                <td>
                                    <?php if ($trans['amount'] > 0): ?>
                                        <span class="text-success"><?= formatCurrency($trans['amount']) ?></span>
                                    <?php endif; ?>
                                    <?php if ($trans['points'] > 0): ?>
                                        <span class="text-warning"><?= formatPoints($trans['points']) ?> điểm</span>
                                    <?php endif; ?>
                                </td>
                                <td><small><?= formatDate($trans['created_at']) ?></small></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
    $html = ob_get_clean();
    
    echo json_encode(['success' => true, 'html' => $html]);
}

function handleToggleMemberStatus() {
    $memberId = $_POST['member_id'] ?? '';
    $status = $_POST['status'] ?? '';
    
    if (!$memberId || !in_array($status, ['active', 'inactive'])) {
        echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
        return;
    }
    
    $db = getDB();
    $result = $db->update(
        "UPDATE affiliate_members SET status = ?, updated_at = NOW() WHERE member_id = ?",
        [$status, $memberId]
    );
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Đã cập nhật trạng thái thành viên']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không thể cập nhật trạng thái']);
    }
}

function handleExportReferrals() {
    // Simple CSV export
    $status = $_GET['status'] ?? 'pending';
    $search = $_GET['search'] ?? '';
    
    $db = getDB();
    
    $whereConditions = ["r.status = ?"];
    $params = [$status];
    
    if ($search) {
        $whereConditions[] = "(r.student_name LIKE ? OR r.parent_name LIKE ? OR r.parent_phone LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
    }
    
    $whereClause = implode(' AND ', $whereConditions);
    
    $referrals = $db->fetchAll("
        SELECT r.*, am.name as referrer_name, am.role as referrer_role 
        FROM referrals r 
        JOIN affiliate_members am ON r.referrer_id = am.member_id 
        WHERE $whereClause 
        ORDER BY r.created_at DESC
    ", $params);
    
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="gioithieu_' . $status . '_' . date('Y-m-d') . '.csv"');
    
    $output = fopen('php://output', 'w');
    
    // UTF-8 BOM for Excel
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    // Header
    fputcsv($output, [
        'Ngày',
        'Người giới thiệu',
        'Vai trò',
        'Học sinh',
        'Phụ huynh',
        'SĐT',
        'Email',
        'Thưởng',
        'Trạng thái',
        'Ngày xác nhận'
    ]);
    
    // Data
    foreach ($referrals as $ref) {
        $reward = $ref['referrer_role'] === 'teacher' ? 
            number_format($ref['reward_amount']) . ' VNĐ' : 
            number_format($ref['reward_points']) . ' điểm';
            
        fputcsv($output, [
            date('d/m/Y', strtotime($ref['created_at'])),
            $ref['referrer_name'],
            $ref['referrer_role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh',
            $ref['student_name'],
            $ref['parent_name'],
            $ref['parent_phone'],
            $ref['parent_email'],
            $reward,
            $ref['status'] === 'confirmed' ? 'Đã xác nhận' : ($ref['status'] === 'pending' ? 'Chờ xác nhận' : 'Đã nhập học'),
            $ref['confirmed_at'] ? date('d/m/Y', strtotime($ref['confirmed_at'])) : ''
        ]);
    }
    
    fclose($output);
    exit;
}

function handleConfirmPayment() {
    $referralId = $_POST['referral_id'] ?? '';
    
    if (!$referralId) {
        echo json_encode(['success' => false, 'message' => 'Thiếu ID giới thiệu']);
        return;
    }
    
    $db = getDB();
    
    // Get referral details
    $referral = $db->fetch("
        SELECT r.*, am.role, am.wallet_balance, am.points_balance
        FROM referrals r 
        JOIN affiliate_members am ON r.referrer_id = am.member_id 
        WHERE r.id = ?
    ", [$referralId]);
    
    if (!$referral) {
        echo json_encode(['success' => false, 'message' => 'Không tìm thấy giới thiệu']);
        return;
    }
    
    // Update payment status to confirmed
    $updated = $db->execute("
        UPDATE referrals 
        SET payment_status = 'confirmed', payment_confirmed_at = NOW() 
        WHERE id = ?
    ", [$referralId]);
    
    if ($updated) {
        // Add money to member account
        $amount = ($referral['role'] === 'teacher') ? 2000000 : 2000;
        
        if ($referral['role'] === 'teacher') {
            $db->execute("
                UPDATE affiliate_members 
                SET wallet_balance = wallet_balance + ? 
                WHERE member_id = ?
            ", [$amount, $referral['referrer_id']]);
        } else {
            $db->execute("
                UPDATE affiliate_members 
                SET points_balance = points_balance + ? 
                WHERE member_id = ?
            ", [$amount, $referral['referrer_id']]);
        }
        
        // Log transaction
        $db->execute("
            INSERT INTO affiliate_transactions (member_id, type, amount, description, created_at) 
            VALUES (?, 'credit', ?, ?, NOW())
        ", [
            $referral['referrer_id'], 
            $amount, 
            "Hoa hồng giới thiệu học sinh: " . $referral['student_name']
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Xác nhận thành công']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không thể cập nhật']);
    }
}

function handleMarkAsPaid() {
    $referralId = $_POST['referral_id'] ?? '';
    
    if (!$referralId) {
        echo json_encode(['success' => false, 'message' => 'Thiếu ID giới thiệu']);
        return;
    }
    
    $db = getDB();
    
    // Get referral details
    $referral = $db->fetch("
        SELECT r.*, am.role, am.wallet_balance, am.points_balance
        FROM referrals r 
        JOIN affiliate_members am ON r.referrer_id = am.member_id 
        WHERE r.id = ?
    ", [$referralId]);
    
    if (!$referral) {
        echo json_encode(['success' => false, 'message' => 'Không tìm thấy giới thiệu']);
        return;
    }
    
    // Update payment status to paid
    $updated = $db->execute("
        UPDATE referrals 
        SET payment_status = 'paid', payment_completed_at = NOW() 
        WHERE id = ?
    ", [$referralId]);
    
    if ($updated) {
        // Deduct money from member account
        $amount = ($referral['role'] === 'teacher') ? 2000000 : 2000;
        
        if ($referral['role'] === 'teacher') {
            $db->execute("
                UPDATE affiliate_members 
                SET wallet_balance = wallet_balance - ? 
                WHERE member_id = ?
            ", [$amount, $referral['referrer_id']]);
        } else {
            $db->execute("
                UPDATE affiliate_members 
                SET points_balance = points_balance - ? 
                WHERE member_id = ?
            ", [$amount, $referral['referrer_id']]);
        }
        
        // Log transaction
        $db->execute("
            INSERT INTO affiliate_transactions (member_id, type, amount, description, created_at) 
            VALUES (?, 'debit', ?, ?, NOW())
        ", [
            $referral['referrer_id'], 
            $amount, 
            "Thanh toán hoa hồng học sinh: " . $referral['student_name']
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Đã thanh toán thành công']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không thể cập nhật']);
    }
}

function handleConfirmAllPayments() {
    $db = getDB();
    
    $pendingReferrals = $db->fetchAll("
        SELECT r.*, am.role 
        FROM referrals r 
        JOIN affiliate_members am ON r.referrer_id = am.member_id 
        WHERE r.payment_status = 'pending' AND r.status IN ('confirmed', 'enrolled')
    ");
    
    $count = 0;
    foreach ($pendingReferrals as $referral) {
        // Update payment status
        $db->execute("
            UPDATE referrals 
            SET payment_status = 'confirmed', payment_confirmed_at = NOW() 
            WHERE id = ?
        ", [$referral['id']]);
        
        // Add money to member account
        $amount = ($referral['role'] === 'teacher') ? 2000000 : 2000;
        
        if ($referral['role'] === 'teacher') {
            $db->execute("
                UPDATE affiliate_members 
                SET wallet_balance = wallet_balance + ? 
                WHERE member_id = ?
            ", [$amount, $referral['referrer_id']]);
        } else {
            $db->execute("
                UPDATE affiliate_members 
                SET points_balance = points_balance + ? 
                WHERE member_id = ?
            ", [$amount, $referral['referrer_id']]);
        }
        
        // Log transaction
        $db->execute("
            INSERT INTO affiliate_transactions (member_id, type, amount, description, created_at) 
            VALUES (?, 'credit', ?, ?, NOW())
        ", [
            $referral['referrer_id'], 
            $amount, 
            "Hoa hồng giới thiệu học sinh: " . $referral['student_name']
        ]);
        
        $count++;
    }
    
    echo json_encode(['success' => true, 'message' => "Đã xác nhận $count thanh toán", 'count' => $count]);
}

function handleGetPaymentDetails() {
    $referralId = $_GET['referral_id'] ?? '';
    
    if (!$referralId) {
        echo json_encode(['success' => false, 'message' => 'Thiếu ID giới thiệu']);
        return;
    }
    
    $db = getDB();
    
    $referral = $db->fetch("
        SELECT r.*, 
               am.name as referrer_name, 
               am.role as referrer_role,
               am.phone as referrer_phone,
               am.email as referrer_email,
               am.wallet_balance,
               am.points_balance
        FROM referrals r 
        JOIN affiliate_members am ON r.referrer_id = am.member_id 
        WHERE r.id = ?
    ", [$referralId]);
    
    if ($referral) {
        $amount = ($referral['referrer_role'] === 'teacher') ? 2000000 : 2000;
        $currency = ($referral['referrer_role'] === 'teacher') ? 'VNĐ' : 'điểm';
        
        $html = "
            <div class='row'>
                <div class='col-md-6'>
                    <h6>Thông tin Thành viên</h6>
                    <p><strong>Tên:</strong> {$referral['referrer_name']}</p>
                    <p><strong>SĐT:</strong> {$referral['referrer_phone']}</p>
                    <p><strong>Email:</strong> {$referral['referrer_email']}</p>
                    <p><strong>Vai trò:</strong> " . ($referral['referrer_role'] === 'teacher' ? 'Giáo viên' : 'Phụ huynh') . "</p>
                    <p><strong>Số dư hiện tại:</strong> " . 
                    ($referral['referrer_role'] === 'teacher' ? 
                        formatCurrency($referral['wallet_balance']) : 
                        formatPoints($referral['points_balance']) . ' điểm') . "</p>
                </div>
                <div class='col-md-6'>
                    <h6>Thông tin Học sinh</h6>
                    <p><strong>Tên:</strong> {$referral['student_name']}</p>
                    <p><strong>Tuổi:</strong> {$referral['student_age']}</p>
                    <p><strong>SĐT phụ huynh:</strong> {$referral['parent_phone']}</p>
                    <p><strong>Ghi chú:</strong> {$referral['notes']}</p>
                </div>
            </div>
            <hr>
            <div class='row'>
                <div class='col-12'>
                    <h6>Thông tin Thanh toán</h6>
                    <p><strong>Số tiền:</strong> " . formatCurrency($amount) . " $currency</p>
                    <p><strong>Trạng thái:</strong> 
                        <span class='badge bg-" . 
                        ($referral['payment_status'] === 'pending' ? 'warning' : 
                         ($referral['payment_status'] === 'confirmed' ? 'info' : 'success')) . "'>
                            " . ($referral['payment_status'] === 'pending' ? 'Chờ xác nhận' : 
                                 ($referral['payment_status'] === 'confirmed' ? 'Đã xác nhận' : 'Đã thanh toán')) . "
                        </span>
                    </p>
                    <p><strong>Ngày tạo:</strong> " . date('d/m/Y H:i', strtotime($referral['created_at'])) . "</p>
                    " . ($referral['payment_confirmed_at'] ? 
                        "<p><strong>Ngày xác nhận:</strong> " . date('d/m/Y H:i', strtotime($referral['payment_confirmed_at'])) . "</p>" : "") . "
                    " . ($referral['payment_completed_at'] ? 
                        "<p><strong>Ngày thanh toán:</strong> " . date('d/m/Y H:i', strtotime($referral['payment_completed_at'])) . "</p>" : "") . "
                </div>
            </div>
        ";
        
        echo json_encode(['success' => true, 'html' => $html]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không tìm thấy dữ liệu']);
    }
}
?>