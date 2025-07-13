import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertArticleSchema, insertTestimonialSchema, insertProgramSchema, 
  insertActivitySchema, insertAdmissionFormSchema, insertContactFormSchema,
  insertAdmissionStepSchema, insertMediaCoverSchema, insertSocialMediaLinkSchema
} from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
