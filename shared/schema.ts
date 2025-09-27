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
  department: varchar("department").references(() => departments.code),
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
  headOfDepartment: varchar("head_of_department").references(() => users.id),
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
export type Activity = typeof activities.$inferSelect;
export type UpdateActivityStatus = z.infer<typeof updateActivityStatusSchema>;
export type ActivityFile = typeof activityFiles.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
