import 'dotenv/config';
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
    console.log('Starting database connection verification...');
    
    // Import database with new Neon serverless configuration
    const { db } = await import('./db');
    console.log('Testing database connection with simple query...');
    
    // Test database connection with timeout handling
    const connectionTest = await Promise.race([
      db.execute('SELECT 1 as connection_test, NOW() as server_time'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection test timeout after 10 seconds')), 10000)
      )
    ]);
    
    console.log('Database connection successful!');
    console.log('Neon serverless connection established');
    
  } catch (error) {
    console.error('Database connection failed:', error instanceof Error ? error.message : String(error));
    console.log('Warning: Continuing startup despite database issues...');
  }

  // Auto-seed database in development if empty
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log('Checking if database needs seeding...');
      const { db } = await import('./db');
      const { users } = await import('@shared/schema');
      
      // Check if database has any users with timeout protection
      const userCheck = await Promise.race([
        db.select().from(users).limit(1),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('User check timeout after 8 seconds')), 8000)
        )
      ]);
      
      if (Array.isArray(userCheck) && userCheck.length === 0) {
        console.log('No users found in database. Starting auto-seeding...');
        
        const { seedDatabase } = await import('./seed');
        await seedDatabase();
        
        console.log('Database auto-seeding completed successfully!');
      } else {
        console.log('Database already contains data. Skipping auto-seeding.');
      }
    } catch (error) {
      console.error('Warning: Auto-seeding failed, but continuing server startup:', error instanceof Error ? error.message : String(error));
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
