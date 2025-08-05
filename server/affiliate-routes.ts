import type { Express } from "express";
import express from "express";

export function registerAffiliateRoutes(app: Express): void {
  // Affiliate login endpoint with proper cookie handling
  app.post("/api/affiliate/login", async (req, res) => {
    try {
      const { username, memberCode } = req.body;

      if (!username || !memberCode) {
        return res.status(400).json({ 
          message: "Vui lòng nhập đầy đủ thông tin" 
        });
      }

      // Demo authentication - support both username/memberCode and username/password
      if ((username === "testfinal" && memberCode === "123456") || 
          (username === "testfinal" && req.body.password === "123456")) {
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
}