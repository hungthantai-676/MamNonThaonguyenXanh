-- Database schema for Mầm Non Thảo Nguyên Xanh (PHP Version)
-- MySQL/MariaDB compatible

-- Create database
CREATE DATABASE IF NOT EXISTS mamnonthaonguyenxanh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mamnonthaonguyenxanh;

-- Users table for admin authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    role ENUM('admin', 'editor') DEFAULT 'admin',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Programs table
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_age INT NOT NULL,
    max_age INT NOT NULL,
    tuition DECIMAL(10,0) NOT NULL,
    features TEXT,
    image_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    date DATE,
    location VARCHAR(100),
    frequency VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Articles table
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE,
    summary TEXT,
    content LONGTEXT,
    featured_image VARCHAR(255),
    category VARCHAR(50),
    status ENUM('draft', 'published') DEFAULT 'published',
    author_id INT,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Testimonials table
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    content TEXT NOT NULL,
    avatar VARCHAR(255),
    rating INT DEFAULT 5,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact forms table
CREATE TABLE contact_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    child_name VARCHAR(100),
    child_age INT,
    message TEXT,
    status ENUM('new', 'contacted', 'enrolled') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admission forms table
CREATE TABLE admission_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    child_name VARCHAR(100) NOT NULL,
    child_birthdate DATE,
    child_gender ENUM('male', 'female'),
    program_id INT,
    preferred_start_date DATE,
    special_needs TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
);

-- Social media table
CREATE TABLE social_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(20) NOT NULL,
    url VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table for site configuration
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Media coverage table
CREATE TABLE media_coverage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    outlet VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    type ENUM('tv', 'newspaper', 'online', 'radio') NOT NULL,
    url VARCHAR(255),
    summary TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs for admin actions
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default admin user
INSERT INTO users (username, password, email, full_name, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@mamnonthaonguyenxanh.com', 'Quản trị viên', 'admin');
-- Default password: admin123

-- Insert sample programs
INSERT INTO programs (name, description, min_age, max_age, tuition, features) VALUES 
('Lớp Mẫu Giáo Nhỏ', 'Chương trình dành cho trẻ 3-4 tuổi với các hoạt động phát triển cơ bản', 3, 4, 4000000, 'Học qua vui chơi, Phát triển vận động, Kỹ năng xã hội'),
('Lớp Mẫu Giáo Lớn', 'Chương trình chuẩn bị cho trẻ 4-5 tuổi vào lớp 1', 4, 5, 4000000, 'Chuẩn bị tiểu học, Toán tư duy, Đọc viết cơ bản'),
('Lớp Chồi', 'Chương trình cho trẻ 2-3 tuổi mới bắt đầu', 2, 3, 4000000, 'Làm quen môi trường, Chăm sóc đặc biệt, Phát triển ngôn ngữ');

-- Insert sample activities
INSERT INTO activities (name, description, date, location, frequency) VALUES 
('Ngày hội Trung Thu', 'Tổ chức lễ hội truyền thống với các trò chơi dân gian', '2025-09-15', 'Sân trường', 'Hàng năm'),
('Hoạt động ngoại khóa', 'Các hoạt động thể thao, âm nhạc, hội họa', '2025-08-01', 'Phòng đa năng', 'Hàng tuần'),
('Dã ngoại cuối năm', 'Chuyến dã ngoại tại công viên để gắn kết', '2025-05-20', 'Công viên Tao Đàn', 'Hàng năm');

-- Insert sample testimonials
INSERT INTO testimonials (name, role, content, rating) VALUES 
('Chị Hương', 'Phụ huynh lớp Mẫu Giáo Lớn', 'Con tôi rất thích đến trường. Các cô giáo tận tâm và chương trình học rất bổ ích.', 5),
('Anh Minh', 'Bố của bé Lan', 'Trường có môi trường an toàn, sạch sẽ. Con em phát triển rất tốt về mọi mặt.', 5),
('Chị Mai', 'Mẹ của bé Nam', 'Đội ngũ giáo viên chuyên nghiệp, luôn quan tâm đến từng em một cách tận tình.', 5);

-- Insert sample articles
INSERT INTO articles (title, slug, summary, content, category, status) VALUES 
('Tuyển sinh năm học 2024-2025', 'tuyen-sinh-nam-hoc-2024-2025', 'Thông báo tuyển sinh và các thông tin cần biết cho năm học mới', 'Nhà trường thông báo tuyển sinh cho năm học 2024-2025. Chúng tôi nhận học sinh từ 2-5 tuổi...', 'Thông báo', 'published'),
('Khai giảng năm học mới', 'khai-giang-nam-hoc-moi', 'Lễ khai giảng năm học 2024-2025 được tổ chức long trọng', 'Sáng ngày 5/9/2024, trường Mầm non Thảo Nguyên Xanh đã tổ chức lễ khai giảng...', 'Sự kiện', 'published'),
('Chương trình dinh dưỡng mới', 'chuong-trinh-dinh-duong-moi', 'Giới thiệu chương trình dinh dưỡng cân bằng cho trẻ', 'Nhà trường áp dụng chương trình dinh dưỡng mới nhằm đảm bảo sức khỏe tốt nhất...', 'Giáo dục', 'published');

-- Insert social media links
INSERT INTO social_media (platform, url) VALUES 
('facebook', 'https://facebook.com/mamnonthaonguyenxanh'),
('youtube', 'https://youtube.com/@mamnonthaonguyenxanh'),
('instagram', 'https://instagram.com/mamnonthaonguyenxanh');

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES 
('site_name', 'Mầm Non Thảo Nguyên Xanh', 'Tên website'),
('contact_phone', '0912 345 678', 'Số điện thoại liên hệ'),
('contact_email', 'info@mamnonthaonguyenxanh.com', 'Email liên hệ'),
('contact_address', '123 Đường Hoa Sữa, Phường Linh Tây, TP. Thủ Đức, TP.HCM', 'Địa chỉ trường'),
('school_hours', 'Thứ 2 - Thứ 6: 7:00 - 17:00, Thứ 7: 7:00 - 11:00', 'Giờ học'),
('maps_embed', '', 'Google Maps embed code');

-- Insert sample media coverage
INSERT INTO media_coverage (outlet, title, date, type, url, summary) VALUES 
('VTC News', 'Mầm non Thảo Nguyên Xanh - Điểm sáng trong giáo dục mầm non', '2024-03-15', 'online', 'https://vtc.vn/mam-non-thao-nguyen-xanh', 'Báo cáo về chất lượng giáo dục tại trường'),
('HTV', 'Chương trình giáo dục sáng tạo cho trẻ em', '2024-02-20', 'tv', 'https://htv.vn/chuong-trinh-giao-duc', 'Phóng sự về phương pháp giáo dục hiện đại'),
('Tuổi Trẻ', 'Môi trường học tập lý tưởng cho trẻ mầm non', '2024-01-10', 'newspaper', 'https://tuoitre.vn/moi-truong-hoc-tap', 'Bài viết về cơ sở vật chất và đội ngũ giáo viên');

-- Affiliate system tables
CREATE TABLE affiliate_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    role ENUM('teacher', 'parent') NOT NULL,
    referral_code VARCHAR(10) UNIQUE NOT NULL,
    qr_code_path VARCHAR(255),
    total_referrals INT DEFAULT 0,
    wallet_balance DECIMAL(15,0) DEFAULT 0,
    points_balance INT DEFAULT 0,
    current_milestone INT DEFAULT 0,
    next_milestone_target INT DEFAULT 5,
    status ENUM('active', 'inactive') DEFAULT 'active',
    is_hidden TINYINT(1) DEFAULT 0,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Referral tracking
CREATE TABLE referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_id VARCHAR(20) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    student_age INT DEFAULT 3,
    parent_name VARCHAR(100) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(100),
    admission_form_id INT,
    notes TEXT,
    status ENUM('pending', 'confirmed', 'enrolled') DEFAULT 'pending',
    payment_status ENUM('pending', 'confirmed', 'paid') DEFAULT 'pending',
    reward_amount DECIMAL(15,0) DEFAULT 0,
    reward_points INT DEFAULT 0,
    reward_paid ENUM('yes', 'no') DEFAULT 'no',
    milestone_bonus DECIMAL(15,0) DEFAULT 0,
    milestone_bonus_points INT DEFAULT 0,
    confirmed_at TIMESTAMP NULL,
    payment_confirmed_at TIMESTAMP NULL,
    payment_completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES affiliate_members(member_id) ON DELETE CASCADE,
    FOREIGN KEY (admission_form_id) REFERENCES admission_forms(id) ON DELETE SET NULL
);

-- Wallet transactions
CREATE TABLE wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(20) NOT NULL,
    transaction_type ENUM('referral_reward', 'milestone_bonus', 'withdrawal', 'adjustment') NOT NULL,
    amount DECIMAL(15,0) NOT NULL,
    points INT DEFAULT 0,
    description TEXT,
    referral_id INT,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES affiliate_members(member_id) ON DELETE CASCADE,
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE SET NULL
);

-- Affiliate transactions for payment tracking
CREATE TABLE affiliate_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(20) NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(15,0) DEFAULT 0,
    description TEXT,
    referral_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES affiliate_members(member_id) ON DELETE CASCADE,
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE SET NULL
);

-- Customer conversion tracking
CREATE TABLE customer_conversions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_id VARCHAR(20) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    conversion_source VARCHAR(50),
    status ENUM('lead', 'consultation', 'enrolled') DEFAULT 'lead',
    manual_status ENUM('white', 'yellow', 'green') DEFAULT 'white',
    notes TEXT,
    assigned_staff VARCHAR(100),
    conversion_value DECIMAL(15,0) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES affiliate_members(member_id) ON DELETE CASCADE
);

-- Milestone rewards configuration
CREATE TABLE milestone_rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    milestone_number INT NOT NULL,
    required_referrals INT NOT NULL,
    teacher_bonus DECIMAL(15,0) NOT NULL,
    parent_bonus_points INT NOT NULL,
    description VARCHAR(255),
    active ENUM('yes', 'no') DEFAULT 'yes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert milestone rewards configuration
INSERT INTO milestone_rewards (milestone_number, required_referrals, teacher_bonus, parent_bonus_points, description) VALUES
(1, 5, 10000000, 10000, 'Mốc 5 học sinh đầu tiên'),
(2, 10, 10000000, 10000, 'Mốc 10 học sinh'),
(3, 15, 10000000, 10000, 'Mốc 15 học sinh'),
(4, 20, 10000000, 10000, 'Mốc 20 học sinh'),
(5, 25, 10000000, 10000, 'Mốc 25 học sinh'),
(6, 30, 10000000, 10000, 'Mốc 30 học sinh');

-- Insert sample affiliate members (new registrations start with 0 balance)
INSERT INTO affiliate_members (member_id, name, phone, email, role, referral_code, total_referrals, wallet_balance, points_balance) VALUES
('TCH001', 'Cô Hương Nguyễn', '0912345001', 'huong.nguyen@gmail.com', 'teacher', 'TCH001', 0, 0, 0),
('TCH002', 'Thầy Minh Đặng', '0912345002', 'minh.dang@gmail.com', 'teacher', 'TCH002', 0, 0, 0),
('PAR001', 'Chị Lan Phạm', '0912345003', 'lan.pham@gmail.com', 'parent', 'PAR001', 0, 0, 0),
('PAR002', 'Anh Tuấn Lê', '0912345004', 'tuan.le@gmail.com', 'parent', 'PAR002', 0, 0, 0);

-- Update admission_forms table to include referrer tracking
ALTER TABLE admission_forms ADD COLUMN referrer_code VARCHAR(10) AFTER special_needs;
ALTER TABLE admission_forms ADD COLUMN referrer_id VARCHAR(20) AFTER referrer_code;