<?php
require_once '../includes/affiliate_functions.php';

$db = getDB();

// Get all members with their referral relationships
function buildFamilyTree($db) {
    $members = $db->fetchAll("
        SELECT am.*, 
               COUNT(r.id) as direct_referrals,
               SUM(CASE WHEN r.status IN ('confirmed', 'enrolled') THEN 1 ELSE 0 END) as confirmed_referrals
        FROM affiliate_members am 
        LEFT JOIN referrals r ON am.member_id = r.referrer_id 
        WHERE am.status = 'active'
        GROUP BY am.member_id
        ORDER BY am.registered_at ASC
    ");
    
    // Build tree structure
    $tree = [];
    $memberMap = [];
    
    foreach ($members as $member) {
        $memberMap[$member['member_id']] = $member;
        $memberMap[$member['member_id']]['children'] = [];
    }
    
    // Get referral relationships
    $referrals = $db->fetchAll("
        SELECT DISTINCT referrer_id, 
               GROUP_CONCAT(DISTINCT student_name) as referred_students
        FROM referrals 
        WHERE status IN ('confirmed', 'enrolled')
        GROUP BY referrer_id
    ");
    
    $referralMap = [];
    foreach ($referrals as $ref) {
        $referralMap[$ref['referrer_id']] = explode(',', $ref['referred_students']);
    }
    
    // Add children to tree
    foreach ($referrals as $ref) {
        if (isset($memberMap[$ref['referrer_id']])) {
            $memberMap[$ref['referrer_id']]['referred_students'] = $referralMap[$ref['referrer_id']];
        }
    }
    
    return array_values($memberMap);
}

$familyTree = buildFamilyTree($db);

// Get statistics
$totalNodes = count($familyTree);
$totalTeachers = count(array_filter($familyTree, fn($m) => $m['role'] === 'teacher'));
$totalParents = count(array_filter($familyTree, fn($m) => $m['role'] === 'parent'));
$totalReferrals = array_sum(array_column($familyTree, 'confirmed_referrals'));
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3">🌳 Cây Phả Hệ Affiliate</h1>
    <div>
        <button class="btn btn-primary btn-sm" onclick="expandAllNodes()">
            <i class="fas fa-expand-arrows-alt"></i> Mở rộng tất cả
        </button>
        <button class="btn btn-secondary btn-sm" onclick="collapseAllNodes()">
            <i class="fas fa-compress-arrows-alt"></i> Thu gọn tất cả
        </button>
        <button class="btn btn-success btn-sm" onclick="exportTreeData()">
            <i class="fas fa-download"></i> Xuất Excel
        </button>
    </div>
</div>

<!-- Statistics Overview -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body text-center">
                <h4><?= $totalNodes ?></h4>
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
                <h4><?= $totalReferrals ?></h4>
                <p class="mb-0">Tổng giới thiệu</p>
            </div>
        </div>
    </div>
</div>

<!-- Search and Filter -->
<div class="card mb-4">
    <div class="card-body">
        <div class="row g-3">
            <div class="col-md-4">
                <input type="text" id="searchTree" class="form-control" placeholder="Tìm kiếm thành viên...">
            </div>
            <div class="col-md-3">
                <select id="filterRole" class="form-select">
                    <option value="">Tất cả vai trò</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="parent">Phụ huynh</option>
                </select>
            </div>
            <div class="col-md-3">
                <select id="filterStatus" class="form-select">
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm khóa</option>
                </select>
            </div>
            <div class="col-md-2">
                <button class="btn btn-primary w-100" onclick="filterTree()">
                    <i class="fas fa-filter"></i> Lọc
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Family Tree Visualization -->
<div class="card">
    <div class="card-header">
        <h5 class="mb-0"><i class="fas fa-sitemap"></i> Sơ đồ Phả Hệ</h5>
    </div>
    <div class="card-body">
        <div id="family-tree-container" class="tree-container">
            <?php if (empty($familyTree)): ?>
                <div class="text-center py-5">
                    <i class="fas fa-tree fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">Chưa có thành viên nào</h5>
                    <p class="text-muted">Thêm thành viên để xem cây phả hệ</p>
                </div>
            <?php else: ?>
                <div class="tree-view">
                    <?php foreach ($familyTree as $member): ?>
                        <div class="member-node" 
                             data-member-id="<?= $member['member_id'] ?>"
                             data-role="<?= $member['role'] ?>"
                             data-status="<?= $member['status'] ?>"
                             onclick="showMemberDetails('<?= $member['member_id'] ?>')">
                            
                            <div class="node-card <?= $member['role'] === 'teacher' ? 'teacher-node' : 'parent-node' ?>">
                                <div class="node-header">
                                    <div class="node-avatar">
                                        <i class="fas fa-<?= $member['role'] === 'teacher' ? 'chalkboard-teacher' : 'users' ?>"></i>
                                    </div>
                                    <div class="node-info">
                                        <strong><?= htmlspecialchars($member['name']) ?></strong>
                                        <small class="d-block text-muted"><?= $member['member_id'] ?></small>
                                    </div>
                                    <div class="node-status">
                                        <span class="badge bg-<?= $member['status'] === 'active' ? 'success' : 'secondary' ?>">
                                            <?= $member['status'] === 'active' ? 'Hoạt động' : 'Tạm khóa' ?>
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="node-stats">
                                    <div class="stat-item">
                                        <span class="stat-label">Giới thiệu:</span>
                                        <span class="stat-value"><?= $member['confirmed_referrals'] ?></span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Số dư:</span>
                                        <span class="stat-value">
                                            <?php if ($member['role'] === 'teacher'): ?>
                                                <?= formatCurrency($member['wallet_balance']) ?>
                                            <?php else: ?>
                                                <?= formatPoints($member['points_balance']) ?> điểm
                                            <?php endif; ?>
                                        </span>
                                    </div>
                                </div>
                                
                                <?php if (!empty($member['referred_students'])): ?>
                                    <div class="node-children">
                                        <small class="text-muted">Học sinh giới thiệu:</small>
                                        <div class="children-list">
                                            <?php foreach ($member['referred_students'] as $student): ?>
                                                <span class="badge bg-light text-dark me-1"><?= htmlspecialchars(trim($student)) ?></span>
                                            <?php endforeach; ?>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                
                                <div class="node-actions">
                                    <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); viewMemberDetails('<?= $member['member_id'] ?>')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-info" onclick="event.stopPropagation(); showQRCode('<?= $member['member_id'] ?>')">
                                        <i class="fas fa-qrcode"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
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
                <!-- Content loaded via AJAX -->
            </div>
        </div>
    </div>
</div>

<style>
.tree-container {
    max-height: 80vh;
    overflow-y: auto;
    padding: 20px;
}

.tree-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px 0;
}

.member-node {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.member-node:hover {
    transform: translateY(-2px);
}

.node-card {
    border: 2px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.teacher-node {
    border-color: #28a745;
    background: linear-gradient(135deg, #ffffff 0%, #f8fff9 100%);
}

.parent-node {
    border-color: #ffc107;
    background: linear-gradient(135deg, #ffffff 0%, #fffdf5 100%);
}

.node-card:hover {
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    border-color: #007bff;
}

.node-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.node-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
}

.teacher-node .node-avatar {
    background: #28a745;
}

.parent-node .node-avatar {
    background: #ffc107;
    color: #333;
}

.node-info {
    flex: 1;
}

.node-stats {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    padding: 8px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}

.stat-item {
    text-align: center;
}

.stat-label {
    font-size: 0.8em;
    color: #666;
    display: block;
}

.stat-value {
    font-weight: bold;
    color: #333;
    font-size: 0.9em;
}

.node-children {
    margin: 10px 0;
}

.children-list {
    margin-top: 5px;
    max-height: 60px;
    overflow-y: auto;
}

.node-actions {
    display: flex;
    gap: 5px;
    justify-content: center;
    margin-top: 10px;
}

.filtered-out {
    display: none !important;
}

.highlight-search {
    background-color: yellow;
    padding: 2px 4px;
    border-radius: 3px;
}
</style>

<script>
let allMembers = <?= json_encode($familyTree) ?>;

function showMemberDetails(memberId) {
    // Find member data
    const member = allMembers.find(m => m.member_id === memberId);
    if (!member) return;
    
    // Show basic info
    alert(`Thành viên: ${member.name}\nID: ${member.member_id}\nVai trò: ${member.role === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}\nGiới thiệu: ${member.confirmed_referrals}\nTrạng thái: ${member.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}`);
}

function viewMemberDetails(memberId) {
    // Load detailed member info via AJAX
    fetch(`ajax/affiliate_actions.php?action=get_member_details&member_id=${memberId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('memberDetailsContent').innerHTML = data.html;
                new bootstrap.Modal(document.getElementById('memberDetailsModal')).show();
            } else {
                showAlert('danger', data.message);
            }
        });
}

function showQRCode(memberId) {
    const member = allMembers.find(m => m.member_id === memberId);
    if (!member) return;
    
    const qrUrl = `https://mamnonthaonguyenxanh.com/?ref=${member.referral_code}`;
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}`, '_blank');
}

function filterTree() {
    const searchTerm = document.getElementById('searchTree').value.toLowerCase();
    const roleFilter = document.getElementById('filterRole').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    const nodes = document.querySelectorAll('.member-node');
    
    nodes.forEach(node => {
        const memberId = node.getAttribute('data-member-id');
        const member = allMembers.find(m => m.member_id === memberId);
        
        let shouldShow = true;
        
        // Search filter
        if (searchTerm && !member.name.toLowerCase().includes(searchTerm) && !member.member_id.toLowerCase().includes(searchTerm)) {
            shouldShow = false;
        }
        
        // Role filter
        if (roleFilter && member.role !== roleFilter) {
            shouldShow = false;
        }
        
        // Status filter
        if (statusFilter && member.status !== statusFilter) {
            shouldShow = false;
        }
        
        node.classList.toggle('filtered-out', !shouldShow);
    });
}

function expandAllNodes() {
    // Implementation for expanding tree nodes
    showAlert('info', 'Tính năng mở rộng cây sẽ được thêm trong phiên bản tiếp theo');
}

function collapseAllNodes() {
    // Implementation for collapsing tree nodes
    showAlert('info', 'Tính năng thu gọn cây sẽ được thêm trong phiên bản tiếp theo');
}

function exportTreeData() {
    const csvData = [
        ['ID', 'Tên', 'Vai trò', 'SĐT', 'Email', 'Giới thiệu', 'Số dư', 'Trạng thái', 'Ngày đăng ký']
    ];
    
    allMembers.forEach(member => {
        csvData.push([
            member.member_id,
            member.name,
            member.role === 'teacher' ? 'Giáo viên' : 'Phụ huynh',
            member.phone,
            member.email || '',
            member.confirmed_referrals,
            member.role === 'teacher' ? member.wallet_balance + ' VNĐ' : member.points_balance + ' điểm',
            member.status === 'active' ? 'Hoạt động' : 'Tạm khóa',
            member.registered_at
        ]);
    });
    
    const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cay_pha_he_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Real-time search
document.getElementById('searchTree').addEventListener('input', filterTree);
document.getElementById('filterRole').addEventListener('change', filterTree);
document.getElementById('filterStatus').addEventListener('change', filterTree);
</script>