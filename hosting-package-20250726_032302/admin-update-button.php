<!-- Add this to admin panel for manual sync -->
<div class="card mt-3">
    <div class="card-header">
        <h5>🔄 Đồng bộ từ Replit</h5>
    </div>
    <div class="card-body">
        <p>Cập nhật website từ phiên bản mới nhất trên Replit.com</p>
        <button class="btn btn-primary" onclick="syncFromReplit()">
            <i class="fas fa-sync"></i> Đồng bộ ngay
        </button>
        <div id="sync-status" class="mt-2"></div>
    </div>
</div>

<script>
function syncFromReplit() {
    const button = event.target;
    const status = document.getElementById('sync-status');
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đồng bộ...';
    
    fetch('webhook-update.php?secret=mamnon2025update')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                status.innerHTML = '<div class="alert alert-success">✅ Đồng bộ thành công!</div>';
                setTimeout(() => location.reload(), 2000);
            } else {
                status.innerHTML = '<div class="alert alert-danger">❌ Lỗi: ' + data.message + '</div>';
            }
        })
        .catch(error => {
            status.innerHTML = '<div class="alert alert-danger">❌ Lỗi kết nối: ' + error + '</div>';
        })
        .finally(() => {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-sync"></i> Đồng bộ ngay';
        });
}
</script>
