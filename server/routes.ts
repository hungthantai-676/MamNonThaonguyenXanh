import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertArticleSchema, insertTestimonialSchema, insertProgramSchema, 
  insertActivitySchema, insertAdmissionFormSchema, insertContactFormSchema,
  insertAdmissionStepSchema, insertMediaCoverSchema, insertSocialMediaLinkSchema,
  insertServiceRegistrationSchema, insertAffiliateMemberSchema, updateAffiliateMemberSchema
} from "@shared/schema";
import { notificationService } from "./notifications";
import { sendTestEmail } from "./email";
import AffiliateService from "./affiliate";
import { ChatbotService } from "./chatbot";

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

  app.post("/api/affiliate/register", async (req, res) => {
    try {
      // First parse with just the basic fields (without categoryName)
      const basicData = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        memberType: z.enum(["teacher", "parent"]),
        sponsorId: z.string().optional(),
      }).parse(req.body);
      
      const { name, email, phone, memberType, sponsorId } = basicData;
      
      // Calculate category name from member type
      const categoryName = memberType === "teacher" 
        ? "Chăm sóc phụ huynh" 
        : "Đại sứ thương hiệu";
      
      // Check if email already exists
      const existingMember = await storage.getAffiliateMemberByEmail(email);
      if (existingMember) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Generate unique member ID
      const memberId = AffiliateService.generateMemberId();
      
      // Create Web3 wallet
      const wallet = await AffiliateService.createWallet();
      
      // Get sponsor if provided
      let sponsor = null;
      if (sponsorId) {
        sponsor = await storage.getAffiliateMemberByMemberId(sponsorId);
      }
      
      // Calculate level
      const level = AffiliateService.calculateMemberLevel(sponsor || null);
      
      // Generate referral link
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const referralLink = AffiliateService.generateReferralLink(memberId, baseUrl);
      
      // Generate QR code
      const qrCode = await AffiliateService.generateQRCode(referralLink);
      
      // Encrypt private key
      const encryptedPrivateKey = AffiliateService.encryptPrivateKey(wallet.privateKey);
      
      // Create member
      const memberData = {
        memberId,
        name,
        email,
        phone,
        memberType,
        categoryName,
        sponsorId,
        qrCode,
        referralLink,
        walletAddress: wallet.address,
        privateKey: encryptedPrivateKey,
        level,
        tokenBalance: "1000", // Welcome bonus
        totalReferrals: 0,
        isActive: true,
      };
      
      const member = await storage.createAffiliateMember(memberData);
      
      // Update sponsor's referral count
      if (sponsor && sponsor.totalReferrals !== null) {
        const updateData = updateAffiliateMemberSchema.parse({
          totalReferrals: sponsor.totalReferrals + 1,
        });
        await storage.updateAffiliateMember(sponsor.id, updateData);
      }
      
      res.status(201).json(member);
    } catch (error) {
      console.error('Error registering affiliate member:', error);
      res.status(400).json({ message: "Invalid affiliate member data" });
    }
  });

  app.get("/api/affiliate/tree/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Get all referrals (children)
      const children = await storage.getAffiliateMembersBySponsor(memberId);
      
      // Build tree structure
      const tree = {
        ...member,
        children: children.map(child => ({
          ...child,
          children: [], // Can be expanded for deeper levels
        })),
      };
      
      res.json(tree);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate tree" });
    }
  });

  app.get("/api/affiliate/transactions/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const transactions = await storage.getAffiliateTransactionsByMember(memberId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate transactions" });
    }
  });

  app.get("/api/affiliate/rewards/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const rewards = await storage.getAffiliateRewardsByMember(memberId);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate rewards" });
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

  const httpServer = createServer(app);
  return httpServer;
}
