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

### Authentication
- **Login URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`
- Simple session-based authentication with localStorage token

### Dashboard Features
1. **Cài đặt chung**: Update contact information (phone, email, address, Google Maps)
2. **Bài viết**: Create and manage news articles with categories
3. **Chương trình**: View program details and update tuition fees
4. **Hoạt động**: View and manage school activities

### How to Use Admin Panel
1. Navigate to `/admin/login`
2. Enter credentials: username=`admin`, password=`admin123`
3. Access dashboard to manage content
4. Changes are immediately reflected on the website

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
- July 09, 2025. Added admin authentication system with dashboard
- July 09, 2025. Implemented content management interface
- July 09, 2025. Updated tuition fees to 4,000,000 VND for all programs
- July 09, 2025. Added real business contact information
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```