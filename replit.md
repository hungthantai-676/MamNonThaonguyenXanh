# Mầm Non Thảo Nguyên Xanh - Preschool Website

## Overview
This is a full-stack web application for "Mầm Non Thảo Nguyên Xanh" (Green Meadow Preschool), a Vietnamese preschool. The platform aims to showcase educational programs, manage admissions, share news and activities, and facilitate communication with parents. Key capabilities include content management for educational information, a modern responsive design, and full Vietnamese language support. The project's ambition is to provide a comprehensive and engaging online presence for the preschool.

## User Preferences
- Preferred communication style: Simple, everyday language.
- Testing approach: Prefers direct visual confirmation over technical logs.
- Performance concern: Website loading speed is important for user experience.
- **CRITICAL ARCHITECTURE RULE**: Use only ONE programming language per project to avoid conflicts and optimize hosting costs
- **LANGUAGE PREFERENCE**: React for all future projects - no PHP or mixed language architectures
- **HOSTING OPTIMIZATION**: Lightweight setup for minimal loading times and operational costs

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with custom color scheme
- **UI Components**: Radix UI components with shadcn/ui design system
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Validation**: Zod schemas (shared between frontend and backend)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Project Structure
- `client/`: Frontend React application (components, pages, lib, hooks)
- `server/`: Backend Express application (routes, storage, Vite integration)
- `shared/`: Shared TypeScript types and schemas (e.g., database schema, Zod validation)
- `migrations/`: Database migration files

### Key Components
- **Database Schema**: Users, Articles, Testimonials, Programs, Activities, Admission Forms, Contact Forms.
- **API Endpoints**: Comprehensive CRUD operations for Articles, Testimonials, Programs, Activities, Admission Forms, and Contact Forms.
- **Frontend Pages**: Home, About, Programs, Activities, Parents, Admission, News, Contact.
- **Admin Panel**: Features 10 sections for content management including contact info, media uploads (logo, banner, video), homepage content, about page, parent library, admission info, articles, programs, activities, and media coverage. It also includes an advanced affiliate management system with QR codes, payment tracking, and a detailed dashboard.

### Data Flow
- **Request Flow**: Client `apiRequest` -> Express server -> Zod validation -> Storage layer (Drizzle ORM) -> PostgreSQL -> Response.
- **State Management**: TanStack Query for server state, React Hook Form for form state, React hooks for UI state.

### Deployment Strategy
- **ARCHITECTURE CONVERSION (January 2025)**: Converting from PHP+React hybrid to pure React architecture to resolve affiliate system conflicts
- Supports development (`npm run dev`) and production builds (`npm run build`).
- Utilizes Drizzle Kit for database migrations.
- Environment variables: `DATABASE_URL`, `NODE_ENV`.
- Multiple deployment options including Replit hosting, external hosting with automated sync scripts (e.g., `build-for-hosting.sh`, `deploy-to-hosting.sh`, `sync-to-hosting.js`), and manual/semi-automated/fully automated update workflows.
- **OPTIMIZATION GOAL**: Lightweight hosting for maximum performance and cost efficiency

## External Dependencies

### Runtime Dependencies
- **Database**: Neon PostgreSQL
- **Authentication**: Session-based authentication
- **Validation**: Zod
- **Date Handling**: date-fns
- **Email Automation**: Gmail SMTP (setup pending)
- **AI Chatbot**: Integrated professional customer consultation chatbot
- **Web3 Integration**: Multi-level affiliate system with Web3 wallets and DEX integration

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **Class Variance Authority**: Utility for conditional CSS classes
```