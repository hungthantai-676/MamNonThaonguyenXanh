// Main JavaScript for Mầm Non Thảo Nguyên Xanh

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSmoothScrolling();
    initFormValidation();
    initImageLazyLoading();
    initAnimations();
    initTooltips();
    initModals();
});

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form validation and submission
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// Lazy loading for images
function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Scroll animations
function initAnimations() {
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animateOnScroll.observe(el);
    });
}

// Initialize Bootstrap tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize Bootstrap modals
function initModals() {
    // Auto-show modals with data-auto-show attribute
    document.querySelectorAll('[data-auto-show]').forEach(modal => {
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    });
}

// Contact form submission
function submitContactForm(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Đang gửi...';
    submitBtn.disabled = true;
    
    fetch('ajax/contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
            form.reset();
        } else {
            showAlert('danger', data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    })
    .catch(error => {
        showAlert('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Admission form submission
function submitAdmissionForm(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Đang gửi đơn...';
    submitBtn.disabled = true;
    
    fetch('ajax/admission.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', 'Đơn đăng ký đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
            form.reset();
        } else {
            showAlert('danger', data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    })
    .catch(error => {
        showAlert('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Show alert messages
function showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Create alert container if not exists
function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.maxWidth = '400px';
    
    document.body.appendChild(container);
    return container;
}

// Image upload preview
function previewImage(input, previewId) {
    const file = input.files[0];
    const preview = document.getElementById(previewId);
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
}

// Format phone number input
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 10) {
        value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    input.value = value;
}

// Search functionality
function searchContent(query) {
    const searchResults = document.getElementById('search-results');
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    fetch(`ajax/search.php?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            let html = '';
            
            if (data.length === 0) {
                html = '<div class="p-3 text-muted">Không tìm thấy kết quả</div>';
            } else {
                data.forEach(item => {
                    html += `
                        <div class="search-result-item p-3 border-bottom">
                            <h6 class="mb-1">
                                <a href="${item.url}" class="text-decoration-none">${item.title}</a>
                            </h6>
                            <p class="mb-1 text-muted small">${item.summary}</p>
                            <small class="text-primary">${item.type}</small>
                        </div>
                    `;
                });
            }
            
            searchResults.innerHTML = html;
        })
        .catch(error => {
            searchResults.innerHTML = '<div class="p-3 text-danger">Lỗi tìm kiếm</div>';
        });
}

// Newsletter subscription
function subscribeNewsletter(email) {
    fetch('ajax/newsletter.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', 'Đăng ký nhận tin thành công!');
        } else {
            showAlert('danger', data.message || 'Có lỗi xảy ra.');
        }
    })
    .catch(error => {
        showAlert('danger', 'Có lỗi xảy ra. Vui lòng thử lại.');
    });
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('success', 'Đã sao chép vào clipboard!');
    }).catch(() => {
        showAlert('danger', 'Không thể sao chép. Vui lòng sao chép thủ công.');
    });
}

// Print page
function printPage() {
    window.print();
}

// Share functionality
function shareContent(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        });
    } else {
        copyToClipboard(url);
    }
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'btn btn-primary position-fixed';
    backToTopBtn.style.bottom = '100px';
    backToTopBtn.style.right = '20px';
    backToTopBtn.style.zIndex = '998';
    backToTopBtn.style.display = 'none';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.width = '50px';
    backToTopBtn.style.height = '50px';
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    document.body.appendChild(backToTopBtn);
}

// Initialize back to top on load
window.addEventListener('load', initBackToTop);

// Utility functions
const utils = {
    // Format number with thousands separator
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    
    // Format currency
    formatCurrency: (amount) => {
        return utils.formatNumber(amount) + ' VNĐ';
    },
    
    // Validate email
    isValidEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate phone number
    isValidPhone: (phone) => {
        const re = /^[0-9]{10,11}$/;
        return re.test(phone.replace(/\s/g, ''));
    },
    
    // Get URL parameter
    getUrlParameter: (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export utils for global use
window.utils = utils;

// Affiliate system functions
window.affiliate = {
    // Auto-detect referral code from URL
    checkReferralCode: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        
        if (refCode) {
            // Store in localStorage for later use
            localStorage.setItem('referral_code', refCode);
            
            // Validate referral code
            fetch(`ajax/affiliate_actions.php?action=validate_referral&code=${refCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.valid) {
                        showAlert('info', `Bạn được giới thiệu bởi ${data.referrer.name}`);
                    }
                });
        }
    },
    
    // Register affiliate member
    register: function(formData) {
        return fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json());
    },
    
    // Get dashboard data
    getDashboard: function(memberId) {
        return fetch(`ajax/affiliate_actions.php?action=get_dashboard&member_id=${memberId}`)
            .then(response => response.json());
    },
    
    // Add customer conversion
    addConversion: function(data) {
        const formData = new FormData();
        formData.append('action', 'add_conversion');
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        
        return fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json());
    },
    
    // Update conversion status
    updateConversionStatus: function(conversionId, status, manualStatus = '', notes = '', assignedStaff = '') {
        const formData = new FormData();
        formData.append('action', 'update_conversion_status');
        formData.append('conversion_id', conversionId);
        formData.append('status', status);
        formData.append('manual_status', manualStatus);
        formData.append('notes', notes);
        formData.append('assigned_staff', assignedStaff);
        
        return fetch('ajax/affiliate_actions.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json());
    },
    
    // Get top performers
    getTopPerformers: function(limit = 10) {
        return fetch(`ajax/affiliate_actions.php?action=get_top_performers&limit=${limit}`)
            .then(response => response.json());
    },
    
    // Search members
    searchMembers: function(query, role = '') {
        return fetch(`ajax/affiliate_actions.php?action=search_members&q=${encodeURIComponent(query)}&role=${role}`)
            .then(response => response.json());
    }
};

// Auto-check referral code on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admission') || utils.getUrlParameter('ref')) {
        affiliate.checkReferralCode();
    }
});