/**
 * Simple Node.js script to run database seeding
 * This script imports and runs the seeding function in a Node.js context
 * where DATABASE_URL should be available through the environment.
 */

import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Try to get the DATABASE_URL from the process environment
console.log('🔍 Checking for DATABASE_URL...');

// Method 1: Direct from environment
if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL found in environment');
} else {
  console.log('⚠️ DATABASE_URL not found in environment, trying to extract from application...');
  
  // Method 2: Try to read from the application process
  try {
    const result = execSync('ps aux | grep "tsx server/index.ts" | grep -v grep', { encoding: 'utf8' });
    if (result) {
      console.log('📱 Application process found, DATABASE_URL should be available to application');
    }
  } catch (error) {
    console.log('⚠️ Could not find application process');
  }
}

// Try to import and run the seeding function
try {
  console.log('🌱 Attempting to import and run seeding function...');
  
  // Dynamic import of the seeding function
  const { seedDatabase } = await import('../server/seed.ts');
  
  console.log('📦 Seeding function imported successfully');
  console.log('🚀 Starting database seeding process...');
  
  await seedDatabase();
  
  console.log('✅ Database seeding completed successfully!');
  process.exit(0);
  
} catch (error) {
  console.error('❌ Error during database seeding:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}