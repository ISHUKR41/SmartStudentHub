# Smart Student Hub

A comprehensive student management platform with Firebase Authentication featuring 12 core sections for managing academic activities.

## Project Overview

Smart Student Hub is a fully responsive web application designed for students to manage their academic life. The platform includes authentication, email verification, and a rich dashboard with multiple sections for different student activities.

## Features Implemented

### Authentication
- **Firebase Authentication** with email/password
- **Email Verification** enforcement - users cannot access dashboard until verified
- **Secure Logout** with proper redirect to signin page
- **Protected Routes** - all dashboard pages require authentication

### Dashboard Sections (12 Total)

1. **Dashboard** - Overview with stats, quick access, recent activities
2. **Schedule** - Class timetable with day/week views
3. **Attendance** - Track attendance with stats and charts
4. **Assignments** - Manage assignments with status tracking
5. **Exams** - Examination schedule and results
6. **Resources** - Study materials, notes, videos, code samples
7. **Events** - Campus events with registration
8. **Notices** - Important announcements and notifications
9. **QR Scanner** - Scan QR codes for attendance/events
10. **Lost & Found** - Report and find lost items
11. **Profile** - User profile management
12. **Settings** - Account and notification preferences

### UI/UX Features

- **Collapsible Sidebar Navigation**
  - Desktop: Expandable/collapsible with toggle button
  - Mobile: Animated drawer with overlay
  - Icons for all navigation items
  - User profile dropdown with quick actions

- **Responsive Design**
  - Fully responsive for all devices (mobile, tablet, desktop, TV, laptop)
  - Adaptive layouts using Tailwind CSS
  - Mobile-first approach

- **Extensive UI Libraries**
  - shadcn/ui components (Cards, Buttons, Dialogs, etc.)
  - Radix UI primitives (Tabs, Dropdown, Avatar, etc.)
  - Framer Motion for animations
  - Recharts for data visualization
  - React Icons for comprehensive icon library
  - CountUp for animated statistics

## Recent Changes (October 1, 2024)

### Completed
1. ✅ Created all 12 feature pages with professional UI
2. ✅ Implemented collapsible sidebar navigation (DashboardLayout)
3. ✅ Fixed routing - all authenticated routes wrapped in DashboardLayout
4. ✅ Fixed logout redirect to navigate to /firebase-signin
5. ✅ Maintained email verification enforcement
6. ✅ Added mobile responsive drawer navigation
7. ✅ Implemented user profile dropdown with logout

### Project Structure

```
client/src/
├── components/
│   ├── layout/
│   │   └── dashboard-layout.tsx    # Main layout with sidebar
│   └── ui/                          # shadcn UI components
├── pages/
│   ├── firebase-signin.tsx          # Login page
│   ├── firebase-signup.tsx          # Registration page
│   ├── email-verification.tsx       # Email verification page
│   ├── dashboard.tsx                # Main dashboard
│   ├── schedule.tsx                 # Class schedule
│   ├── attendance.tsx               # Attendance tracking
│   ├── assignments.tsx              # Assignment management
│   ├── exams.tsx                    # Exam schedule/results
│   ├── resources.tsx                # Study resources
│   ├── events.tsx                   # Campus events
│   ├── notices.tsx                  # Announcements
│   ├── qr-scanner.tsx              # QR code scanner
│   ├── lost-found.tsx              # Lost & Found
│   ├── profile.tsx                  # User profile
│   └── settings.tsx                 # Settings
├── firebase/
│   └── auth.ts                      # Firebase authentication logic
└── App.tsx                          # Main routing configuration

server/
├── index.ts                         # Express server
└── db.ts                           # Database configuration
```

## User Preferences

- **Design Style**: Professional, modern UI with extensive use of libraries
- **Responsiveness**: Must work on all device types (mobile, tablet, desktop, TV, laptop)
- **UI Libraries**: Extensive use of shadcn/ui, Radix UI, Framer Motion, Recharts
- **Authentication**: Firebase Auth with email verification required

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React, React Icons
- **Auth**: Firebase Authentication
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **Backend**: Express.js

## Running the Project

The project runs with a single command:
```bash
npm run dev
```

This starts both:
- Express server (backend) on port 5000
- Vite dev server (frontend) on port 5000 (proxied)

## Known Issues

- Database persistence issues when sharing (documented but not blocking core functionality)
- PostgreSQL connection warnings in development (app continues to work with Firebase Auth)

## Next Steps

- [ ] Test comprehensive login/logout flow with real Firebase account
- [ ] Verify responsive design on physical mobile/tablet devices
- [ ] Add data persistence for student information
- [ ] Implement real QR code scanning functionality
- [ ] Add file upload for resources and assignments
