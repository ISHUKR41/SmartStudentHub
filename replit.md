# Student Activity Management System

## Overview
This project is a centralized digital platform for Higher Education Institutions (HEIs) to track and manage student activities from admission to graduation. It enables students to record achievements, faculty to verify activities, and administrators to generate reports for institutional analytics. The system aims to eliminate scattered paperwork, providing a single source of truth for all student activities, certificates, and achievements, with a focus on supporting NAAC and NIRF accreditation requirements for Indian HEIs.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The system uses a modern, responsive React-based web application with a professional design system. It leverages Tailwind CSS and shadcn/ui components for a consistent look and feel, providing role-specific dashboards for students, faculty, and administrators, and ensuring mobile responsiveness.

### Technical Implementations
- **Frontend**: Built with React 18 and TypeScript, using Wouter for routing, React Hook Form with Zod for form handling, TanStack Query for server state management, and Vite for building. It follows role-based routing and atomic design principles.
- **Backend**: A Node.js/Express server with TypeScript, implementing a RESTful API design, role-based access control, file upload handling with Multer, and session-based authentication using `express-session`. It follows the Repository pattern.
- **Database**: PostgreSQL is used as the primary database, managed with Drizzle ORM for type-safe operations and migrations, hosted on Neon Database. It features a normalized schema with audit trails and session storage.
- **Authentication**: Integrates Replit Auth using OpenID Connect (OIDC) and Passport.js, providing session management with PostgreSQL storage and role-based authorization for student, faculty, and admin roles. Automatic user provisioning is handled via Replit identity claims.
- **File Management**: Supports local file system storage for document uploads, with validation for PDF, JPG, and PNG formats, file size limitations, and secure serving with path traversal protection.
- **State Management**: Frontend state is managed using React Query for server state, React Hook Form for form state, React Context for authentication, and local component state for UI interactions.
- **Deployment**: Configured for Replit, using Vite for frontend development and esbuild for server compilation, with environment variable management.

### Feature Specifications
- **Core Platform**: Role-based authentication (student, faculty, admin), comprehensive activity lifecycle management (submission, verification, approval), activity portfolio viewing, and file upload system for certificates.
- **Data Management**: Pre-populated PostgreSQL database with sample data including departments, faculty, and user roles. Activity approval workflow with feedback system and detailed categorization.
- **Analytics & Reporting (Backend Ready)**: Department-wise statistics, student engagement tracking, category-based activity distribution, and faculty performance metrics. Backend services for PDF portfolio export, NAAC, and NIRF report generation are implemented, with frontend integration pending.
- **Compliance Framework**: Supports NAAC criteria (Curricular Aspects, Teaching-Learning, Research, Infrastructure, Student Support, Governance, Institutional Values) and NIRF parameters (TLR, RP, GO, OI, PR) through specific data collection and automated reporting capabilities.

## External Dependencies

- **Database Service**: Neon PostgreSQL (serverless PostgreSQL hosting).
- **Authentication Provider**: Replit Auth (OpenID Connect for user identity).
- **UI Component Library**: shadcn/ui (React components built on Radix UI).
- **Core Libraries**: Drizzle ORM, TanStack Query, React Hook Form, Zod, Multer, Express Session.