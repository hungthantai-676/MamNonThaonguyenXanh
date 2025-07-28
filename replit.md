# Mầm Non Thảo Nguyên Xanh - Preschool Website

## Overview

This is a full-stack web application for "Mầm Non Thảo Nguyên Xanh" (Green Meadow Preschool), a Vietnamese preschool website. The application provides a comprehensive platform for showcasing educational programs, managing admissions, sharing news and activities, and connecting with parents. It features a modern, responsive design with Vietnamese language support and educational-focused content management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom color scheme for educational branding
- **UI Components**: Radix UI components with shadcn/ui design system
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Validation**: Zod schemas shared between frontend and backend
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utility functions
│   │   └── hooks/        # Custom React hooks
├── server/           # Backend Express application
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer
│   └── vite.ts       # Vite integration for development
├── shared/           # Shared TypeScript types and schemas
│   └── schema.ts     # Database schema and Zod validation
└── migrations/       # Database migration files
```

## Key Components

### Database Schema
The application uses the following main entities:
- **Users**: Administrative users with authentication
- **Articles**: News articles and announcements with categories
- **Testimonials**: Parent testimonials and reviews
- **Programs**: Educational programs with age ranges and features
- **Activities**: School activities and events
- **Admission Forms**: Student admission applications
- **Contact Forms**: General inquiries and contact submissions

### API Endpoints
- `GET/POST /api/articles` - Article management with category filtering
- `GET/POST /api/testimonials` - Parent testimonials
- `GET/POST /api/programs` - Educational programs
- `GET/POST /api/activities` - School activities
- `POST /api/admission-forms` - Admission applications
- `POST /api/contact-forms` - Contact inquiries

### Frontend Pages
- **Home**: Hero section with features, testimonials, and highlights
- **About**: School history, mission, and team information
- **Programs**: Educational programs by age group
- **Activities**: School events and activities
- **Parents**: Parent resources and downloadable materials
- **Admission**: Enrollment information and application form
- **News**: Articles and announcements with category filtering
- **Contact**: Contact information and inquiry form

## Data Flow

### Request Flow
1. Client makes API requests through the `apiRequest` utility
2. Express server handles requests via route handlers
3. Route handlers validate data using Zod schemas
4. Storage layer interacts with PostgreSQL via Drizzle ORM
5. Response data is returned to client and cached by React Query

### State Management
- Server state is managed by TanStack Query with automatic caching
- Form state is handled by React Hook Form with Zod validation
- UI state is managed locally with React hooks

## External Dependencies

### Development Tools
- **Vite**: Build tool with HMR and TypeScript support
- **ESBuild**: Fast JavaScript bundler for production
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer

### Runtime Dependencies
- **Database**: Neon PostgreSQL with connection pooling
- **Authentication**: Session-based authentication (ready for implementation)
- **Validation**: Zod for runtime type checking
- **Date Handling**: date-fns for date manipulation

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **Class Variance Authority**: Utility for conditional CSS classes

## Deployment Strategy

### Development
- Run `npm run dev` to start development server
- Vite provides hot module replacement for fast development
- Database migrations can be pushed with `npm run db:push`

### Production Build
- `npm run build` creates optimized production build
- Frontend is built to `dist/public/`
- Backend is bundled with esbuild to `dist/`
- `npm start` runs the production server

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment setting (development/production)

### Database Setup
- Uses Drizzle Kit for database migrations
- Schema is defined in `shared/schema.ts`
- Migrations are stored in `./migrations/`

## Admin Panel Features

### Easy Access
- **Access**: Click "Quản trị" in header or footer
- **Login URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`
- Simple client-side authentication for easy access

### Dashboard Features (10 Tabs)
1. **📞 Liên hệ**: Update contact info (phone, email, address, Google Maps)
2. **🖼️ Ảnh/Video**: Upload images and videos directly from device
   - Logo upload with preview
   - Banner upload with preview  
   - Video upload with preview
   - All formats supported, auto-resizing
3. **🏠 Trang chủ**: Edit homepage content
   - Hero section (title, subtitle, background image)
   - Featured highlights and descriptions
   - Direct content editing
4. **ℹ️ Giới thiệu**: Edit about page content
   - School history, mission, vision
   - Teacher team information
   - About images upload
5. **📚 Thư viện**: Parent library management
   - Document upload and management
   - PDF/DOC file support
   - Edit/delete existing documents
6. **🎓 Tuyển sinh**: Admission information editing
   - General admission info
   - Age requirements and deadlines
   - Required documents list
   - Tuition fees for all programs
7. **📰 Bài viết**: Create and edit articles
   - Title, content, category selection
   - Direct image upload from device
   - Edit/delete existing articles
   - Instant publishing
8. **📚 Chương trình**: Programs management
   - Edit program details and tuition
   - Program descriptions and requirements
9. **🎯 Hoạt động**: Activities management
   - Edit activity details and images
   - Date, location, and frequency settings
10. **📺 Báo chí**: Media coverage management
    - Add new media coverage articles
    - Edit existing coverage (outlet, title, date, type, URL)
    - Delete media coverage entries
    - Support for TV, newspaper, online, and radio coverage

### User-Friendly Features
- Drag & drop file upload
- Instant image/video preview
- Emoji icons for easy navigation
- Mobile responsive design
- Vietnamese interface
- One-click save/publish

## Deployment and Hosting

### Production Deployment Options
- **Current**: Running on Replit with full functionality
- **External Hosting**: Complete deployment package ready for independent hosting
- **File Backup**: `website-backup-20250721_060053.tar.gz` contains production-ready build
- **Auto-Sync**: Scripts available for automatic updates from Replit to hosting

### Deployment Files Created
- `build-for-hosting.sh` - Full backup creation script
- `deploy-to-hosting.sh` - Automated deployment to hosting via FTP
- `quick-update.sh` - Fast update script for minor changes
- `sync-to-hosting.js` - Node.js service for webhook-based auto-sync
- `HUONG_DAN_TRIET_KHAI_HOSTING.md` - Complete hosting deployment guide

### Hosting Requirements
- Node.js 18+ runtime environment
- PostgreSQL database (can use existing Neon database)
- SSL certificate for HTTPS
- FTP/SSH access for file uploads
- Port 3000 or hosting-provided port

### Update Workflow Options
1. **Manual**: Run build script → Download → Upload to hosting → Restart
2. **Semi-Auto**: FTP credentials in environment → Run deploy script → Auto-upload
3. **Full Auto**: Webhook setup → One-click deploy from Replit → Auto-restart

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
- July 09, 2025. Added admin authentication system with dashboard
- July 09, 2025. Implemented content management interface
- July 09, 2025. Updated tuition fees to 4,000,000 VND for all programs
- July 09, 2025. Added real business contact information
- July 13, 2025. Added comprehensive edit/delete functionality for articles, programs, activities
- July 13, 2025. Expanded admin panel to 9 tabs including homepage, about page, library, and admission editing
- July 13, 2025. Implemented modal forms for editing all content types with image upload capabilities
- July 13, 2025. Added media coverage management system with new database table and API endpoints
- July 13, 2025. Implemented "Báo chí nói về chúng tôi" section with full CRUD operations in admin panel
- July 13, 2025. Updated news page to dynamically load media coverage from API instead of static data
- July 13, 2025. RESOLVED: Fixed critical routing and navigation issues - all Link components now work correctly
- July 13, 2025. TESTED: JavaScript functionality, navigation, and API endpoints confirmed working
- July 13, 2025. OPTIMIZED: Added database query limits and caching headers for improved performance
- July 13, 2025. CONFIRMED: News article links and detail pages functioning properly with logging
- July 13, 2025. IMPLEMENTED: Complete social media management system with Facebook, YouTube, Instagram integration
- July 13, 2025. ENHANCED: Media coverage section with clickable links to original articles and improved admin management
- July 13, 2025. IMPLEMENTED: Gmail SMTP email automation system with detailed setup guides
- July 13, 2025. PAUSED: Email setup postponed - user will continue tomorrow with Gmail App Password setup
- July 13, 2025. STARTED: Multi-level affiliate system with QR codes, Web3 wallets, and DEX integration
- July 16, 2025. COMPLETED: Multi-level affiliate system with full backend services, API endpoints, and frontend interface
- July 16, 2025. IMPLEMENTED: AI Chatbot system with professional customer consultation capabilities
- July 16, 2025. POSITIONED: Chatbot at 2/3 screen height and right corner for optimal user experience
- July 21, 2025. COMPLETED: F1 agent customer conversion tracking with 3-color status system and automatic commission distribution
- July 21, 2025. IMPLEMENTED: Complete hosting deployment system with automated sync capabilities and production-ready backup files
- July 26, 2025. UPDATED: Affiliate reward system - New members start with 0 balance, rewards only added upon confirmed conversion
- July 26, 2025. ENHANCED: Admin referral management with manual confirmation system to prevent premature reward distribution
- July 26, 2025. IMPLEMENTED: Advanced 3-stage payment confirmation system with color-coded status tracking (yellow=pending, green=confirmed, blue=paid)
- July 26, 2025. ADDED: Complete payment workflow automation with wallet management and transaction logging
- July 26, 2025. CREATED: Comprehensive payment management admin panel with batch processing and detailed reporting features
- July 26, 2025. FINALIZED: Complete admin affiliate system with 8 specialized modules (overview, conversions, members, payments, referrals, genealogy, transactions, settings)
- July 26, 2025. PERFECTED: Admin dashboard now includes visual tree genealogy, detailed transaction history, configurable reward settings, and comprehensive filtering capabilities
- July 26, 2025. IMPLEMENTED: Advanced tooltip guide system for admin affiliate management with interactive tour, contextual help, and comprehensive member hide/show functionality
- July 26, 2025. CLEANED: Removed Demo Test tab from member affiliate page, kept genealogy tree system and all original functionality intact
- July 26, 2025. FIXED: Admin dashboard authentication persistence (8-hour sessions), homepage save functionality, clear upload destinations with previews
- July 26, 2025. RESOLVED: Fixed critical routing issues - Activities and Contact pages now display separate content correctly
- July 26, 2025. ENHANCED: Main Menu Manager completely redesigned with simplified grid layout replacing complex nested tabs
- July 26, 2025. IMPROVED: All admin panels now include "Quay lại Dashboard" navigation buttons for better user experience
- July 26, 2025. IMPLEMENTED: Functional Edit buttons in Main Menu Manager that navigate to Dashboard with localStorage tracking for specific items
- July 26, 2025. OPTIMIZED: Main Menu Manager now shows preview of all content (articles, programs, activities) with working edit/delete functionality
- July 28, 2025. IMPLEMENTED: Homepage content database persistence - admin dashboard now saves/loads hero and features content from database instead of console logging
- July 28, 2025. UPDATED: Hero section layout redesigned with split-screen approach - image in upper half, text content in lower solid background for better readability
- July 28, 2025. ENHANCED: Call-to-action "ĐĂNG KÝ NGAY" button redesigned with bright green color, emoji icons, and hover effects to encourage user registration
- July 28, 2025. ONGOING: Username field visibility issue in affiliate registration form - created test page /test-username for debugging browser cache issues
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Testing approach: Prefers direct visual confirmation over technical logs.
Performance concern: Website loading speed is important for user experience.
```