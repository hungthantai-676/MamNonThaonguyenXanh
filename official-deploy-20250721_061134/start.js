const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for production
app.set('trust proxy', 1);

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Import and register routes
const { registerRoutes } = require('./server/routes.js');

// Initialize server
async function startServer() {
  try {
    const server = await registerRoutes(app);
    
    // Catch all handler for SPA
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Mầm Non Thảo Nguyên Xanh server running on port ${PORT}`);
      console.log(`🌐 Domain: https://mamnonthaonguyenxanh.com`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
    });
    
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}

startServer();
