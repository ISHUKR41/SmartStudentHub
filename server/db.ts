/**
 * Database Connection Configuration
 * 
 * Sets up the database connection using PostgreSQL for the Student Activity
 * Record Management System. This file configures the connection pool and
 * initializes the Drizzle ORM with the complete schema.
 * 
 * Features:
 * - Standard PostgreSQL connection (compatible with Replit)
 * - Connection pooling for performance
 * - Schema-aware ORM setup
 * 
 * Environment Requirements:
 * - DATABASE_URL: PostgreSQL connection string (provided by Replit)
 */

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Get database URL with fallback handling for different Replit environments
// This ensures compatibility across development and production environments
function getDatabaseUrl(): string {
  let dbUrl = process.env.DATABASE_URL;
  
  // Try multiple ways to get DATABASE_URL in Replit environment
  if (!dbUrl) {
    // Try different environment variable names that Replit might use
    dbUrl = process.env.REPLIT_DB_URL || 
            process.env.DB_URL || 
            process.env.POSTGRES_URL ||
            process.env.PGURL;
  }
  
  // Try to read from .replit or other config files if env var not available
  if (!dbUrl) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Check if there's a .env file
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const dbMatch = envContent.match(/DATABASE_URL\s*=\s*["']?([^"'\n\r]+)["']?/);
        if (dbMatch) {
          dbUrl = dbMatch[1];
        }
      }
    } catch (error) {
      console.error('Could not read .env file:', error);
    }
  }
  
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
    db = drizzle(pool, { schema });
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
