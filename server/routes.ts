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