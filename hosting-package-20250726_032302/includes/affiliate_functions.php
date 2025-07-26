<?php
require_once 'database.php';

// Generate unique member ID
function generateMemberId($role) {
    $prefix = ($role === 'teacher') ? 'TCH' : 'PAR';
    $db = getDB();
    
    do {
        $number = str_pad(mt_rand(1, 999), 3, '0', STR_PAD_LEFT);
        $memberId = $prefix . $number;
        $exists = $db->fetch("SELECT id FROM affiliate_members WHERE member_id = ?", [$memberId]);
    } while ($exists);
    
    return $memberId;
}

// Generate unique referral code
function generateReferralCode() {
    $db = getDB();
    
    do {
        $code = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6);
        $exists = $db->fetch("SELECT id FROM affiliate_members WHERE referral_code = ?", [$code]);
    } while ($exists);
    
    return $code;
}

// Register new affiliate member
function registerAffiliateMember($name, $phone, $email, $role) {
    $db = getDB();
    
    // Check if phone already exists
    $existing = $db->fetch("SELECT id FROM affiliate_members WHERE phone = ?", [$phone]);
    if ($existing) {
        return ['success' => false, 'message' => 'Số điện thoại đã được đăng ký'];
    }
    
    $memberId = generateMemberId($role);
    $referralCode = generateReferralCode();
    
    $result = $db->insert(
        "INSERT INTO affiliate_members (member_id, name, phone, email, role, referral_code) VALUES (?, ?, ?, ?, ?, ?)",
        [$memberId, $name, $phone, $email, $role, $referralCode]
    );
    
    if ($result) {
        // Generate QR code
        $qrCodePath = generateQRCode($memberId, $referralCode);
        
        // Update QR code path
        $db->update(
            "UPDATE affiliate_members SET qr_code_path = ? WHERE member_id = ?",
            [$qrCodePath, $memberId]
        );
        
        return [
            'success' => true, 
            'member_id' => $memberId,
            'referral_code' => $referralCode,
            'qr_code' => $qrCodePath
        ];
    }
    
    return ['success' => false, 'message' => 'Có lỗi xảy ra khi đăng ký'];
}

// Generate QR Code for referral link
function generateQRCode($memberId, $referralCode) {
    $referralUrl = "https://mamnonthaonguyenxanh.com/?ref=" . $referralCode;
    $qrText = "Mầm Non Thảo Nguyên Xanh\nGiới thiệu bởi: " . $memberId . "\nLink: " . $referralUrl;
    
    // Create QR code directory
    $qrDir = 'assets/qr_codes/';
    if (!file_exists($qrDir)) {
        mkdir($qrDir, 0755, true);
    }
    
    $qrFile = $qrDir . $memberId . '_qr.png';
    
    // Simple QR code generation (you can use QR code library here)
    // For now, create a placeholder file
    $qrImage = imagecreate(200, 200);
    $bg = imagecolorallocate($qrImage, 255, 255, 255);
    $text = imagecolorallocate($qrImage, 0, 0, 0);
    
    imagefill($qrImage, 0, 0, $bg);
    imagestring($qrImage, 3, 10, 50, 'QR Code', $text);
    imagestring($qrImage, 2, 10, 80, $memberId, $text);
    imagestring($qrImage, 1, 10, 110, $referralCode, $text);
    
    imagepng($qrImage, $qrFile);
    imagedestroy($qrImage);
    
    return $qrFile;
}

// Process referral from admission form
function processReferral($admissionId, $referrerCode) {
    $db = getDB();
    
    // Get referrer info
    $referrer = $db->fetch("SELECT * FROM affiliate_members WHERE referral_code = ? AND status = 'active'", [$referrerCode]);
    if (!$referrer) {
        return false;
    }
    
    // Get admission form info
    $admission = $db->fetch("SELECT * FROM admission_forms WHERE id = ?", [$admissionId]);
    if (!$admission) {
        return false;
    }
    
    // Create referral record with pending status (NO REWARDS YET)
    $rewardAmount = ($referrer['role'] === 'teacher') ? 2000000 : 0;
    $rewardPoints = ($referrer['role'] === 'parent') ? 2000 : 0;
    
    $referralId = $db->insert(
        "INSERT INTO referrals (referrer_id, student_name, parent_name, parent_phone, parent_email, admission_form_id, reward_amount, reward_points, status, reward_paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'no')",
        [$referrer['member_id'], $admission['child_name'], $admission['parent_name'], $admission['phone'], $admission['email'], $admissionId, $rewardAmount, $rewardPoints]
    );
    
    if ($referralId) {
        // Update admission form
        $db->update(
            "UPDATE admission_forms SET referrer_code = ?, referrer_id = ? WHERE id = ?",
            [$referrerCode, $referrer['member_id'], $admissionId]
        );
        
        // DO NOT auto-confirm - wait for manual confirmation
        return $referralId;
    }
    
    return false;
}

// Confirm referral and add rewards (ONLY when customer actually converts)
function confirmReferral($referralId) {
    $db = getDB();
    
    // Get referral info
    $referral = $db->fetch("SELECT * FROM referrals WHERE id = ? AND status = 'pending'", [$referralId]);
    if (!$referral) {
        return false; // Only process pending referrals
    }
    
    // Get referrer info
    $referrer = $db->fetch("SELECT * FROM affiliate_members WHERE member_id = ?", [$referral['referrer_id']]);
    if (!$referrer) {
        return false;
    }
    
    // Add reward to wallet ONLY when confirmed
    if ($referrer['role'] === 'teacher') {
        // Add money for teachers
        $db->update(
            "UPDATE affiliate_members SET wallet_balance = wallet_balance + ?, total_referrals = total_referrals + 1, updated_at = NOW() WHERE member_id = ?",
            [$referral['reward_amount'], $referrer['member_id']]
        );
        
        // Add transaction record
        $db->insert(
            "INSERT INTO wallet_transactions (member_id, transaction_type, amount, points, description, referral_id, status) VALUES (?, 'referral_reward', ?, 0, ?, ?, 'completed')",
            [$referrer['member_id'], $referral['reward_amount'], 'Thưởng giới thiệu học sinh: ' . $referral['student_name'], $referralId]
        );
    } else {
        // Add points for parents
        $db->update(
            "UPDATE affiliate_members SET points_balance = points_balance + ?, total_referrals = total_referrals + 1, updated_at = NOW() WHERE member_id = ?",
            [$referral['reward_points'], $referrer['member_id']]
        );
        
        // Add transaction record
        $db->insert(
            "INSERT INTO wallet_transactions (member_id, transaction_type, amount, points, description, referral_id, status) VALUES (?, 'referral_reward', 0, ?, ?, ?, 'completed')",
            [$referrer['member_id'], $referral['reward_points'], 'Điểm thưởng giới thiệu học sinh: ' . $referral['student_name'], $referralId]
        );
    }
    
    // Update referral status
    $db->update(
        "UPDATE referrals SET status = 'confirmed', reward_paid = 'yes', confirmed_at = NOW() WHERE id = ?",
        [$referralId]
    );
    
    // Check and process milestone bonus
    checkMilestoneBonus($referrer['member_id']);
    
    return true;
}

// Check and process milestone bonus
function checkMilestoneBonus($memberId) {
    $db = getDB();
    
    // Get current member info
    $member = $db->fetch("SELECT * FROM affiliate_members WHERE member_id = ?", [$memberId]);
    if (!$member) {
        return false;
    }
    
    $totalReferrals = $member['total_referrals'];
    $currentMilestone = $member['current_milestone'];
    
    // Check if reached new milestone (every 5 referrals)
    $newMilestone = floor($totalReferrals / 5);
    
    if ($newMilestone > $currentMilestone) {
        // Get milestone rewards
        $milestoneReward = $db->fetch(
            "SELECT * FROM milestone_rewards WHERE milestone_number = ? AND active = 'yes'",
            [$newMilestone]
        );
        
        if ($milestoneReward) {
            if ($member['role'] === 'teacher') {
                // Add milestone bonus for teachers
                $bonusAmount = $milestoneReward['teacher_bonus'];
                
                $db->update(
                    "UPDATE affiliate_members SET wallet_balance = wallet_balance + ?, current_milestone = ?, next_milestone_target = ? WHERE member_id = ?",
                    [$bonusAmount, $newMilestone, ($newMilestone + 1) * 5, $memberId]
                );
                
                // Add transaction record
                $db->insert(
                    "INSERT INTO wallet_transactions (member_id, transaction_type, amount, description) VALUES (?, 'milestone_bonus', ?, ?)",
                    [$memberId, $bonusAmount, 'Thưởng mốc ' . $milestoneReward['required_referrals'] . ' học sinh']
                );
                
                // Update referrals with milestone bonus
                $db->update(
                    "UPDATE referrals SET milestone_bonus = ? WHERE referrer_id = ? AND status = 'confirmed' ORDER BY confirmed_at DESC LIMIT 1",
                    [$bonusAmount, $memberId]
                );
                
            } else {
                // Add milestone bonus points for parents
                $bonusPoints = $milestoneReward['parent_bonus_points'];
                
                $db->update(
                    "UPDATE affiliate_members SET points_balance = points_balance + ?, current_milestone = ?, next_milestone_target = ? WHERE member_id = ?",
                    [$bonusPoints, $newMilestone, ($newMilestone + 1) * 5, $memberId]
                );
                
                // Add transaction record
                $db->insert(
                    "INSERT INTO wallet_transactions (member_id, transaction_type, points, description) VALUES (?, 'milestone_bonus', ?, ?)",
                    [$memberId, $bonusPoints, 'Điểm thưởng mốc ' . $milestoneReward['required_referrals'] . ' học sinh']
                );
                
                // Update referrals with milestone bonus
                $db->update(
                    "UPDATE referrals SET milestone_bonus_points = ? WHERE referrer_id = ? AND status = 'confirmed' ORDER BY confirmed_at DESC LIMIT 1",
                    [$bonusPoints, $memberId]
                );
            }
            
            return true;
        }
    }
    
    return false;
}

// Get member dashboard data
function getMemberDashboard($memberId) {
    $db = getDB();
    
    // Get member info
    $member = $db->fetch("SELECT * FROM affiliate_members WHERE member_id = ?", [$memberId]);
    if (!$member) {
        return null;
    }
    
    // Get referrals
    $referrals = $db->fetchAll(
        "SELECT * FROM referrals WHERE referrer_id = ? ORDER BY created_at DESC",
        [$memberId]
    );
    
    // Get transactions
    $transactions = $db->fetchAll(
        "SELECT * FROM wallet_transactions WHERE member_id = ? ORDER BY created_at DESC LIMIT 20",
        [$memberId]
    );
    
    // Calculate progress to next milestone
    $nextMilestone = ($member['current_milestone'] + 1) * 5;
    $progressPercent = ($member['total_referrals'] % 5) / 5 * 100;
    
    return [
        'member' => $member,
        'referrals' => $referrals,
        'transactions' => $transactions,
        'next_milestone' => $nextMilestone,
        'progress_percent' => $progressPercent,
        'referrals_to_next' => $nextMilestone - $member['total_referrals']
    ];
}

// Get top performers
function getTopPerformers($limit = 10) {
    $db = getDB();
    
    return $db->fetchAll(
        "SELECT member_id, name, role, total_referrals, wallet_balance, points_balance FROM affiliate_members WHERE status = 'active' ORDER BY total_referrals DESC, wallet_balance DESC LIMIT ?",
        [$limit]
    );
}

// Process customer conversion tracking
function addCustomerConversion($referrerId, $customerName, $customerPhone, $customerEmail, $source = 'website') {
    $db = getDB();
    
    // Check if customer already exists
    $existing = $db->fetch(
        "SELECT id FROM customer_conversions WHERE customer_phone = ? AND referrer_id = ?",
        [$customerPhone, $referrerId]
    );
    
    if ($existing) {
        return false;
    }
    
    return $db->insert(
        "INSERT INTO customer_conversions (referrer_id, customer_name, customer_phone, customer_email, conversion_source) VALUES (?, ?, ?, ?, ?)",
        [$referrerId, $customerName, $customerPhone, $customerEmail, $source]
    );
}

// Update customer conversion status
function updateCustomerStatus($conversionId, $status, $manualStatus = null, $notes = '', $assignedStaff = '') {
    $db = getDB();
    
    $updateFields = ["status = ?"];
    $params = [$status];
    
    if ($manualStatus) {
        $updateFields[] = "manual_status = ?";
        $params[] = $manualStatus;
    }
    
    if ($notes) {
        $updateFields[] = "notes = ?";
        $params[] = $notes;
    }
    
    if ($assignedStaff) {
        $updateFields[] = "assigned_staff = ?";
        $params[] = $assignedStaff;
    }
    
    $params[] = $conversionId;
    
    return $db->update(
        "UPDATE customer_conversions SET " . implode(", ", $updateFields) . " WHERE id = ?",
        $params
    );
}

// Get conversion statistics
function getConversionStats($referrerId = null) {
    $db = getDB();
    
    $whereClause = $referrerId ? "WHERE referrer_id = ?" : "";
    $params = $referrerId ? [$referrerId] : [];
    
    $stats = $db->fetch(
        "SELECT 
            COUNT(*) as total_leads,
            SUM(CASE WHEN status = 'consultation' THEN 1 ELSE 0 END) as consultations,
            SUM(CASE WHEN status = 'enrolled' THEN 1 ELSE 0 END) as enrollments,
            SUM(CASE WHEN manual_status = 'white' THEN 1 ELSE 0 END) as white_status,
            SUM(CASE WHEN manual_status = 'yellow' THEN 1 ELSE 0 END) as yellow_status,
            SUM(CASE WHEN manual_status = 'green' THEN 1 ELSE 0 END) as green_status
        FROM customer_conversions {$whereClause}",
        $params
    );
    
    // Calculate conversion rates
    $stats['consultation_rate'] = $stats['total_leads'] > 0 ? ($stats['consultations'] / $stats['total_leads']) * 100 : 0;
    $stats['enrollment_rate'] = $stats['total_leads'] > 0 ? ($stats['enrollments'] / $stats['total_leads']) * 100 : 0;
    
    return $stats;
}

// Validate referral code
function isValidReferralCode($code) {
    $db = getDB();
    
    $referrer = $db->fetch(
        "SELECT member_id FROM affiliate_members WHERE referral_code = ? AND status = 'active'",
        [$code]
    );
    
    return $referrer ? $referrer['member_id'] : false;
}
?>