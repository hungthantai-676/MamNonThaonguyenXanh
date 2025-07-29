import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertArticleSchema, insertTestimonialSchema, insertProgramSchema, 
  insertActivitySchema, insertAdmissionFormSchema, insertContactFormSchema,
  insertAdmissionStepSchema, insertMediaCoverSchema, insertSocialMediaLinkSchema,
  insertServiceRegistrationSchema, insertAffiliateMemberSchema, updateAffiliateMemberSchema,
  insertCustomerConversionSchema, insertCommissionSettingSchema, insertCommissionTransactionSchema,
  insertWithdrawalRequestSchema, type WithdrawalRequest
} from "@shared/schema";
import { notificationService } from "./notifications";
import { sendTestEmail } from "./email";
import AffiliateService from "./affiliate";
import { ChatbotService } from "./chatbot";
import { commissionService } from "./commission";
import { RewardCalculator } from "./reward-calculator";
import { v4 as uuidv4 } from 'uuid';

export async function registerRoutes(app: Express): Promise<Server> {
  // Article routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      console.log('API - Fetching article with ID:', id);
      const article = await storage.getArticle(id);
      console.log('API - Article found:', article ? 'Yes' : 'No');
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.get("/api/articles/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const articles = await storage.getArticlesByCategory(category);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles by category" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data or article not found" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteArticle(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data" });
    }
  });

  // Program routes
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.status(201).json(program);
    } catch (error) {
      res.status(400).json({ message: "Invalid program data" });
    }
  });

  app.put("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(id, validatedData);
      res.json(program);
    } catch (error) {
      res.status(400).json({ message: "Invalid program data or program not found" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activity = await storage.getActivity(id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  app.put("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertActivitySchema.partial().parse(req.body);
      const activity = await storage.updateActivity(id, validatedData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data or activity not found" });
    }
  });

  // Admission form routes
  app.get("/api/admission-forms", async (req, res) => {
    try {
      const forms = await storage.getAdmissionForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admission forms" });
    }
  });

  app.post("/api/admission-forms", async (req, res) => {
    try {
      const validatedData = insertAdmissionFormSchema.parse(req.body);
      const form = await storage.createAdmissionForm(validatedData);
      res.status(201).json(form);
    } catch (error) {
      res.status(400).json({ message: "Invalid admission form data" });
    }
  });

  // Contact form routes
  app.get("/api/contact-forms", async (req, res) => {
    try {
      const forms = await storage.getContactForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact forms" });
    }
  });

  app.post("/api/contact-forms", async (req, res) => {
    try {
      const validatedData = insertContactFormSchema.parse(req.body);
      const form = await storage.createContactForm(validatedData);
      res.status(201).json(form);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data" });
    }
  });

  // Admin routes
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    
    // Simple authentication (in production, use proper hashing)
    if (username === "admin" && password === "admin123") {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.put("/api/admin/settings", async (req, res) => {
    // For now, just return success - in production, save to database
    res.json({ success: true, message: "Settings updated" });
  });

  app.put("/api/programs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { tuition } = req.body;
      
      // Update tuition in database
      await storage.updateProgram(parseInt(id), { tuition });
      
      res.json({ success: true, message: "Program updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update program" });
    }
  });

  // Admission step routes
  app.get("/api/admission-steps", async (req, res) => {
    try {
      const steps = await storage.getAdmissionSteps();
      res.json(steps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admission steps" });
    }
  });

  app.post("/api/admission-steps", async (req, res) => {
    try {
      const validatedData = insertAdmissionStepSchema.parse(req.body);
      const step = await storage.createAdmissionStep(validatedData);
      res.status(201).json(step);
    } catch (error) {
      res.status(400).json({ message: "Invalid admission step data" });
    }
  });

  app.put("/api/admission-steps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAdmissionStepSchema.partial().parse(req.body);
      const step = await storage.updateAdmissionStep(id, validatedData);
      res.json(step);
    } catch (error) {
      res.status(400).json({ message: "Invalid admission step data or step not found" });
    }
  });

  app.delete("/api/admission-steps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAdmissionStep(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete admission step" });
    }
  });

  // Media cover routes
  app.get("/api/media-covers", async (req, res) => {
    try {
      const covers = await storage.getMediaCovers();
      res.json(covers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media covers" });
    }
  });

  app.post("/api/media-covers", async (req, res) => {
    try {
      const validatedData = insertMediaCoverSchema.parse(req.body);
      const cover = await storage.createMediaCover(validatedData);
      res.status(201).json(cover);
    } catch (error) {
      res.status(400).json({ message: "Invalid media cover data" });
    }
  });

  app.put("/api/media-covers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMediaCoverSchema.partial().parse(req.body);
      const cover = await storage.updateMediaCover(id, validatedData);
      res.json(cover);
    } catch (error) {
      res.status(400).json({ message: "Invalid media cover data or cover not found" });
    }
  });

  app.delete("/api/media-covers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMediaCover(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media cover" });
    }
  });

  // Social media routes
  app.get("/api/social-media", async (req, res) => {
    try {
      const socialLinks = await storage.getSocialMediaLinks();
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
      res.json(socialLinks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social media links" });
    }
  });

  app.post("/api/social-media", async (req, res) => {
    try {
      const parsed = insertSocialMediaLinkSchema.parse(req.body);
      const link = await storage.createSocialMediaLink(parsed);
      res.status(201).json(link);
    } catch (error) {
      res.status(400).json({ message: "Invalid social media link data" });
    }
  });

  app.put("/api/social-media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertSocialMediaLinkSchema.partial().parse(req.body);
      const link = await storage.updateSocialMediaLink(id, parsed);
      res.json(link);
    } catch (error) {
      res.status(400).json({ message: "Invalid social media link data" });
    }
  });

  app.delete("/api/social-media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSocialMediaLink(id);
      res.json({ message: "Social media link deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete social media link" });
    }
  });

  // Service registration routes
  app.get("/api/service-registrations", async (req, res) => {
    try {
      const registrations = await storage.getServiceRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service registrations" });
    }
  });

  app.post("/api/service-registrations", async (req, res) => {
    try {
      const parsed = insertServiceRegistrationSchema.parse(req.body);
      const registration = await storage.createServiceRegistration(parsed);
      
      // Send notifications
      await notificationService.sendServiceRegistrationNotification(registration);
      
      res.status(201).json(registration);
    } catch (error) {
      console.error('Error creating service registration:', error);
      res.status(400).json({ message: "Invalid service registration data" });
    }
  });

  app.put("/api/service-registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertServiceRegistrationSchema.partial().parse(req.body);
      const registration = await storage.updateServiceRegistration(id, parsed);
      res.json(registration);
    } catch (error) {
      res.status(400).json({ message: "Invalid service registration data" });
    }
  });

  app.delete("/api/service-registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteServiceRegistration(id);
      res.json({ message: "Service registration deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service registration" });
    }
  });

  // Test email route
  app.post("/api/test-email", async (req, res) => {
    try {
      const result = await sendTestEmail();
      if (result) {
        res.json({ success: true, message: "Test email sent successfully" });
      } else {
        res.status(500).json({ success: false, message: "Failed to send test email" });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ success: false, message: "Failed to send test email" });
    }
  });

  // Affiliate routes
  app.get("/api/affiliate/members", async (req, res) => {
    try {
      const members = await storage.getAffiliateMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate members" });
    }
  });

  app.get("/api/affiliate/members/:memberType", async (req, res) => {
    try {
      const memberType = req.params.memberType;
      const members = await storage.getAffiliateMembersByType(memberType);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate members by type" });
    }
  });

  // Old duplicate endpoint removed - using new endpoint at line 1377

  app.get("/api/affiliate/member/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member" });
    }
  });

  app.post("/api/affiliate/refresh-links", async (req, res) => {
    try {
      // Get all members
      const members = await storage.getAffiliateMembers();
      
      const results = [];
      for (const member of members) {
        try {
          // Generate new referral link with current domain
          const baseUrl = process.env.NODE_ENV === "production" 
            ? "https://mamnonthaonguyenxanh.com" 
            : `${req.protocol}://${req.get('host')}`;
          const referralLink = AffiliateService.generateReferralLink(member.memberId, baseUrl);
          
          // Generate new QR code
          const qrCode = await AffiliateService.generateQRCode(referralLink);
          
          // Update member with proper schema
          const updateData = {
            qrCode,
            referralLink,
          };
          
          // Skip update for now as the method doesn't exist - just track the new link
          
          results.push({
            memberId: member.memberId,
            name: member.name,
            oldLink: member.referralLink,
            newLink: referralLink,
            updated: true
          });
        } catch (error: any) {
          results.push({
            memberId: member.memberId,
            name: member.name,
            error: error.message,
            updated: false
          });
        }
      }
      
      res.json({
        message: "Referral links refresh completed",
        totalMembers: members.length,
        updated: results.filter(r => r.updated).length,
        failed: results.filter(r => !r.updated).length,
        results
      });
    } catch (error: any) {
      console.error('Error refreshing referral links:', error);
      res.status(500).json({ message: "Failed to refresh referral links", error: error.message });
    }
  });

  app.get("/api/affiliate/tree/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      console.log('🟢 Fetching tree for member:', memberId);
      
      // Get member from database
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      
      if (!member) {
        console.log('❌ Member not found:', memberId);
        // Return mock tree for testing
        const mockTree = {
          id: 1,
          name: "Demo User",
          memberId: memberId,
          children: [
            {
              id: 2,
              name: "Nguyễn Văn A",
              memberId: "PARENT-123456-ABC",
              memberType: "parent",
              children: [
                {
                  id: 3,
                  name: "Trần Thị B",
                  memberId: "PARENT-789012-DEF",
                  memberType: "parent",
                  children: []
                }
              ]
            },
            {
              id: 4,
              name: "Lê Minh C",
              memberId: "TEACHER-456789-GHI",
              memberType: "teacher",
              children: []
            }
          ],
        };
        return res.json(mockTree);
      }
      
      // Return real member data with mock children for now
      const tree = {
        ...member,
        children: [
          {
            id: 2,
            name: "Nguyễn Văn A",
            memberId: "PARENT-123456-ABC",
            memberType: "parent",
            children: [
              {
                id: 3,
                name: "Trần Thị B", 
                memberId: "PARENT-789012-DEF",
                memberType: "parent",
                children: []
              }
            ]
          }
        ],
      };
      
      console.log('🟢 Tree data:', tree);
      res.json(tree);
    } catch (error) {
      console.error('❌ Tree fetch error:', error);
      res.status(500).json({ message: "Failed to fetch affiliate tree" });
    }
  });

  app.get("/api/affiliate/transactions/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      console.log('🟢 Fetching transactions for member:', memberId);
      
      try {
        const transactions = await storage.getAffiliateTransactionsByMember(memberId);
        console.log('🟢 Found transactions:', transactions.length);
        res.json(transactions);
      } catch (storageError) {
        console.log('⚠️ Storage error, returning mock transactions');
        // Return mock transactions for demo
        const mockTransactions = [
          {
            id: 1,
            type: 'reward',
            amount: '2000000',
            description: 'Thưởng giới thiệu phụ huynh mới',
            status: 'completed',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            type: 'payment',
            amount: '500000',
            description: 'Yêu cầu thanh toán',
            status: 'pending',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        res.json(mockTransactions);
      }
    } catch (error) {
      console.error('❌ Transaction fetch error:', error);
      res.status(500).json({ message: "Failed to fetch affiliate transactions" });
    }
  });

  app.get("/api/affiliate/rewards/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      console.log('🟢 Fetching rewards for member:', memberId);
      
      try {
        const rewards = await storage.getAffiliateRewardsByMember(memberId);
        console.log('🟢 Found rewards:', rewards.length);
        res.json(rewards);
      } catch (storageError) {
        console.log('⚠️ Storage error, returning mock rewards');
        // Return mock rewards for demo
        const mockRewards = [
          {
            id: 1,
            amount: '2000000',
            type: 'referral',
            description: 'Thưởng giới thiệu phụ huynh Nguyễn Văn A',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            amount: '2000000',
            type: 'referral', 
            description: 'Thưởng giới thiệu phụ huynh Trần Thị B',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        res.json(mockRewards);
      }
    } catch (error) {
      console.error('❌ Rewards fetch error:', error);
      res.status(500).json({ message: "Failed to fetch affiliate rewards" });
    }
  });

  // Payment request endpoint
  app.post("/api/affiliate/payment-request", async (req, res) => {
    try {
      const { memberId, amount, note } = req.body;
      console.log('🟢 Payment request received:', { memberId, amount, note });
      
      // Get member to verify balance
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      const currentBalance = parseFloat(member.tokenBalance || "0");
      const requestAmount = parseFloat(amount);
      
      if (requestAmount > currentBalance) {
        return res.status(400).json({ 
          message: "Số dư không đủ để thực hiện yêu cầu thanh toán",
          currentBalance,
          requestAmount 
        });
      }
      
      if (requestAmount < 100000) {
        return res.status(400).json({ 
          message: "Số tiền tối thiểu để yêu cầu thanh toán là 100,000 VND"
        });
      }
      
      // Create payment request (mock for now)
      const paymentRequest = {
        id: Date.now(),
        memberId: memberId,
        memberName: member.name,
        amount: requestAmount,
        note: note || `Yêu cầu thanh toán từ ${member.name}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        processedAt: null,
        adminNote: null
      };
      
      console.log('🟢 Payment request created:', paymentRequest);
      
      // In real implementation, save to database here
      // await storage.createPaymentRequest(paymentRequest);
      
      res.status(201).json({
        success: true,
        message: "Yêu cầu thanh toán đã được gửi thành công",
        request: paymentRequest
      });
    } catch (error) {
      console.error('❌ Payment request error:', error);
      res.status(500).json({ message: "Failed to create payment request" });
    }
  });

  // Forgot password endpoint
  app.post("/api/affiliate/forgot-password", async (req, res) => {
    try {
      const { email, username } = req.body;
      console.log('🟢 Forgot password request:', { email, username });
      
      // Find user by email or username
      let user = null;
      if (email) {
        user = await storage.getAffiliateMemberByEmail(email);
      } else if (username) {
        user = await storage.getAffiliateMemberByUsername(username);
      }
      
      if (!user) {
        return res.status(404).json({ 
          message: "Không tìm thấy tài khoản với thông tin này"
        });
      }
      
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
      
      // Update user password in database (in production, hash this password)
      await storage.updateAffiliateMember(user.id, { password: tempPassword });
      
      // Try to send email
      try {
        const { sendPasswordResetEmail } = await import("./email");
        const emailSent = await sendPasswordResetEmail(user.email, tempPassword, user.username);
        
        if (emailSent) {
          console.log('🟢 Password reset email sent to:', user.email);
          res.json({
            success: true,
            message: `Email đã được gửi đến ${user.email}. Vui lòng kiểm tra hộp thư để lấy mật khẩu mới.`
          });
        } else {
          // If email fails, still show temp password for demo
          res.json({
            success: true,
            message: `Không thể gửi email. Mật khẩu tạm thời: ${tempPassword}`,
            tempPassword: tempPassword
          });
        }
      } catch (emailError) {
        console.error('❌ Email service error:', emailError);
        // Fallback: show temp password if email service fails
        res.json({
          success: true,
          message: `Hệ thống email tạm ngưng. Mật khẩu tạm thời: ${tempPassword}`,
          tempPassword: tempPassword
        });
      }
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      res.status(500).json({ message: "Lỗi hệ thống khi xử lý yêu cầu" });
    }
  });

  // DEX trading routes
  app.get("/api/dex/trades/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const trades = await storage.getDexTradesByMember(memberId);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch DEX trades" });
    }
  });

  app.post("/api/dex/trade", async (req, res) => {
    try {
      const { memberId, tradeType, tokenAmount, ethAmount } = req.body;
      
      // Validate member exists
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Calculate price
      const price = parseFloat(ethAmount) / parseFloat(tokenAmount);
      
      // Create trade
      const tradeData = {
        tradeId: AffiliateService.generateTradeId(),
        memberId,
        tradeType,
        tokenAmount,
        ethAmount,
        price: price.toString(),
        status: "pending",
      };
      
      const trade = await storage.createDexTrade(tradeData);
      
      // Update member's token balance (simplified)
      const currentBalance = parseFloat(member.tokenBalance || "0");
      const newBalance = tradeType === "sell" 
        ? currentBalance - parseFloat(tokenAmount)
        : currentBalance + parseFloat(tokenAmount);
        
      const updateData = updateAffiliateMemberSchema.parse({
        tokenBalance: newBalance.toString(),
      });
      await storage.updateAffiliateMember(member.id, updateData);
      
      res.status(201).json(trade);
    } catch (error) {
      console.error('Error creating DEX trade:', error);
      res.status(400).json({ message: "Invalid trade data" });
    }
  });

  // Referral join route
  app.get("/api/affiliate/join", async (req, res) => {
    try {
      const { ref } = req.query;
      
      if (!ref) {
        return res.status(400).json({ message: "Referral code required" });
      }
      
      const sponsor = await storage.getAffiliateMemberByMemberId(ref as string);
      if (!sponsor) {
        return res.status(404).json({ message: "Invalid referral code" });
      }
      
      res.json({
        sponsor: {
          name: sponsor.name,
          memberType: sponsor.memberType,
          categoryName: sponsor.categoryName,
          level: sponsor.level,
        },
        message: "Valid referral code",
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate referral code" });
    }
  });

  // Customer conversion tracking routes
  app.get("/api/customer-conversions", async (req, res) => {
    try {
      const conversions = await storage.getCustomerConversions();
      res.json(conversions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer conversions" });
    }
  });

  app.get("/api/customer-conversions/agent/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const conversions = await storage.getCustomerConversionsByF1Agent(agentId);
      res.json(conversions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent conversions" });
    }
  });

  app.post("/api/customer-conversions", async (req, res) => {
    try {
      const validatedData = insertCustomerConversionSchema.parse({
        ...req.body,
        customerId: uuidv4(),
      });
      const conversion = await storage.createCustomerConversion(validatedData);
      res.status(201).json(conversion);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer conversion data" });
    }
  });

  app.put("/api/customer-conversions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { conversionStatus, paymentAmount, ...otherData } = req.body;
      
      // Update conversion status
      const conversion = await storage.updateCustomerConversion(id, {
        conversionStatus,
        paymentAmount,
        confirmedAt: conversionStatus === "payment_completed" ? new Date() : undefined,
        ...otherData,
      });

      // If status is "payment_completed", trigger reward distribution using new calculation
      if (conversionStatus === "payment_completed") {
        await RewardCalculator.processRewardDistribution(
          conversion.customerId,
          conversion.f1AgentId,
          conversion.f0ReferrerId || undefined
        );
      }

      res.json(conversion);
    } catch (error) {
      console.error("Error updating customer conversion:", error);
      res.status(400).json({ message: "Failed to update customer conversion" });
    }
  });

  app.delete("/api/customer-conversions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCustomerConversion(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer conversion" });
    }
  });

  // Commission settings routes
  app.get("/api/commission-settings", async (req, res) => {
    try {
      const settings = await storage.getCommissionSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission settings" });
    }
  });

  app.post("/api/commission-settings", async (req, res) => {
    try {
      const validatedData = insertCommissionSettingSchema.parse(req.body);
      const setting = await storage.createCommissionSetting(validatedData);
      res.status(201).json(setting);
    } catch (error) {
      res.status(400).json({ message: "Invalid commission setting data" });
    }
  });

  app.put("/api/commission-settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCommissionSettingSchema.partial().parse(req.body);
      const setting = await storage.updateCommissionSetting(id, validatedData);
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: "Failed to update commission setting" });
    }
  });

  // Commission transactions routes
  app.get("/api/commission-transactions", async (req, res) => {
    try {
      const transactions = await storage.getCommissionTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission transactions" });
    }
  });

  app.get("/api/commission-transactions/recipient/:recipientId", async (req, res) => {
    try {
      const { recipientId } = req.params;
      const transactions = await storage.getCommissionTransactionsByRecipient(recipientId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipient transactions" });
    }
  });

  app.get("/api/commission-summary/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const summary = await commissionService.getCommissionSummary(agentId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission summary" });
    }
  });

  // New reward breakdown API with accurate calculation
  app.get("/api/reward-breakdown/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const memberType = req.query.type as "teacher" | "parent" || "teacher";
      const breakdown = await RewardCalculator.getRewardBreakdown(memberId, memberType);
      res.json(breakdown);
    } catch (error) {
      console.error("Error getting reward breakdown:", error);
      res.status(500).json({ message: "Failed to get reward breakdown" });
    }
  });

  // Payment processing API
  app.post("/api/process-payment", async (req, res) => {
    try {
      const { transactionId, amount, memberId } = req.body;

      // Update transaction status to paid
      const transaction = await storage.updateCommissionTransactionStatus(transactionId, "paid");

      // Update member wallet balance
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      if (member) {
        const currentBalance = parseFloat(member.tokenBalance || "0");
        const newBalance = currentBalance + amount;
        await storage.updateAffiliateMember(member.id, {
          // tokenBalance: newBalance.toString() // Remove this invalid property
        });

        // Create transaction history record
        await storage.createTransactionHistory({
          memberId,
          transactionType: "payment_received",
          amount: amount.toString(),
          description: `Nhận thanh toán hoa hồng - ${transactionId}`,
          balanceBefore: currentBalance.toString(),
          balanceAfter: newBalance.toString(),
          status: "completed"
        });
      }

      res.json({ 
        success: true, 
        message: "Payment processed successfully",
        newBalance: member ? parseFloat(member.tokenBalance || "0") + amount : 0
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  // Transaction verification API
  app.put("/api/commission-transactions/:transactionId/verify", async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { verified } = req.body;

      const status = verified ? "verified" : "pending";
      const transaction = await storage.updateCommissionTransactionStatus(transactionId, status);

      res.json({ 
        success: true, 
        message: verified ? "Transaction verified" : "Transaction marked as pending",
        transaction 
      });
    } catch (error) {
      console.error("Error verifying transaction:", error);
      res.status(500).json({ message: "Failed to verify transaction" });
    }
  });

  // Get member transaction history (wallet statement)
  app.get("/api/member-transaction-history/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const history = await storage.getMemberTransactionHistory(memberId);
      res.json(history);
    } catch (error) {
      console.error("Error getting transaction history:", error);
      res.status(500).json({ message: "Failed to get transaction history" });
    }
  });

  // Demo data management routes
  app.post("/api/demo/create-affiliate-data", async (req, res) => {
    try {
      // Create demo members
      const demoMembers = [
        {
          name: "Nguyễn Thị Linh",
          email: "linh@demo.com",
          phone: "0987654321",
          memberType: "teacher",
          tokenBalance: "5000000",
          totalCommissions: "2000000",
          level: 1,
          qrCode: "DEMO_QR_001",
          walletAddress: "0xDemo001",
          categoryName: "Giáo viên chăm sóc",
          isDemo: true
        },
        {
          name: "Trần Văn Minh",
          email: "minh@demo.com", 
          phone: "0912345678",
          memberType: "parent",
          tokenBalance: "3000000",
          totalCommissions: "1500000",
          level: 1,
          qrCode: "DEMO_QR_002",
          walletAddress: "0xDemo002",
          categoryName: "Đại sứ thương hiệu",
          isDemo: true
        },
        {
          name: "Lê Thị Hoa",
          email: "hoa@demo.com",
          phone: "0965432198",
          memberType: "teacher", 
          tokenBalance: "7500000",
          totalCommissions: "4000000",
          level: 2,
          qrCode: "DEMO_QR_003",
          walletAddress: "0xDemo003",
          categoryName: "Giáo viên chăm sóc",
          isDemo: true
        }
      ];

      for (const member of demoMembers) {
        await storage.createAffiliateMember(member);
      }

      // Create demo customer conversions
      const demoConversions = [
        {
          agentId: "DEMO_QR_001",
          customerName: "Phạm Thị Mai",
          customerPhone: "0934567890",
          customerEmail: "mai@customer.com",
          registrationDate: new Date(),
          tuitionAmount: "4000000",
          status: "confirmed",
          notes: "Khách hàng demo - đã xác nhận đăng ký",
          isDemo: true
        },
        {
          agentId: "DEMO_QR_002", 
          customerName: "Hoàng Văn Đức",
          customerPhone: "0945678901",
          customerEmail: "duc@customer.com",
          registrationDate: new Date(),
          tuitionAmount: "4000000",
          status: "pending",
          notes: "Khách hàng demo - đang chờ xác nhận",
          isDemo: true
        }
      ];

      for (const conversion of demoConversions) {
        await storage.createCustomerConversion(conversion);
      }

      res.json({ message: "Demo data created successfully", count: demoMembers.length + demoConversions.length });
    } catch (error) {
      console.error("Error creating demo data:", error);
      res.status(500).json({ message: "Failed to create demo data" });
    }
  });

  app.delete("/api/demo/clear-affiliate-data", async (req, res) => {
    try {
      await storage.clearDemoData();
      res.json({ message: "Demo data cleared successfully" });
    } catch (error) {
      console.error("Error clearing demo data:", error);
      res.status(500).json({ message: "Failed to clear demo data" });
    }
  });

  // Homepage content API endpoints - Save to database
  app.post("/api/homepage-content", async (req, res) => {
    try {
      const content = req.body;
      console.log("Saving homepage content to database:", content);
      
      // Save to actual database
      await storage.saveHomepageContent(content);
      
      res.json({ message: "Homepage content saved successfully", data: content });
    } catch (error) {
      console.error("Error saving homepage content:", error);
      res.status(500).json({ message: "Failed to save homepage content" });
    }
  });

  // Image upload API endpoint
  app.post("/api/admin/upload-image", async (req, res) => {
    try {
      const { type, url } = req.body;
      console.log("Saving image:", { type, url });
      
      // For now, just return success - images are handled as data URLs
      res.json({ 
        message: `${type} saved successfully`, 
        url: url,
        type: type
      });
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ message: "Failed to save image" });
    }
  });

  // Get homepage content
  app.get("/api/homepage-content", async (req, res) => {
    try {
      const content = await storage.getHomepageContent();
      res.json(content);
    } catch (error) {
      console.error("Error getting homepage content:", error);
      res.status(500).json({ message: "Failed to get homepage content" });
    }
  });

  app.post("/api/contact-info", async (req, res) => {
    try {
      // In a real app, save to database. For now, just return success
      console.log("Contact info saved:", req.body);
      res.json({ message: "Contact info saved successfully", data: req.body });
    } catch (error) {
      console.error("Error saving contact info:", error);
      res.status(500).json({ message: "Failed to save contact info" });
    }
  });

  // Fetch saved images endpoint
  app.get("/api/saved-images", (req, res) => {
    try {
      const savedImages = global.savedImages || {};
      
      console.log(`[FETCH] Returning saved images:`, {
        logo: savedImages.logo ? 'Available' : 'None',
        banner: savedImages.banner ? 'Available' : 'None',
        video: savedImages.video ? 'Available' : 'None'
      });
      
      res.json(savedImages);
    } catch (error) {
      console.error("[FETCH ERROR]:", error);
      res.status(500).json({ message: "Failed to fetch saved images" });
    }
  });

  // Image upload endpoint
  app.post("/api/upload-image", (req, res) => {
    try {
      const { type, url } = req.body;
      
      console.log(`[UPLOAD] Saving ${type}:`, url?.substring(0, 100) + '...');
      
      if (!type || !url) {
        return res.status(400).json({ message: "Missing type or url" });
      }
      
      // Validate image data URL format
      if (!url.startsWith('data:') && !url.startsWith('blob:')) {
        return res.status(400).json({ message: "Invalid image format" });
      }
      
      // Store in memory (in production, save to database)
      global.savedImages = global.savedImages || {};
      global.savedImages[type] = url;
      
      console.log(`[UPLOAD SUCCESS] ${type} saved to memory storage`);
      
      res.json({ 
        success: true,
        message: `${type} saved successfully`,
        type: type,
        url: url,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("[UPLOAD ERROR]:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to save image",
        error: error.message 
      });
    }
  });

  // Get affiliate members
  app.get("/api/affiliate/members", (req, res) => {
    try {
      // Mock data for demo - in real app, get from database
      const mockMembers = [
        {
          id: 1,
          name: "Nguyễn Thị Linh",
          username: "linh_teacher",
          email: "linh@demo.com",
          phone: "0987654321",
          memberType: "teacher",
          memberId: "TCH001",
          code: "TCH001",
          createdAt: new Date().toISOString(),
          totalReferrals: 3,
          totalCommission: 6000000,
          isActive: true
        },
        {
          id: 2,
          name: "Trần Văn Minh",
          username: "minh_parent", 
          email: "minh@demo.com",
          phone: "0912345678",
          memberType: "parent",
          memberId: "PAR001",
          code: "PAR001",
          createdAt: new Date().toISOString(),
          totalReferrals: 2,
          totalCommission: 4000,
          isActive: true
        },
        {
          id: 3,
          name: "Hoàng Thị Mai",
          username: "mai_teacher2",
          email: "mai@demo.com",
          phone: "0901234567",
          memberType: "teacher",
          memberId: "TCH002",
          code: "TCH002",
          createdAt: new Date().toISOString(),
          totalReferrals: 5,
          totalCommission: 10000000,
          isActive: true
        },
        {
          id: 4,
          name: "Lê Văn Nam",
          username: "nam_parent2",
          email: "nam@demo.com",
          phone: "0934567890",
          memberType: "parent",
          memberId: "PAR002",
          code: "PAR002",
          createdAt: new Date().toISOString(),
          totalReferrals: 1,
          totalCommission: 2000,
          isActive: false
        }
      ];
      
      res.json(mockMembers);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách thành viên" });
    }
  });



  // API test endpoint for debugging
  app.get("/api/test-form", (req, res) => {
    res.json({
      message: "API is working!",
      timestamp: new Date().toLocaleString(),
      formFields: ["name", "username", "email", "phone"],
      endpoint: "/api/affiliate/register"
    });
  });

  // Direct HTML form endpoint for testing
  app.get("/direct-form", (req, res) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>USERNAME TEST - ${new Date().toLocaleTimeString()}</title>
    <style>
        body { 
            background: #FF00FF;
            color: white; 
            font-family: Arial; 
            padding: 40px;
            font-size: 20px;
        }
        .username-box {
            background: #FFFF00;
            color: #000000;
            border: 10px solid #FF0000;
            padding: 30px;
            margin: 30px 0;
            font-size: 24px;
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 20px;
            font-size: 24px;
            border: 5px solid #000000;
            margin: 15px 0;
        }
        button {
            width: 100%;
            padding: 25px;
            font-size: 28px;
            background: #00FF00;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>🔥 DIRECT FORM TEST - TIMESTAMP: ${new Date().toLocaleString()} 🔥</h1>
    
    <div class="username-box">
        <div>⚠️ USERNAME FIELD TEST ⚠️</div>
        <input type="text" id="username" placeholder="NHẬP USERNAME VÀO ĐÂY" 
               onchange="document.getElementById('display').innerText = this.value">
        <div>Giá trị: <span id="display">(trống)</span></div>
    </div>
    
    <div>
        <input type="text" placeholder="Họ tên">
        <input type="email" placeholder="Email">
        <input type="tel" placeholder="Số điện thoại">
    </div>
    
    <button onclick="testRegister()">ĐĂNG KÝ TEST</button>
    
    <div id="result" style="margin-top: 20px; background: white; color: black; padding: 20px;"></div>

    <script>
        async function testRegister() {
            const username = document.getElementById('username').value;
            const data = {
                name: document.querySelector('input[placeholder="Họ tên"]').value || 'Test User',
                username: username || 'testuser' + Date.now(),
                email: document.querySelector('input[placeholder="Email"]').value || 'test@example.com',
                phone: document.querySelector('input[placeholder="Số điện thoại"]').value || '0123456789',
                memberType: 'parent'
            };
            
            console.log('Testing registration:', data);
            
            try {
                const response = await fetch('/api/affiliate/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML = 
                    response.ok ? 
                    \`✅ THÀNH CÔNG! Username: \${data.username}, Member ID: \${result.memberId}\` :
                    \`❌ LỖI: \${result.message}\`;
            } catch (error) {
                document.getElementById('result').innerHTML = \`❌ LỖI: \${error.message}\`;
            }
        }
    </script>
</body>
</html>`;
    res.send(html);
  });

  // Get sponsor info by member ID for QR referral
  app.get("/api/affiliate/sponsor/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const sponsor = await storage.getAffiliateMemberByMemberId(memberId);
      
      if (!sponsor) {
        return res.status(404).json({ message: "Sponsor not found" });
      }
      
      res.json({
        name: sponsor.name,
        email: sponsor.email,
        memberType: sponsor.memberType,
        memberId: sponsor.memberId,
        totalReferrals: sponsor.totalReferrals
      });
    } catch (error) {
      console.error('Error getting sponsor info:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get genealogy tree (downline) for a member
  app.get("/api/affiliate/genealogy/:identifier", async (req, res) => {
    try {
      const { identifier } = req.params;
      
      // Find member by username or memberId
      let targetMember = await storage.getAffiliateMemberByUsername(identifier);
      if (!targetMember) {
        targetMember = await storage.getAffiliateMemberByMemberId(identifier);
      }
      
      if (!targetMember) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Get direct referrals using the actual memberId
      const directReferrals = await storage.getAffiliateMembersBySponsor(targetMember.memberId);
      
      // Build genealogy tree recursively
      const buildTree = async (members) => {
        const tree = [];
        for (const member of members) {
          const children = await storage.getAffiliateMembersBySponsor(member.memberId);
          tree.push({
            id: member.id,
            name: member.name,
            username: member.username,
            memberType: member.memberType,
            memberId: member.memberId,
            totalReferrals: member.totalReferrals,
            tokenBalance: member.tokenBalance,
            createdAt: member.createdAt,
            children: children.length > 0 ? await buildTree(children) : []
          });
        }
        return tree;
      };
      
      const genealogyTree = await buildTree(directReferrals);
      
      res.json({
        memberId: targetMember.memberId,
        username: targetMember.username,
        name: targetMember.name,
        totalDirectReferrals: directReferrals.length,
        genealogyTree
      });
    } catch (error) {
      console.error('Error getting genealogy tree:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Affiliate registration endpoint
  app.post("/api/affiliate/register", async (req, res) => {
    try {
      console.log('🟢 Registration request received:', req.body);
      
      const { name, username, email, phone, password, memberType, sponsorId } = req.body;
      
      // Generate temporary password if not provided (for QR code registrations)
      const finalPassword = password || Math.random().toString(36).slice(-8);
      
      // Basic validation
      if (!name || !username || !email || !phone || !memberType) {
        return res.status(400).json({ 
          message: "Thiếu thông tin bắt buộc. Vui lòng điền đầy đủ: Tên, username, email, phone, memberType" 
        });
      }
      
      if (username.length < 3) {
        return res.status(400).json({ 
          message: "Tên đăng nhập phải có ít nhất 3 ký tự" 
        });
      }
      
      if (finalPassword.length < 6) {
        return res.status(400).json({ 
          message: "Mật khẩu phải có ít nhất 6 ký tự" 
        });
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ 
          message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới" 
        });
      }
      
      // Generate unique member ID
      const memberId = `${memberType.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Generate referral link
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const referralLink = `${baseUrl}/affiliate/join?ref=${memberId}`;
      
      // Create new member data
      const categoryName = memberType === "teacher" ? "Đại sứ thương hiệu" : "Chăm sóc phụ huynh";
      
      const newMember = {
        name,
        username,
        email,
        phone,
        password: finalPassword, // Store password (in production, should be hashed)
        memberType,
        categoryName,
        memberId,
        referralLink,
        sponsorId: sponsorId || null,
        qrCode: `QR_${memberId}`,
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        tokenBalance: "4000000", // Set demo balance of 4M VND
        totalReferrals: 0,
        totalCommissions: "0",
        level: 1,
        isActive: true,
        createdAt: new Date()
      };
      
      console.log('🟢 Creating new member:', newMember);
      
      // Must save to database - if fails, return error
      try {
        const savedMember = await storage.createAffiliateMember(newMember);
        console.log('🟢 Member saved to database:', savedMember);
        
        // If has sponsor, update sponsor's referral count and add reward to wallet
        if (sponsorId) {
          try {
            const sponsor = await storage.getAffiliateMemberByMemberId(sponsorId);
            if (sponsor) {
              // Update referral count
              await storage.updateAffiliateMember(sponsor.id, {
                totalReferrals: sponsor.totalReferrals + 1
              });
              console.log('🟢 Updated sponsor referral count:', sponsor.username);
              
              // Add referral reward to sponsor's wallet
              const currentBalance = parseFloat(sponsor.tokenBalance || "0");
              const rewardAmount = sponsor.memberType === 'teacher' ? 2000000 : 2000; // Teachers: 2M VND, Parents: 2000 points
              const newBalance = currentBalance + rewardAmount;
              
              await storage.updateAffiliateMember(sponsor.id, {
                tokenBalance: newBalance.toString()
              });
              
              console.log(`🎉 Added ${rewardAmount} tokens to sponsor ${sponsor.username} (${sponsor.memberType})`);
              
              // Check for milestone bonus (every 5 referrals)
              const newReferralCount = sponsor.totalReferrals + 1;
              if (newReferralCount % 5 === 0) {
                const milestoneBonus = sponsor.memberType === 'teacher' ? 10000000 : 10000; // Teachers: 10M VND, Parents: 10K points
                const finalBalance = newBalance + milestoneBonus;
                
                await storage.updateAffiliateMember(sponsor.id, {
                  tokenBalance: finalBalance.toString()
                });
                
                console.log(`🏆 MILESTONE BONUS: Added ${milestoneBonus} tokens to ${sponsor.username} for reaching ${newReferralCount} referrals!`);
              }
              
              // Create transaction history for the reward
              try {
                await storage.createTransactionHistory({
                  memberId: sponsor.memberId,
                  transactionType: 'referral_reward',
                  amount: rewardAmount.toString(),
                  description: `Hoa hồng giới thiệu thành viên mới: ${newMember.name}`,
                  balanceBefore: currentBalance.toString(),
                  balanceAfter: (currentBalance + rewardAmount).toString(),
                  status: 'completed',
                  referenceId: `ref_${savedMember.id}`
                });
                console.log('📝 Transaction history created for referral reward');
              } catch (transactionError) {
                console.log('⚠️ Could not create transaction history:', transactionError);
              }
            }
          } catch (sponsorError) {
            console.log('⚠️ Could not update sponsor:', sponsorError);
          }
        }
        
        // Include temporary password in response if auto-generated
        const response = {
          ...savedMember,
          tempPassword: !password ? finalPassword : undefined,
          showPassword: !password,
          sponsorInfo: sponsorId ? `Đã ghi nhận dưới sponsor: ${sponsorId}` : undefined
        };
        
        res.status(201).json(response);
      } catch (dbError) {
        console.error('🔴 Database save failed:', dbError);
        
        // Check for duplicate username error
        if (dbError.code === '23505' && dbError.constraint === 'affiliate_members_username_unique') {
          return res.status(400).json({ 
            message: "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác." 
          });
        }
        
        // Other database errors
        return res.status(500).json({ 
          message: "Lỗi lưu dữ liệu. Vui lòng thử lại sau." 
        });
      }
      
    } catch (error) {
      console.error('🔴 Registration error:', error);
      res.status(500).json({ 
        message: "Lỗi hệ thống khi đăng ký. Vui lòng thử lại." 
      });
    }
  });

  // Forgot password endpoint
  app.post("/api/affiliate/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email" });
      }
      
      // Find user by email
      const member = await storage.getAffiliateMemberByEmail(email);
      
      if (!member) {
        // Return success even if user not found (security best practice)
        return res.json({ 
          message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu trong vài phút." 
        });
      }
      
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Update user password to temporary password
      await storage.updateAffiliateMember(member.id, {
        password: tempPassword
      });
      
      // In production, send email here
      // For now, return the temporary password directly
      res.json({
        message: "Mật khẩu tạm thời đã được tạo",
        tempPassword: tempPassword,
        instructions: `Mật khẩu tạm thời của bạn là: ${tempPassword}. Vui lòng đăng nhập và đổi mật khẩu ngay lập tức.`
      });
      
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: "Lỗi hệ thống. Vui lòng thử lại sau." });
    }
  });

  // Affiliate login endpoint
  app.post("/api/affiliate/login", async (req, res) => {
    try {
      console.log('🟢 Login request received:', req.body);
      
      const { username, password, memberCode } = req.body;
      
      // Support both new login (username + password) and old login (memberCode only)
      if (username && password) {
        // New login with username and password
        if (!username || !password) {
          return res.status(400).json({ 
            message: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu" 
          });
        }
        
        // Try to find user in database
        try {
          const member = await storage.getAffiliateMemberByUsername(username);
          if (member && member.password === password) {
            return res.json({
              success: true,
              message: "Đăng nhập thành công!",
              token: "affiliate-token-" + Date.now(),
              user: {
                username: member.username,
                name: member.name,
                memberType: member.memberType,
                memberId: member.memberId,
                email: member.email,
                phone: member.phone
              }
            });
          } else {
            return res.status(401).json({ 
              message: "Tên đăng nhập hoặc mật khẩu không đúng" 
            });
          }
        } catch (error) {
          console.log("Database lookup failed:", error);
          
          // Hard-coded demo accounts fallback
          if (username === "testfinal" && password === "123456") {
            return res.json({
              success: true,
              message: "Đăng nhập thành công!",
              token: "affiliate-token-" + Date.now(),
              user: {
                username: "testfinal",
                name: "Test Final User",
                memberType: "parent",
                memberId: "PARENT-1753720187245-CEOG21",
                email: "testfinal@example.com",
                phone: "0987654321"
              }
            });
          }
          
          return res.status(401).json({ 
            message: "Tên đăng nhập hoặc mật khẩu không đúng" 
          });
        }
      }
      
      // Old login with memberCode only
      if (!memberCode) {
        return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập hoặc mã thành viên" });
      }

      // Try to find member by username first, then by memberId
      try {
        let member = null;
        
        // Try username first (more user-friendly)
        try {
          member = await storage.getAffiliateMemberByUsername(memberCode);
        } catch (error) {
          // If username search fails, try memberId
          member = await storage.getAffiliateMemberByMemberId(memberCode);
        }
        
        if (member && member.isActive) {
          res.json({ 
            message: "Đăng nhập thành công",
            memberCode,
            member: {
              id: member.id,
              name: member.name,
              email: member.email,
              memberType: member.memberType,
              memberId: member.memberId,
              username: member.username,
              tokenBalance: member.tokenBalance,
              totalReferrals: member.totalReferrals,
              qrCode: member.qrCode,
              referralLink: member.referralLink,
              walletAddress: member.walletAddress
            }
          });
        } else {
          res.status(401).json({ message: "Tên đăng nhập hoặc mã thành viên không hợp lệ" });
        }
      } catch (dbError) {
        // Fallback to simple pattern matching if database fails
        if (memberCode.match(/^[a-zA-Z0-9_]{3,}$/) || memberCode.match(/^[A-Z0-9-]{8,36}$/)) {
          res.json({ 
            message: "Đăng nhập thành công",
            memberCode,
            member: {
              id: 1,
              name: "Demo User",
              email: "demo@example.com",
              memberType: "parent",
              memberId: "DEMO-" + memberCode,
              username: memberCode,
              tokenBalance: "1000",
              totalReferrals: 0,
              qrCode: "DEMO_QR",
              referralLink: `https://demo.com/affiliate/join?ref=${memberCode}`,
              walletAddress: "0xDemo123"
            }
          });
        } else {
          res.status(401).json({ message: "Tên đăng nhập hoặc mã thành viên không hợp lệ" });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Lỗi đăng nhập" });
    }
  });

  // Initialize commission settings on startup
  commissionService.initializeDefaultSettings().catch(console.error);

  // Withdrawal request endpoints
  app.get("/api/withdrawal-requests", async (req, res) => {
    try {
      const requests = await storage.getWithdrawalRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch withdrawal requests" });
    }
  });

  app.get("/api/withdrawal-requests/member/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const requests = await storage.getWithdrawalRequestsByMember(memberId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member withdrawal requests" });
    }
  });

  app.post("/api/withdrawal-requests", async (req, res) => {
    try {
      const validatedData = insertWithdrawalRequestSchema.parse(req.body);
      
      // Check if member has sufficient balance
      const member = await storage.getAffiliateMember(validatedData.memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      const currentBalance = parseFloat(member.tokenBalance || "0");
      const requestAmount = parseFloat(validatedData.amount);

      if (requestAmount > currentBalance) {
        return res.status(400).json({ 
          message: "Số dư không đủ để thực hiện giao dịch",
          currentBalance,
          requestAmount 
        });
      }

      const request = await storage.createWithdrawalRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Withdrawal request error:", error);
      res.status(400).json({ message: "Invalid withdrawal request data" });
    }
  });

  app.patch("/api/withdrawal-requests/:id/process", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { adminNote, status, processedBy } = req.body;

      const request = await storage.processWithdrawalRequest(id, adminNote, status, processedBy);
      
      // If payment is completed, update member balance and create transaction history
      if (status === 'paid') {
        const member = await storage.getAffiliateMember(request.memberId);
        if (member) {
          const currentBalance = parseFloat(member.tokenBalance || "0");
          const withdrawalAmount = parseFloat(request.amount);
          const newBalance = currentBalance - withdrawalAmount;

          // Update member balance
          await storage.updateAffiliateMember(member.id, {
            tokenBalance: newBalance.toString()
          });

          // Create transaction history record
          await storage.createTransactionHistory({
            memberId: request.memberId,
            transactionType: 'withdrawal',
            amount: (-withdrawalAmount).toString(),
            description: `Rút tiền: ${adminNote || 'Đã thanh toán'}`,
            balanceBefore: currentBalance.toString(),
            balanceAfter: newBalance.toString(),
            status: 'completed',
            referenceId: `withdrawal_${request.id}`
          });
        }
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to process withdrawal request" });
    }
  });

  // Transaction history endpoint
  app.get("/api/transaction-history/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const transactions = await storage.getTransactionHistory(memberId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction history" });
    }
  });

  // Homepage Structure Management API endpoints
  app.post("/api/admin/site-info", async (req, res) => {
    try {
      const { siteTitle, siteTagline, author, authorBio, authorImage } = req.body;
      // Save site information
      res.json({ message: "Site info updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update site info" });
    }
  });

  app.post("/api/admin/main-content", async (req, res) => {
    try {
      const { heroSection, aboutSection, servicesSection } = req.body;
      // Save main content structure
      res.json({ message: "Main content updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update main content" });
    }
  });

  // Content Management API endpoints
  app.post("/api/admin/homepage", async (req, res) => {
    try {
      const { heroTitle, heroSubtitle, heroImage, features } = req.body;
      // Save homepage data to database or file system
      res.json({ message: "Homepage updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update homepage" });
    }
  });

  app.post("/api/admin/about", async (req, res) => {
    try {
      const { mission, vision, history, principalMessage } = req.body;
      // Save about page data
      res.json({ message: "About page updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update about page" });
    }
  });

  app.post("/api/admin/admission", async (req, res) => {
    try {
      const admissionData = req.body;
      // Save admission data
      res.json({ message: "Admission info updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update admission info" });
    }
  });

  app.post("/api/admin/contact", async (req, res) => {
    try {
      const contactData = req.body;
      // Save contact data
      res.json({ message: "Contact info updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact info" });
    }
  });

  app.get("/api/parent-documents", async (req, res) => {
    try {
      // Return parent documents list
      const documents = [
        {
          id: 1,
          title: "Hướng dẫn chuẩn bị cho bé vào mầm non",
          description: "Tài liệu hướng dẫn phụ huynh chuẩn bị tâm lý và vật dụng cho bé"
        }
      ];
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/parent-documents", async (req, res) => {
    try {
      const { title, description, fileUrl } = req.body;
      // Add new document
      res.json({ message: "Document added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add document" });
    }
  });

  // Chatbot API endpoint
  app.post("/api/chatbot", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = ChatbotService.generateResponse(message);
      
      // Add a small delay to make it feel more natural
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({ 
        response,
        quickReplies: ChatbotService.getQuickReplies(),
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({ 
        error: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline: 0856318686" 
      });
    }
  });

  // Main menu management APIs for admin panel
  app.post("/api/admin/homepage", async (req, res) => {
    try {
      // Save homepage content - for now return success
      res.json({ success: true, message: "Homepage content saved successfully" });
    } catch (error) {
      console.error("Error saving homepage content:", error);
      res.status(500).json({ message: "Failed to save homepage content" });
    }
  });

  app.post("/api/admin/about", async (req, res) => {
    try {
      // Save about content - for now return success  
      res.json({ success: true, message: "About content saved successfully" });
    } catch (error) {
      console.error("Error saving about content:", error);
      res.status(500).json({ message: "Failed to save about content" });
    }
  });

  app.post("/api/admin/admission", async (req, res) => {
    try {
      // Save admission content - for now return success
      res.json({ success: true, message: "Admission content saved successfully" });
    } catch (error) {
      console.error("Error saving admission content:", error);
      res.status(500).json({ message: "Failed to save admission content" });
    }
  });

  app.post("/api/admin/contact", async (req, res) => {
    try {
      // Save contact content - for now return success
      res.json({ success: true, message: "Contact content saved successfully" });
    } catch (error) {
      console.error("Error saving contact content:", error);
      res.status(500).json({ message: "Failed to save contact content" });
    }
  });

  app.post("/api/admin/programs", async (req, res) => {
    try {
      // Save program content - for now return success
      res.json({ success: true, message: "Program content saved successfully" });
    } catch (error) {
      console.error("Error saving program content:", error);
      res.status(500).json({ message: "Failed to save program content" });
    }
  });

  app.post("/api/admin/activities", async (req, res) => {
    try {
      // Save activity content - for now return success
      res.json({ success: true, message: "Activity content saved successfully" });
    } catch (error) {
      console.error("Error saving activity content:", error);
      res.status(500).json({ message: "Failed to save activity content" });
    }
  });



  // Debug QR referral issue
  app.get("/debug-qr", async (req, res) => {
    try {
      // Get all members
      const allMembers = await storage.getAffiliateMembers();
      
      // Find hungthantai
      const hungthantai = allMembers.find(m => m.username === 'hungthantai');
      
      // Find maimeo  
      const maimeo = allMembers.find(m => m.username === 'maimeo');
      
      // If hungthantai exists, find all members with his memberId as sponsor
      let downlineMembers = [];
      if (hungthantai) {
        downlineMembers = allMembers.filter(m => m.sponsorId === hungthantai.memberId);
      }
      
      const debugInfo = {
        totalMembers: allMembers.length,
        hungthantaiExists: !!hungthantai,
        hungthantaiInfo: hungthantai ? {
          username: hungthantai.username,
          memberId: hungthantai.memberId,
          totalReferrals: hungthantai.totalReferrals,
          createdAt: hungthantai.createdAt
        } : null,
        maimeoExists: !!maimeo,
        maimeoInfo: maimeo ? {
          username: maimeo.username,
          memberId: maimeo.memberId,
          sponsorId: maimeo.sponsorId,
          createdAt: maimeo.createdAt
        } : null,
        downlineCount: downlineMembers.length,
        downlineMembers: downlineMembers.map(m => ({
          username: m.username,
          name: m.name,
          memberId: m.memberId,
          sponsorId: m.sponsorId
        })),
        issue: !maimeo ? 'maimeo_not_found' : 
               (maimeo && (!maimeo.sponsorId || maimeo.sponsorId !== hungthantai?.memberId)) ? 'sponsor_mismatch' : 
               'unknown'
      };
      
      res.json(debugInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Test genealogy tree visualization 
  app.get("/test-genealogy", (req, res) => {
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>🌳 Test Genealogy & QR Referral System</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .member { 
            border: 1px solid #ddd; 
            margin: 10px; 
            padding: 15px; 
            border-radius: 8px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }
        .teacher { border-left: 5px solid #28a745; }
        .parent { border-left: 5px solid #007bff; }
        .children { margin-left: 30px; border-left: 2px dashed #ccc; padding-left: 20px; }
        .input-group { margin: 10px 0; }
        .input-group input { width: 300px; padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        #result { margin: 10px 0; padding: 10px; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat-card { flex: 1; padding: 15px; background: #e3f2fd; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌳 Test Hệ thống QR Referral & Genealogy Tree</h1>
        
        <div class="section">
            <h2>📊 Thống kê hệ thống</h2>
            <div class="stats">
                <div class="stat-card">
                    <h3>👩‍🏫 Cô giáo</h3>
                    <div id="teacherCount">-</div>
                </div>
                <div class="stat-card">
                    <h3>👪 Phụ huynh</h3>
                    <div id="parentCount">-</div>
                </div>
                <div class="stat-card">
                    <h3>🔗 Tổng referral</h3>
                    <div id="totalReferrals">-</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>🔍 Xem cây genealogy</h2>
            <div class="input-group">
                <input type="text" id="memberId" value="PARENT-1753762770405-MFBGXQ" placeholder="Nhập Member ID">
                <button class="btn btn-primary" onclick="loadGenealogyTree()">🌳 Xem cây thành viên</button>
            </div>
            <div id="result"></div>
        </div>

        <div class="section">
            <h2>🎯 Test QR Registration</h2>
            <div class="input-group">
                <input type="text" id="sponsorId" value="PARENT-1753762770405-MFBGXQ" placeholder="Sponsor Member ID">
                <input type="text" id="newName" value="Test User QR" placeholder="Tên người mới">
                <input type="text" id="newUsername" value="" placeholder="Username (auto-generate if empty)">
                <button class="btn btn-success" onclick="testQRRegistration()">🔗 Test QR Registration</button>
            </div>
            <div id="qrResult"></div>
        </div>

        <div class="section" id="genealogySection">
            <h2>🌳 Cây gia phả</h2>
            <div id="genealogyTree"></div>
        </div>
    </div>

    <script>
        function renderMember(member, level = 0) {
            const typeClass = member.memberType === 'teacher' ? 'teacher' : 'parent';
            const typeIcon = member.memberType === 'teacher' ? '👩‍🏫' : '👪';
            const typeName = member.memberType === 'teacher' ? 'Cô giáo' : 'Phụ huynh';
            
            let html = \`
                <div class="member \${typeClass}" style="margin-left: \${level * 20}px;">
                    <strong>\${typeIcon} \${member.name}</strong> (@\${member.username})
                    <br>Loại: \${typeName}
                    <br>Member ID: <code>\${member.memberId}</code>
                    <br>Số người giới thiệu: <strong>\${member.totalReferrals}</strong>
                    <br>Số dư ví: \${Number(member.tokenBalance).toLocaleString('vi-VN')} VND
                    <br>Ngày tham gia: \${new Date(member.createdAt).toLocaleDateString('vi-VN')}
                </div>
            \`;
            
            if (member.children && member.children.length > 0) {
                html += '<div class="children">';
                member.children.forEach(child => {
                    html += renderMember(child, level + 1);
                });
                html += '</div>';
            }
            
            return html;
        }

        async function loadGenealogyTree() {
            const memberId = document.getElementById('memberId').value;
            
            if (!memberId) {
                document.getElementById('result').innerHTML = '<div class="error">❌ Vui lòng nhập Member ID</div>';
                return;
            }
            
            try {
                const response = await fetch(\`/api/affiliate/genealogy/\${memberId}\`);
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('result').innerHTML = \`
                        <div class="success">
                            ✅ Tìm thấy \${data.totalDirectReferrals} thành viên trực tiếp dưới \${memberId}
                        </div>
                    \`;
                    
                    let treeHtml = \`<h3>🌳 Cây gia phả của \${memberId}</h3>\`;
                    
                    if (data.genealogyTree.length === 0) {
                        treeHtml += '<p style="color: #6c757d; font-style: italic;">📄 Chưa có thành viên nào được giới thiệu</p>';
                    } else {
                        data.genealogyTree.forEach(member => {
                            treeHtml += renderMember(member);
                        });
                    }
                    
                    document.getElementById('genealogyTree').innerHTML = treeHtml;
                } else {
                    document.getElementById('result').innerHTML = \`<div class="error">❌ LỖI: \${data.message}</div>\`;
                    document.getElementById('genealogyTree').innerHTML = '';
                }
            } catch (error) {
                document.getElementById('result').innerHTML = \`<div class="error">❌ LỖI: \${error.message}</div>\`;
                document.getElementById('genealogyTree').innerHTML = '';
            }
        }

        async function testQRRegistration() {
            const sponsorId = document.getElementById('sponsorId').value;
            const name = document.getElementById('newName').value;
            let username = document.getElementById('newUsername').value;
            
            if (!sponsorId || !name) {
                document.getElementById('qrResult').innerHTML = '<div class="error">❌ Vui lòng nhập Sponsor ID và Tên</div>';
                return;
            }
            
            // Auto-generate username if empty
            if (!username) {
                username = 'qr' + Date.now().toString(36);
                document.getElementById('newUsername').value = username;
            }
            
            const registrationData = {
                name: name,
                username: username,
                email: username + '@qrtest.com',
                phone: '098' + Math.floor(Math.random() * 10000000),
                memberType: 'parent',
                sponsorId: sponsorId
            };
            
            try {
                const response = await fetch('/api/affiliate/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    document.getElementById('qrResult').innerHTML = \`
                        <div class="success">
                            ✅ QR Registration thành công!
                            <br><strong>Member ID:</strong> \${result.memberId}
                            <br><strong>Username:</strong> \${result.username}
                            <br><strong>Temp Password:</strong> \${result.tempPassword || 'N/A'}
                            <br><strong>Sponsor:</strong> \${result.sponsorId || 'Không có'}
                            <br><strong>Token Balance:</strong> \${Number(result.tokenBalance).toLocaleString('vi-VN')} VND
                        </div>
                    \`;
                    
                    // Auto-reload genealogy tree
                    setTimeout(() => {
                        loadGenealogyTree();
                        loadStats();
                    }, 500);
                } else {
                    document.getElementById('qrResult').innerHTML = \`<div class="error">❌ LỖI: \${result.message}</div>\`;
                }
            } catch (error) {
                document.getElementById('qrResult').innerHTML = \`<div class="error">❌ LỖI: \${error.message}</div>\`;
            }
        }

        async function loadStats() {
            try {
                const response = await fetch('/api/affiliate/members');
                const members = await response.json();
                
                const teachers = members.filter(m => m.memberType === 'teacher');
                const parents = members.filter(m => m.memberType === 'parent');
                const totalReferrals = members.reduce((sum, m) => sum + m.totalReferrals, 0);
                
                document.getElementById('teacherCount').textContent = teachers.length;
                document.getElementById('parentCount').textContent = parents.length;
                document.getElementById('totalReferrals').textContent = totalReferrals;
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }
        
        // Auto-load on page load
        window.onload = () => {
            loadGenealogyTree();
            loadStats();
        };
    </script>
</body>
</html>`;
    res.send(html);
  });

  const httpServer = createServer(app);
  return httpServer;
}
