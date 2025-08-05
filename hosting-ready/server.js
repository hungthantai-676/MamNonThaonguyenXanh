import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Demo data for testing
const demoData = {
  articles: [
    {
      id: 1,
      title: "Chương trình học mới 2024-2025",
      content: "Chương trình giáo dục toàn diện cho trẻ mầm non",
      publishedAt: new Date().toISOString(),
      category: "education"
    }
  ],
  programs: [
    {
      id: 1,
      name: "Lớp Mẫu Giáo Nhỏ (3-4 tuổi)",
      description: "Chương trình phát triển toàn diện cho trẻ 3-4 tuổi",
      ageRange: "3-4 tuổi",
      features: ["Phát triển ngôn ngữ", "Kỹ năng xã hội", "Sáng tạo nghệ thuật"]
    },
    {
      id: 2,
      name: "Lớp Mẫu Giáo Lớn (4-5 tuổi)", 
      description: "Chuẩn bị cho bé vào lớp 1",
      ageRange: "4-5 tuổi",
      features: ["Toán học cơ bản", "Đọc viết", "Tư duy logic"]
    }
  ],
  activities: [
    {
      id: 1,
      name: "Ngày hội Trung Thu",
      description: "Hoạt động văn hóa truyền thống",
      date: "2024-09-15",
      images: ["/images/trung-thu.jpg"]
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Chị Hương",
      role: "Phụ huynh học sinh Minh An",
      content: "Trường có môi trường học tập tốt, cô giáo tận tâm.",
      rating: 5
    }
  ]
};

// API Routes
app.get('/api/articles', (req, res) => {
  res.json(demoData.articles);
});

app.get('/api/programs', (req, res) => {
  res.json(demoData.programs);
});

app.get('/api/activities', (req, res) => {
  res.json(demoData.activities);
});

app.get('/api/testimonials', (req, res) => {
  res.json(demoData.testimonials);
});

app.get('/api/homepage-content', (req, res) => {
  res.json({
    title: "Mầm Non Thảo Nguyên Xanh",
    subtitle: "Giáo dục bằng trái tim",
    description: "Nơi nuôi dưỡng tương lai của bé",
    welcomeText: "Chào mừng đến với Mầm Non Thảo Nguyên Xanh"
  });
});

app.get('/api/homepage-banner', (req, res) => {
  res.json({
    bannerImage: "/images/banner.jpg",
    title: "Mầm Non Thảo Nguyên Xanh"
  });
});

app.get('/api/social-media', (req, res) => {
  res.json([
    {
      id: 1,
      platform: "facebook",
      url: "https://facebook.com/mamnonthaonguyenxanh",
      icon: "facebook"
    }
  ]);
});

// Affiliate Routes
app.post('/api/affiliate/login', (req, res) => {
  const { username, memberCode, password } = req.body;
  
  if (!username || (!memberCode && !password)) {
    return res.status(400).json({ 
      message: "Vui lòng nhập đầy đủ thông tin" 
    });
  }

  // Demo login
  if ((username === "testfinal" && memberCode === "123456") || 
      (username === "testfinal" && password === "123456")) {
    
    res.cookie('aff_token', 'demo_token', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('member_code', memberCode || "123456", {
      httpOnly: false,
      sameSite: 'Lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      memberCode: memberCode || "123456",
      member: {
        id: 1,
        name: "Demo User",
        email: "demo@example.com",
        memberType: "parent",
        memberId: "DEMO-123456",
        username: "testfinal",
        tokenBalance: "1000",
        totalReferrals: 5,
        qrCode: "DEMO_QR_CODE",
        referralLink: "https://mamnonthaonguyenxanh.com/affiliate/join?ref=123456"
      }
    });
  } else {
    return res.status(401).json({ 
      message: "Thông tin đăng nhập không hợp lệ" 
    });
  }
});

app.post('/api/affiliate/register', (req, res) => {
  const { username, email, memberType, fullName, phoneNumber } = req.body;

  if (!username || !email || !memberType || !fullName) {
    return res.status(400).json({
      message: "Vui lòng điền đầy đủ thông tin bắt buộc"
    });
  }

  const memberCode = `${memberType.toUpperCase()}-${Date.now().toString().slice(-6)}`;

  res.json({
    success: true,
    message: "Đăng ký thành công",
    memberCode: memberCode,
    member: {
      id: Date.now(),
      username: username.trim(),
      email: email.trim(),
      memberType,
      name: fullName.trim(),
      phoneNumber: phoneNumber?.trim() || "",
      memberId: memberCode,
      isActive: true,
      tokenBalance: "0",
      totalReferrals: 0,
      qrCode: `QR_${memberCode}`,
      referralLink: `https://mamnonthaonguyenxanh.com/affiliate/join?ref=${memberCode}`,
      walletAddress: `0x${Date.now().toString(16)}...`
    }
  });
});

app.get('/api/affiliate/auth', (req, res) => {
  const token = req.cookies?.aff_token;
  const memberCode = req.cookies?.member_code;
  
  if (token && memberCode) {
    res.json({ 
      authenticated: true, 
      memberCode: memberCode 
    });
  } else {
    res.json({ 
      authenticated: false 
    });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  res.json({ 
    success: true, 
    message: "Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm." 
  });
});

app.post('/api/forgot-password', (req, res) => {
  const { email, username } = req.body;
  
  if (!email && !username) {
    return res.status(400).json({ error: "Vui lòng nhập email hoặc tên đăng nhập" });
  }

  res.json({ 
    success: true, 
    message: "Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư." 
  });
});

// Admin Routes
app.post('/api/admin/homepage-content', (req, res) => {
  res.json({ success: true, message: "Lưu nội dung thành công" });
});

app.post('/api/admin/homepage-banner', (req, res) => {
  res.json({ success: true, message: "Lưu banner thành công" });
});

// Image upload endpoints - MOVED TO TOP for proper route handling
app.post('/api/admin/upload-image', (req, res) => {
  try {
    console.log('Upload image endpoint hit:', req.body);
    const timestamp = Date.now();
    const imageUrl = `/images/uploaded/image-${timestamp}.jpg`;
    
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: "Hình ảnh đã được lưu thành công" 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi khi lưu hình ảnh" 
    });
  }
});

app.post('/api/admin/upload-banner', (req, res) => {
  try {
    console.log('Upload banner endpoint hit:', req.body);
    const timestamp = Date.now();
    const bannerUrl = `/images/banners/banner-${timestamp}.jpg`;
    
    res.json({ 
      success: true, 
      bannerUrl: bannerUrl,
      message: "Banner đã được lưu thành công" 
    });
  } catch (error) {
    console.error('Banner upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi khi lưu banner" 
    });
  }
});

app.post('/api/admin/upload-video', (req, res) => {
  try {
    console.log('Upload video endpoint hit:', req.body);
    const timestamp = Date.now();
    const videoUrl = `/videos/uploaded/video-${timestamp}.mp4`;
    
    res.json({ 
      success: true, 
      videoUrl: videoUrl,
      message: "Video đã được lưu thành công" 
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi khi lưu video" 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch all - serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Time: ${new Date().toLocaleString('vi-VN')}`);
});