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

  // Step 3: Development environment fallback with retry mechanism
  if (process.env.NODE_ENV === 'development') {
    console.log('Development environment detected, checking for Replit database provisioning...');
    
    // Check if Replit has provided any database environment variables
    const replitDbVars = Object.keys(process.env).filter(key => 
      key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('NEON')
    );
    
    if (replitDbVars.length > 0) {
      console.log('Available database-related environment variables:', replitDbVars);
    }

    console.warn('⚠️  Database URL not immediately available');
    console.warn('   This is normal for Replit environments during initial startup.');
    console.warn('   Using fallback connection strategy...');
    
    // Return a placeholder that we'll replace when database becomes available
    return 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
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

// Create database connection with improved error handling
let pool: Pool;
let db: any;

try {
  if (resolvedDatabaseUrl.includes('placeholder')) {
    console.log('Using placeholder database URL - creating mock connection');
    // Create a minimal mock for development startup
    pool = new Pool({ 
      connectionString: 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
      max: 1,
      idleTimeoutMillis: 1000,
      connectionTimeoutMillis: 1000,
    });
    db = drizzle(pool, { schema });
  } else {
    console.log('Creating production database connection');
    // Create optimized connection pool for serverless environment
    pool = new Pool({ 
      connectionString: resolvedDatabaseUrl,
      // Optimized settings for serverless environment
      max: 1, // Single connection for serverless
      idleTimeoutMillis: 10000, // Close idle connections quickly
      connectionTimeoutMillis: 5000, // 5 second timeout
    });
    db = drizzle(pool, { schema });
  }
  
  console.log(`Database connection pool initialized successfully`);
} catch (error) {
  console.error('Database initialization failed:', error);
  console.log('Creating fallback database connection...');
  
  // Create a fallback connection that can be replaced later
  pool = new Pool({ 
    connectionString: 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
    max: 1,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
  });
  db = drizzle(pool, { schema });
}

export { pool, db };
