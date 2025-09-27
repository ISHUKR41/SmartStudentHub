# Student Activity Management System

## Overview

This is a centralized digital platform for Higher Education Institutions (HEIs) to comprehensively track and manage student activities from admission to graduation. The system enables students to record their academic and co-curricular achievements, faculty to verify and approve activities, and administrators to generate reports for NAAC/NIRF compliance. The platform eliminates scattered paperwork by providing a single source of truth for all student activities, certificates, and achievements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based single-page application (SPA) built with:
- **React 18** with TypeScript for type safety and component-based architecture
- **Wouter** for lightweight client-side routing instead of React Router
- **Tailwind CSS** with shadcn/ui component library for consistent design system
- **React Hook Form** with Zod validation for form handling and client-side validation
- **TanStack Query** (React Query) for server state management and API caching
- **Vite** as the build tool for fast development and optimized production builds

The frontend follows a role-based routing pattern with separate dashboards for students, faculty, and administrators. Components are organized using atomic design principles with reusable UI components in the `components/ui` directory.

### Backend Architecture
The server uses a Node.js/Express architecture with:
- **Express.js** server with TypeScript for type-safe API development
- **RESTful API design** with clear endpoint organization in `/api` routes
- **Role-based access control** with middleware for route protection
- **File upload handling** using multer with security restrictions
- **Session-based authentication** using express-session with PostgreSQL storage
- **Error handling middleware** with proper HTTP status codes and logging

The backend follows the Repository pattern with a clean separation between routes, business logic, and data access layers.

### Database Design
Uses **PostgreSQL** as the primary database with:
- **Drizzle ORM** for type-safe database operations and migrations
- **Neon Database** for serverless PostgreSQL hosting with WebSocket support
- **Normalized schema** with proper relationships between users, activities, files, and departments
- **Audit trail** with created/updated timestamps on all entities
- **Session storage** table for authentication state persistence

Key entities include Users (with role-based permissions), Activities (with approval workflow), ActivityFiles (for certificate attachments), and Departments for organizational structure.

### Authentication System
Implements **Replit Auth** integration with:
- **OpenID Connect (OIDC)** for secure authentication flow
- **Passport.js** strategy for authentication middleware
- **Session management** with PostgreSQL storage for scalability
- **Role-based authorization** with student, faculty, and admin roles
- **Automatic user provisioning** from Replit identity claims

### File Management
Handles document uploads with:
- **Local file system storage** with organized directory structure
- **File type validation** restricting uploads to PDF, JPG, and PNG formats
- **File size limitations** to prevent abuse and maintain performance
- **Secure file serving** with proper MIME type handling
- **Path traversal protection** to prevent directory access vulnerabilities

### State Management
Frontend state is managed through:
- **React Query** for server state, caching, and background updates
- **React Hook Form** for form state and validation
- **React Context** for authentication state and user information
- **Local component state** for UI interactions and temporary data

### Deployment Architecture
Configured for Replit deployment with:
- **Development server** using Vite dev server with Express API
- **Production build** process combining Vite frontend build with esbuild server compilation
- **Environment variable management** for database connections and authentication secrets
- **Static file serving** for built frontend assets

## External Dependencies

### Database Service
- **Neon PostgreSQL**: Serverless PostgreSQL database with WebSocket support for real-time features and automatic scaling

### Authentication Provider
- **Replit Auth**: OpenID Connect provider for user authentication and identity management, eliminating need for custom user registration

### UI Component Library
- **shadcn/ui**: Comprehensive React component library built on Radix UI primitives providing accessible, customizable components

### Development Tools
- **Replit-specific plugins**: Development banner, runtime error overlay, and cartographer for enhanced development experience within Replit environment

### Core Libraries
- **Drizzle ORM**: Type-safe database operations and schema management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for both client and server
- **Multer**: File upload handling middleware
- **Express Session**: Session management with PostgreSQL storage