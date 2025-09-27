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
import { insertActivitySchema, updateActivityStatusSchema } from "@shared/schema";
import { AuthenticatedUser } from "../types/express";
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
  // Initialize Replit Authentication middleware
  await setupAuth(app);

  /**
   * Authentication Routes
   * 
   * Handles user authentication and profile management.
   * All routes require valid authentication tokens.
   */
  app.get('/api/auth/user', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  /**
   * Student Routes
   * 
   * API endpoints for student-specific functionality.
   * Students can manage their activities, view portfolios, and track progress.
   */
  app.get('/api/students/activities', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const activities = await storage.getActivitiesByStudent(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching student activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get('/api/students/stats', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getStudentStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching student stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Activity routes
  app.post('/api/activities', isAuthenticated, upload.array('files', 5), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const activityData = insertActivitySchema.parse({
        ...req.body,
        studentId: userId,
        activityDate: new Date(req.body.activityDate),
      });

      const activity = await storage.createActivity(activityData);

      // Handle file uploads
      if (req.files && req.files.length > 0) {
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
  app.get('/api/faculty/pending-activities', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
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

  app.patch('/api/faculty/activities/:activityId/status', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { activityId } = req.params;
      const updates = updateActivityStatusSchema.parse(req.body);
      
      const updatedActivity = await storage.updateActivityStatus(
        activityId,
        updates,
        req.user.claims.sub
      );

      res.json(updatedActivity);
    } catch (error) {
      console.error("Error updating activity status:", error);
      res.status(400).json({ message: "Failed to update activity status" });
    }
  });

  // Admin routes
  app.get('/api/admin/department-stats', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
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

  app.get('/api/admin/category-stats', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
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

  app.get('/api/admin/student-summary', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
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
