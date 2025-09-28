/**
 * Database Schema Definition for Student Activity Record Management System
 * 
 * This file defines the complete database schema for a Higher Education Student Activity
 * Management System designed for NAAC/NIRF compliance. It includes tables for users,
 * activities, files, departments, and their relationships.
 * 
 * Key Features:
 * - Multi-role user system (student, faculty, admin)
 * - Activity tracking with verification workflow
 * - File attachment support for certificates
 * - Department-based organization
 * - Comprehensive analytics and reporting
 */

import { sql } from 'drizzle-orm';
// Export sql for use in other files
export { sql };
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Session Storage Table
 * 
 * Stores user session data for Replit Authentication.
 * This table is required by the express-session middleware and Replit Auth integration.
 * Sessions are automatically cleaned up based on expiration time.
 */
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

/**
 * User Role Enumeration
 * 
 * Defines the three main user types in the system:
 * - student: Can upload activities, view portfolio, track progress
 * - faculty: Can approve/reject activities, provide feedback
 * - admin: Can view analytics, manage departments, generate reports
 */
export const userRoleEnum = pgEnum('user_role', ['student', 'faculty', 'admin']);

/**
 * Activity Status Enumeration
 * 
 * Tracks the verification status of student activities:
 * - pending: Recently uploaded, awaiting faculty review
 * - approved: Verified by faculty, counts toward student portfolio
 * - rejected: Not approved by faculty, requires revision or replacement
 */
export const activityStatusEnum = pgEnum('activity_status', ['pending', 'approved', 'rejected']);

/**
 * Activity Category Enumeration
 * 
 * Categorizes student activities for portfolio organization and NAAC compliance:
 * - academic: Research papers, academic competitions, conferences
 * - co-curricular: College events, clubs, societies, sports
 * - extra-curricular: External competitions, cultural activities
 * - volunteering: Community service, social work, NGO activities
 * - internship: Industrial training, company internships
 * - leadership: Student government, team leadership roles
 * - mooc: Online courses, certifications, skill development
 */
export const activityCategoryEnum = pgEnum('activity_category', [
  'academic',
  'co-curricular', 
  'extra-curricular',
  'volunteering',
  'internship',
  'leadership',
  'mooc'
]);

/**
 * Users Table
 * 
 * Central user management table supporting Replit Authentication.
 * Stores user profiles with role-based access control and academic information.
 * 
 * Key Features:
 * - UUID primary keys for security
 * - Role-based access (student/faculty/admin)
 * - Department association for organizational structure
 * - Academic progress tracking (semester, CGPA)
 * - Profile image support
 */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('student').notNull(),
  rollNumber: varchar("roll_number").unique(),
  department: varchar("department"),
  currentSemester: integer("current_semester"),
  cgpa: decimal("cgpa", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Activities Table
 * 
 * Core table storing student achievement and activity records.
 * Each activity goes through a verification workflow managed by faculty.
 * 
 * Workflow:
 * 1. Student uploads activity with details and certificates
 * 2. Activity starts in 'pending' status
 * 3. Faculty reviews and approves/rejects with feedback
 * 4. Approved activities contribute to student portfolio and skill credits
 */
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: activityCategoryEnum("category").notNull(),
  organization: varchar("organization").notNull(),
  activityDate: timestamp("activity_date").notNull(),
  status: activityStatusEnum("status").default('pending').notNull(),
  verifiedBy: varchar("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
  feedback: text("feedback"),
  skillCredits: integer("skill_credits").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Activity Files Table
 * 
 * Stores metadata for files attached to activities (certificates, documents).
 * Files are stored on disk, this table tracks their metadata and relationships.
 * 
 * Security Features:
 * - Path validation to prevent directory traversal
 * - File type restrictions for security
 * - File size tracking for storage management
 */
export const activityFiles = pgTable("activity_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activityId: varchar("activity_id").references(() => activities.id, { onDelete: 'cascade' }).notNull(),
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

/**
 * Departments Table
 * 
 * Organizational structure for academic departments.
 * Links users to their departments and supports department-level analytics.
 * 
 * Features:
 * - Unique department codes for easy reference
 * - Head of Department assignment
 * - Support for department-based reporting
 */
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  code: varchar("code").notNull().unique(),
  headOfDepartment: varchar("head_of_department"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Database Relations
 * 
 * Defines the relationships between tables using Drizzle ORM relations.
 * These relations enable efficient joins and data fetching across related entities.
 */
export const usersRelations = relations(users, ({ many, one }) => ({
  activities: many(activities, { relationName: 'student_activities' }),
  verifiedActivities: many(activities, { relationName: 'faculty_verifications' }),
  department: one(departments, {
    fields: [users.department],
    references: [departments.code],
  }),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  student: one(users, {
    fields: [activities.studentId],
    references: [users.id],
    relationName: 'student_activities'
  }),
  verifier: one(users, {
    fields: [activities.verifiedBy],
    references: [users.id],
    relationName: 'faculty_verifications'
  }),
  files: many(activityFiles),
}));

export const activityFilesRelations = relations(activityFiles, ({ one }) => ({
  activity: one(activities, {
    fields: [activityFiles.activityId],
    references: [activities.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ many, one }) => ({
  users: many(users),
  headOfDepartment: one(users, {
    fields: [departments.headOfDepartment],
    references: [users.id],
  }),
}));

/**
 * Validation Schemas
 * 
 * Zod schemas derived from database tables for request validation.
 * These schemas ensure data integrity and type safety across the API.
 * 
 * Security Features:
 * - Input validation before database operations
 * - Type-safe data handling
 * - Automatic schema generation from database definitions
 */
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  rollNumber: true,
  department: true,
  currentSemester: true,
  cgpa: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  status: true,
  verifiedBy: true,
  verificationDate: true,
  createdAt: true,
  updatedAt: true,
});

export const updateActivityStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
  feedback: z.string().optional(),
  skillCredits: z.number().optional(),
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true,
});

/**
 * Authentication Form Validation Schemas
 * 
 * Professional validation schemas for login and signup forms in the Smart Student Hub.
 * These schemas ensure data integrity and provide user-friendly validation messages
 * suitable for a Higher Education Institution environment.
 */

/**
 * Login Form Validation Schema
 * 
 * Validates user credentials for Replit Auth integration.
 * Since authentication is handled by Replit Auth, only email is collected for user identification.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .toLowerCase(),
});

/**
 * Signup Form Validation Schema
 * 
 * Validation for new user registration in academic institutions.
 * Collects academic information only - authentication is handled by Replit Auth.
 * Includes academic-specific fields like roll number and department.
 */
export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .toLowerCase(),
  rollNumber: z
    .string()
    .min(1, "Roll number is required")
    .min(4, "Roll number must be at least 4 characters")
    .max(20, "Roll number must be less than 20 characters")
    .regex(/^[A-Za-z0-9]+$/, "Roll number can only contain letters and numbers"),
  department: z
    .string()
    .min(1, "Please select your department"),
  currentSemester: z
    .number()
    .min(1, "Semester must be at least 1")
    .max(10, "Semester must be at most 10")
    .int("Semester must be a whole number"),
});

/**
 * Department Options for Academic Institutions
 * 
 * Comprehensive list of common departments in Higher Education Institutions.
 * Used for dropdown selection in signup forms.
 */
export const departmentOptions = [
  { value: "CSE", label: "Computer Science & Engineering" },
  { value: "ECE", label: "Electronics & Communication Engineering" },
  { value: "EEE", label: "Electrical & Electronics Engineering" },
  { value: "MECH", label: "Mechanical Engineering" },
  { value: "CIVIL", label: "Civil Engineering" },
  { value: "CHEM", label: "Chemical Engineering" },
  { value: "AERO", label: "Aeronautical Engineering" },
  { value: "AUTO", label: "Automobile Engineering" },
  { value: "BIOMED", label: "Biomedical Engineering" },
  { value: "BIOTECH", label: "Biotechnology" },
  { value: "IT", label: "Information Technology" },
  { value: "ISE", label: "Information Science & Engineering" },
  { value: "AI", label: "Artificial Intelligence & Machine Learning" },
  { value: "DS", label: "Data Science" },
  { value: "CYBER", label: "Cyber Security" },
  { value: "MATH", label: "Mathematics" },
  { value: "PHYSICS", label: "Physics" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "BBA", label: "Bachelor of Business Administration" },
  { value: "MBA", label: "Master of Business Administration" },
  { value: "MCA", label: "Master of Computer Applications" },
  { value: "BCA", label: "Bachelor of Computer Applications" },
  { value: "COMMERCE", label: "Commerce" },
  { value: "ECONOMICS", label: "Economics" },
  { value: "ENGLISH", label: "English Literature" },
  { value: "OTHER", label: "Other" },
];

/**
 * Semester Options for Academic Progression
 * 
 * Standard semester options for Higher Education tracking.
 */
export const semesterOptions = [
  { value: 1, label: "1st Semester" },
  { value: 2, label: "2nd Semester" },
  { value: 3, label: "3rd Semester" },
  { value: 4, label: "4th Semester" },
  { value: 5, label: "5th Semester" },
  { value: 6, label: "6th Semester" },
  { value: 7, label: "7th Semester" },
  { value: 8, label: "8th Semester" },
  { value: 9, label: "9th Semester" },
  { value: 10, label: "10th Semester" },
];

/**
 * TypeScript Type Definitions
 * 
 * Exported types for use throughout the application.
 * These types ensure consistency between frontend and backend data handling.
 * 
 * Types are automatically inferred from database schemas and validation schemas,
 * ensuring they stay in sync with database structure changes.
 */
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// Activity type is defined at the end of the file

export type UpdateActivityStatus = z.infer<typeof updateActivityStatusSchema>;
export type ActivityFile = typeof activityFiles.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

/**
 * Authentication Form Type Definitions
 * 
 * Inferred types from validation schemas for type safety throughout the application.
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * PDF Portfolio Generation Types
 * 
 * Types specifically for generating student portfolio PDFs.
 * These types ensure type safety when generating professional portfolios.
 */
export interface PortfolioData {
  student: User;
  activities: Activity[];
  stats: {
    totalActivities: number;
    skillCredits: number;
    categoryCounts: Record<string, number>;
    activitiesPerSemester: Record<number, number>;
  };
  generatedAt: Date;
}

export interface PortfolioSection {
  title: string;
  activities: Activity[];
  totalCredits: number;
  count: number;
}

// Test exports to verify module resolution
export const TEST_CONSTANT = 'test';
export interface TestInterface {
  test: string;
}

// Activity type moved to end of file for better visibility
export interface Activity {
  id: string;
  studentId: string;
  title: string;
  description: string | null;
  category: 'academic' | 'co-curricular' | 'extra-curricular' | 'volunteering' | 'internship' | 'leadership' | 'mooc';
  organization: string;
  activityDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  verifiedBy: string | null;
  verificationDate: Date | null;
  feedback: string | null;
  skillCredits: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
