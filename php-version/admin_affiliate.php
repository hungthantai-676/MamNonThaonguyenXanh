<?php
require_once 'includes/affiliate_functions.php';

// Admin authentication check
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ?page=admin');
    exit();
}

$action = $_GET['action'] ?? 'overview';
$db = getDB();
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý Affiliate - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>

<div class="container-fluid">
    <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-dark text-white p-0">
            <div class="d-flex flex-column vh-100">
                <div class="p-3 text-center border-bottom">
                    <h5>🎯 Affiliate Admin</h5>
                </div>
                
                <nav class="nav flex-column p-3">
                    <a class="nav-link text-white <?= $action == 'overview' ? 'active bg-primary' : '' ?>" href="?action=overview">
                        <i class="fas fa-chart-line"></i> Tổng quan
                    </a>
                    <a class="nav-link text-white <?= $action == 'members' ? 'active bg-primary' : '' ?>" href="?action=members">
                        <i class="fas fa-users"></i> Thành viên
                    </a>
                    <a class="nav-link text-white <?= $action == 'referrals' ? 'active bg-primary' : '' ?>" href="?action=referrals">
                        <i class="fas fa-handshake"></i> Giới thiệu
                    </a>
                    <a class="nav-link text-white <?= $action == 'genealogy' ? 'active bg-primary' : '' ?>" href="?action=genealogy">
                        <i class="fas fa-sitemap"></i> Cây Phả Hệ
                    </a>
                    <a class="nav-link text-white <?= $action == 'payments' ? 'active bg-primary' : '' ?>" href="?action=payments">
                        <i class="fas fa-money-bill-wave"></i> Thanh toán
                    </a>
                    <a class="nav-link text-white <?= $action == 'conversions' ? 'active bg-primary' : '' ?>" href="?action=conversions">
                        <i class="fas fa-user-check"></i> Conversion
                    </a>
                    <a class="nav-link text-white <?= $action == 'transactions' ? 'active bg-primary' : '' ?>" href="?action=transactions">
                        <i class="fas fa-money-bill-wave"></i> Giao dịch
                    </a>
                    <a class="nav-link text-white <?= $action == 'settings' ? 'active bg-primary' : '' ?>" href="?action=settings">
                        <i class="fas fa-cog"></i> Cài đặt
                    </a>
                </nav>
                
                <div class="mt-auto p-3">
                    <a href="?page=admin" class="btn btn-outline-light btn-sm">
                        <i class="fas fa-arrow-left"></i> Quay lại Admin
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="col-md-9 col-lg-10">
            <div class="p-4">
                <?php
                switch($action) {
                    case 'overview':
                        include 'admin/affiliate_overview.php';
                        break;
                    case 'members':
                        include 'admin/affiliate_members.php';
                        break;
                    case 'referrals':
                        include 'admin/affiliate_referrals.php';
                        break;
                    case 'genealogy':
                        include 'admin/affiliate_genealogy.php';
                        break;
                    case 'payments':
                        include 'admin/affiliate_payments.php';
                        break;
                    case 'conversions':
                        include 'admin/affiliate_conversions.php';
                        break;
                    case 'transactions':
                        include 'admin/affiliate_transactions.php';
                        break;
                    case 'settings':
                        include 'admin/affiliate_settings.php';
                        break;
                    case 'member_details':
                        include 'admin/affiliate_member_details.php';
                        break;
                    default:
                        include 'admin/affiliate_overview.php';
                }
                ?>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/main.js"></script>

<script>
// Admin affiliate functions
const affiliateAdmin = {
    // Confirm referral
    confirmReferral: function(referralId) {
        if (confirm('Xác nhận giới thiệu này và cộng thưởng?')) {
            fetch('ajax/affiliate_actions.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=confirm_referral&referral_id=${referralId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('success', 'Xác nhận thành công!');
                    location.reload();
                } else {
                    showAlert('danger', data.message);
                }
            });
        }
    },
    
    // Update conversion status
    updateConversion: function(conversionId, status, manualStatus) {
        const formData = new FormData();
        formData.append('action', 'update_conversion_status');
        formData.append('conversion_id', conversionId);
        formData.append('status', status);
        formData.append('manual_status', manualStatus);
        
        fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', 'Cập nhật thành công!');
                location.reload();
            } else {
                showAlert('danger', data.message);
            }
        });
    },
    
    // Export data
    exportData: function(type) {
        window.open(`ajax/export.php?type=${type}`, '_blank');
    }
};

window.affiliateAdmin = affiliateAdmin;
</script>

</body>
</html>