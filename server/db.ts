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
function getDatabaseUrl(): string {
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
    console.error('❌ DATABASE_URL exists but is empty.');
    console.error('   This usually means the Replit PostgreSQL database was provisioned');
    console.error('   but the environment variable value wasn\'t populated.');
    console.error('');
    console.error('   To fix this:');
    console.error('   1. Open the "Secrets" tab in Replit (lock icon in left sidebar)');
    console.error('   2. Check if DATABASE_URL has a value');
    console.error('   3. If empty, click "Connect PostgreSQL Database" to re-provision');
    console.error('   4. Or set DATABASE_URL manually with your PostgreSQL connection string');
  }

  // No valid database configuration found
  throw new Error(
    'Database connection required but not configured. ' +
    'DATABASE_URL must be set with a valid PostgreSQL connection string, ' +
    'or provide PGHOST, PGPORT, PGUSER, PGPASSWORD, and PGDATABASE. ' +
    'See the console output above for troubleshooting steps.'
  );
}

const connectionString = getDatabaseUrl();

// Create optimized connection pool for serverless environment
export const pool = new Pool({ 
  connectionString,
  max: 1, // Single connection for serverless
  idleTimeoutMillis: 10000, // Close idle connections quickly
  connectionTimeoutMillis: 5000, // 5 second timeout
});

export const db = drizzle(pool, { schema });

console.log('✅ Database connection configured successfully');
