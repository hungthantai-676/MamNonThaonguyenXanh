<?php
header('Content-Type: application/json');
require_once '../includes/affiliate_functions.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$response = ['success' => false, 'message' => 'Invalid action'];

switch ($action) {
    case 'register':
        $name = sanitize($_POST['name'] ?? '');
        $phone = sanitize($_POST['phone'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $role = sanitize($_POST['role'] ?? '');
        
        if (empty($name) || empty($phone) || empty($role)) {
            $response['message'] = 'Vui lòng điền đầy đủ thông tin bắt buộc';
        } elseif (!in_array($role, ['teacher', 'parent'])) {
            $response['message'] = 'Vai trò không hợp lệ';
        } else {
            $result = registerAffiliateMember($name, $phone, $email, $role);
            $response = $result;
        }
        break;
        
    case 'get_dashboard':
        $memberId = sanitize($_GET['member_id'] ?? '');
        
        if (empty($memberId)) {
            $response['message'] = 'Thiếu mã thành viên';
        } else {
            $dashboard = getMemberDashboard($memberId);
            if ($dashboard) {
                $response = ['success' => true, 'data' => $dashboard];
            } else {
                $response['message'] = 'Không tìm thấy thông tin thành viên';
            }
        }
        break;
        
    case 'validate_referral':
        $code = sanitize($_GET['code'] ?? '');
        
        if (empty($code)) {
            $response['message'] = 'Thiếu mã giới thiệu';
        } else {
            $memberId = isValidReferralCode($code);
            if ($memberId) {
                $db = getDB();
                $member = $db->fetch("SELECT name, role FROM affiliate_members WHERE member_id = ?", [$memberId]);
                $response = [
                    'success' => true, 
                    'valid' => true,
                    'referrer' => $member
                ];
            } else {
                $response = [
                    'success' => true, 
                    'valid' => false,
                    'message' => 'Mã giới thiệu không hợp lệ'
                ];
            }
        }
        break;
        
    case 'confirm_referral':
        $referralId = (int)($_POST['referral_id'] ?? 0);
        
        if ($referralId <= 0) {
            $response['message'] = 'ID giới thiệu không hợp lệ';
        } else {
            $result = confirmReferral($referralId);
            if ($result) {
                $response = ['success' => true, 'message' => 'Xác nhận thành công'];
            } else {
                $response['message'] = 'Có lỗi xảy ra khi xác nhận';
            }
        }
        break;
        
    case 'add_conversion':
        $referrerId = sanitize($_POST['referrer_id'] ?? '');
        $customerName = sanitize($_POST['customer_name'] ?? '');
        $customerPhone = sanitize($_POST['customer_phone'] ?? '');
        $customerEmail = sanitize($_POST['customer_email'] ?? '');
        $source = sanitize($_POST['source'] ?? 'website');
        
        if (empty($referrerId) || empty($customerName) || empty($customerPhone)) {
            $response['message'] = 'Thiếu thông tin bắt buộc';
        } else {
            $result = addCustomerConversion($referrerId, $customerName, $customerPhone, $customerEmail, $source);
            if ($result) {
                $response = ['success' => true, 'message' => 'Thêm conversion thành công'];
            } else {
                $response['message'] = 'Khách hàng đã tồn tại hoặc có lỗi xảy ra';
            }
        }
        break;
        
    case 'update_conversion_status':
        $conversionId = (int)($_POST['conversion_id'] ?? 0);
        $status = sanitize($_POST['status'] ?? '');
        $manualStatus = sanitize($_POST['manual_status'] ?? '');
        $notes = sanitize($_POST['notes'] ?? '');
        $assignedStaff = sanitize($_POST['assigned_staff'] ?? '');
        
        if ($conversionId <= 0 || empty($status)) {
            $response['message'] = 'Thiếu thông tin bắt buộc';
        } else {
            $result = updateCustomerStatus($conversionId, $status, $manualStatus, $notes, $assignedStaff);
            if ($result) {
                $response = ['success' => true, 'message' => 'Cập nhật thành công'];
            } else {
                $response['message'] = 'Có lỗi xảy ra khi cập nhật';
            }
        }
        break;
        
    case 'get_top_performers':
        $limit = (int)($_GET['limit'] ?? 10);
        $performers = getTopPerformers($limit);
        $response = ['success' => true, 'data' => $performers];
        break;
        
    case 'get_conversion_stats':
        $referrerId = sanitize($_GET['referrer_id'] ?? '');
        $stats = getConversionStats($referrerId ?: null);
        $response = ['success' => true, 'data' => $stats];
        break;
        
    case 'search_members':
        $query = sanitize($_GET['q'] ?? '');
        $role = sanitize($_GET['role'] ?? '');
        
        if (strlen($query) < 2) {
            $response['message'] = 'Từ khóa quá ngắn';
        } else {
            $db = getDB();
            $whereClause = "WHERE (name LIKE ? OR member_id LIKE ? OR phone LIKE ?)";
            $params = ["%{$query}%", "%{$query}%", "%{$query}%"];
            
            if ($role) {
                $whereClause .= " AND role = ?";
                $params[] = $role;
            }
            
            $members = $db->fetchAll(
                "SELECT member_id, name, phone, role, total_referrals, wallet_balance, points_balance, status FROM affiliate_members {$whereClause} ORDER BY total_referrals DESC LIMIT 20",
                $params
            );
            
            $response = ['success' => true, 'data' => $members];
        }
        break;
        
    case 'get_referral_details':
        $referralId = (int)($_GET['referral_id'] ?? 0);
        
        if ($referralId <= 0) {
            $response['message'] = 'ID không hợp lệ';
        } else {
            $db = getDB();
            $referral = $db->fetch(
                "SELECT r.*, am.name as referrer_name, am.role as referrer_role 
                FROM referrals r 
                JOIN affiliate_members am ON r.referrer_id = am.member_id 
                WHERE r.id = ?",
                [$referralId]
            );
            
            if ($referral) {
                $response = ['success' => true, 'data' => $referral];
            } else {
                $response['message'] = 'Không tìm thấy thông tin';
            }
        }
        break;
        
    case 'get_member_transactions':
        $memberId = sanitize($_GET['member_id'] ?? '');
        $limit = (int)($_GET['limit'] ?? 50);
        
        if (empty($memberId)) {
            $response['message'] = 'Thiếu mã thành viên';
        } else {
            $db = getDB();
            $transactions = $db->fetchAll(
                "SELECT * FROM wallet_transactions WHERE member_id = ? ORDER BY created_at DESC LIMIT ?",
                [$memberId, $limit]
            );
            
            $response = ['success' => true, 'data' => $transactions];
        }
        break;
        
    case 'generate_qr_code':
        $memberId = sanitize($_POST['member_id'] ?? '');
        
        if (empty($memberId)) {
            $response['message'] = 'Thiếu mã thành viên';
        } else {
            $db = getDB();
            $member = $db->fetch("SELECT referral_code FROM affiliate_members WHERE member_id = ?", [$memberId]);
            
            if ($member) {
                $qrCodePath = generateQRCode($memberId, $member['referral_code']);
                
                if ($qrCodePath) {
                    $db->update(
                        "UPDATE affiliate_members SET qr_code_path = ? WHERE member_id = ?",
                        [$qrCodePath, $memberId]
                    );
                    
                    $response = ['success' => true, 'qr_code' => $qrCodePath];
                } else {
                    $response['message'] = 'Có lỗi tạo QR code';
                }
            } else {
                $response['message'] = 'Không tìm thấy thành viên';
            }
        }
        break;
        
    default:
        $response['message'] = 'Hành động không được hỗ trợ';
}

echo json_encode($response);
?>