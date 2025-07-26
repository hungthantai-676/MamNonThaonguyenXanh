/**
 * Affiliate Guide Tooltip System
 * Hệ thống hướng dẫn tooltip cho trang affiliate
 */

class AffiliateGuide {
    constructor() {
        this.tooltips = new Map();
        this.currentTooltip = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        this.createTooltipContainer();
        this.bindEvents();
        this.setupGuideData();
    }

    createTooltipContainer() {
        this.tooltipEl = document.createElement('div');
        this.tooltipEl.className = 'guide-tooltip';
        this.tooltipEl.style.display = 'none';
        document.body.appendChild(this.tooltipEl);
    }

    setupGuideData() {
        // Dữ liệu hướng dẫn cho các phần tử khác nhau
        this.guides = {
            // Dashboard Overview
            'dashboard-header': {
                title: '🎯 Dashboard Tổng Quan',
                content: 'Đây là trang chính để theo dõi hoạt động affiliate của bạn',
                step: 'Bước 1: Kiểm tra thông tin cá nhân và vai trò',
                next: 'Tiếp theo: Xem thống kê tổng quan bên dưới',
                type: 'info'
            },

            // Stats Cards
            'total-referrals': {
                title: '👥 Số Học Sinh Đã Giới Thiệu',
                content: 'Hiển thị tổng số học sinh bạn đã giới thiệu thành công',
                step: 'Số này tăng khi học sinh được xác nhận đăng ký',
                next: 'Xem ví tiền/điểm bên cạnh',
                type: 'info'
            },

            'wallet-balance': {
                title: '💰 Ví Tiền / Điểm Thưởng',
                content: 'Số dư hiện tại trong ví của bạn',
                step: 'Giáo viên: VNĐ | Phụ huynh: Điểm thưởng',
                next: 'Kiểm tra thu nhập tháng này',
                type: 'success'
            },

            'monthly-earnings': {
                title: '📈 Thu Nhập Tháng Này',
                content: 'Tổng thu nhập từ affiliate trong tháng hiện tại',
                step: 'Cập nhật theo thời gian thực',
                next: 'Xem hoa hồng chờ xử lý',
                type: 'success'
            },

            'pending-commission': {
                title: '⏳ Hoa Hồng Chờ Xử Lý',
                content: 'Số tiền đang chờ admin xác nhận và thanh toán',
                step: 'Sẽ được chuyển vào ví sau khi admin xác nhận',
                next: 'Cuộn xuống xem danh sách giới thiệu',
                type: 'warning'
            },

            // Referral Form
            'referral-form': {
                title: '📝 Form Giới Thiệu Học Sinh',
                content: 'Điền thông tin học sinh mới để nhận hoa hồng',
                step: 'Bước 1: Điền đầy đủ thông tin chính xác',
                next: 'Bước 2: Nhấn "Gửi giới thiệu" khi hoàn tất',
                type: 'step'
            },

            'student-name': {
                title: '👶 Tên Học Sinh',
                content: 'Nhập họ tên đầy đủ của em bé',
                step: 'Ví dụ: Nguyễn Văn An',
                next: 'Điền tuổi của em bé',
                type: 'step'
            },

            'student-age': {
                title: '🎂 Tuổi Học Sinh',
                content: 'Chọn độ tuổi phù hợp với chương trình',
                step: 'Mầm non nhận trẻ từ 2-6 tuổi',
                next: 'Điền thông tin phụ huynh',
                type: 'step'
            },

            'parent-info': {
                title: '👨‍👩‍👧‍👦 Thông Tin Phụ Huynh',
                content: 'Thông tin liên hệ để nhà trường gọi tư vấn',
                step: 'Số điện thoại phải chính xác để được liên hệ',
                next: 'Thêm ghi chú nếu cần',
                type: 'step'
            },

            // QR Code Section
            'qr-code': {
                title: '📱 Mã QR Giới Thiệu',
                content: 'Chia sẻ mã này để khách hàng đăng ký nhanh',
                step: 'Khách quét mã → tự động có thông tin giới thiệu của bạn',
                next: 'Sao chép link hoặc tải QR về điện thoại',
                type: 'info'
            },

            'share-link': {
                title: '🔗 Link Chia Sẻ',
                content: 'Gửi link này qua Zalo, Facebook, SMS',
                step: 'Click "Sao chép" rồi gửi cho khách hàng',
                next: 'Hoặc tải QR code xuống',
                type: 'info'
            },

            // Referral History
            'referral-history': {
                title: '📋 Lịch Sử Giới Thiệu',
                content: 'Danh sách tất cả học sinh bạn đã giới thiệu',
                step: 'Theo dõi trạng thái: Chờ xử lý → Đã xác nhận → Đã nhập học',
                next: 'Click vào từng dòng để xem chi tiết',
                type: 'info'
            },

            'status-badges': {
                title: '🏷️ Trạng Thái Xử Lý',
                content: 'Màu sắc hiển thị tiến độ xử lý',
                step: 'Vàng: Chờ xử lý | Xanh: Đã xác nhận | Xanh đậm: Đã nhập học',
                next: 'Hoa hồng được trả khi chuyển sang "Đã xác nhận"',
                type: 'warning'
            },

            // Genealogy Tree
            'genealogy-tree': {
                title: '🌳 Cây Phả Hệ Affiliate',
                content: 'Xem cơ cấu tổ chức và đội nhóm của bạn',
                step: 'Bạn ở trung tâm, các thành viên do bạn mời xung quanh',
                next: 'Click vào thành viên để xem chi tiết',
                type: 'info'
            },

            // Commission Info
            'commission-rates': {
                title: '💎 Mức Hoa Hồng',
                content: 'Bảng tính hoa hồng chi tiết theo vai trò',
                step: 'Giáo viên: 2M VNĐ/học sinh | Phụ huynh: 2000 điểm/học sinh',
                next: 'Bonus thêm mỗi 5 học sinh thành công',
                type: 'success'
            },

            // Action Buttons
            'download-qr': {
                title: '⬇️ Tải QR Code',
                content: 'Tải file ảnh QR về máy để in hoặc chia sẻ',
                step: 'Click để tải xuống file PNG chất lượng cao',
                next: 'In ra giấy hoặc lưu vào điện thoại',
                type: 'step'
            },

            'copy-link': {
                title: '📋 Sao Chép Link',
                content: 'Copy link giới thiệu vào clipboard',
                step: 'Click để sao chép tự động',
                next: 'Dán vào tin nhắn, email hoặc mạng xã hội',
                type: 'step'
            },

            'submit-referral': {
                title: '✅ Gửi Giới Thiệu',
                content: 'Hoàn tất việc đăng ký thông tin học sinh mới',
                step: 'Kiểm tra lại thông tin trước khi gửi',
                next: 'Chờ admin xử lý và liên hệ phụ huynh',
                type: 'step'
            }
        };
    }

    bindEvents() {
        // Bind hover events cho các element có class guide-element
        document.addEventListener('mouseover', (e) => {
            const element = e.target.closest('.guide-element');
            if (element && element.dataset.guide) {
                this.showTooltip(element, element.dataset.guide);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const element = e.target.closest('.guide-element');
            if (element && element.dataset.guide) {
                this.hideTooltip();
            }
        });

        // Click để ẩn tooltip
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.tooltipEl.contains(e.target)) {
                this.hideTooltip();
            }
        });

        // Ẩn tooltip khi scroll
        document.addEventListener('scroll', () => {
            if (this.isVisible) {
                this.hideTooltip();
            }
        });
    }

    showTooltip(element, guideKey) {
        const guide = this.guides[guideKey];
        if (!guide) return;

        // Tạo nội dung tooltip
        const content = this.createTooltipContent(guide);
        this.tooltipEl.innerHTML = content;
        
        // Hiển thị tooltip
        this.tooltipEl.style.display = 'block';
        this.tooltipEl.className = `guide-tooltip ${guide.type || 'info'}`;
        
        // Tính toán vị trí
        this.positionTooltip(element);
        
        // Animation hiển thị
        setTimeout(() => {
            this.tooltipEl.classList.add('show', 'animate-in');
            this.isVisible = true;
        }, 10);

        // Highlight element
        element.classList.add('guide-highlight');
    }

    hideTooltip() {
        if (!this.isVisible) return;

        this.tooltipEl.classList.remove('show', 'animate-in');
        this.isVisible = false;
        
        setTimeout(() => {
            this.tooltipEl.style.display = 'none';
        }, 300);

        // Remove highlight từ tất cả elements
        document.querySelectorAll('.guide-highlight').forEach(el => {
            el.classList.remove('guide-highlight');
        });
    }

    createTooltipContent(guide) {
        return `
            <div class="guide-tooltip-title">
                ${guide.title}
            </div>
            <div class="guide-tooltip-content">
                ${guide.content}
            </div>
            <div class="guide-tooltip-step">
                💡 ${guide.step}
            </div>
            <div class="guide-tooltip-next">
                ➡️ ${guide.next}
            </div>
        `;
    }

    positionTooltip(element) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltipEl.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 15;

        // Điều chỉnh nếu tooltip bị tràn màn hình
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > viewport.width - 10) {
            left = viewport.width - tooltipRect.width - 10;
        }

        // Nếu không đủ chỗ ở trên, hiển thị dưới
        if (top < 10) {
            top = rect.bottom + 15;
            this.tooltipEl.classList.add('bottom');
        } else {
            this.tooltipEl.classList.remove('bottom');
        }

        // Điều chỉnh cho mobile
        if (viewport.width < 768) {
            left = 10;
            this.tooltipEl.style.maxWidth = (viewport.width - 40) + 'px';
        }

        this.tooltipEl.style.left = left + 'px';
        this.tooltipEl.style.top = top + 'px';
    }

    // Thêm guide element programmatically
    addGuideElement(selector, guideKey) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('guide-element');
            element.dataset.guide = guideKey;
        });
    }

    // Khởi tạo auto guide cho các element chuẩn
    initAutoGuides() {
        // Auto add guide cho các element phổ biến
        this.addGuideElement('.referral-stats .card:nth-child(1)', 'total-referrals');
        this.addGuideElement('.referral-stats .card:nth-child(2)', 'wallet-balance');
        this.addGuideElement('.referral-stats .card:nth-child(3)', 'monthly-earnings');
        this.addGuideElement('.referral-stats .card:nth-child(4)', 'pending-commission');
        this.addGuideElement('#referralForm', 'referral-form');
        this.addGuideElement('#qrCodeSection', 'qr-code');
        this.addGuideElement('.referral-history', 'referral-history');
    }
}

// Khởi tạo khi DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    window.affiliateGuide = new AffiliateGuide();
    
    // Delay một chút để đảm bảo các element đã render
    setTimeout(() => {
        window.affiliateGuide.initAutoGuides();
    }, 500);
});

// Export cho sử dụng global
window.AffiliateGuide = AffiliateGuide;