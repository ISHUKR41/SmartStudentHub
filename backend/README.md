# 🎓 Smart Student Hub - Backend API Documentation

## 📋 Overview

Comprehensive backend API for the Smart Student Hub educational platform. Built with Express.js, TypeScript, PostgreSQL, and Drizzle ORM.

## 🏗️ Architecture

```
backend/
├── schema.ts          # Complete database schema (50+ tables)
├── db.ts             # Database connection configuration
├── routes.ts         # RESTful API endpoints (150+ routes)
├── index.ts          # Express server entry point
├── types.ts          # TypeScript type definitions
├── middleware.ts     # Custom middleware functions
└── utils.ts          # Helper utilities
```

## 🚀 Features

### ✅ Complete Feature Coverage

- **Authentication & Authorization**: Role-based access control (Student, Faculty, Admin, Staff)
- **Academic Management**: Courses, Timetable, Grades, Study Materials, Assignments, Exams
- **Financial Management**: Fee Payments, Scholarships, Receipts, Transactions
- **Campus Life**: Library, Hostel, Transportation, Cafeteria, Clubs
- **Career Services**: Placements, Internships, Job Applications
- **Communication**: Events, Notices, Notifications
- **Support**: Grievances, Medical Records, Help Desk
- **Student Development**: Mentorship, Research Projects, Certifications, Skill Assessments
- **Portfolio**: Activities, Goals, Achievements, Digital Portfolio
- **Analytics**: Dashboard Statistics, Reports, Performance Tracking

## 🗄️ Database Schema

### Core Tables (50+)

#### User Management

- `users` - User profiles with role-based access
- `sessions` - Session management

#### Academic

- `courses` - Course catalog
- `course_enrollments` - Student course registrations
- `timetable` - Class schedules
- `grades` - Student marks and grades
- `study_materials` - Course materials and resources
- `assignments` - Assignment details
- `assignment_submissions` - Student submissions
- `exams` - Examination schedule
- `exam_results` - Exam marks
- `attendance` - Attendance records

#### Financial

- `fee_structure` - Fee details by semester/department
- `fee_payments` - Payment records
- `scholarships` - Available scholarships
- `scholarship_applications` - Scholarship applications

#### Campus Life

- `library_books` - Book catalog
- `library_issues` - Book issue/return records
- `hostel_rooms` - Room inventory
- `hostel_allotments` - Student room assignments
- `bus_routes` - Transportation routes
- `cafeteria_menu` - Cafeteria items
- `clubs` - Student clubs/societies
- `club_memberships` - Club membership records

#### Career & Placement

- `placements` - Job opportunities
- `placement_applications` - Job applications
- `internships` - Internship opportunities
- `internship_applications` - Internship applications

#### Communication

- `events` - Campus events
- `event_rsvp` - Event registrations
- `notices` - Important announcements
- `notice_reads` - Notice read tracking
- `notifications` - User notifications
- `lost_found` - Lost & found items

#### Support

- `grievances` - Student complaints/grievances
- `medical_records` - Health records

#### Student Development

- `mentorships` - Mentor-mentee relationships
- `research_projects` - Research work
- `research_participants` - Project team members
- `certifications` - Professional certifications
- `skill_assessments` - Skill evaluation tests
- `assessment_attempts` - Test attempts/scores

#### Portfolio

- `activities` - Co-curricular activities
- `goals` - Personal goals
- `achievements` - Accomplishments
- `alumni` - Alumni directory

## 🔌 API Endpoints

### Authentication & Users

```
GET    /api/users/me              # Get current user profile
PUT    /api/users/me              # Update profile
GET    /api/users/:id             # Get user by ID
GET    /api/users                 # List users (faculty/admin)
```

### Courses

```
GET    /api/courses               # Get all courses
GET    /api/courses/:id           # Get course details
POST   /api/courses               # Create course (faculty)
PUT    /api/courses/:id           # Update course (faculty)
DELETE /api/courses/:id           # Delete course (admin)
```

### Course Enrollments

```
GET    /api/enrollments/me        # Get enrolled courses
POST   /api/enrollments           # Enroll in course
DELETE /api/enrollments/:id       # Drop course
```

### Timetable

```
GET    /api/timetable/me          # Get student's timetable
GET    /api/timetable/course/:id  # Get course schedule
POST   /api/timetable             # Create entry (faculty)
PUT    /api/timetable/:id         # Update entry (faculty)
DELETE /api/timetable/:id         # Delete entry (faculty)
```

### Grades

```
GET    /api/grades/me             # Get student's grades
GET    /api/grades/semester/:sem  # Get semester grades
GET    /api/grades/cgpa           # Get CGPA
POST   /api/grades                # Add grade (faculty)
PUT    /api/grades/:id            # Update grade (faculty)
```

### Study Materials

```
GET    /api/materials             # Get all materials
GET    /api/materials/course/:id  # Get course materials
POST   /api/materials             # Upload material (with file)
POST   /api/materials/:id/download # Track downloads
DELETE /api/materials/:id         # Delete material
```

### Assignments

```
GET    /api/assignments/me        # Get student's assignments
GET    /api/assignments/course/:id # Get course assignments
POST   /api/assignments           # Create assignment (faculty)
POST   /api/assignments/:id/submit # Submit assignment (with file)
PUT    /api/submissions/:id/grade # Grade submission (faculty)
```

### Exams

```
GET    /api/exams/upcoming        # Get upcoming exams
GET    /api/exams/results/me      # Get exam results
POST   /api/exams                 # Create exam (faculty)
POST   /api/exams/:id/results     # Publish results (faculty)
```

### Attendance

```
GET    /api/attendance/me         # Get attendance records
GET    /api/attendance/stats      # Get attendance statistics
POST   /api/attendance            # Mark attendance (faculty)
```

### Fee Payments

```
GET    /api/fees/me               # Get payment history
GET    /api/fees/structure        # Get fee structure
POST   /api/fees/payment          # Create payment
PUT    /api/fees/payment/:id      # Update payment (admin)
GET    /api/fees/receipt/:id      # Get receipt
```

### Scholarships

```
GET    /api/scholarships          # Get all scholarships
GET    /api/scholarships/applications/me # Get applications
POST   /api/scholarships/apply    # Apply for scholarship (with docs)
PUT    /api/scholarships/applications/:id # Update status (admin)
```

### Library

```
GET    /api/library/books         # Search books
GET    /api/library/issues/me     # Get issued books
POST   /api/library/issue         # Issue book (staff)
PUT    /api/library/return/:id    # Return book (staff)
```

### Events

```
GET    /api/events                # Get all events
GET    /api/events/upcoming       # Get upcoming events
POST   /api/events                # Create event (faculty)
POST   /api/events/:id/rsvp       # RSVP to event
```

### Notices

```
GET    /api/notices               # Get all notices
POST   /api/notices/:id/read      # Mark as read
POST   /api/notices               # Create notice (faculty)
```

### Lost & Found

```
GET    /api/lost-found            # Get items
POST   /api/lost-found            # Report item (with image)
PUT    /api/lost-found/:id/claim  # Claim item
```

### Grievances

```
GET    /api/grievances/me         # Get my grievances
POST   /api/grievances            # Submit grievance (with attachment)
PUT    /api/grievances/:id        # Update status (admin)
```

### Activities & Portfolio

```
GET    /api/activities/me         # Get my activities
POST   /api/activities            # Submit activity (with certificate)
PUT    /api/activities/:id/verify # Approve/reject (faculty)
```

### Goals & Achievements

```
GET    /api/goals/me              # Get my goals
POST   /api/goals                 # Create goal
PUT    /api/goals/:id             # Update goal
GET    /api/achievements/me       # Get achievements
POST   /api/achievements          # Add achievement (with certificate)
```

### Notifications

```
GET    /api/notifications/me      # Get notifications
PUT    /api/notifications/:id/read # Mark as read
PUT    /api/notifications/read-all # Mark all as read
```

### Dashboard & Analytics

```
GET    /api/dashboard/stats       # Get dashboard statistics
```

## 🔐 Authentication & Authorization

### Role-Based Access Control

- **Student**: Access own data, submit assignments, apply for scholarships
- **Faculty**: Manage courses, grade assignments, mark attendance
- **Admin**: Full system access, user management, system configuration
- **Staff**: Library, hostel, transportation management

### Middleware

```typescript
requireAuth(); // Requires authentication
requireRole("student"); // Single role
requireRole("faculty", "admin"); // Multiple roles
```

## 📤 File Uploads

Supported file uploads using Multer:

- Study materials (PDF, PPT, DOC, etc.)
- Assignment submissions
- Certificates
- Documents
- Images (profile, events, lost items)
- Grievance attachments

**Upload limits**: 10MB per file

## 🌐 Environment Variables

Create `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# Or use separate variables
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=smart_student_hub
PG_USER=postgres
PG_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Session Secret
SESSION_SECRET=your-super-secret-key-change-this

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## 🗃️ Database Setup

### Using Neon PostgreSQL (Recommended)

1. **Sign up** at [neon.tech](https://neon.tech) (Free tier available)
2. **Create a new project**
3. **Copy connection string**
4. **Add to `.env`**:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```

### Push Schema to Database

```bash
npm run db:push
```

This will create all 50+ tables automatically using Drizzle Kit.

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Server will run on: `http://localhost:5000`

### Build for Production

```bash
npm run build
npm start
```

## 🧪 Testing Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:5000/health

# Get current user (requires authentication)
curl http://localhost:5000/api/users/me \
  -H "Cookie: connect.sid=your-session-cookie"
```

### Using Postman/Insomnia

1. Import endpoints from this documentation
2. Set base URL: `http://localhost:5000`
3. Enable cookies for session management

## 📊 Response Format

### Success Response

```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": "value2",
  "createdAt": "2025-10-03T12:00:00Z"
}
```

### Error Response

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (delete success)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔄 Data Flow

```
Client Request
    ↓
Express Middleware (CORS, Body Parser, Session)
    ↓
Authentication Middleware (if required)
    ↓
Authorization Middleware (role check)
    ↓
Route Handler
    ↓
Database Query (Drizzle ORM)
    ↓
Response to Client
```

## 📝 Best Practices

1. **Always use prepared statements** (Drizzle handles this)
2. **Validate input data** using Zod schemas
3. **Handle errors gracefully** with try-catch
4. **Use transactions** for related operations
5. **Implement pagination** for large datasets
6. **Log all database operations** for debugging
7. **Sanitize file uploads** to prevent security issues
8. **Use indexes** on frequently queried columns
9. **Implement rate limiting** in production
10. **Keep session secret secure** and rotate regularly

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15+ (Neon Serverless)
- **ORM**: Drizzle ORM
- **Session**: express-session + connect-pg-simple
- **File Upload**: Multer
- **Validation**: Zod
- **Security**: CORS, Helmet (recommended)

## 📦 Package Dependencies

### Core

- `express` - Web framework
- `@neondatabase/serverless` - PostgreSQL driver
- `drizzle-orm` - TypeScript ORM
- `express-session` - Session management
- `connect-pg-simple` - PostgreSQL session store

### Utilities

- `multer` - File upload handling
- `cors` - CORS middleware
- `zod` - Schema validation
- `ws` - WebSocket support

### Development

- `tsx` - TypeScript execution
- `drizzle-kit` - Database migrations
- `typescript` - Type checking

## 🐛 Common Issues & Solutions

### Database Connection Fails

**Problem**: `Database connection failed`

**Solution**:

1. Check `DATABASE_URL` in `.env`
2. Verify network connectivity
3. Ensure PostgreSQL is running
4. Check firewall settings

### Session Not Persisting

**Problem**: User gets logged out after server restart

**Solution**: Use PostgreSQL session store (already configured)

### File Upload Fails

**Problem**: `No file uploaded` error

**Solution**:

1. Ensure `uploads/` directory exists
2. Check file size (max 10MB)
3. Verify `multipart/form-data` content type

### CORS Errors

**Problem**: `CORS policy blocked`

**Solution**: Update `CLIENT_URL` in `.env` or configure CORS origins

## 📈 Performance Optimization

1. **Connection Pooling**: Configured with max 10 connections
2. **Query Optimization**: Use indexes and `SELECT` specific columns
3. **Caching**: Consider Redis for session storage in production
4. **CDN**: Serve uploaded files via CDN
5. **Load Balancing**: Use PM2 or similar for clustering

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure session cookies
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Use parameterized queries (Drizzle default)
- [ ] Validate file uploads
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable CSP headers
- [ ] Implement request logging

## 📞 Support

For issues or questions:

1. Check this documentation
2. Review error logs
3. Check database connectivity
4. Verify environment variables

## 🎯 Next Steps

1. ✅ Configure database (`.env`)
2. ✅ Run `npm run db:push`
3. ✅ Start server (`npm run dev`)
4. ✅ Test health endpoint
5. ✅ Integrate with frontend
6. ✅ Deploy to production

---

**Built with ❤️ for Smart Student Hub**
