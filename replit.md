# Smart Student Hub - Complete Educational Platform

## Overview
A comprehensive digital platform for educational institutions to manage student activities, attendance, assignments, exams, resources, events, and more. This system provides a centralized hub for students to track their academic journey with features like schedule management, QR code attendance, lost & found, and digital portfolios.

## Recent Changes (October 1, 2025)
Major rebuild in progress to create a focused, professional student hub with:
- Clean architecture with only essential pages
- Firebase authentication with mandatory email verification
- Collapsible sidebar navigation
- 12 core features: Dashboard, Schedule, Attendance, Assignments, Exams, Resources, Events, Notices, QR Scanner, Lost & Found, Profile, Settings
- In-memory storage to ensure data persistence when shared
- Fully responsive design for all devices
- Modern UI with extensive library usage (Framer Motion, React Hook Form, TanStack Query, etc.)

## User Preferences
Preferred communication style: Simple, everyday language
Storage preference: In-memory storage (no database) for easy sharing and deployment

## System Architecture

### UI/UX Decisions
The system uses a modern, responsive React-based web application with a professional design system. It leverages Tailwind CSS and shadcn/ui components for a consistent look and feel, providing role-specific dashboards for students, faculty, and administrators, and ensuring mobile responsiveness.

### Technical Implementations
- **Frontend**: Built with React 18 and TypeScript, using Wouter for routing, React Hook Form with Zod for form handling, TanStack Query for server state management, and Vite for building. It follows role-based routing and atomic design principles.
- **Backend**: A Node.js/Express server with TypeScript, implementing a RESTful API design, role-based access control, file upload handling with Multer, and session-based authentication using `express-session`. It follows the Repository pattern.
- **Database**: PostgreSQL is used as the primary database, managed with Drizzle ORM for type-safe operations and migrations, hosted on Neon Database. It features a normalized schema with audit trails and session storage.
- **Authentication**: Dual authentication system supporting both Firebase Authentication and Replit Auth. Firebase Auth (primary) provides email/password authentication with email verification, professional signin/signup pages with glassmorphism design, and optional Firestore integration. Replit Auth (legacy) uses OpenID Connect (OIDC) and Passport.js. Both systems support session management and role-based authorization for student, faculty, and admin roles.
- **File Management**: Supports local file system storage for document uploads, with validation for PDF, JPG, and PNG formats, file size limitations, and secure serving with path traversal protection.
- **State Management**: Frontend state is managed using React Query for server state, React Hook Form for form state, React Context for authentication, and local component state for UI interactions.
- **Deployment**: Configured for Replit, using Vite for frontend development and esbuild for server compilation, with environment variable management.

### Feature Specifications
- **Core Platform**: Role-based authentication (student, faculty, admin), comprehensive activity lifecycle management (submission, verification, approval), activity portfolio viewing, and file upload system for certificates.
- **Data Management**: Pre-populated PostgreSQL database with sample data including departments, faculty, and user roles. Activity approval workflow with feedback system and detailed categorization.
- **Analytics & Reporting (Backend Ready)**: Department-wise statistics, student engagement tracking, category-based activity distribution, and faculty performance metrics. Backend services for PDF portfolio export, NAAC, and NIRF report generation are implemented, with frontend integration pending.
- **Compliance Framework**: Supports NAAC criteria (Curricular Aspects, Teaching-Learning, Research, Infrastructure, Student Support, Governance, Institutional Values) and NIRF parameters (TLR, RP, GO, OI, PR) through specific data collection and automated reporting capabilities.

## Firebase Authentication

### Implementation
The project now includes a professional Firebase Authentication system with:

**Signin Page** (`/firebase-signin`):
- Email and password authentication with floating labels
- Password visibility toggle
- Forgot password functionality
- Link to signup page
- Professional glassmorphism design with particle animations
- Animated typewriter text on the left panel
- **Advanced Animations**: Staggered entrance animations, magnetic button effect (follows cursor), ripple click effects, animated gradient borders on focus, smooth icon animations, floating stats cards, sweeping glow effects, animated gradient backgrounds, spring transitions, shimmer loading effect

**Signup Page** (`/firebase-signup`):
- All required fields: First Name, Last Name, College Name, Registration Number, Email, Password, Confirm Password
- Password strength validation (minimum 8 characters, uppercase, lowercase, number, special character) with animated progress bar
- Real-time password requirements validation with checkmark animations
- Password confirmation validation
- Professional glassmorphism design with particle animations
- Animated typewriter text on the left panel
- **Advanced Animations**: All signin page animations plus animated password strength meter, staggered validation feedback, success confetti animation, progressive form revelation with scroll animations, individual requirement checkmarks with scale effects

**Configuration**:
Firebase configuration is defined in `client/src/firebase/config.ts`:
```javascript
{
  apiKey: "AIzaSyC3GQbY14MlwzLC2hiZcwdK73qlu4lNifo",
  authDomain: "smart-student-hub-75.firebaseapp.com",
  projectId: "smart-student-hub-75",
  storageBucket: "smart-student-hub-75.firebasestorage.app",
  messagingSenderId: "77366186543",
  appId: "1:77366186543:web:a05fb48a11addde782acda"
}
```

**Environment Variables**:
- `VITE_ENABLE_FIRESTORE=true` - Enable Firestore integration (default: disabled)

**Firebase Project Setup**:
1. Enable Email/Password authentication in Firebase Console → Authentication → Sign-in method
2. Add authorized domains in Firebase Console → Authentication → Settings
3. Firestore is optional - authentication works with Firebase Auth only

**Dual Authentication System**:
- **Firebase Auth** (Primary): Used for `/firebase-signin` and `/firebase-signup` routes. Handles email/password authentication with email verification.
- **Replit Auth** (Legacy): Used for `/login` and `/signup` routes. Handles OpenID Connect authentication.
- Both systems can coexist. Users authenticate through either system independently.
- Auth state is managed via `useAuth()` hook with 3-second timeout fallback

### Known Issues
1. **Landing Page Loading**: The root landing page (`/`) may show a loading state. Users can access authentication pages directly at `/firebase-signin` and `/firebase-signup`.
2. **Dashboard Chart Warnings**: StudentDashboard has some chart data warnings (not auth-related, does not affect functionality).
3. **Firestore Optional**: Firestore is disabled to prevent AbortError connection issues. Authentication works perfectly with Firebase Auth only.

### Recent Fixes (September 30, 2025)
- ✅ **Updated Firebase Configuration**: Corrected appId to match actual Firebase project credentials
- ✅ **Fixed Routing Issues**: Corrected signup page redirect from `/signin` to `/firebase-signin`
- ✅ **Fixed Regex Patterns**: Fixed double backslash issues in signup validation patterns for name and password fields
- ✅ **Verified All Routes**: Confirmed all authentication routes are working correctly
- ✅ **Fixed signup.tsx Link**: Updated signin link from `/signin` to `/firebase-signin` for proper navigation
- ✅ Fixed duplicate Firebase initialization
- ✅ Corrected invalid appId format
- ✅ Made Firestore optional to prevent connection errors
- ✅ Fixed missing TypeScript types (@types/zxcvbn)
- ✅ Fixed critical React errors (Activity, VictoryPolarAxis, Lightbulb imports)
- ✅ Added safety timeout to useAuth hook

## External Dependencies

- **Database Service**: Neon PostgreSQL (serverless PostgreSQL hosting).
- **Authentication Provider**: Firebase Authentication (email/password) and Replit Auth (OpenID Connect).
- **UI Component Library**: shadcn/ui (React components built on Radix UI).
- **Core Libraries**: Drizzle ORM, TanStack Query, React Hook Form, Zod, Multer, Express Session, Firebase SDK.