/**
 * Database Connection Configuration
 * 
 * Sets up the database connection using Neon Serverless PostgreSQL for the Student Activity
 * Record Management System. This file configures the connection pool optimized for
 * serverless environments and initializes the Drizzle ORM with the complete schema.
 * 
 * Features:
 * - Neon Serverless PostgreSQL connection (optimized for Replit)
 * - WebSocket-based connection pooling
 * - Automatic connection management and timeout handling
 * - Schema-aware ORM setup
 * 
 * Environment Requirements:
 * - DATABASE_URL: PostgreSQL connection string (provided by Replit)
 *   OR individual variables: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for serverless environment
neonConfig.webSocketConstructor = ws;

// Get database URL from environment, with fallback to constructing from PG* variables
function getDatabaseUrl(): string | null {
  // First, try DATABASE_URL if it exists and is not empty
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (databaseUrl && databaseUrl.length > 0) {
    console.log('✓ Using DATABASE_URL from environment');
    return databaseUrl;
  }

  // If DATABASE_URL is not available, construct from individual PG* variables
  const pgHost = process.env.PGHOST?.trim();
  const pgPort = process.env.PGPORT?.trim() || '5432';
  const pgUser = process.env.PGUSER?.trim();
  const pgPassword = process.env.PGPASSWORD?.trim();
  const pgDatabase = process.env.PGDATABASE?.trim();

  if (pgHost && pgUser && pgPassword && pgDatabase) {
    const constructedUrl = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`;
    console.log('✓ Constructed DATABASE_URL from PG* environment variables');
    return constructedUrl;
  }

  // Check if DATABASE_URL exists but is empty (common in Replit when secrets aren't populated)
  if ('DATABASE_URL' in process.env) {
    console.warn('⚠️  DATABASE_URL exists but is empty.');
    console.warn('   Using in-memory storage instead of PostgreSQL database.');
    console.warn('   Note: Data will not persist across restarts.');
    console.warn('');
    console.warn('   To enable database persistence:');
    console.warn('   1. Open the "Secrets" tab in Replit (lock icon in left sidebar)');
    console.warn('   2. Check if DATABASE_URL has a value');
    console.warn('   3. If empty, click "Connect PostgreSQL Database" to re-provision');
    console.warn('   4. Or set DATABASE_URL manually with your PostgreSQL connection string');
  }

  // No valid database configuration found - return null to use in-memory storage
  return null;
}

const connectionString = getDatabaseUrl();

// Create optimized connection pool for serverless environment only if database is configured
export const pool = connectionString ? new Pool({ 
  connectionString,
  max: 1, // Single connection for serverless
  idleTimeoutMillis: 10000, // Close idle connections quickly
  connectionTimeoutMillis: 5000, // 5 second timeout
}) : null;

export const db = pool ? drizzle(pool, { schema }) : null;

if (db) {
  console.log('✅ Database connection configured successfully');
} else {
  console.log('⚠️  Running with in-memory storage (data will not persist)');
}
