-- Database Schema for Mầm Non Thảo Nguyên Xanh
-- MySQL/MariaDB compatible schema
-- Optimized for standard hosting providers

-- Create database (run this first if needed)
-- CREATE DATABASE mamnon_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE mamnon_db;

-- Articles table for news and announcements
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    category ENUM('news', 'announcement', 'event', 'education') DEFAULT 'news',
    image_url VARCHAR(500),
    author VARCHAR(100) DEFAULT 'Admin',
    status ENUM('draft', 'published') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- Programs table for educational programs
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age_range VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    features TEXT,
    tuition DECIMAL(10,2) NOT NULL DEFAULT 4000000.00,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
);

-- Activities table for school activities and events
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date_time DATETIME,
    location VARCHAR(255),
    frequency ENUM('daily', 'weekly', 'monthly', 'yearly', 'special') DEFAULT 'special',
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_time),
    INDEX idx_active (is_active)
);

-- Testimonials table for parent reviews
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    content TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active)
);

-- Contact forms table for inquiries
CREATE TABLE contact_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    child_name VARCHAR(255),
    child_age VARCHAR(50),
    message TEXT,
    status ENUM('new', 'contacted', 'enrolled', 'closed') DEFAULT 'new',
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- Admission forms table for enrollment applications
CREATE TABLE admission_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    child_name VARCHAR(255) NOT NULL,
    child_birthdate DATE,
    child_age VARCHAR(50),
    desired_program VARCHAR(255),
    start_date DATE,
    previous_school VARCHAR(255),
    special_needs TEXT,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    status ENUM('pending', 'reviewing', 'approved', 'enrolled', 'rejected') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- Media coverage table for press mentions
CREATE TABLE media_coverage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    outlet VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    coverage_date DATE,
    type ENUM('tv', 'newspaper', 'online', 'radio') DEFAULT 'online',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (coverage_date),
    INDEX idx_type (type),
    INDEX idx_featured (is_featured)
);

-- Social media links table
CREATE TABLE social_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_platform (platform),
    INDEX idx_active (is_active)
);

-- Content management table for dynamic content
CREATE TABLE site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    value LONGTEXT,
    type ENUM('text', 'html', 'image', 'json') DEFAULT 'text',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_section_key (section, key_name),
    INDEX idx_section (section)
);

-- Admin users table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    full_name VARCHAR(255),
    role ENUM('admin', 'editor') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_active (is_active)
);

-- Admin sessions table
CREATE TABLE admin_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
);

-- Affiliate system tables (if needed)
CREATE TABLE affiliates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    type ENUM('teacher', 'parent', 'other') DEFAULT 'parent',
    wallet_address VARCHAR(255),
    qr_code TEXT,
    total_referrals INT DEFAULT 0,
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- File uploads table for managing uploaded files
CREATE TABLE file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100),
    category VARCHAR(100),
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_created (created_at)
);

-- Insert default data
INSERT INTO articles (title, excerpt, content, category) VALUES
('Chào mừng đến với Mầm Non Thảo Nguyên Xanh', 
 'Chúng tôi cam kết mang đến môi trường giáo dục tốt nhất cho con em bạn.', 
 'Mầm Non Thảo Nguyên Xanh được thành lập với sứ mệnh cung cấp nền giáo dục mầm non chất lượng cao, an toàn và thân thiện với trẻ em. Chúng tôi tin rằng mỗi đứa trẻ đều có tiềm năng riêng và cần được nuôi dưỡng trong môi trường phù hợp.', 
 'announcement'),

('Tuyển sinh năm học 2024-2025', 
 'Thông báo tuyển sinh cho năm học mới với nhiều ưu đãi hấp dẫn.', 
 'Mầm Non Thảo Nguyên Xanh thông báo tuyển sinh cho năm học 2024-2025. Chúng tôi nhận trẻ từ 18 tháng đến 6 tuổi với học phí 4.000.000 VNĐ/tháng. Đăng ký sớm sẽ được giảm 10% học phí tháng đầu.', 
 'news');

INSERT INTO programs (name, age_range, description, features, tuition) VALUES
('Lớp Nhà Trẻ', '18 tháng - 3 tuổi', 
 'Chương trình dành cho trẻ nhỏ với sự chăm sóc tận tình và phát triển các kỹ năng cơ bản.', 
 'Chăm sóc cá nhân, Phát triển vận động, Kỹ năng xã hội cơ bản', 
 4000000.00),

('Lớp Mẫu Giáo Nhỏ', '3 - 4 tuổi', 
 'Phát triển toàn diện các kỹ năng nhận thức và chuẩn bị cho bậc học cao hơn.', 
 'Học chữ cái, số đếm, Hoạt động sáng tạo, Kỹ năng giao tiếp', 
 4000000.00),

('Lớp Mẫu Giáo Lớn', '4 - 5 tuổi', 
 'Chuẩn bị cho việc vào lớp 1 với các kỹ năng học tập cần thiết.', 
 'Chuẩn bị vào lớp 1, Toán học cơ bản, Đọc viết sơ cấp', 
 4000000.00);

INSERT INTO activities (name, description, date_time, location, frequency) VALUES
('Ngày hội Trung Thu', 
 'Tổ chức các hoạt động vui chơi, thi đấu và văn nghệ nhân dịp Tết Trung Thu.', 
 '2024-09-15 08:00:00', 
 'Sân trường', 
 'yearly'),

('Học bơi an toàn', 
 'Dạy trẻ các kỹ năng bơi lội cơ bản và an toàn dưới nước.', 
 '2024-08-01 09:00:00', 
 'Hồ bơi trường', 
 'weekly'),

('Dã ngoại cuối tuần', 
 'Hoạt động ngoài trời giúp trẻ khám phá thiên nhiên và rèn luyện thể chất.', 
 '2024-07-30 07:30:00', 
 'Công viên thành phố', 
 'monthly');

INSERT INTO testimonials (name, role, content, rating) VALUES
('Chị Hương', 'Phụ huynh lớp Mầm 4', 
 'Con tôi rất thích đi học ở đây. Các cô giáo rất tận tâm và môi trường học tập rất tốt. Tôi hoàn toàn yên tâm khi gửi con ở trường.', 
 5),

('Anh Minh', 'Phụ huynh lớp Nhà trẻ', 
 'Trường có cơ sở vật chất hiện đại, an toàn. Con tôi từ khi học ở đây đã tự tin và vui vẻ hơn rất nhiều.', 
 5),

('Chị Lan', 'Phụ huynh lớp Mầm 5', 
 'Chương trình học rất phong phú và bổ ích. Con được phát triển toàn diện cả về thể chất lẫn tinh thần.', 
 5);

INSERT INTO social_media (platform, url, display_order) VALUES
('facebook', 'https://www.facebook.com/mamnonthaonguyenxanh', 1),
('youtube', 'https://www.youtube.com/@mamnonthaonguyenxanh', 2),
('instagram', 'https://www.instagram.com/mamnonthaonguyenxanh', 3);

INSERT INTO site_content (section, key_name, value, type) VALUES
('contact', 'phone', '0856318686', 'text'),
('contact', 'email', 'mamnonthaonguyenxanh@gmail.com', 'text'),
('contact', 'address', 'Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình', 'text'),
('homepage', 'hero_title', 'Chào mừng đến với Mầm Non Thảo Nguyên Xanh', 'text'),
('homepage', 'hero_subtitle', 'Môi trường giáo dục an toàn, thân thiện và chuyên nghiệp cho bé yêu', 'text'),
('about', 'history', 'Mầm Non Thảo Nguyên Xanh được thành lập năm 2020 với mong muốn tạo ra một môi trường giáo dục an toàn, thân thiện và chất lượng cao cho trẻ em.', 'text'),
('about', 'mission', 'Cung cấp nền giáo dục mầm non toàn diện, phát triển các kỹ năng cơ bản và tính cách tốt đẹp cho trẻ.', 'text'),
('about', 'vision', 'Trở thành ngôi trường mầm non hàng đầu trong khu vực, được phụ huynh và cộng đồng tin tưởng.', 'text');

-- Create default admin user (password: admin123)
INSERT INTO admin_users (username, password, email, full_name) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@mamnonthaonguyenxanh.com', 'Administrator');