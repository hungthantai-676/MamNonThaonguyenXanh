import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware setup
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Affiliate login endpoint with proper cookie handling
  app.post("/api/affiliate/login", async (req, res) => {
    try {
      const { username, memberCode } = req.body;

      if (!username || !memberCode) {
        return res.status(400).json({ 
          message: "Vui lòng nhập đầy đủ thông tin" 
        });
      }

      // Demo authentication for testfinal/123456
      if (username === "testfinal" && memberCode === "123456") {
        res.cookie('aff_token', 'demo_token', {
          httpOnly: true,
          sameSite: 'Lax',
          secure: false,
          maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie('member_code', memberCode, {
          httpOnly: false,
          sameSite: 'Lax', 
          secure: false,
          maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({ 
          success: true,
          message: "Đăng nhập thành công",
          memberCode,
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
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        message: "Có lỗi xảy ra trong quá trình đăng nhập" 
      });
    }
  });

  // Affiliate logout endpoint
  app.post("/api/affiliate/logout", (req, res) => {
    res.clearCookie('aff_token');
    res.clearCookie('member_code');
    res.json({ success: true, message: "Đăng xuất thành công" });
  });

  // Check authentication status
  app.get("/api/affiliate/auth", (req, res) => {
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

  // Affiliate registration endpoint
  app.post("/api/affiliate/register", async (req, res) => {
    try {
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
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "Có lỗi xảy ra trong quá trình đăng ký"
      });
    }
  });

  // Dashboard data endpoint
  app.get("/api/affiliate/dashboard", async (req, res) => {
    try {
      const token = req.cookies?.aff_token;
      const memberCode = req.cookies?.member_code;

      if (!token || !memberCode) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
      }

      // Demo data for testing
      res.json({
        member: {
          id: 1,
          name: "Demo User",
          memberType: "parent",
          memberId: memberCode,
          tokenBalance: "1000",
          totalReferrals: 5,
          qrCode: "DEMO_QR",
          referralLink: `https://mamnonthaonguyenxanh.com/affiliate/join?ref=${memberCode}`
        },
        customers: [],
        commissions: [],
        totalEarnings: 0
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Có lỗi xảy ra khi tải dữ liệu" });
    }
  });

  // Basic routes for other pages
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles || []);
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getPrograms(); 
      res.json(programs || []);
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities || []);
    } catch (error) {
      res.json([]);
    }
  });

  // Homepage content routes
  app.get("/api/homepage-content", async (req, res) => {
    try {
      const content = await storage.getHomepageContent();
      res.json(content || {});
    } catch (error) {
      res.json({});
    }
  });

  app.get("/api/homepage-banner", async (req, res) => {
    try {
      const banner = await storage.getHomepageBanner();
      res.json(banner || {});
    } catch (error) {
      res.json({});
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials || []);
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/social-media", async (req, res) => {
    try {
      const socialMedia = await storage.getSocialMedia();
      res.json(socialMedia || []);
    } catch (error) {
      res.json([]);
    }
  });

  // Serve static uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}