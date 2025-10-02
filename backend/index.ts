/**
 * BACKEND SERVER ENTRY POINT
 *
 * Express.js server with:
 * - Session management
 * - Authentication
 * - API routes
 * - File upload handling
 * - Error handling
 * - CORS configuration
 */

import express, {
  type Express,
  Request,
  Response,
  NextFunction,
} from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg"; // Import pg Pool for session store
import cors from "cors";
import path from "path";
// Using working-routes.ts - clean implementation with proper type handling
// NOTE: routes.ts and enhanced-routes.ts are kept for reference (as per user requirement: "kuch bhe remove ye delete mat karna")
import { registerWorkingRoutes as registerRoutes } from "./working-routes";
import { db } from "./db";

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files (uploaded files)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Session configuration
const PgSession = connectPgSimple(session);

let sessionStore;
if (process.env.DATABASE_URL) {
  // Use PostgreSQL session store with standard pg Pool (connect-pg-simple requires this)
  const sessionPool = new PgPool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
  });

  sessionStore = new PgSession({
    pool: sessionPool,
    tableName: "sessions",
    createTableIfMissing: true,
  });

  console.log("✅ Using PostgreSQL session store");
} else {
  console.warn("⚠️  Using memory store - sessions will not persist");
  sessionStore = new session.MemoryStore();
}

app.use(
  session({
    store: sessionStore,
    secret:
      process.env.SESSION_SECRET ||
      "smart-student-hub-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
  })
);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// ==================== ROUTES ====================

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    database: db ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Register all API routes
registerRoutes(app);

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ==================== SERVER START ====================

if (require.main === module) {
  app.listen(PORT, () => {
    console.log("");
    console.log("🚀 Smart Student Hub Backend Server");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🔌 API endpoint: http://localhost:${PORT}/api`);
    console.log(`💾 Database: ${db ? "✅ Connected" : "❌ Disconnected"}`);
    console.log(`📁 Uploads: ${path.join(__dirname, "../uploads")}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
  });
}

export default app;
