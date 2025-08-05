import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerWebsiteRoutes } from "./website-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Delegate all website functionality to separate module
  return await registerWebsiteRoutes(app);
}