/**
 * BACKEND DATABASE CONFIGURATION
 *
 * Database connection setup using Neon PostgreSQL with Drizzle ORM
 */

import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

// Configure WebSocket for serverless
neonConfig.webSocketConstructor = ws;

// Get database URL from environment
function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Support separate PG variables
  const { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;
  if (PG_HOST && PG_DATABASE && PG_USER && PG_PASSWORD) {
    return `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${
      PG_PORT || 5432
    }/${PG_DATABASE}?sslmode=require`;
  }

  throw new Error(
    "Database configuration not found. Please set DATABASE_URL environment variable or PG_* variables."
  );
}

let connectionString: string;
let db: ReturnType<typeof drizzle> | null = null;

try {
  connectionString = getDatabaseUrl();

  // Create connection pool
  const pool = new Pool({
    connectionString,
    max: 10, // Maximum 10 connections in pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Initialize Drizzle ORM with schema
  db = drizzle(pool, { schema });

  console.log("✅ Database connected successfully");
} catch (error) {
  console.error("❌ Database connection failed:", error);
  console.warn("⚠️  Application will continue without database persistence");
  console.warn("⚠️  Please configure DATABASE_URL to enable data persistence");
}

export { db, schema };
