import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { storage } from "./storage";

export async function registerWebsiteRoutes(app: Express): Promise<Server> {
  // Ensure upload directories exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const imagesDir = path.join(uploadsDir, 'images');
  const videosDir = path.join(uploadsDir, 'videos');
  
  [uploadsDir, imagesDir, videosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Multer setup for file uploads
  const storage_multer = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype.startsWith('image/')) {
        cb(null, imagesDir);
      } else if (file.mimetype.startsWith('video/')) {
        cb(null, videosDir);
      } else {
        cb(new Error('Invalid file type'), '');
      }
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const type = file.mimetype.startsWith('image/') ? 'image' : 'video';
      cb(null, `${type}-${timestamp}${ext}`);
    }
  });

  const upload = multer({ 
    storage: storage_multer,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only images and videos are allowed'));
      }
    }
  });

  // Middleware setup
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Serve static files
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // Banner upload endpoint (separate from regular images)
  app.post('/api/admin/upload-banner', upload.single('banner'), (req, res) => {
    try {
      console.log('Upload banner endpoint hit, file:', req.file);
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file được upload"
        });
      }

      const bannerUrl = `/uploads/images/${req.file.filename}`;
      
      res.json({ 
        success: true, 
        bannerUrl: bannerUrl,
        message: "Banner đã được lưu thành công" 
      });
    } catch (error) {
      console.error('Banner upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi khi lưu banner: " + (error as Error).message 
      });
    }
  });

  // Image upload endpoints
  app.post('/api/admin/upload-image', upload.single('image'), (req, res) => {
    try {
      console.log('Upload image endpoint hit, file:', req.file);
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file được upload"
        });
      }

      const imageUrl = `/uploads/images/${req.file.filename}`;
      
      res.json({ 
        success: true, 
        imageUrl: imageUrl,
        message: "Ảnh đã được lưu thành công" 
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi khi lưu ảnh: " + (error as Error).message 
      });
    }
  });

  // Video upload endpoint
  app.post('/api/admin/upload-video', upload.single('video'), (req, res) => {
    try {
      console.log('Upload video endpoint hit, file:', req.file);
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file được upload"
        });
      }

      const videoUrl = `/uploads/videos/${req.file.filename}`;
      
      res.json({ 
        success: true, 
        videoUrl: videoUrl,
        message: "Video đã được lưu thành công" 
      });
    } catch (error) {
      console.error('Video upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi khi lưu video: " + (error as Error).message 
      });
    }
  });

  // Remove banner endpoint
  app.delete('/api/admin/remove-banner', (req, res) => {
    try {
      res.json({ 
        success: true, 
        message: "Banner đã được xóa" 
      });
    } catch (error) {
      console.error('Remove banner error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi khi xóa banner: " + (error as Error).message 
      });
    }
  });

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

      // Save contact form - using existing contact forms method
      // const contact = await storage.saveContactForm({
      //   name,
      //   email,
      //   phone: phone || "",
      //   message,
      //   submittedAt: new Date().toISOString()
      // });

      res.json({ success: true, message: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm." });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra khi gửi form" });
    }
  });

  // Website data endpoints
  app.get("/api/homepage-content", async (req, res) => {
    try {
      const content = await storage.getHomepageContent();
      res.json(content);
    } catch (error) {
      console.error("Get homepage content error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  app.get("/api/homepage-banner", async (req, res) => {
    try {
      const banner = await storage.getHomepageBanner();
      res.json(banner);
    } catch (error) {
      console.error("Get homepage banner error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      console.error("Get articles error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Get testimonials error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      console.error("Get programs error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  app.get("/api/social-media", async (req, res) => {
    try {
      const socialMedia = await storage.getSocialMedia();
      res.json(socialMedia);
    } catch (error) {
      console.error("Get social media error:", error);
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  // Create HTTP Server
  const httpServer = createServer(app);
  return httpServer;
}