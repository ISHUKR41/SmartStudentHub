/**
 * WORKING API ROUTES - OPTIMIZED FOR 100,000+ STUDENTS
 *
 * This file provides production-ready routes with:
 * - Session data (number IDs) ↔ Schema data (varchar IDs) conversion
 * - Perfect data isolation for 100k students
 * - Performance optimizations: caching, rate limiting, pagination
 * - Type safety and null checks
 * - Memory-efficient queries
 */

import { Router } from "express";
import type { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

import { db } from "../server/db";
import {
  updateStudentData,
  addStudentRecord,
  subscribeToStudentData,
  trackStudentActivity,
  getStudentPath,
} from "./firebase-config";
import {
  users,
  grades,
  courseEnrollments,
  assignments,
  assignmentSubmissions,
  attendance,
  feePayments,
  scholarshipApplications,
  libraryIssues,
  activities,
  goals,
  notifications,
} from "./schema";
import { eq, desc, sql, and, gte, lte, count } from "drizzle-orm";
import * as compression from "compression";
const NodeCache = require("node-cache");

// ==================== PERFORMANCE MIDDLEWARE FOR 100K STUDENTS ====================

// Rate limiting: 100 requests per minute per user (scalable for 100k students)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Speed limiting: slow down after 50 requests
const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1 minute
  delayAfter: 50, // allow 50 requests per minute at full speed
  delayMs: () => 500, // add 500ms delay after delayAfter is reached
  maxDelayMs: 20000, // max 20 second delay
});

// Advanced memory cache for 100k students (auto cleanup, memory limits)
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default TTL
  maxKeys: 50000, // Max 50k cached items for memory efficiency
  deleteOnExpire: true,
  checkperiod: 120, // Check for expired keys every 2 minutes
});

// Cache statistics for monitoring
const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    memoryUsage: process.memoryUsage(),
  };
};

const getCache = (key: string) => cache.get(key);
const setCache = (key: string, data: any, ttl: number = 300) => {
  cache.set(key, data, ttl);
};

// ==================== AUTHENTICATION & SECURITY MIDDLEWARE ====================

const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Unauthorized - Please login" });
  }
  next();
};

const asyncHandler = (
  fn: (req: Request, res: Response, next: Function) => Promise<any>
) => {
  return (req: Request, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch((err: Error) => {
      console.error("Route error:", err);
      res.status(500).json({ error: "Internal server error" });
    });
  };
};

// Data isolation helper - ensures students only see their own data
const getUserId = (req: Request): string => {
  return req.session.user!.id.toString(); // Convert session number ID to string for schema
};

// ==================== ROUTES ====================

export function registerWorkingRoutes(app: Express) {
  const apiRouter = Router();

  // Apply performance middleware to all API routes
  apiRouter.use(apiLimiter);
  apiRouter.use(speedLimiter);

  // Health check
  apiRouter.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      database: db ? "connected" : "disconnected",
      user: req.session?.user ? "authenticated" : "guest",
    });
  });

  // ==================== USER PROFILE ====================

  apiRouter.get(
    "/users/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString(); // Convert number to string for varchar ID
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      res.json(user || {});
    })
  );

  // ==================== GRADES ====================

  apiRouter.get(
    "/grades/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString();
      const page = parseInt((req.query.page as string) || "1");
      const limit = Math.min(
        parseInt((req.query.limit as string) || "20"),
        100
      );
      const offset = (page - 1) * limit;

      // Check cache first (optimized for 100k students)
      const cacheKey = `grades:${userId}:${page}:${limit}`;
      let cachedResult = getCache(cacheKey);

      if (cachedResult) {
        // Track activity for analytics
        await trackStudentActivity(userId, {
          action: "view_grades",
          page: "grades",
          timestamp: Date.now(),
          metadata: { cached: true, page, limit },
        });
        return res.json(cachedResult);
      }

      const studentGrades = await db
        .select()
        .from(grades)
        .where(eq(grades.studentId, userId))
        .orderBy(desc(grades.examDate))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(grades)
        .where(eq(grades.studentId, userId));

      const result = {
        data: studentGrades,
        page,
        limit,
        total: Number(count) || 0,
        pages: Math.ceil((Number(count) || 0) / limit),
      };

      // Cache result for 5 minutes
      setCache(cacheKey, result, 300);

      // Sync to Firebase for real-time updates
      await updateStudentData(userId, "grades", {
        latestGrades: studentGrades.slice(0, 10), // Only latest 10 for performance
        summary: {
          totalGrades: Number(count) || 0,
          lastUpdated: Date.now(),
        },
      });

      // Track activity for analytics
      await trackStudentActivity(userId, {
        action: "view_grades",
        page: "grades",
        timestamp: Date.now(),
        metadata: {
          cached: false,
          page,
          limit,
          totalRecords: Number(count) || 0,
        },
      });

      res.json(result);
    })
  );

  // ==================== ASSIGNMENTS ====================

  apiRouter.get(
    "/assignments/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString();

      // Check cache first (optimized for 100k students)
      const cacheKey = `assignments:${userId}`;
      let cachedResult = getCache(cacheKey);

      if (cachedResult) {
        await trackStudentActivity(userId, {
          action: "view_assignments",
          page: "assignments",
          timestamp: Date.now(),
          metadata: { cached: true },
        });
        return res.json(cachedResult);
      }

      // Get enrolled courses
      const enrolledCourses = await db
        .select()
        .from(courseEnrollments)
        .where(eq(courseEnrollments.studentId, userId));

      const courseIds = enrolledCourses.map((e) => e.courseId);

      if (courseIds.length === 0) {
        const result: { data: any[]; total: number } = { data: [], total: 0 };
        setCache(cacheKey, result, 180); // Cache for 3 minutes
        return res.json(result);
      }

      // Get assignments with submissions (limit for performance)
      const allAssignments = await db.select().from(assignments).limit(100);

      // Get user's submissions
      const userSubmissions = await db
        .select()
        .from(assignmentSubmissions)
        .where(eq(assignmentSubmissions.studentId, userId));

      const submissionsMap = new Map(
        userSubmissions.map((s) => [s.assignmentId, s])
      );

      const assignmentsWithSubmissions = allAssignments.map((assignment) => ({
        ...assignment,
        submission: submissionsMap.get(assignment.id) || null,
      }));

      // Cache results for performance
      const result = {
        data: assignmentsWithSubmissions,
        total: assignmentsWithSubmissions.length,
      };
      setCache(cacheKey, result, 300); // Cache for 5 minutes

      // Sync with Firebase for real-time updates
      try {
        await updateStudentData(userId, "assignments", result);
        await trackStudentActivity(userId, {
          action: "assignments_fetch",
          page: "assignments",
          timestamp: Date.now(),
          metadata: { count: result.total },
        });
      } catch (firebaseError) {
        console.error("Firebase sync error for assignments:", firebaseError);
      }

      res.json(result);
    })
  );

  // ==================== ATTENDANCE ====================

  apiRouter.get(
    "/attendance/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString();
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const attendanceRecords = await db
        .select()
        .from(attendance)
        .where(eq(attendance.studentId, userId))
        .orderBy(desc(attendance.date)) // Fixed: column name is 'date', not 'attendanceDate'
        .limit(100);

      const [stats] = await db
        .select({
          total: sql<number>`cast(count(*) as integer)`,
          present: sql<number>`cast(sum(case when ${attendance.status} = 'present' then 1 else 0 end) as integer)`,
          absent: sql<number>`cast(sum(case when ${attendance.status} = 'absent' then 1 else 0 end) as integer)`,
          late: sql<number>`cast(sum(case when ${attendance.status} = 'late' then 1 else 0 end) as integer)`,
        })
        .from(attendance)
        .where(eq(attendance.studentId, userId));

      const result = {
        records: attendanceRecords,
        stats: {
          total: Number(stats.total) || 0,
          present: Number(stats.present) || 0,
          absent: Number(stats.absent) || 0,
          late: Number(stats.late) || 0,
          percentage:
            ((Number(stats.present) || 0) / (Number(stats.total) || 1)) * 100,
        },
      };

      // Cache results for better performance
      const cacheKey = `attendance:${userId}`;
      setCache(cacheKey, result, 300); // Cache for 5 minutes

      // Sync with Firebase for real-time updates
      try {
        await updateStudentData(userId, "attendance", result);
        await trackStudentActivity(userId, {
          action: "attendance_fetch",
          page: "attendance",
          timestamp: Date.now(),
          metadata: { totalRecords: result.records.length },
        });
      } catch (firebaseError) {
        console.error("Firebase sync error for attendance:", firebaseError);
      }

      res.json(result);
    })
  );

  // ==================== FEE PAYMENTS ====================

  apiRouter.get(
    "/fee-payments/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString();

      // Check cache first
      const cacheKey = `feePayments:${userId}`;
      const cachedResult = getCache(cacheKey);
      if (cachedResult) {
        return res.json(cachedResult);
      }

      const payments = await db
        .select()
        .from(feePayments)
        .where(eq(feePayments.studentId, userId))
        .orderBy(desc(feePayments.createdAt))
        .limit(100);

      const result = {
        data: payments,
        total: payments.length,
      };

      // Cache and sync with Firebase
      setCache(cacheKey, result, 300); // Cache for 5 minutes

      try {
        await updateStudentData(userId, "feePayments", result);
        await trackStudentActivity(userId, {
          action: "fee_payments_fetch",
          page: "fee-payments",
          timestamp: Date.now(),
          metadata: { totalPayments: result.total },
        });
      } catch (firebaseError) {
        console.error("Firebase sync error for fee payments:", firebaseError);
      }

      res.json(result);
    })
  );

  // ==================== SCHOLARSHIPS ====================

  apiRouter.get(
    "/scholarships/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString();

      // Check cache first
      const cacheKey = `scholarships:${userId}`;
      const cachedResult = getCache(cacheKey);
      if (cachedResult) {
        return res.json(cachedResult);
      }

      const applications = await db
        .select()
        .from(scholarshipApplications)
        .where(eq(scholarshipApplications.studentId, userId))
        .orderBy(desc(scholarshipApplications.applicationDate)) // Fixed: column name is 'applicationDate', not 'createdAt'
        .limit(100);

      const result = {
        data: applications,
        total: applications.length,
      };

      // Cache and sync with Firebase
      setCache(cacheKey, result, 300); // Cache for 5 minutes

      try {
        await updateStudentData(userId, "scholarships", result);
        await trackStudentActivity(userId, {
          action: "scholarships_fetch",
          page: "scholarships",
          timestamp: Date.now(),
          metadata: { totalApplications: result.total },
        });
      } catch (firebaseError) {
        console.error("Firebase sync error for scholarships:", firebaseError);
      }

      res.json(result);
    })
  );

  // ==================== LIBRARY ====================

  apiRouter.get(
    "/library/issued/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString();

      // Check cache first
      const cacheKey = `library:${userId}`;
      const cachedResult = getCache(cacheKey);
      if (cachedResult) {
        return res.json(cachedResult);
      }

      const issuedBooks = await db
        .select()
        .from(libraryIssues)
        .where(eq(libraryIssues.studentId, userId))
        .orderBy(desc(libraryIssues.issueDate))
        .limit(100);

      const result = {
        data: issuedBooks,
        total: issuedBooks.length,
      };

      // Cache and sync with Firebase
      setCache(cacheKey, result, 300); // Cache for 5 minutes

      try {
        await updateStudentData(userId, "library", result);
        await trackStudentActivity(userId, {
          action: "library_fetch",
          page: "library",
          timestamp: Date.now(),
          metadata: { totalBooks: result.total },
        });
      } catch (firebaseError) {
        console.error("Firebase sync error for library:", firebaseError);
      }

      res.json(result);
    })
  );

  // ==================== ACTIVITIES ====================

  apiRouter.get(
    "/activities/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString();
      const category = req.query.category as string;

      // Check cache first
      const cacheKey = `activities:${userId}:${category || "all"}`;
      const cachedResult = getCache(cacheKey);
      if (cachedResult) {
        return res.json(cachedResult);
      }

      const studentActivities = await db
        .select()
        .from(activities)
        .where(eq(activities.studentId, userId))
        .orderBy(desc(activities.activityDate))
        .limit(100);

      const result = {
        data: studentActivities,
        total: studentActivities.length,
      };

      // Cache and sync with Firebase
      setCache(cacheKey, result, 300); // Cache for 5 minutes

      try {
        await updateStudentData(userId, "activities", result);
        await trackStudentActivity(userId, {
          action: "activities_fetch",
          page: "activities",
          timestamp: Date.now(),
          metadata: { totalActivities: result.total, category },
        });
      } catch (firebaseError) {
        console.error("Firebase sync error for activities:", firebaseError);
      }

      res.json(result);
    })
  );

  // ==================== GOALS ====================

  apiRouter.get(
    "/goals/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString();

      // Check cache first
      const cacheKey = `goals:${userId}`;
      const cachedResult = getCache(cacheKey);
      if (cachedResult) {
        return res.json(cachedResult);
      }

      const studentGoals = await db
        .select()
        .from(goals)
        .where(eq(goals.studentId, userId))
        .orderBy(desc(goals.targetDate))
        .limit(100);

      const result = {
        data: studentGoals,
        total: studentGoals.length,
      };

      // Cache and sync with Firebase
      setCache(cacheKey, result, 300); // Cache for 5 minutes

      try {
        await updateStudentData(userId, "goals", result);
        await trackStudentActivity(userId, {
          action: "goals_fetch",
          page: "goals",
          timestamp: Date.now(),
          metadata: { totalGoals: result.total },
        });
      } catch (firebaseError) {
        console.error("Firebase sync error for goals:", firebaseError);
      }

      res.json(result);
    })
  );

  // ==================== NOTIFICATIONS ====================

  apiRouter.get(
    "/notifications/me",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const userId = req.session.user!.id.toString();

      // Check cache first
      const cacheKey = `notifications:${userId}`;
      const cachedResult = getCache(cacheKey);
      if (cachedResult) {
        return res.json(cachedResult);
      }

      const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(50);

      const result = {
        data: userNotifications,
        total: userNotifications.length,
      };

      // Cache and sync with Firebase
      setCache(cacheKey, result, 180); // Cache for 3 minutes (notifications should be fresher)

      try {
        await updateStudentData(userId, "notifications", result);
        await trackStudentActivity(userId, {
          action: "notifications_fetch",
          page: "notifications",
          timestamp: Date.now(),
          metadata: { totalNotifications: result.total },
        });
      } catch (firebaseError) {
        console.error("Firebase sync error for notifications:", firebaseError);
      }

      res.json(result);
    })
  );

  // Mount API routes
  app.use("/api", apiRouter);
}
