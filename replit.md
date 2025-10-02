# Smart Student Hub - Educational Management Platform

## 📚 Project Overview
A comprehensive educational management platform for tracking student achievements, activities, attendance, and academic progress. Built with React, TypeScript, Express, PostgreSQL, and Firebase Authentication.

## 🎯 Current Status (October 2, 2025)

### ✅ Completed Features
- **Authentication System**: Firebase authentication with mandatory email verification
- **Dashboard**: Animated statistics cards, Recharts visualizations (Area/Bar/Pie charts), upcoming classes
- **Attendance**: Comprehensive tracking with statistics, charts, monthly trends, subject-wise analysis
- **Schedule**: Day-by-day class schedule with add/edit/delete functionality
- **Responsive Sidebar**: Collapsible sections using Accordion, mobile hamburger menu, auto-collapse
- **Logout Fix**: Properly redirects to /firebase-signin (previously caused 404 error)

### 🔧 In Progress
- Database persistence configuration
- Enhanced page features (QR scanning, file uploads, PDF export)
- Advanced analytics with ECharts

### 📦 Installed Libraries & Technologies
**Frontend:**
- React + TypeScript + Vite
- Recharts (visualizations), ECharts (advanced charts)
- Framer Motion (animations), CountUp (number animations)
- Shadcn UI, Radix UI, Tailwind CSS
- React Hook Form, Zod validation
- React Query (data fetching)
- React Dropzone, QRCode.react, React Big Calendar
- Wouter (routing)

**Backend:**
- Express.js, TypeScript
- Drizzle ORM, PostgreSQL
- Firebase Admin SDK
- Passport.js authentication

## ⚠️ CRITICAL: Database Persistence Issue

### Problem
The `DATABASE_URL` environment variable is currently **empty**, causing the application to use **in-memory storage**. This means:
- ❌ All data is lost when the app restarts
- ❌ Data doesn't persist when sharing the repl
- ❌ Cannot be used in production

### Solution
1. **Check if PostgreSQL is provisioned:**
   - Open Replit Secrets tab
   - Look for database-related environment variables

2. **If database exists but env vars are missing:**
   - The DATABASE_URL should be auto-populated by Replit
   - Try restarting the repl
   - Check Replit database tab

3. **If no database:**
   - Replit provides built-in PostgreSQL (Neon-backed)
   - The database should already be available based on project status
   - Contact Replit support if env vars are not populating

### How the Code Handles This
The application gracefully falls back to in-memory storage when DATABASE_URL is missing:
- Located in: `server/db.ts`
- Uses MemStorage when db is null
- All CRUD operations work, but data is temporary

### To Verify Database Connection
```bash
echo $DATABASE_URL
# Should output: postgres://...connection string
```

If empty, check other variables:
```bash
echo $PGHOST $PGUSER $PGDATABASE
```

## 🏗️ Architecture

### Data Flow
1. **Frontend** (React/TypeScript) → Uses React Query for data fetching
2. **API Routes** (`server/routes.ts`) → Validates with Zod schemas
3. **Storage Interface** (`server/storage.ts`) → Abstracts data operations
4. **Database** (PostgreSQL via Drizzle ORM) or MemStorage (fallback)

### Database Schema
Located in: `shared/schema.ts`
- Uses Drizzle ORM for type-safe database operations
- Includes Zod schemas for validation
- Models: Users, Students, Activities, Attendance, Assignments, Exams, etc.

### File Structure
```
client/
  src/
    components/ - Reusable UI components
    pages/ - Route pages
    firebase/ - Firebase auth config
    hooks/ - Custom React hooks
    lib/ - Utilities and helpers
server/
  routes.ts - API endpoints
  storage.ts - Data access layer
  db.ts - Database connection
shared/
  schema.ts - Shared types and schemas
```

## 🚀 Running the Project
- Command: `npm run dev`
- Frontend: Vite dev server (auto-configured)
- Backend: Express server
- Port: 5000 (both frontend and backend)

## 🎨 UI/UX Design Principles
- **Responsive**: Works on mobile, tablet, desktop, TV
- **Dark Mode**: Fully supported with explicit light/dark variants
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts and ECharts for data visualization
- **Professional**: Shadcn UI components with Tailwind CSS

## 📱 Pages Overview

### Core Features
- **Dashboard**: Overview with statistics and charts
- **Schedule**: Class timetable with day-by-day view
- **Attendance**: Comprehensive tracking with analytics
- **Assignments**: File upload and submission tracking
- **Exams**: Schedule and results management
- **Grades**: Performance tracking

### Additional Features
- **Resources**: Study materials and documents
- **Events**: Campus events with RSVP
- **Notices**: Announcements and notifications
- **QR Scanner**: Attendance marking via QR codes
- **Lost & Found**: Item reporting with images
- **Alumni**: Networking and profiles

### Advanced Features
- **Activity Tracker**: Extra-curricular activities with faculty approval
- **Digital Portfolio**: Comprehensive student portfolio with PDF export
- **Analytics**: Advanced analytics with multiple chart types
- **Faculty Approvals**: Workflow management

## 🔐 Security
- Firebase authentication with email verification required
- Protected routes with auth checks
- Session management with Express sessions
- Environment variables for sensitive data

## 📊 NAAC/NIRF Metrics Support
The system tracks institutional metrics required for:
- Student achievement data
- Activity participation rates
- Attendance statistics
- Academic performance metrics
- Faculty approval workflows

## 🐛 Known Issues
1. **DATABASE_URL not set** - See Database Persistence Issue section above
2. **LSP errors in server/routes.ts** - 86 TypeScript errors (not blocking functionality)
   - Missing storage methods
   - Type safety issues
   - Implicit 'any' types

## 📝 User Preferences
- **Libraries**: Use extensive UI libraries for professional appearance
- **Responsiveness**: Must work on all devices including TV
- **Features**: Comprehensive feature set with approval workflows
- **Design**: Professional, modern, animated

## 🔄 Recent Changes (October 2, 2025)
- Fixed logout routing bug (now redirects to /firebase-signin)
- Enhanced Dashboard with animations and charts
- Added packages: react-dropzone, qrcode.react, react-big-calendar, qr-scanner
- Improved sidebar responsiveness with mobile menu

## 📞 Support
For database connection issues:
1. Check Replit database tab
2. Verify environment variables in Secrets
3. Restart the repl
4. Contact Replit support if issues persist

## 🎯 Next Steps
1. Resolve DATABASE_URL configuration
2. Enhance remaining pages with advanced features
3. Fix TypeScript errors in server/routes.ts
4. Add QR code scanning functionality
5. Implement PDF export for portfolio
6. Add file upload with drag-and-drop
7. Deploy to production when database is configured
