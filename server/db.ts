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
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for serverless environment
neonConfig.webSocketConstructor = ws;

// Function to construct DATABASE_URL from individual PostgreSQL environment variables
function constructDatabaseUrl(): string {
  const pgHost = process.env.PGHOST?.trim();
  const pgPort = process.env.PGPORT?.trim() || '5432';
  const pgUser = process.env.PGUSER?.trim();
  const pgPassword = process.env.PGPASSWORD?.trim();
  const pgDatabase = process.env.PGDATABASE?.trim();

  if (pgHost && pgUser && pgPassword && pgDatabase) {
    return `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`;
  }

  return '';
}

// Robust database URL resolution with multiple fallback options
function resolveDatabaseUrl(): string {
  console.log('Resolving database connection...');

  // Step 1: Check if DATABASE_URL is available and valid
  const databaseUrl = process.env.DATABASE_URL?.trim();
  console.log('DATABASE_URL debug info:');
  console.log('- Status:', databaseUrl ? 'configured' : 'missing/empty');
  console.log('- Type:', typeof process.env.DATABASE_URL);
  console.log('- Length:', process.env.DATABASE_URL?.length);

  if (databaseUrl && databaseUrl.length > 0) {
    console.log('✓ Using DATABASE_URL from environment');
    return databaseUrl;
  }

  // Step 2: Try to construct from individual PG variables
  console.log('DATABASE_URL empty/missing, trying individual PG variables...');
  const constructedUrl = constructDatabaseUrl();
  
  if (constructedUrl) {
    console.log('✓ Successfully constructed DATABASE_URL from PG variables');
    console.log('- PGHOST:', process.env.PGHOST ? 'set' : 'missing');
    console.log('- PGPORT:', process.env.PGPORT || '5432 (default)');
    console.log('- PGUSER:', process.env.PGUSER ? 'set' : 'missing');
    console.log('- PGPASSWORD:', process.env.PGPASSWORD ? 'set' : 'missing');
    console.log('- PGDATABASE:', process.env.PGDATABASE ? 'set' : 'missing');
    return constructedUrl;
  }

  // Step 3: Development environment fallback
  if (process.env.NODE_ENV === 'development') {
    console.log('Development environment detected, checking for Replit database provisioning...');
    
    // Check if Replit has provided any database environment variables
    const replitDbVars = Object.keys(process.env).filter(key => 
      key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('NEON')
    );
    
    if (replitDbVars.length > 0) {
      console.log('Available database-related environment variables:', replitDbVars);
    }

    // If running in development and no database URL is found, provide helpful guidance
    console.warn('⚠️  No database connection string available');
    console.warn('   This might indicate that the database hasn\'t been properly provisioned.');
    console.warn('   Please check the following:');
    console.warn('   1. Verify that the Replit database is properly set up');
    console.warn('   2. Check that DATABASE_URL is set in Replit secrets');
    console.warn('   3. Ensure PG variables (PGHOST, PGUSER, PGPASSWORD, PGDATABASE) are configured');
    
    // Provide a development fallback to prevent complete application failure
    throw new Error(
      'Database connection not available. Please configure DATABASE_URL or individual PG environment variables. ' +
      'For development, ensure the Replit database is provisioned and secrets are properly configured.'
    );
  }

  // Step 4: Production environment - strict requirements
  console.error('❌ No valid database configuration found');
  console.log('Available environment variables:', Object.keys(process.env).filter(key => 
    key.includes('DATABASE') || key.includes('PG') || key.includes('POSTGRES')
  ));
  
  throw new Error(
    'Database connection required but not configured. Please set DATABASE_URL or configure individual PostgreSQL environment variables (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE).'
  );
}

// Resolve the database URL with fallback logic
const resolvedDatabaseUrl = resolveDatabaseUrl();

// Log database configuration (masking sensitive info for security)
const maskedUrl = resolvedDatabaseUrl.replace(/:(\/\/[^:]+:)[^@]+(@)/, ':$1***$2');
console.log(`Database URL configured: ${maskedUrl}`);
console.log(`Using Neon Serverless driver with WebSocket pooling`);

// Create optimized connection pool for serverless environment
// Pool manages connections efficiently with timeout handling
export const pool = new Pool({ 
  connectionString: resolvedDatabaseUrl,
  // Optimized settings for serverless environment
  max: 1, // Single connection for serverless
  idleTimeoutMillis: 10000, // Close idle connections quickly
  connectionTimeoutMillis: 5000, // 5 second timeout
});

// Initialize Drizzle ORM with schema
export const db = drizzle(pool, { schema });

console.log(`Database connection pool initialized successfully`);
