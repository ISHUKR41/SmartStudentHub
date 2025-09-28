import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Database startup logging and verification
  try {
    console.log('🚀 Starting database configuration verification...');
    
    // Check DATABASE_URL existence and format
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      // Mask credentials for security
      const maskedUrl = dbUrl.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2');
      console.log(`✅ DATABASE_URL configured: ${maskedUrl}`);
      console.log(`📊 URL length: ${dbUrl.length} characters`);
      console.log(`🔐 SSL mode: ${dbUrl.includes('sslmode=') ? 'Configured' : 'Adding SSL automatically'}`);
    } else {
      console.error('❌ DATABASE_URL not found in environment variables');
    }
    
    // Test database connection early
    const { db } = await import('./db');
    console.log('🔌 Testing database connection...');
    
    // This will trigger the connection initialization with SSL config
    await db().execute('SELECT 1 as connection_test');
    console.log('✅ Database connection successful');
    
  } catch (error) {
    console.error('❌ Database configuration failed:', error instanceof Error ? error.message : String(error));
    console.log('⚠️ Continuing startup despite database issues...');
  }

  // Auto-seed database in development if empty
  if (process.env.NODE_ENV === 'development') {
    try {
      const { db } = await import('./db');
      const { users } = await import('@shared/schema');
      
      // Check if database has any users
      const existingUsers = await db().select().from(users).limit(1);
      
      if (existingUsers.length === 0) {
        console.log('No users found in database. Auto-seeding with sample data...');
        
        const { seedDatabase } = await import('./seed');
        await seedDatabase();
        
        console.log('Database auto-seeding completed successfully!');
      } else {
        console.log('INFO: Database already contains data. Skipping auto-seeding.');
      }
    } catch (error) {
      console.error('WARNING: Auto-seeding failed, but continuing server startup:', error);
    }
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
