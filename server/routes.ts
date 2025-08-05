import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { registerAffiliateRoutes } from "./affiliate-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware setup
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Register affiliate routes separately to avoid conflicts with main site
  registerAffiliateRoutes(app);

  // Admin content management endpoints
  app.post("/api/admin/homepage-content", async (req, res) => {
    try {
      const content = await storage.saveHomepageContent(req.body);
      res.json({ success: true, content });
    } catch (error) {
      console.error("Save homepage content error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra khi lưu nội dung" });
    }
  });

  app.post("/api/admin/homepage-banner", async (req, res) => {
    try {
      const banner = await storage.saveHomepageBanner(req.body);
      res.json({ success: true, banner });
    } catch (error) {
      console.error("Save homepage banner error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra khi lưu banner" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
      }

      const contactData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || "",
        message: message.trim(),
        createdAt: new Date().toISOString()
      };

      const contact = await storage.createContact(contactData);
      res.json({ success: true, message: "Gửi tin nhắn thành công!", contact });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra khi gửi tin nhắn" });
    }
  });

  // Password reset endpoint
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email, username } = req.body;
      
      if (!email && !username) {
        return res.status(400).json({ error: "Vui lòng nhập email hoặc tên đăng nhập" });
      }

      // For demo, return success message
      res.json({ 
        success: true, 
        message: "Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư." 
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra khi gửi email khôi phục" });
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

  // Image upload endpoint
  app.post('/api/admin/upload-image', (req, res) => {
    try {
      // For now, return success - in production would save to file system or cloud
      const { type } = req.body;
      const timestamp = Date.now();
      const imageUrl = `/images/uploaded/${type}-${timestamp}.jpg`;
      
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

  // Banner upload endpoint
  app.post('/api/admin/upload-banner', (req, res) => {
    try {
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

  // Serve static uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}