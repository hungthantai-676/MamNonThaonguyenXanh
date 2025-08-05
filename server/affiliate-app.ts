import express, { type Request, Response, NextFunction } from "express";
import { registerAffiliateRoutes } from "./affiliate-routes";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";

// Create separate Express app for Affiliate system
const affiliateApp = express();

// Configure middleware for affiliate app
affiliateApp.use(express.json({ limit: '50mb' }));
affiliateApp.use(express.urlencoded({ extended: false, limit: '50mb' }));
affiliateApp.use(cookieParser());

// Configure session middleware for affiliate
affiliateApp.use(session({
  secret: process.env.AFFILIATE_SESSION_SECRET || 'affiliate-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Logging middleware for affiliate requests
affiliateApp.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `[AFFILIATE] ${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Register affiliate routes
registerAffiliateRoutes(affiliateApp);

// Serve affiliate static files
affiliateApp.use('/affiliate-assets', express.static(path.join(process.cwd(), 'public', 'affiliate')));

// Affiliate error handling
affiliateApp.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Affiliate System Error";

  res.status(status).json({ message });
  console.error('[AFFILIATE ERROR]', err);
});

// Health check for affiliate system
affiliateApp.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'affiliate-system',
    timestamp: new Date().toISOString()
  });
});

export { affiliateApp };

// Start affiliate server on different port
const affiliatePort = 5001;
export function startAffiliateServer() {
  affiliateApp.listen(affiliatePort, '0.0.0.0', () => {
    console.log(`[AFFILIATE SERVER] Running on port ${affiliatePort}`);
  });
}