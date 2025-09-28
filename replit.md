# Student Activity Management System

## Overview

This is a centralized digital platform for Higher Education Institutions (HEIs) to comprehensively track and manage student activities from admission to graduation. The system enables students to record their academic and co-curricular achievements, faculty to verify and approve activities, and administrators to generate reports for institutional analytics. The platform eliminates scattered paperwork by providing a single source of truth for all student activities, certificates, and achievements.

The system is operational with comprehensive sample data featuring realistic student profiles, professional activities, and complete verification workflows. Built for Indian Higher Education Institutions with architecture support for NAAC and NIRF accreditation requirements.

## Current Project Status

### Implemented Features
The Student Activity Management System has the following working capabilities:

**Core Platform Features:**
- Role-based authentication system with three distinct user types: student, faculty, and admin (users are assigned fixed roles based on their institutional position)
- Complete activity lifecycle management from submission through faculty verification to final approval
- Activity portfolio viewing and management with professional formatting
- File upload system supporting certificates and documentation (PDF, JPG, PNG, up to 10MB per file)
- Role-specific dashboards and interfaces for different user types

**Database and Data Management:**
- PostgreSQL database with professional sample data pre-populated
- Seven engineering departments with designated faculty heads
- User management system with role-based access control
- Activity approval workflow with faculty verification and feedback system
- Detailed activity categorization for academic and co-curricular activities

**User Interface and Experience:**
- Modern React-based responsive web application
- Role-specific dashboards for students, faculty, and administrators
- Professional design system using Tailwind CSS and shadcn/ui components
- Real-time data updates and navigation between different sections
- Mobile-responsive design for accessibility across devices

**Analytics and Reporting (Backend Ready):**
- Department-wise activity statistics and performance metrics
- Student engagement tracking and activity completion analytics
- Category-based activity distribution analysis
- Faculty performance metrics and verification statistics

### User Instructions for Working Features

**For Students:**
1. **Upload Activities**: Use the "Upload Achievement" page to submit activities with descriptions and certificate files
2. **Track Status**: Monitor your submitted activities' approval status on the Dashboard
3. **View Portfolio**: Access your verified achievements on the "Digital Portfolio" page
4. **Check Statistics**: View your skill credits and activity counts on the main dashboard

**For Faculty:**
1. **Review Activities**: Access "Pending Approvals" to see activities awaiting verification
2. **Approve/Reject**: Review activity details and certificates, then approve or reject with feedback
3. **Provide Feedback**: Add constructive comments for rejected activities to guide students
4. **Monitor Department**: Track activities from students in your department

**For Administrators:**
1. **View Analytics**: Access comprehensive statistics on the "Analytics & Reports" page
2. **Department Analysis**: Compare performance across different academic departments
3. **Student Monitoring**: Review individual student activity summaries and engagement
4. **Export Data**: Download CSV reports for further analysis

### Features Under Development

**PDF Portfolio Export:**
- ✅ Backend Service: Complete PDF generation service implemented (`/api/students/portfolio.pdf`)
- ⚠️ Frontend Integration: UI button exists but needs connection to backend service
- 📋 Status: Backend ready, frontend integration pending

**NAAC/NIRF Institutional Reporting:**
- ✅ Backend Services: Complete NAAC and NIRF report generation APIs implemented
- ✅ Data Analytics: Comprehensive metrics collection for accreditation requirements
- ⚠️ Frontend Integration: Admin buttons exist but need connection to backend services
- 📋 Status: Backend ready, frontend integration pending

**Advanced Features (Planned):**
- Role-switching functionality for users with multiple institutional roles
- Real-time notification system for activity status updates
- Advanced search and filtering across all activities
- Automated email reports for department heads and administrators

## Sample Data Overview

### Professional Sample Data Structure
The system includes comprehensive professional sample data that demonstrates the platform's capabilities and provides realistic context for testing and demonstration purposes. All sample data reflects authentic Indian Higher Education practices.

### Primary Student Profile: ISHU KUMAR

**Academic Profile:**
- **Full Name:** ISHU KUMAR
- **Roll Number:** 2021CSE001
- **Department:** Computer Science and Engineering (CSE)
- **Current Semester:** 6th Semester
- **CGPA:** 8.75/10.0
- **Email:** ishu.kumar@student.nitdelhi.ac.in

**Activity Portfolio Summary:**
ISHU KUMAR's profile includes 17 documented activities across various categories:

**Academic Excellence (5 Activities):**
- Research paper publication in IEEE Conference on Biomedical Engineering
- Best Paper Award at Technex 2024, IIT BHU
- Google Summer of Code 2023 with Apache Software Foundation
- Technical leadership roles in Computer Science Society
- Programming competition achievements including ACM ICPC participation

**Industry Experience (2 Activities):**
- Software Development Internship at Microsoft India Development Center
- Machine Learning Internship with Flipkart Labs

**Leadership and Social Impact (6 Activities):**
- National Service Scheme (NSS) coordination
- Student mentorship program leadership
- Cultural event organization and management
- Volunteer coordination for Delhi Marathon
- Teaching and digital literacy initiatives

**Professional Development (4 Activities):**
- Deep Learning Specialization from Stanford University (Coursera)
- Cloud computing certifications
- Technical workshop organization and delivery
- Industry conference presentations

### Educational Ecosystem

**Faculty Structure:**
The sample data includes qualified faculty members with appropriate academic titles:
- **Dr. Amit Sharma** - CSE Department Head with research background
- **Prof. Sunita Verma** - Senior CSE Faculty for academic guidance
- **Dr. Rajesh Kumar** - ECE Department expertise
- **Prof. Meera Agarwal** - Mechanical Engineering Department

**Department Organization:**
Seven major engineering departments representing typical Indian technical institutions:
- Computer Science and Engineering (CSE)
- Electronics and Communication Engineering (ECE)
- Mechanical Engineering (ME)
- Civil Engineering (CE)
- Electrical Engineering (EE)
- Information Technology (IT)
- Chemical Engineering (CHE)

**Administrative Structure:**
Professional administrative roles supporting institutional operations:
- Registrar Office for academic administration
- Dean of Student Affairs for student welfare and activities
- Department heads with faculty leadership responsibilities

### Data Quality and Authenticity

**Professional Standards:**
All sample activities include realistic descriptions, proper organization names, and authentic achievement metrics. Activities reference real institutions (IIT BHU, NIT Delhi), legitimate organizations (IEEE, Google, Microsoft), and industry-standard programs (Smart India Hackathon, Google Summer of Code).

**NAAC/NIRF Alignment:**
Activity categories and skill credit assignments align with National Assessment and Accreditation Council (NAAC) criteria and National Institutional Ranking Framework (NIRF) parameters. The data structure supports automated reporting for both accreditation systems.

**Verification Workflow:**
Sample data includes realistic approval patterns with 70% approved activities, 20% pending review, and 10% rejected submissions, reflecting typical institutional verification processes.

## NAAC and NIRF Compliance Framework

### National Assessment and Accreditation Council (NAAC) Alignment

**Criterion-wise Data Collection:**
The platform supports comprehensive data collection aligned with NAAC's seven criteria:

**Criterion 1 - Curricular Aspects:**
- Academic project tracking and documentation
- Research paper publications and conference presentations
- Course completion certificates and professional development activities

**Criterion 2 - Teaching-Learning and Evaluation:**
- Student participation in academic competitions and hackathons
- Peer learning initiatives and mentorship programs
- Industry internship documentation and skill development tracking

**Criterion 3 - Research, Innovations and Extension:**
- Research publication tracking with impact metrics
- Innovation project documentation and patent applications
- Community extension activities and social impact measurement

**Criterion 4 - Infrastructure and Learning Resources:**
- Digital platform utilization analytics
- Technology-enabled learning activity documentation
- Resource utilization tracking for institutional assessment

**Criterion 5 - Student Support and Progression:**
- Comprehensive student activity portfolio management
- Career progression tracking through skill credit accumulation
- Student welfare and support service participation documentation

**Criterion 6 - Governance, Leadership and Management:**
- Faculty involvement in student activity verification
- Institutional governance through structured approval workflows
- Quality assurance mechanisms in activity verification processes

**Criterion 7 - Institutional Values and Best Practices:**
- Environmental sustainability project tracking
- Social responsibility initiative documentation
- Value-based education activity recording and verification

### National Institutional Ranking Framework (NIRF) Parameter Support

**Teaching, Learning & Resources (TLR):**
- Student-teacher engagement through activity mentorship tracking
- Resource utilization documentation for learning enhancement
- Academic performance correlation with co-curricular participation

**Research and Professional Practice (RP):**
- Research publication metrics and citation tracking
- Industry collaboration documentation through internship programs
- Professional development activity verification and impact assessment

**Graduation Outcomes (GO):**
- Comprehensive skill development tracking through credit accumulation
- Employment outcome correlation with activity participation
- Higher education progression monitoring through portfolio analysis

**Outreach and Inclusivity (OI):**
- Community service and social impact activity documentation
- Diversity and inclusion initiative participation tracking
- Regional and national collaboration evidence through competition participation

**Perception (PR):**
- Alumni feedback integration through portfolio sharing
- Employer perception tracking through internship performance
- Peer institution collaboration documentation through inter-collegiate activities

### Automated Compliance Reporting

**Data Aggregation and Analysis:**
The platform automatically aggregates student activity data to generate compliance reports for both NAAC and NIRF submissions. This includes statistical analysis, trend identification, and performance benchmarking.

**Quality Assurance Mechanisms:**
Built-in verification workflows ensure data authenticity and completeness required for accreditation processes. Faculty verification, document validation, and audit trails maintain data integrity standards.

**Export and Documentation:**
Automated report generation in formats required by accreditation bodies, including statistical summaries, trend analyses, and evidence documentation for institutional assessment processes.

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