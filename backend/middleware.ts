/**
 * BACKEND MIDDLEWARE FUNCTIONS
 *
 * Custom middleware for authentication, authorization, validation, etc.
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// ==================== AUTHENTICATION MIDDLEWARE ====================

/**
 * Require user to be authenticated
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Please login to access this resource",
    });
  }
  next();
};

/**
 * Require user to have specific role(s)
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};

/**
 * Optional authentication - adds user to request if logged in
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // User will be available in req.session.user if authenticated
  next();
};

// ==================== VALIDATION MIDDLEWARE ====================

/**
 * Validate request body against Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid request body",
        details: error.errors || error.message,
      });
    }
  };
};

/**
 * Validate query parameters against Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid query parameters",
        details: error.errors || error.message,
      });
    }
  };
};

/**
 * Validate route parameters against Zod schema
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid route parameters",
        details: error.errors || error.message,
      });
    }
  };
};

// ==================== ERROR HANDLING MIDDLEWARE ====================

/**
 * Async handler wrapper - catches errors and passes to error handler
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Global error handler
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err);

  // Determine status code
  const statusCode = (err as any).statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    error: err.name || "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong. Please try again later.",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: (err as any).details,
    }),
    timestamp: new Date().toISOString(),
  });
};

// ==================== LOGGING MIDDLEWARE ====================

/**
 * Request logger
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`;

    // Color code by status
    if (res.statusCode >= 500) {
      console.error("❌", logMessage);
    } else if (res.statusCode >= 400) {
      console.warn("⚠️ ", logMessage);
    } else {
      console.log("✅", logMessage);
    }
  });

  next();
};

// ==================== RATE LIMITING ====================

/**
 * Simple in-memory rate limiter
 * For production, use redis-based rate limiting
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
}) => {
  const {
    windowMs,
    max,
    message = "Too many requests, please try again later",
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    // Get or create rate limit record
    let record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      // Create new record
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(identifier, record);
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        error: "Too Many Requests",
        message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    record.count++;
    next();
  };
};

// ==================== OWNERSHIP MIDDLEWARE ====================

/**
 * Check if user owns the resource
 */
export const checkOwnership = (userIdField: string = "studentId") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const resourceUserId = (req.body || req.params || {})[userIdField];

    if (!req.session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (
      resourceUserId &&
      resourceUserId !== req.session.user.id &&
      req.session.user.role !== "admin"
    ) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only access your own resources",
      });
    }

    next();
  };
};

// ==================== PAGINATION MIDDLEWARE ====================

/**
 * Parse and validate pagination parameters
 */
export const pagination = (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const maxLimit = 100;

  // Validate and constrain
  req.query.page = Math.max(1, page).toString();
  req.query.limit = Math.min(Math.max(1, limit), maxLimit).toString();

  next();
};

// ==================== FILE UPLOAD VALIDATION ====================

/**
 * Validate uploaded file type
 */
export const validateFileType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    const fileType = req.file.mimetype;
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({
        error: "Invalid File Type",
        message: `Only ${allowedTypes.join(", ")} files are allowed`,
        received: fileType,
      });
    }

    next();
  };
};

/**
 * Validate file size
 */
export const validateFileSize = (maxSizeInMB: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (req.file.size > maxSizeInBytes) {
      return res.status(400).json({
        error: "File Too Large",
        message: `File size must be less than ${maxSizeInMB}MB`,
        received: `${(req.file.size / 1024 / 1024).toFixed(2)}MB`,
      });
    }

    next();
  };
};

// ==================== CORS CONFIGURATION ====================

/**
 * Custom CORS options
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5000",
      process.env.CLIENT_URL,
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ==================== SANITIZATION ====================

/**
 * Basic XSS sanitization
 */
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Remove any <script> tags from string inputs
  const sanitize = (obj: any): any => {
    if (typeof obj === "string") {
      return obj.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};

export default {
  requireAuth,
  requireRole,
  optionalAuth,
  validateBody,
  validateQuery,
  validateParams,
  asyncHandler,
  notFoundHandler,
  errorHandler,
  requestLogger,
  rateLimit,
  checkOwnership,
  pagination,
  validateFileType,
  validateFileSize,
  corsOptions,
  sanitizeInput,
};
