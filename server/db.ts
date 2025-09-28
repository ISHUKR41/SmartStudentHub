/**
 * Database Connection Configuration
 * 
 * Sets up the database connection using Neon PostgreSQL for the Student Activity
 * Record Management System. This file configures the connection pool and
 * initializes the Drizzle ORM with the complete schema.
 * 
 * Features:
 * - Serverless PostgreSQL connection via Neon
 * - WebSocket support for real-time features
 * - Connection pooling for performance
 * - Schema-aware ORM setup
 * 
 * Environment Requirements:
 * - DATABASE_URL: PostgreSQL connection string (provided by Replit)
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket constructor for Neon serverless connections
// This enables real-time features and improves connection reliability
neonConfig.webSocketConstructor = ws;

// Get database URL with fallback handling for different Replit environments
// This ensures compatibility across development and production environments
function getDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  return dbUrl;
}

// Create connection pool lazily to ensure environment variables are loaded
// Pool manages multiple connections and handles connection reuse
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!db) {
    const connectionString = getDatabaseUrl();
    pool = new Pool({ connectionString });
    db = drizzle({ client: pool, schema });
  }
  return db;
}

function getPool() {
  if (!pool) {
    getDb(); // This will initialize both pool and db
  }
  return pool!;
}

// Export the database instance and pool
// This provides type-safe database operations throughout the application
export { getDb as db, getPool as pool };
