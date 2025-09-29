import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./vite";

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

// Initialize database connection and routes for serverless environment
const initializeApp = async () => {
  // Database startup logging and verification
  try {
    console.log("Starting database connection verification...");

    // Import database with new Neon serverless configuration
    const { db } = await import("./db");
    console.log("Testing database connection with simple query...");

    // Test database connection with timeout handling
    const connectionTest = await Promise.race([
      db.execute("SELECT 1 as connection_test, NOW() as server_time"),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Connection test timeout after 10 seconds")),
          10000
        )
      ),
    ]);

    console.log("Database connection successful!");
    console.log("Neon serverless connection established");
  } catch (error) {
    console.error(
      "Database connection failed:",
      error instanceof Error ? error.message : String(error)
    );
    console.log("Warning: Continuing startup despite database issues...");
  }

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  return app;
};

export default initializeApp;
