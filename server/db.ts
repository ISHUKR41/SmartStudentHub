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

// Validate DATABASE_URL exists with better error handling
const databaseUrl = process.env.DATABASE_URL?.trim();
console.log('DATABASE_URL debug info:');
console.log('- Status:', databaseUrl ? 'configured' : 'missing');
console.log('- Type:', typeof process.env.DATABASE_URL);
console.log('- Length:', process.env.DATABASE_URL?.length);

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set or is empty');
  console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE')));
  
  // Try to throw a more descriptive error
  throw new Error(
    "DATABASE_URL must be set and not empty. Check if Replit secrets are properly configured.",
  );
}

// Log database configuration (masking sensitive info for security)
const maskedUrl = databaseUrl.replace(/:(\/\/[^:]+:)[^@]+(@)/, ':$1***$2');
console.log(`Database URL configured: ${maskedUrl}`);
console.log(`Using Neon Serverless driver with WebSocket pooling`);

// Create optimized connection pool for serverless environment
// Pool manages connections efficiently with timeout handling
export const pool = new Pool({ 
  connectionString: databaseUrl,
  // Optimized settings for serverless environment
  max: 1, // Single connection for serverless
  idleTimeoutMillis: 10000, // Close idle connections quickly
  connectionTimeoutMillis: 5000, // 5 second timeout
});

// Initialize Drizzle ORM with schema
export const db = drizzle(pool, { schema });

console.log(`Database connection pool initialized successfully`);
