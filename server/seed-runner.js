/**
 * Database Seeding Runner Script
 * 
 * This JavaScript script runs the database seeding to populate the system
 * with professional sample data for ISHU KUMAR and other users.
 * 
 * This script works around TypeScript import issues by using a simple
 * Node.js environment to run the seeding functionality.
 */

import { execSync } from 'child_process';

console.log('🚀 Starting database seeding process...');

try {
  // Run the TypeScript seeding script using tsx
  execSync('cd /home/runner/workspace && npx tsx server/seed.ts', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('✅ Database seeding completed successfully!');
} catch (error) {
  console.error('❌ Error during seeding:', error.message);
  
  // Try alternative approach - run through npm script
  try {
    console.log('🔄 Trying alternative seeding approach...');
    execSync('cd /home/runner/workspace && npm run seed', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log('✅ Database seeding completed via npm script!');
  } catch (altError) {
    console.error('❌ Alternative seeding also failed:', altError.message);
    process.exit(1);
  }
}