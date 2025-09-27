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

// Validate that database URL is configured
// This prevents runtime errors and provides clear error messages for setup issues
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool for efficient database connections
// Pool manages multiple connections and handles connection reuse
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize Drizzle ORM with schema and connection pool
// This provides type-safe database operations throughout the application
export const db = drizzle({ client: pool, schema });
