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
import { setupGoogleAuth, isAuthenticated } from "./googleAuth";
import {
  insertActivitySchema,
  updateActivityStatusSchema,
  loginSchema,
  signupSchema,
  insertAttendanceSchema,
  insertSubjectSchema,
  insertNotificationSchema,
  insertGoalSchema,
  insertAchievementSchema,
  insertClassSchema,
  updateClassSchema,
  insertAssignmentSchema,
  insertAssignmentSubmissionSchema,
  updateAssignmentSubmissionSchema,
} from "@shared/schema";
import { AuthenticatedUser } from "../types/express";
import { PDFPortfolioService } from "./pdfService";
import {
  InstitutionalReportPDFService,
  NAACReportData,
  NIRFReportData,
} from "./reportPdfService";
import multer from "multer";
import path from "path";
import fs from "fs";

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
  if (!data || data.length === 0) return "";

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    // Header row
    headers.map((header) => `"${header}"`).join(","),
    // Data rows
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return '""';
          if (typeof value === "object") return `"${JSON.stringify(value)}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");

  return csvContent;
}

/**
 * File Upload Configuration
 *
 * Configures multer middleware for secure file uploads.
 *
 * Security Features:
 * - File type restrictions (PDF, DOC, DOCX, JPG, PNG only)
 * - File size limits (10MB maximum)
 * - Unique filename generation to prevent conflicts
 * - Secure file storage in uploads directory
 *
 * Supported File Types:
 * - PDF: For certificates and official documents
 * - DOC/DOCX: For Word documents and assignments
 * - JPG/PNG: For images and scanned documents
 */
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX, JPG, and PNG files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
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
  app.get("/seed-database", async (req, res) => {
    try {
      console.log("Starting database seeding via GET endpoint...");

      // Import the seedDatabase function dynamically
      const { seedDatabase } = await import("./seed");

      console.log("Seeding function imported successfully");
      await seedDatabase();

      console.log("Database seeding completed successfully!");

      res.setHeader("Content-Type", "text/plain");
      res.send(
        "Database seeded successfully with professional sample data!\n\nCheck the server logs for details."
      );
    } catch (error) {
      console.error("ERROR: Database seeding failed:", error);
      res.setHeader("Content-Type", "text/plain");
      res
        .status(500)
        .send(
          `Failed to seed database: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
    }
  });

  // Database status endpoint
  app.get("/db-status", async (req, res) => {
    try {
      const dbUrl = process.env.DATABASE_URL;
      res.setHeader("Content-Type", "text/plain");
      res.send(
        `Database URL exists: ${!!dbUrl}\nURL length: ${
          dbUrl ? dbUrl.length : 0
        }\nEnvironment: ${process.env.NODE_ENV || "unknown"}`
      );
    } catch (error) {
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send(`Error checking database status: ${error}`);
    }
  });

  // Database health check endpoint
  app.get("/api/health/db", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { users, activities, sql } = await import("@shared/schema");

      if (!db) {
        return res.status(500).json({
          status: "unhealthy",
          error: "Database connection not available",
          timestamp: new Date().toISOString(),
        });
      }

      // Test basic connectivity
      const result = await db.execute(sql`SELECT 1 as test`);

      // Get user count to verify data
      const userCountResult = await db.select().from(users);
      const userCount = userCountResult.length;

      // Get activities count
      const activitiesResult = await db.select().from(activities);
      const activitiesCount = activitiesResult.length;

      // Get ISHU KUMAR specifically to verify seeding
      const ishuUser = userCountResult.find(
        (u) => u.firstName === "ISHU" && u.lastName === "KUMAR"
      );

      const healthData = {
        status: "healthy",
        connectivity: "ok",
        userCount,
        activitiesCount,
        ishuKumarExists: !!ishuUser,
        timestamp: new Date().toISOString(),
        testQuery: result.rows?.[0] || result,
      };

      console.log(`Database Health Check:`);
      console.log(`   Users in database: ${userCount}`);
      console.log(`   Activities in database: ${activitiesCount}`);
      console.log(`   ISHU KUMAR exists: ${!!ishuUser}`);
      console.log(`   Connection test: PASSED`);

      res.json(healthData);
    } catch (error) {
      console.error("Database health check failed:", error);
      res.status(500).json({
        status: "unhealthy",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Initialize Replit Authentication middleware
  setupGoogleAuth(app);

  /**
   * Authentication Routes
   *
   * Handles user authentication and profile management.
   * All routes require valid authentication tokens.
   */
  app.get(
    "/api/auth/user",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const user = await storage.getUser(userId);
        res.json(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
      }
    }
  );

  /**
   * Complete User Profile with Signup Data
   *
   * This endpoint is called after authentication to merge signup data
   * stored in sessionStorage with the authenticated user profile.
   */
  app.post(
    "/api/auth/complete-profile",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const signupData = signupSchema.parse(req.body);

        // Check if roll number is already taken by another user
        const existingRollNumber = await storage.getUserByRollNumber(
          signupData.rollNumber
        );
        if (existingRollNumber && existingRollNumber.id !== userId) {
          return res.status(409).json({
            message:
              "This roll number is already registered. Please contact your institution if this is incorrect.",
            success: false,
          });
        }

        // Get current user data
        const currentUser = await storage.getUser(userId);
        if (!currentUser) {
          return res.status(404).json({
            message: "User not found",
            success: false,
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
          role: currentUser.role ?? "student",
        };

        // Update user with academic information
        const updatedUser = await storage.upsertUser(updatedUserData);

        res.json({
          success: true,
          message: "Profile completed successfully",
          user: updatedUser,
        });
      } catch (error) {
        console.error("Error completing user profile:", error);
        if (
          error instanceof Error &&
          error.message.includes("already registered")
        ) {
          res.status(409).json({
            message: error.message,
            success: false,
          });
        } else {
          res.status(500).json({
            message: "Failed to complete profile",
            success: false,
          });
        }
      }
    }
  );

  /**
   * Google OAuth Login Routes
   */

  // Initiate Google OAuth login
  app.get("/api/auth/google", (req, res, next) => {
    const isDevelopment = process.env.NODE_ENV === "development";
    const hasGoogleCredentials =
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_ID !== "dummy-client-id";

    if (isDevelopment && !hasGoogleCredentials) {
      // Mock login for development
      req.login({ id: "dev-user-123" }, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    } else {
      // Real Google OAuth
      const passport = require("passport");
      passport.authenticate("google", { scope: ["profile", "email"] })(
        req,
        res,
        next
      );
    }
  });

  // Google OAuth callback
  app.get("/api/auth/google/callback", (req, res, next) => {
    const isDevelopment = process.env.NODE_ENV === "development";
    const hasGoogleCredentials =
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_ID !== "dummy-client-id";

    if (isDevelopment && !hasGoogleCredentials) {
      // Mock callback for development
      req.login({ id: "dev-user-123" }, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    } else {
      // Real Google OAuth callback
      const passport = require("passport");
      passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/login?error=authentication_failed",
      })(req, res, next);
    }
  });

  // Traditional login endpoint (now redirects to Google OAuth)
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      // Redirect to Google OAuth for authentication
      res.status(200).json({
        success: true,
        message: "Redirecting to Google authentication...",
        redirectUrl: "/api/auth/google",
      });
    } catch (error) {
      console.error("Login validation error:", error);
      res.status(400).json({
        message: "Invalid email format. Please check your email address.",
        success: false,
      });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  /**
   * Traditional Signup Endpoint
   *
   * Handles form-based registration requests and integrates with the user system.
   * This endpoint validates registration data and creates user profiles.
   */
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      // Parse and validate the form data
      const validatedData = signupSchema.parse({
        ...req.body,
        currentSemester: parseInt(req.body.currentSemester), // Convert string to number
      });

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({
          message:
            "An account with this email address already exists. Please sign in instead.",
          success: false,
        });
      }

      // Check if roll number is already taken
      const existingRollNumber = await storage.getUserByRollNumber(
        validatedData.rollNumber
      );
      if (existingRollNumber) {
        return res.status(409).json({
          message:
            "This roll number is already registered. Please contact your institution if this is incorrect.",
          success: false,
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
        role: "student" as const,
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
          role: createdUser.role,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        res.status(400).json({
          message:
            error.message ||
            "Invalid registration data. Please check your academic information.",
          success: false,
        });
      } else {
        res.status(500).json({
          message:
            "An unexpected error occurred during registration. Please try again.",
          success: false,
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
  app.get(
    "/api/students/activities",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const activities = await storage.getActivitiesByStudent(userId);
        res.json(activities);
      } catch (error) {
        console.error("Error fetching student activities:", error);
        res.status(500).json({ message: "Failed to fetch activities" });
      }
    }
  );

  app.get(
    "/api/students/stats",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const stats = await storage.getStudentStats(userId);
        res.json(stats);
      } catch (error) {
        console.error("Error fetching student stats:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
      }
    }
  );

  app.get(
    "/api/students/portfolio.pdf",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;

        // Get comprehensive portfolio data
        const portfolioData = await storage.getPortfolioData(userId);

        // Initialize PDF service and generate portfolio
        const pdfService = new PDFPortfolioService();
        const pdfBuffer = await pdfService.generatePortfolio({
          ...portfolioData,
          generatedAt: new Date(),
        });

        // Set appropriate headers for PDF download
        const fileName = `${portfolioData.student.firstName}_${
          portfolioData.student.lastName
        }_Portfolio_${new Date().toISOString().split("T")[0]}.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Length", pdfBuffer.length);

        // Send the PDF buffer
        res.send(pdfBuffer);
      } catch (error) {
        console.error("Error generating portfolio PDF:", error);
        res.status(500).json({
          message: "Failed to generate portfolio PDF",
          error:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? error.message
                : String(error)
              : undefined,
        });
      }
    }
  );

  // Student Attendance Routes
  app.get(
    "/api/students/attendance/stats",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const stats = await storage.getAttendanceStats(userId);
        res.json(stats);
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch attendance statistics" });
      }
    }
  );

  app.get(
    "/api/students/attendance/trends",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const weeks = parseInt(req.query.weeks as string) || 8;
        const trends = await storage.getAttendanceTrends(userId, weeks);
        res.json(trends);
      } catch (error) {
        console.error("Error fetching attendance trends:", error);
        res.status(500).json({ message: "Failed to fetch attendance trends" });
      }
    }
  );

  app.get(
    "/api/students/subjects",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const subjects = await storage.getSubjectsByStudent(userId);
        res.json(subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ message: "Failed to fetch subjects" });
      }
    }
  );

  app.get(
    "/api/students/attendance",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const attendance = await storage.getStudentAttendance(userId);
        res.json(attendance);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Failed to fetch attendance records" });
      }
    }
  );

  // Student Notifications, Goals, and Achievements Routes
  app.get(
    "/api/students/notifications",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const notifications = await storage.getNotificationsByStudent(userId);
        res.json(notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Failed to fetch notifications" });
      }
    }
  );

  app.get(
    "/api/students/goals",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const goals = await storage.getGoalsByStudent(userId);
        res.json(goals);
      } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({ message: "Failed to fetch goals" });
      }
    }
  );

  app.get(
    "/api/students/achievements",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const achievements = await storage.getAchievementsByStudent(userId);
        res.json(achievements);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        res.status(500).json({ message: "Failed to fetch achievements" });
      }
    }
  );

  /**
   * Enhanced Attendance API Routes
   *
   * Comprehensive attendance management with filtering, analytics, and CRUD operations.
   */
  app.get(
    "/api/attendance",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const { subjectId, dateFrom, dateTo, status } = req.query;

        let attendance;
        if (subjectId) {
          attendance = await storage.getStudentAttendanceBySubject(
            userId,
            subjectId as string
          );
        } else {
          attendance = await storage.getStudentAttendance(userId);
        }

        // Apply filters if provided
        let filteredAttendance = attendance;
        if (dateFrom) {
          const fromDate = new Date(dateFrom as string);
          filteredAttendance = filteredAttendance.filter(
            (record) => record.attendanceDate && new Date(record.attendanceDate) >= fromDate
          );
        }
        if (dateTo) {
          const toDate = new Date(dateTo as string);
          filteredAttendance = filteredAttendance.filter(
            (record) => record.attendanceDate && new Date(record.attendanceDate) <= toDate
          );
        }
        if (status) {
          filteredAttendance = filteredAttendance.filter(
            (record) => record.status === status
          );
        }

        res.json(filteredAttendance);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Failed to fetch attendance records" });
      }
    }
  );

  app.post(
    "/api/attendance",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
          return res.status(403).json({ message: "Access denied" });
        }

        const attendanceData = insertAttendanceSchema.parse({
          ...req.body,
          date: new Date(req.body.date),
        });

        const attendance = await storage.createAttendanceRecord(attendanceData);
        res.status(201).json(attendance);
      } catch (error) {
        console.error("Error creating attendance:", error);
        res.status(400).json({ message: "Failed to create attendance record" });
      }
    }
  );

  app.get(
    "/api/attendance/analytics",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const { subjectId, dateFrom, dateTo } = req.query;

        const dateRange =
          dateFrom && dateTo
            ? {
                start: new Date(dateFrom as string),
                end: new Date(dateTo as string),
              }
            : undefined;

        const analytics = await storage.getAttendanceAnalytics(
          userId,
          subjectId as string,
          dateRange
        );

        res.json(analytics);
      } catch (error) {
        console.error("Error fetching attendance analytics:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch attendance analytics" });
      }
    }
  );

  /**
   * QR Attendance Session Routes
   * 
   * Secure QR code-based attendance marking system.
   * Faculty/Admin can create QR sessions, students can scan to mark attendance.
   */
  app.post(
    "/api/attendance/qr/create",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const user = await storage.getUser(userId);

        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
          return res.status(403).json({ message: "Only faculty and admins can create QR attendance sessions" });
        }

        const { subjectId, classId } = req.body;

        if (!subjectId) {
          return res.status(400).json({ message: "Subject ID is required" });
        }

        const session = await storage.createQRSession(subjectId, userId, classId);

        res.status(201).json({
          success: true,
          sessionId: session.sessionId,
          token: session.token,
          expiresAt: session.expiresAt,
          message: "QR attendance session created successfully",
        });
      } catch (error) {
        console.error("Error creating QR session:", error);
        res.status(500).json({ message: "Failed to create QR attendance session" });
      }
    }
  );

  app.post(
    "/api/attendance/qr/scan",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const user = await storage.getUser(userId);

        if (!user || user.role !== "student") {
          return res.status(403).json({ message: "Only students can scan QR codes for attendance" });
        }

        const { token } = req.body;

        if (!token) {
          return res.status(400).json({ message: "QR token is required" });
        }

        const result = await storage.validateQRSession(token, userId);

        if (!result.isValid) {
          return res.status(400).json({
            success: false,
            message: result.error || "Invalid QR code",
          });
        }

        res.json({
          success: true,
          subjectId: result.subjectId,
          message: "Attendance marked successfully",
        });
      } catch (error) {
        console.error("Error scanning QR code:", error);
        res.status(500).json({ message: "Failed to scan QR code" });
      }
    }
  );

  /**
   * Enhanced Subjects API Routes
   *
   * Comprehensive subject management with grades, credits, and CRUD operations.
   */
  app.get(
    "/api/subjects",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        let subjects;

        if (user?.role === "student") {
          subjects = await storage.getSubjectsByStudent(user.id);
        } else {
          subjects = await storage.getSubjects();
        }

        res.json(subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ message: "Failed to fetch subjects" });
      }
    }
  );

  app.post(
    "/api/subjects",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
          return res.status(403).json({ message: "Access denied" });
        }

        const subjectData = insertSubjectSchema.parse(req.body);
        const subject = await storage.createSubject(subjectData);
        res.status(201).json(subject);
      } catch (error) {
        console.error("Error creating subject:", error);
        res.status(400).json({ message: "Failed to create subject" });
      }
    }
  );

  app.put(
    "/api/subjects/:subjectId",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
          return res.status(403).json({ message: "Access denied" });
        }

        const { subjectId } = req.params;
        const updates = req.body;

        const subject = await storage.updateSubject(subjectId, updates);
        res.json(subject);
      } catch (error) {
        console.error("Error updating subject:", error);
        res.status(400).json({ message: "Failed to update subject" });
      }
    }
  );

  app.delete(
    "/api/subjects/:subjectId",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
          return res.status(403).json({ message: "Access denied" });
        }

        const { subjectId } = req.params;
        await storage.deleteSubject(subjectId);
        res.status(204).send();
      } catch (error) {
        console.error("Error deleting subject:", error);
        res.status(400).json({ message: "Failed to delete subject" });
      }
    }
  );

  /**
   * Enhanced Notifications API Routes
   *
   * Comprehensive notification management with read/unread status and CRUD operations.
   */
  app.post(
    "/api/notifications",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
          return res.status(403).json({ message: "Access denied" });
        }

        const notificationData = insertNotificationSchema.parse(req.body);
        const notification = await storage.createNotification(notificationData);
        res.status(201).json(notification);
      } catch (error) {
        console.error("Error creating notification:", error);
        res.status(400).json({ message: "Failed to create notification" });
      }
    }
  );

  app.patch(
    "/api/notifications/:notificationId/read",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const { notificationId } = req.params;
        const notification = await storage.markNotificationAsRead(
          notificationId
        );
        res.json(notification);
      } catch (error) {
        console.error("Error marking notification as read:", error);
        res
          .status(400)
          .json({ message: "Failed to mark notification as read" });
      }
    }
  );

  app.patch(
    "/api/notifications/mark-all-read",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        await storage.markAllNotificationsAsRead(userId);
        res.status(204).send();
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res
          .status(400)
          .json({ message: "Failed to mark all notifications as read" });
      }
    }
  );

  app.get(
    "/api/notifications/unread-count",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const count = await storage.getUnreadNotificationCount(userId);
        res.json({ count });
      } catch (error) {
        console.error("Error fetching unread notification count:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch unread notification count" });
      }
    }
  );

  /**
   * Enhanced Goals API Routes
   *
   * Comprehensive goal management with progress tracking and CRUD operations.
   */
  app.post(
    "/api/goals",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const goalData = insertGoalSchema.parse({
          ...req.body,
          studentId: userId,
          targetDate: new Date(req.body.targetDate),
        });

        const goal = await storage.createGoal(goalData);
        res.status(201).json(goal);
      } catch (error) {
        console.error("Error creating goal:", error);
        res.status(400).json({ message: "Failed to create goal" });
      }
    }
  );

  app.put(
    "/api/goals/:goalId",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const { goalId } = req.params;
        const updates = req.body;

        if (updates.targetDate) {
          updates.targetDate = new Date(updates.targetDate);
        }

        const goal = await storage.updateGoal(goalId, updates);
        res.json(goal);
      } catch (error) {
        console.error("Error updating goal:", error);
        res.status(400).json({ message: "Failed to update goal" });
      }
    }
  );

  app.delete(
    "/api/goals/:goalId",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const { goalId } = req.params;
        await storage.deleteGoal(goalId);
        res.status(204).send();
      } catch (error) {
        console.error("Error deleting goal:", error);
        res.status(400).json({ message: "Failed to delete goal" });
      }
    }
  );

  app.get(
    "/api/goals/analytics",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const analytics = await storage.getGoalAnalytics(userId);
        res.json(analytics);
      } catch (error) {
        console.error("Error fetching goal analytics:", error);
        res.status(500).json({ message: "Failed to fetch goal analytics" });
      }
    }
  );

  /**
   * Enhanced Achievements API Routes
   *
   * Comprehensive achievement management with verification and CRUD operations.
   */
  app.post(
    "/api/achievements",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const achievementData = insertAchievementSchema.parse({
          ...req.body,
          studentId: userId,
          dateEarned: new Date(req.body.dateEarned),
        });

        const achievement = await storage.createAchievement(achievementData);
        res.status(201).json(achievement);
      } catch (error) {
        console.error("Error creating achievement:", error);
        res.status(400).json({ message: "Failed to create achievement" });
      }
    }
  );

  app.put(
    "/api/achievements/:achievementId",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
          return res.status(403).json({ message: "Access denied" });
        }

        const { achievementId } = req.params;
        const updates = req.body;

        const achievement = await storage.updateAchievement(
          achievementId,
          updates
        );
        res.json(achievement);
      } catch (error) {
        console.error("Error updating achievement:", error);
        res.status(400).json({ message: "Failed to update achievement" });
      }
    }
  );

  /**
   * Schedule/Class Management API Routes
   *
   * Comprehensive class schedule management with CRUD operations and time conflict detection.
   */
  
  // Get all classes for the authenticated student
  app.get(
    "/api/schedule/classes",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const classes = await storage.getClassesByStudent(userId);
        res.json(classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ message: "Failed to fetch classes" });
      }
    }
  );

  // Get a specific class by ID
  app.get(
    "/api/schedule/classes/:classId",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const { classId } = req.params;
        const classData = await storage.getClassById(classId);
        if (!classData) {
          return res.status(404).json({ message: "Class not found" });
        }
        res.json(classData);
      } catch (error) {
        console.error("Error fetching class:", error);
        res.status(500).json({ message: "Failed to fetch class" });
      }
    }
  );

  // Create a new class
  app.post(
    "/api/schedule/classes",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const classData = insertClassSchema.parse({
          ...req.body,
          studentId: userId,
        });

        // Check for time conflicts
        const hasConflict = await storage.checkTimeConflict(
          userId,
          classData.dayOfWeek || '',
          classData.startTime || '',
          classData.endTime || ''
        );

        if (hasConflict) {
          return res.status(409).json({ 
            message: "Time conflict detected. A class already exists at this time slot.",
            conflict: true
          });
        }

        const newClass = await storage.createClass(classData);
        res.status(201).json(newClass);
      } catch (error) {
        console.error("Error creating class:", error);
        res.status(400).json({ message: "Failed to create class" });
      }
    }
  );

  // Update an existing class
  app.put(
    "/api/schedule/classes/:classId",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const { classId } = req.params;
        const updates = updateClassSchema.parse(req.body);

        // Check for time conflicts if time or day is being updated
        if (updates.dayOfWeek || updates.startTime || updates.endTime) {
          const existingClass = await storage.getClassById(classId);
          if (!existingClass) {
            return res.status(404).json({ message: "Class not found" });
          }

          const dayOfWeek = updates.dayOfWeek || existingClass.dayOfWeek || '';
          const startTime = updates.startTime || existingClass.startTime || '';
          const endTime = updates.endTime || existingClass.endTime || '';

          const hasConflict = await storage.checkTimeConflict(
            userId,
            dayOfWeek,
            startTime,
            endTime,
            classId
          );

          if (hasConflict) {
            return res.status(409).json({ 
              message: "Time conflict detected. Another class exists at this time slot.",
              conflict: true
            });
          }
        }

        const updatedClass = await storage.updateClass(classId, updates);
        res.json(updatedClass);
      } catch (error) {
        console.error("Error updating class:", error);
        res.status(400).json({ message: "Failed to update class" });
      }
    }
  );

  // Delete a class
  app.delete(
    "/api/schedule/classes/:classId",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const { classId } = req.params;
        await storage.deleteClass(classId);
        res.status(204).send();
      } catch (error) {
        console.error("Error deleting class:", error);
        res.status(400).json({ message: "Failed to delete class" });
      }
    }
  );

  /**
   * Comprehensive Analytics API Routes
   *
   * Advanced dashboard metrics and snapshots for enhanced user experience.
   */
  app.get(
    "/api/analytics/dashboard",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const snapshots = await storage.getDashboardSnapshots(userId);
        res.json(snapshots);
      } catch (error) {
        console.error("Error fetching dashboard analytics:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch dashboard analytics" });
      }
    }
  );

  // Activity routes
  app.post(
    "/api/activities",
    isAuthenticated,
    upload.array("files", 5),
    async (req: Request, res: Response) => {
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
    }
  );

  app.get(
    "/api/activities/files/:activityId",
    isAuthenticated,
    async (req, res) => {
      try {
        const { activityId } = req.params;
        const files = await storage.getActivityFiles(activityId);
        res.json(files);
      } catch (error) {
        console.error("Error fetching activity files:", error);
        res.status(500).json({ message: "Failed to fetch files" });
      }
    }
  );

  // Faculty routes
  app.get(
    "/api/faculty/pending-activities",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
          return res.status(403).json({ message: "Access denied" });
        }

        const activities = await storage.getActivitiesByStatus("pending");
        res.json(activities);
      } catch (error) {
        console.error("Error fetching pending activities:", error);
        res.status(500).json({ message: "Failed to fetch pending activities" });
      }
    }
  );

  app.patch(
    "/api/faculty/activities/:activityId/status",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
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
    }
  );

  // Admin routes
  app.get(
    "/api/admin/department-stats",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const stats = await storage.getDepartmentStats();
        res.json(stats);
      } catch (error) {
        console.error("Error fetching department stats:", error);
        res.status(500).json({ message: "Failed to fetch department stats" });
      }
    }
  );

  app.get(
    "/api/admin/category-stats",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const stats = await storage.getCategoryStats();
        res.json(stats);
      } catch (error) {
        console.error("Error fetching category stats:", error);
        res.status(500).json({ message: "Failed to fetch category stats" });
      }
    }
  );

  app.get(
    "/api/admin/student-summary",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const summary = await storage.getStudentSummary();
        res.json(summary);
      } catch (error) {
        console.error("Error fetching student summary:", error);
        res.status(500).json({ message: "Failed to fetch student summary" });
      }
    }
  );

  // Enhanced Analytics Endpoints
  app.get(
    "/api/admin/analytics/trends",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
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
    }
  );

  app.get(
    "/api/admin/analytics/faculty-performance",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const performance = await storage.getFacultyPerformanceStats();
        res.json(performance);
      } catch (error) {
        console.error("Error fetching faculty performance:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch faculty performance" });
      }
    }
  );

  app.get(
    "/api/admin/analytics/naac-metrics",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const metrics = await storage.getNAACMetrics();
        res.json(metrics);
      } catch (error) {
        console.error("Error fetching NAAC metrics:", error);
        res.status(500).json({ message: "Failed to fetch NAAC metrics" });
      }
    }
  );

  app.get(
    "/api/admin/analytics/nirf-metrics",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const metrics = await storage.getNIRFMetrics();
        res.json(metrics);
      } catch (error) {
        console.error("Error fetching NIRF metrics:", error);
        res.status(500).json({ message: "Failed to fetch NIRF metrics" });
      }
    }
  );

  app.get(
    "/api/admin/analytics/date-range",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const { startDate, endDate, department } = req.query;

        if (!startDate || !endDate) {
          return res
            .status(400)
            .json({ message: "Start date and end date are required" });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        const dept = department as string | undefined;

        const analytics = await storage.getAnalyticsByDateRange(
          start,
          end,
          dept
        );
        res.json(analytics);
      } catch (error) {
        console.error("Error fetching date range analytics:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch date range analytics" });
      }
    }
  );

  // CSV Export Endpoints
  app.get(
    "/api/admin/export/csv/:type",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const { type } = req.params;
        const { department, startDate, endDate } = req.query;

        const validTypes = ["activities", "students", "departments"];
        if (!validTypes.includes(type)) {
          return res.status(400).json({ message: "Invalid export type" });
        }

        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;
        const dept = department as string | undefined;

        const data = await storage.getCSVExportData(type, dept, start, end);

        // Convert to CSV format
        const csv = convertToCSV(data);
        const filename = `${type}_export_${
          new Date().toISOString().split("T")[0]
        }.csv`;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
        res.send(csv);
      } catch (error) {
        console.error("Error exporting CSV:", error);
        res.status(500).json({ message: "Failed to export CSV" });
      }
    }
  );

  // NAAC Report PDF Generation
  app.get(
    "/api/admin/reports/naac",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const {
          startDate,
          endDate,
          institutionName = "Higher Education Institution",
        } = req.query;

        // Default to last academic year if no dates provided
        const end = endDate ? new Date(endDate as string) : new Date();
        const start = startDate
          ? new Date(startDate as string)
          : new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());

        // Gather all NAAC data
        const [naacMetrics, categoryStats] = await Promise.all([
          storage.getNAACMetrics(),
          storage.getCategoryStats(),
        ]);

        const reportData: NAACReportData = {
          institutionName: institutionName as string,
          generatedAt: new Date(),
          reportPeriod: { startDate: start, endDate: end },
          studentEngagement: naacMetrics.studentEngagement,
          departmentParticipation: naacMetrics.departmentParticipation,
          facultyInvolvement: naacMetrics.facultyInvolvement,
          qualityMetrics: naacMetrics.qualityMetrics,
          categoryStats,
        };

        const pdfService = new InstitutionalReportPDFService();
        const pdfBuffer = await pdfService.generateNAACReport(reportData);

        const fileName = `NAAC_Compliance_Report_${
          new Date().toISOString().split("T")[0]
        }.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Length", pdfBuffer.length);
        res.send(pdfBuffer);
      } catch (error) {
        console.error("Error generating NAAC report:", error);
        res.status(500).json({
          message: "Failed to generate NAAC report",
          error:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? error.message
                : String(error)
              : undefined,
        });
      }
    }
  );

  // NIRF Report PDF Generation
  app.get(
    "/api/admin/reports/nirf",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const {
          startDate,
          endDate,
          institutionName = "Higher Education Institution",
        } = req.query;

        // Default to last academic year if no dates provided
        const end = endDate ? new Date(endDate as string) : new Date();
        const start = startDate
          ? new Date(startDate as string)
          : new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());

        // Gather all NIRF data
        const [nirfMetrics, trendsData] = await Promise.all([
          storage.getNIRFMetrics(),
          storage.getTrendsData(start, end),
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
          trendsData,
        };

        const pdfService = new InstitutionalReportPDFService();
        const pdfBuffer = await pdfService.generateNIRFReport(reportData);

        const fileName = `NIRF_Performance_Report_${
          new Date().toISOString().split("T")[0]
        }.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Length", pdfBuffer.length);
        res.send(pdfBuffer);
      } catch (error) {
        console.error("Error generating NIRF report:", error);
        res.status(500).json({
          message: "Failed to generate NIRF report",
          error:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? error.message
                : String(error)
              : undefined,
        });
      }
    }
  );

  /**
   * Comprehensive Charts Analytics API Routes
   *
   * Dedicated endpoints for all 18 chart types with optimized data aggregation
   * and performance features. Each endpoint provides data specifically formatted
   * for the corresponding chart component.
   */

  // Phase 1 Analytics Endpoints - Core Academic Charts

  // 1. GPA Trend Analysis
  app.get(
    "/api/analytics/gpa-trends",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const { semesters = 8 } = req.query;

        const gpaData = await storage.getGPATrends(
          userId,
          parseInt(semesters as string)
        );

        res.json({
          success: true,
          data: gpaData,
          metadata: {
            totalSemesters: gpaData.length,
            averageGPA:
              gpaData.reduce((acc, curr) => acc + curr.gpa, 0) / gpaData.length,
            trend:
              gpaData.length > 1
                ? gpaData[gpaData.length - 1].gpa - gpaData[0].gpa > 0
                  ? "improving"
                  : "declining"
                : "stable",
          },
        });
      } catch (error) {
        console.error("Error fetching GPA trends:", error);
        res.status(500).json({ message: "Failed to fetch GPA trend data" });
      }
    }
  );

  // 2. Credits and GPA Analysis
  app.get(
    "/api/analytics/credits-gpa",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const creditsData = await storage.getCreditsGPAAnalysis(userId);

        res.json({
          success: true,
          data: creditsData,
          metadata: {
            totalCredits: creditsData.reduce(
              (acc, curr) => acc + curr.earnedCredits,
              0
            ),
            projectedGraduation:
              creditsData.length > 0
                ? new Date().getFullYear() +
                  Math.ceil(
                    (160 -
                      creditsData[creditsData.length - 1].cumulativeCredits) /
                      20
                  )
                : null,
          },
        });
      } catch (error) {
        console.error("Error fetching credits GPA data:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch credits and GPA analysis" });
      }
    }
  );

  // 3. Cumulative CGPA Progression
  app.get(
    "/api/analytics/cumulative-cgpa",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const cgpaData = await storage.getCumulativeCGPAData(userId);

        res.json({
          success: true,
          data: cgpaData,
          metadata: {
            currentCGPA:
              cgpaData.length > 0 ? cgpaData[cgpaData.length - 1].cgpa : null,
            targetAchievement:
              cgpaData.length > 0
                ? cgpaData[cgpaData.length - 1].cgpa >=
                  cgpaData[cgpaData.length - 1].targetCGPA
                : false,
          },
        });
      } catch (error) {
        console.error("Error fetching cumulative CGPA:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch cumulative CGPA data" });
      }
    }
  );

  // 4. Subject-wise GPA Distribution
  app.get(
    "/api/analytics/subject-gpa",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const { semester } = req.query;

        const subjectData = await storage.getSubjectGPADistribution(
          userId,
          semester as string
        );

        res.json({
          success: true,
          data: subjectData,
          metadata: {
            totalSubjects: subjectData.length,
            highPerformance: subjectData.filter((s) => s.gpa >= 9).length,
            needsImprovement: subjectData.filter((s) => s.gpa < 7).length,
          },
        });
      } catch (error) {
        console.error("Error fetching subject GPA:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch subject GPA distribution" });
      }
    }
  );

  // 5. GPA vs Attendance Correlation
  app.get(
    "/api/analytics/gpa-attendance-correlation",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const correlationData = await storage.getGPAAttendanceCorrelation(
          userId
        );

        // Calculate correlation coefficient
        const n = correlationData.length;
        const sumGPA = correlationData.reduce((acc, curr) => acc + curr.gpa, 0);
        const sumAttendance = correlationData.reduce(
          (acc, curr) => acc + curr.attendance,
          0
        );
        const sumGPAAttendance = correlationData.reduce(
          (acc, curr) => acc + curr.gpa * curr.attendance,
          0
        );
        const sumGPASquared = correlationData.reduce(
          (acc, curr) => acc + curr.gpa * curr.gpa,
          0
        );
        const sumAttendanceSquared = correlationData.reduce(
          (acc, curr) => acc + curr.attendance * curr.attendance,
          0
        );

        const correlation =
          n > 0
            ? (n * sumGPAAttendance - sumGPA * sumAttendance) /
              Math.sqrt(
                (n * sumGPASquared - sumGPA * sumGPA) *
                  (n * sumAttendanceSquared - sumAttendance * sumAttendance)
              )
            : 0;

        res.json({
          success: true,
          data: correlationData,
          metadata: {
            correlationCoefficient: correlation,
            strength:
              Math.abs(correlation) > 0.7
                ? "strong"
                : Math.abs(correlation) > 0.3
                ? "moderate"
                : "weak",
            direction: correlation > 0 ? "positive" : "negative",
          },
        });
      } catch (error) {
        console.error("Error fetching GPA-attendance correlation:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch GPA and attendance correlation" });
      }
    }
  );

  // 6. Skills Assessment Data
  app.get(
    "/api/analytics/skills",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const skillsData = await storage.getSkillsAssessmentData(userId);

        res.json({
          success: true,
          data: skillsData,
          metadata: {
            overallScore:
              skillsData.reduce((acc, curr) => acc + curr.current, 0) /
              skillsData.length,
            targetAchievement:
              skillsData.reduce(
                (acc, curr) => acc + curr.current / curr.target,
                0
              ) / skillsData.length,
            strongestSkill: skillsData.reduce((prev, curr) =>
              prev.current > curr.current ? prev : curr
            ),
            improvementArea: skillsData.reduce((prev, curr) =>
              prev.current < curr.current ? prev : curr
            ),
          },
        });
      } catch (error) {
        console.error("Error fetching skills data:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch skills assessment data" });
      }
    }
  );

  // 7. Skill Growth Progress
  app.get(
    "/api/analytics/skill-growth",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const skillGrowthData = await storage.getSkillGrowthData(userId);

        res.json({
          success: true,
          data: skillGrowthData,
          metadata: {
            totalSkills: skillGrowthData.length,
            averageProgress:
              skillGrowthData.reduce(
                (acc, curr) => acc + curr.progress / curr.target,
                0
              ) / skillGrowthData.length,
            expertLevel: skillGrowthData.filter((s) => s.level === "Expert")
              .length,
            beginnerLevel: skillGrowthData.filter((s) => s.level === "Beginner")
              .length,
          },
        });
      } catch (error) {
        console.error("Error fetching skill growth data:", error);
        res.status(500).json({ message: "Failed to fetch skill growth data" });
      }
    }
  );

  // 8. Achievement Funnel Analysis
  app.get(
    "/api/analytics/achievement-funnel",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const funnelData = await storage.getAchievementFunnelData(userId);

        res.json({
          success: true,
          data: funnelData,
          metadata: {
            conversionRate:
              funnelData.length > 1
                ? (funnelData[funnelData.length - 1].count /
                    funnelData[0].count) *
                  100
                : 0,
            totalSubmissions: funnelData.length > 0 ? funnelData[0].count : 0,
            finalApprovals:
              funnelData.length > 0
                ? funnelData[funnelData.length - 1].count
                : 0,
          },
        });
      } catch (error) {
        console.error("Error fetching achievement funnel:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch achievement funnel data" });
      }
    }
  );

  // Phase 2 Analytics Endpoints - Advanced Analytics

  // 9. Attendance Calendar Heatmap
  app.get(
    "/api/analytics/attendance-heatmap",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const { year = new Date().getFullYear() } = req.query;

        const heatmapData = await storage.getAttendanceHeatmapData(
          userId,
          parseInt(year as string)
        );

        res.json({
          success: true,
          data: heatmapData,
          metadata: {
            year: parseInt(year as string),
            totalDays: heatmapData.length,
            averageAttendance:
              heatmapData.reduce((acc, curr) => acc + curr.attendance, 0) /
              heatmapData.length,
            presentDays: heatmapData.filter((d) => d.status === "present")
              .length,
            absentDays: heatmapData.filter((d) => d.status === "absent").length,
          },
        });
      } catch (error) {
        console.error("Error fetching attendance heatmap:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch attendance heatmap data" });
      }
    }
  );

  // 10. Weekly Attendance Patterns
  app.get(
    "/api/analytics/weekly-patterns",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const { weeks = 12 } = req.query;

        const weeklyData = await storage.getWeeklyAttendancePatterns(
          userId,
          parseInt(weeks as string)
        );

        res.json({
          success: true,
          data: weeklyData,
          metadata: {
            totalWeeks: weeklyData.length,
            bestDay: "monday", // Calculate based on actual data
            worstDay: "friday", // Calculate based on actual data
            weeklyAverage:
              weeklyData.reduce((acc, curr) => acc + curr.weekAverage, 0) /
              weeklyData.length,
          },
        });
      } catch (error) {
        console.error("Error fetching weekly patterns:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch weekly attendance patterns" });
      }
    }
  );

  // 11. Activity Category Distribution
  app.get(
    "/api/analytics/activity-distribution",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const distributionData = await storage.getActivityCategoryDistribution(
          userId
        );

        res.json({
          success: true,
          data: distributionData,
          metadata: {
            totalActivities: distributionData.reduce(
              (acc, curr) => acc + curr.count,
              0
            ),
            mostActiveCategory: distributionData.reduce((prev, curr) =>
              prev.count > curr.count ? prev : curr
            ),
            categoryCount: distributionData.length,
          },
        });
      } catch (error) {
        console.error("Error fetching activity distribution:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch activity category distribution" });
      }
    }
  );

  // 12. Activity Volume Trends
  app.get(
    "/api/analytics/activity-volume",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const { months = 12 } = req.query;

        const volumeData = await storage.getActivityVolumeData(
          userId,
          parseInt(months as string)
        );

        res.json({
          success: true,
          data: volumeData,
          metadata: {
            totalMonths: volumeData.length,
            peakMonth: volumeData.reduce((prev, curr) =>
              prev.total > curr.total ? prev : curr
            ),
            averageMonthly:
              volumeData.reduce((acc, curr) => acc + curr.total, 0) /
              volumeData.length,
          },
        });
      } catch (error) {
        console.error("Error fetching activity volume:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch activity volume data" });
      }
    }
  );

  // 13. Peer Comparison Analysis
  app.get(
    "/api/analytics/peer-comparison",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const peerData = await storage.getPeerComparisonData(
          userId,
          user.department
        );

        res.json({
          success: true,
          data: peerData,
          metadata: {
            department: user.department,
            totalMetrics: peerData.length,
            aboveAverage: peerData.filter(
              (metric) => metric.myValue > metric.median
            ).length,
            topPercentile: peerData.filter(
              (metric) => metric.myValue >= metric.q3
            ).length,
          },
        });
      } catch (error) {
        console.error("Error fetching peer comparison:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch peer comparison data" });
      }
    }
  );

  // 14. Rank Percentile Data
  app.get(
    "/api/analytics/rank-percentile",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const rankData = await storage.getRankPercentileData(userId);

        res.json({
          success: true,
          data: rankData,
          metadata: {
            percentileImprovement: rankData.previousRank
              ? rankData.percentile -
                ((rankData.totalStudents - rankData.previousRank) /
                  rankData.totalStudents) *
                  100
              : 0,
            targetDistance: rankData.target - rankData.currentRank,
            departmentPosition: "top-25%", // Calculate based on department average
          },
        });
      } catch (error) {
        console.error("Error fetching rank percentile:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch rank percentile data" });
      }
    }
  );

  // 15. Department Rankings
  app.get(
    "/api/analytics/department-rankings",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const rankingsData = await storage.getDepartmentRankings();

        res.json({
          success: true,
          data: rankingsData,
          metadata: {
            totalDepartments: rankingsData.length,
            topDepartment: rankingsData.length > 0 ? rankingsData[0] : null,
            averageScore:
              rankingsData.reduce((acc, curr) => acc + curr.overallScore, 0) /
              rankingsData.length,
          },
        });
      } catch (error) {
        console.error("Error fetching department rankings:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch department rankings" });
      }
    }
  );

  // 16. Portfolio Strength Analysis
  app.get(
    "/api/analytics/portfolio-strength",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const portfolioData = await storage.getPortfolioStrengthData(userId);

        res.json({
          success: true,
          data: portfolioData,
          metadata: {
            totalAreas: portfolioData.length,
            strongestArea: portfolioData.reduce((prev, curr) =>
              prev.strength > curr.strength ? prev : curr
            ),
            portfolioScore:
              portfolioData.reduce((acc, curr) => acc + curr.strength, 0) /
              portfolioData.length,
          },
        });
      } catch (error) {
        console.error("Error fetching portfolio strength:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch portfolio strength data" });
      }
    }
  );

  // 17. Approval SLA Metrics
  app.get(
    "/api/analytics/approval-sla",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || (user.role !== "faculty" && user.role !== "admin")) {
          return res.status(403).json({ message: "Access denied" });
        }

        const slaData = await storage.getApprovalSLAData();

        res.json({
          success: true,
          data: slaData,
          metadata: {
            averageApprovalTime:
              slaData.reduce((acc, curr) => acc + curr.avgApprovalTime, 0) /
              slaData.length,
            onTimeRate:
              slaData.reduce((acc, curr) => acc + curr.onTimePercentage, 0) /
              slaData.length,
            totalReviewers: slaData.length,
          },
        });
      } catch (error) {
        console.error("Error fetching approval SLA:", error);
        res.status(500).json({ message: "Failed to fetch approval SLA data" });
      }
    }
  );

  // 18. Grade Correlation Matrix
  app.get(
    "/api/analytics/correlation-matrix",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const correlationData = await storage.getGradeCorrelationMatrix(userId);

        res.json({
          success: true,
          data: correlationData,
          metadata: {
            subjectCount: correlationData.subjects.length,
            strongCorrelations: correlationData.correlationMatrix
              .flat()
              .filter((val) => Math.abs(val) > 0.7).length,
            averageCorrelation:
              correlationData.correlationMatrix
                .flat()
                .reduce(
                  (acc, curr, idx) =>
                    idx % (correlationData.subjects.length + 1) === 0
                      ? acc
                      : acc + Math.abs(curr),
                  0
                ) /
              (correlationData.correlationMatrix.flat().length -
                correlationData.subjects.length),
          },
        });
      } catch (error) {
        console.error("Error fetching correlation matrix:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch grade correlation matrix" });
      }
    }
  );

  // Real-time Analytics Update Endpoint
  app.get(
    "/api/analytics/live-updates",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;

        // Set up Server-Sent Events
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Cache-Control",
        });

        // Send initial data
        const initialData = await storage.getLiveAnalyticsUpdate(userId);
        res.write(`data: ${JSON.stringify(initialData)}\n\n`);

        // Set up periodic updates (every 30 seconds)
        const interval = setInterval(async () => {
          try {
            const updateData = await storage.getLiveAnalyticsUpdate(userId);
            res.write(`data: ${JSON.stringify(updateData)}\n\n`);
          } catch (error) {
            console.error("Error sending live update:", error);
            clearInterval(interval);
            res.end();
          }
        }, 30000);

        // Cleanup on client disconnect
        req.on("close", () => {
          clearInterval(interval);
          res.end();
        });
      } catch (error) {
        console.error("Error setting up live updates:", error);
        res.status(500).json({ message: "Failed to set up live updates" });
      }
    }
  );

  // Batch Analytics Endpoint for Performance Optimization
  app.post(
    "/api/analytics/batch",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const { endpoints } = req.body;

        if (!Array.isArray(endpoints) || endpoints.length === 0) {
          return res.status(400).json({ message: "Invalid endpoints array" });
        }

        const batchResults = await Promise.allSettled(
          endpoints.map(async (endpoint: string) => {
            switch (endpoint) {
              case "gpa-trends":
                return {
                  endpoint,
                  data: await storage.getGPATrends(userId, 8),
                };
              case "skills":
                return {
                  endpoint,
                  data: await storage.getSkillsAssessmentData(userId),
                };
              case "attendance-heatmap":
                return {
                  endpoint,
                  data: await storage.getAttendanceHeatmapData(
                    userId,
                    new Date().getFullYear()
                  ),
                };
              default:
                throw new Error(`Unknown endpoint: ${endpoint}`);
            }
          })
        );

        const successResults = batchResults
          .filter(
            (result): result is PromiseFulfilledResult<any> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);

        const failedResults = batchResults
          .map((result, index) =>
            result.status === "rejected"
              ? { endpoint: endpoints[index], error: result.reason }
              : null
          )
          .filter(Boolean);

        res.json({
          success: true,
          data: successResults,
          errors: failedResults,
          metadata: {
            requested: endpoints.length,
            successful: successResults.length,
            failed: failedResults.length,
          },
        });
      } catch (error) {
        console.error("Error in batch analytics:", error);
        res.status(500).json({ message: "Failed to fetch batch analytics" });
      }
    }
  );

  // Departments routes
  app.get("/api/departments", isAuthenticated, async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.post(
    "/api/departments",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const user = await storage.getUser(
          (req.user as AuthenticatedUser).claims.sub
        );
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }

        const department = await storage.createDepartment(req.body);
        res.status(201).json(department);
      } catch (error) {
        console.error("Error creating department:", error);
        res.status(400).json({ message: "Failed to create department" });
      }
    }
  );

  // File download route
  app.get("/api/files/:filename", isAuthenticated, async (req, res) => {
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
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(filename)}"`
      );
      res.sendFile(resolvedFilePath);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  // ===== ASSIGNMENT ROUTES =====
  
  // Get all assignments
  app.get("/api/assignments", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const assignments = await storage.getAllAssignments();
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  // Get assignment by ID
  app.get("/api/assignments/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await storage.getAssignmentById(id);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      res.json(assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      res.status(500).json({ message: "Failed to fetch assignment" });
    }
  });

  // Create new assignment (faculty/admin only)
  app.post("/api/assignments", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const validatedData = insertAssignmentSchema.parse({
        ...req.body,
        createdBy: userId,
      });

      const assignment = await storage.createAssignment(validatedData);
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(400).json({ message: "Failed to create assignment" });
    }
  });

  // Get student submissions
  app.get("/api/submissions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const submissions = await storage.getSubmissionsByStudent(userId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Get submission for specific assignment and student
  app.get("/api/assignments/:assignmentId/submission", isAuthenticated, async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const userId = (req.user as AuthenticatedUser).claims.sub;
      
      const submission = await storage.getSubmissionByAssignmentAndStudent(assignmentId, userId);
      
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      const files = await storage.getSubmissionFiles(submission.id);
      res.json({ ...submission, files });
    } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({ message: "Failed to fetch submission" });
    }
  });

  // Submit assignment with files
  app.post("/api/assignments/:assignmentId/submit", 
    isAuthenticated,
    upload.array('files', 10),
    async (req, res) => {
      try {
        const { assignmentId } = req.params;
        const userId = (req.user as AuthenticatedUser).claims.sub;
        const files = req.files as Express.Multer.File[];

        // Check if assignment exists
        const assignment = await storage.getAssignmentById(assignmentId);
        if (!assignment) {
          return res.status(404).json({ message: "Assignment not found" });
        }

        // Check if student already has a submission
        const existingSubmission = await storage.getSubmissionByAssignmentAndStudent(assignmentId, userId);
        
        let submission;
        if (existingSubmission) {
          // Update existing submission
          submission = await storage.updateSubmission(existingSubmission.id, {
            status: 'submitted',
          });
        } else {
          // Create new submission
          const validatedData = insertAssignmentSubmissionSchema.parse({
            assignmentId,
            studentId: userId,
            status: 'submitted',
          });
          submission = await storage.createSubmission(validatedData);
        }

        // Add files to submission
        const uploadedFiles = [];
        for (const file of files) {
          const uploadedFile = await storage.addSubmissionFile(
            submission.id,
            file.originalname,
            file.filename,
            file.mimetype,
            file.size
          );
          uploadedFiles.push(uploadedFile);
        }

        res.status(201).json({ 
          submission, 
          files: uploadedFiles,
          message: "Assignment submitted successfully" 
        });
      } catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(400).json({ message: "Failed to submit assignment" });
      }
    }
  );

  // Get submission files
  app.get("/api/submissions/:submissionId/files", isAuthenticated, async (req, res) => {
    try {
      const { submissionId } = req.params;
      const files = await storage.getSubmissionFiles(submissionId);
      res.json(files);
    } catch (error) {
      console.error("Error fetching submission files:", error);
      res.status(500).json({ message: "Failed to fetch submission files" });
    }
  });

  // Delete submission file
  app.delete("/api/files/:fileId", isAuthenticated, async (req, res) => {
    try {
      const { fileId } = req.params;
      await storage.deleteSubmissionFile(fileId);
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Grade submission (faculty/admin only)
  app.patch("/api/submissions/:submissionId/grade", isAuthenticated, async (req, res) => {
    try {
      const { submissionId } = req.params;
      const userId = (req.user as AuthenticatedUser).claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const validatedData = updateAssignmentSubmissionSchema.parse({
        ...req.body,
        status: 'graded',
        gradedBy: userId,
        gradedAt: new Date(),
      });

      const submission = await storage.updateSubmission(submissionId, validatedData);
      res.json(submission);
    } catch (error) {
      console.error("Error grading submission:", error);
      res.status(400).json({ message: "Failed to grade submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
