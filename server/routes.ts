/**
 * API Routes for Student Activity Record Management System
 * 
 * This file defines all REST API endpoints for the application.
 * The API follows RESTful conventions and includes proper authentication,
 * validation, and error handling.
 * 
 * Route Categories:
 * - Authentication: User login, logout, profile management
 * - Student Routes: Activity management, portfolio generation
 * - Faculty Routes: Activity approval/rejection workflow
 * - Admin Routes: Analytics, reporting, department management
 * - File Routes: Upload, download, and file management
 * 
 * Security Features:
 * - Replit Auth integration for authentication
 * - Role-based access control
 * - Input validation using Zod schemas
 * - File upload restrictions and validation
 * - Path traversal protection
 */

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertActivitySchema, updateActivityStatusSchema, loginSchema, signupSchema } from "@shared/schema";
import { AuthenticatedUser } from "../types/express";
import { PDFPortfolioService } from "./pdfService";
import { InstitutionalReportPDFService, NAACReportData, NIRFReportData } from "./reportPdfService";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Extended Request Interface
 * 
 * Extends the standard Express Request to include authenticated user information.
 * Used throughout the API to ensure type safety for authenticated routes.
 */
interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

/**
 * CSV Conversion Utility
 * 
 * Converts an array of objects to CSV format for data export.
 * Handles nested objects by flattening them and escapes special characters.
 */
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return '';

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Header row
    headers.map(header => `"${header}"`).join(','),
    // Data rows
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '""';
        if (typeof value === 'object') return `"${JSON.stringify(value)}"`;
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}

/**
 * File Upload Configuration
 * 
 * Configures multer middleware for secure file uploads.
 * 
 * Security Features:
 * - File type restrictions (PDF, JPG, PNG only)
 * - File size limits (10MB maximum)
 * - Unique filename generation to prevent conflicts
 * - Secure file storage in uploads directory
 * 
 * Supported File Types:
 * - PDF: For certificates and official documents
 * - JPG/PNG: For images and scanned documents
 */
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

/**
 * Register All API Routes
 * 
 * Sets up all API endpoints and middleware for the application.
 * Routes are organized by functionality and protected by appropriate
 * authentication and authorization middleware.
 * 
 * @param app - Express application instance
 * @returns HTTP server instance
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Database seeding endpoint (for development/testing) - BEFORE auth middleware
  app.get('/seed-database', async (req, res) => {
    try {
      console.log("Starting database seeding via GET endpoint...");
      
      // Import the seedDatabase function dynamically
      const { seedDatabase } = await import('./seed');
      
      console.log("Seeding function imported successfully");
      await seedDatabase();
      
      console.log("Database seeding completed successfully!");
      
      res.setHeader('Content-Type', 'text/plain');
      res.send('Database seeded successfully with professional sample data!\n\nCheck the server logs for details.');
    } catch (error) {
      console.error("ERROR: Database seeding failed:", error);
      res.setHeader('Content-Type', 'text/plain');
      res.status(500).send(`Failed to seed database: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // Database status endpoint
  app.get('/db-status', async (req, res) => {
    try {
      const dbUrl = process.env.DATABASE_URL;
      res.setHeader('Content-Type', 'text/plain');
      res.send(`Database URL exists: ${!!dbUrl}\nURL length: ${dbUrl ? dbUrl.length : 0}\nEnvironment: ${process.env.NODE_ENV || 'unknown'}`);
    } catch (error) {
      res.setHeader('Content-Type', 'text/plain');
      res.status(500).send(`Error checking database status: ${error}`);
    }
  });

  // Database health check endpoint
  app.get('/api/health/db', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { users, activities, sql } = await import('@shared/schema');
      
      // Test basic connectivity
      const result = await db.execute(sql`SELECT 1 as test`);
      
      // Get user count to verify data
      const userCountResult = await db.select().from(users);
      const userCount = userCountResult.length;
      
      // Get activities count
      const activitiesResult = await db.select().from(activities);
      const activitiesCount = activitiesResult.length;
      
      // Get ISHU KUMAR specifically to verify seeding
      const ishuUser = userCountResult.find(u => u.firstName === 'ISHU' && u.lastName === 'KUMAR');
      
      const healthData = {
        status: 'healthy',
        connectivity: 'ok',
        userCount,
        activitiesCount,
        ishuKumarExists: !!ishuUser,
        timestamp: new Date().toISOString(),
        testQuery: result.rows?.[0] || result
      };
      
      console.log(`Database Health Check:`);
      console.log(`   Users in database: ${userCount}`);
      console.log(`   Activities in database: ${activitiesCount}`);
      console.log(`   ISHU KUMAR exists: ${!!ishuUser}`);
      console.log(`   Connection test: PASSED`);
      
      res.json(healthData);
    } catch (error) {
      console.error('Database health check failed:', error);
      res.status(500).json({ 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  });

  // Initialize Replit Authentication middleware
  await setupAuth(app);

  /**
   * Authentication Routes
   * 
   * Handles user authentication and profile management.
   * All routes require valid authentication tokens.
   */
  app.get('/api/auth/user', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  /**
   * Complete User Profile with Signup Data
   * 
   * This endpoint is called after authentication to merge signup data
   * stored in sessionStorage with the authenticated user profile.
   */
  app.post('/api/auth/complete-profile', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const signupData = signupSchema.parse(req.body);
      
      // Check if roll number is already taken by another user
      const existingRollNumber = await storage.getUserByRollNumber(signupData.rollNumber);
      if (existingRollNumber && existingRollNumber.id !== userId) {
        return res.status(409).json({
          message: "This roll number is already registered. Please contact your institution if this is incorrect.",
          success: false
        });
      }
      
      // Get current user data
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        return res.status(404).json({
          message: "User not found",
          success: false
        });
      }
      
      // Merge signup data with current user profile
      const updatedUserData = {
        id: userId,
        email: currentUser.email,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        profileImageUrl: currentUser.profileImageUrl,
        rollNumber: signupData.rollNumber,
        department: signupData.department,
        currentSemester: signupData.currentSemester,
        role: currentUser.role ?? 'student',
      };
      
      // Update user with academic information
      const updatedUser = await storage.upsertUser(updatedUserData);
      
      res.json({
        success: true,
        message: "Profile completed successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error completing user profile:", error);
      if (error instanceof Error && error.message.includes('already registered')) {
        res.status(409).json({
          message: error.message,
          success: false
        });
      } else {
        res.status(500).json({ 
          message: "Failed to complete profile",
          success: false
        });
      }
    }
  });

  /**
   * Simplified Login Endpoint
   * 
   * Validates email and redirects to Replit Auth for secure authentication.
   * No password processing for maximum security.
   */
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Optional: Check if user exists in our system for better UX
      // This is optional since Replit Auth will handle authentication
      
      // Redirect to Replit Auth for actual authentication
      res.status(200).json({ 
        success: true, 
        message: "Redirecting to institutional authentication system...",
        redirectUrl: "/api/login" // Replit Auth login endpoint
      });
    } catch (error) {
      console.error("Login validation error:", error);
      res.status(400).json({ 
        message: "Invalid email format. Please check your email address.",
        success: false
      });
    }
  });

  /**
   * Traditional Signup Endpoint
   * 
   * Handles form-based registration requests and integrates with the user system.
   * This endpoint validates registration data and creates user profiles.
   */
  app.post('/api/auth/signup', async (req: Request, res: Response) => {
    try {
      // Parse and validate the form data
      const validatedData = signupSchema.parse({
        ...req.body,
        currentSemester: parseInt(req.body.currentSemester) // Convert string to number
      });
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({
          message: "An account with this email address already exists. Please sign in instead.",
          success: false
        });
      }

      // Check if roll number is already taken
      const existingRollNumber = await storage.getUserByRollNumber(validatedData.rollNumber);
      if (existingRollNumber) {
        return res.status(409).json({
          message: "This roll number is already registered. Please contact your institution if this is incorrect.",
          success: false
        });
      }

      // Create user account using storage abstraction
      const newUserData = {
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        rollNumber: validatedData.rollNumber,
        department: validatedData.department,
        currentSemester: validatedData.currentSemester,
        role: 'student' as const,
        // Authentication is handled by Replit Auth - we only store academic data
      };

      const createdUser = await storage.upsertUser(newUserData);

      res.status(201).json({
        success: true,
        message: "Account created successfully! Please sign in to continue.",
        user: {
          id: createdUser.id,
          email: createdUser.email,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          role: createdUser.role
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        res.status(400).json({ 
          message: error.message || "Invalid registration data. Please check your academic information.",
          success: false
        });
      } else {
        res.status(500).json({ 
          message: "An unexpected error occurred during registration. Please try again.",
          success: false
        });
      }
    }
  });

  /**
   * Student Routes
   * 
   * API endpoints for student-specific functionality.
   * Students can manage their activities, view portfolios, and track progress.
   */
  app.get('/api/students/activities', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const activities = await storage.getActivitiesByStudent(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching student activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get('/api/students/stats', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const stats = await storage.getStudentStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching student stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/students/portfolio.pdf', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      
      // Get comprehensive portfolio data
      const portfolioData = await storage.getPortfolioData(userId);
      
      // Initialize PDF service and generate portfolio
      const pdfService = new PDFPortfolioService();
      const pdfBuffer = await pdfService.generatePortfolio({
        ...portfolioData,
        generatedAt: new Date()
      });

      // Set appropriate headers for PDF download
      const fileName = `${portfolioData.student.firstName}_${portfolioData.student.lastName}_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      // Send the PDF buffer
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating portfolio PDF:", error);
      res.status(500).json({ 
        message: "Failed to generate portfolio PDF",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      });
    }
  });

  // Student Attendance Routes
  app.get('/api/students/attendance/stats', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const stats = await storage.getAttendanceStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching attendance stats:", error);
      res.status(500).json({ message: "Failed to fetch attendance statistics" });
    }
  });

  app.get('/api/students/attendance/trends', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const weeks = parseInt(req.query.weeks as string) || 8;
      const trends = await storage.getAttendanceTrends(userId, weeks);
      res.json(trends);
    } catch (error) {
      console.error("Error fetching attendance trends:", error);
      res.status(500).json({ message: "Failed to fetch attendance trends" });
    }
  });

  app.get('/api/students/subjects', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const subjects = await storage.getSubjectsByStudent(userId);
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.get('/api/students/attendance', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const attendance = await storage.getStudentAttendance(userId);
      res.json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Failed to fetch attendance records" });
    }
  });

  // Student Notifications, Goals, and Achievements Routes
  app.get('/api/students/notifications', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const notifications = await storage.getNotificationsByStudent(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get('/api/students/goals', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const goals = await storage.getGoalsByStudent(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.get('/api/students/achievements', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const achievements = await storage.getAchievementsByStudent(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Activity routes
  app.post('/api/activities', isAuthenticated, upload.array('files', 5), async (req: Request, res: Response) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const activityData = insertActivitySchema.parse({
        ...req.body,
        studentId: userId,
        activityDate: new Date(req.body.activityDate),
      });

      const activity = await storage.createActivity(activityData);

      // Handle file uploads
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (const file of req.files) {
          await storage.addActivityFile(
            activity.id,
            file.originalname,
            file.path,
            file.mimetype,
            file.size
          );
        }
      }

      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(400).json({ message: "Failed to create activity" });
    }
  });

  app.get('/api/activities/files/:activityId', isAuthenticated, async (req, res) => {
    try {
      const { activityId } = req.params;
      const files = await storage.getActivityFiles(activityId);
      res.json(files);
    } catch (error) {
      console.error("Error fetching activity files:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Faculty routes
  app.get('/api/faculty/pending-activities', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const activities = await storage.getActivitiesByStatus('pending');
      res.json(activities);
    } catch (error) {
      console.error("Error fetching pending activities:", error);
      res.status(500).json({ message: "Failed to fetch pending activities" });
    }
  });

  app.patch('/api/faculty/activities/:activityId/status', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { activityId } = req.params;
      const updates = updateActivityStatusSchema.parse(req.body);
      
      const updatedActivity = await storage.updateActivityStatus(
        activityId,
        updates,
        (req.user as AuthenticatedUser).claims.sub
      );

      res.json(updatedActivity);
    } catch (error) {
      console.error("Error updating activity status:", error);
      res.status(400).json({ message: "Failed to update activity status" });
    }
  });

  // Admin routes
  app.get('/api/admin/department-stats', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const stats = await storage.getDepartmentStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching department stats:", error);
      res.status(500).json({ message: "Failed to fetch department stats" });
    }
  });

  app.get('/api/admin/category-stats', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const stats = await storage.getCategoryStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching category stats:", error);
      res.status(500).json({ message: "Failed to fetch category stats" });
    }
  });

  app.get('/api/admin/student-summary', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const summary = await storage.getStudentSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching student summary:", error);
      res.status(500).json({ message: "Failed to fetch student summary" });
    }
  });

  // Enhanced Analytics Endpoints
  app.get('/api/admin/analytics/trends', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const trends = await storage.getTrendsData(start, end);
      res.json(trends);
    } catch (error) {
      console.error("Error fetching trends data:", error);
      res.status(500).json({ message: "Failed to fetch trends data" });
    }
  });

  app.get('/api/admin/analytics/faculty-performance', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const performance = await storage.getFacultyPerformanceStats();
      res.json(performance);
    } catch (error) {
      console.error("Error fetching faculty performance:", error);
      res.status(500).json({ message: "Failed to fetch faculty performance" });
    }
  });

  app.get('/api/admin/analytics/naac-metrics', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const metrics = await storage.getNAACMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching NAAC metrics:", error);
      res.status(500).json({ message: "Failed to fetch NAAC metrics" });
    }
  });

  app.get('/api/admin/analytics/nirf-metrics', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const metrics = await storage.getNIRFMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching NIRF metrics:", error);
      res.status(500).json({ message: "Failed to fetch NIRF metrics" });
    }
  });

  app.get('/api/admin/analytics/date-range', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const { startDate, endDate, department } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      const dept = department as string | undefined;

      const analytics = await storage.getAnalyticsByDateRange(start, end, dept);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching date range analytics:", error);
      res.status(500).json({ message: "Failed to fetch date range analytics" });
    }
  });

  // CSV Export Endpoints
  app.get('/api/admin/export/csv/:type', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const { type } = req.params;
      const { department, startDate, endDate } = req.query;
      
      const validTypes = ['activities', 'students', 'departments'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid export type" });
      }

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      const dept = department as string | undefined;

      const data = await storage.getCSVExportData(type, dept, start, end);
      
      // Convert to CSV format
      const csv = convertToCSV(data);
      const filename = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({ message: "Failed to export CSV" });
    }
  });

  // NAAC Report PDF Generation
  app.get('/api/admin/reports/naac', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const { startDate, endDate, institutionName = 'Higher Education Institution' } = req.query;
      
      // Default to last academic year if no dates provided
      const end = endDate ? new Date(endDate as string) : new Date();
      const start = startDate ? new Date(startDate as string) : 
        new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());

      // Gather all NAAC data
      const [naacMetrics, categoryStats] = await Promise.all([
        storage.getNAACMetrics(),
        storage.getCategoryStats()
      ]);

      const reportData: NAACReportData = {
        institutionName: institutionName as string,
        generatedAt: new Date(),
        reportPeriod: { startDate: start, endDate: end },
        studentEngagement: naacMetrics.studentEngagement,
        departmentParticipation: naacMetrics.departmentParticipation,
        facultyInvolvement: naacMetrics.facultyInvolvement,
        qualityMetrics: naacMetrics.qualityMetrics,
        categoryStats
      };

      const pdfService = new InstitutionalReportPDFService();
      const pdfBuffer = await pdfService.generateNAACReport(reportData);

      const fileName = `NAAC_Compliance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating NAAC report:", error);
      res.status(500).json({ 
        message: "Failed to generate NAAC report",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      });
    }
  });

  // NIRF Report PDF Generation
  app.get('/api/admin/reports/nirf', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req.user as AuthenticatedUser).claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const { startDate, endDate, institutionName = 'Higher Education Institution' } = req.query;
      
      // Default to last academic year if no dates provided
      const end = endDate ? new Date(endDate as string) : new Date();
      const start = startDate ? new Date(startDate as string) : 
        new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());

      // Gather all NIRF data
      const [nirfMetrics, trendsData] = await Promise.all([
        storage.getNIRFMetrics(),
        storage.getTrendsData(start, end)
      ]);

      const reportData: NIRFReportData = {
        institutionName: institutionName as string,
        generatedAt: new Date(),
        reportPeriod: { startDate: start, endDate: end },
        studentDiversity: nirfMetrics.studentDiversity,
        academicExcellence: nirfMetrics.academicExcellence,
        researchInnovation: nirfMetrics.researchInnovation,
        outreachInclusion: nirfMetrics.outreachInclusion,
        graduationOutcomes: nirfMetrics.graduationOutcomes,
        trendsData
      };

      const pdfService = new InstitutionalReportPDFService();
      const pdfBuffer = await pdfService.generateNIRFReport(reportData);

      const fileName = `NIRF_Performance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating NIRF report:", error);
      res.status(500).json({ 
        message: "Failed to generate NIRF report",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      });
    }
  });

  // Departments routes
  app.get('/api/departments', isAuthenticated, async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });


  // File download route
  app.get('/api/files/:filename', isAuthenticated, async (req, res) => {
    try {
      const { filename } = req.params;
      
      // Security: Prevent path traversal attacks
      const resolvedFilePath = path.resolve(uploadDir, filename);
      const resolvedUploadDir = path.resolve(uploadDir);
      
      if (!resolvedFilePath.startsWith(resolvedUploadDir)) {
        return res.status(400).json({ message: "Invalid file path" });
      }
      
      if (!fs.existsSync(resolvedFilePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Security: Set safe Content-Disposition header
      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filename)}"`);
      res.sendFile(resolvedFilePath);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
