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
 * Attendance Status Enumeration
 * 
 * Tracks student attendance status for each class:
 * - present: Student attended the class
 * - absent: Student was absent from the class
 * - late: Student attended but was late
 * - excused: Absence was excused (medical/official)
 */
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'late', 'excused']);

/**
 * Notification Type Enumeration
 * 
 * Types of notifications that can be sent to students:
 * - info: General information notifications
 * - success: Achievement and positive updates
 * - warning: Important warnings and reminders
 * - error: Critical issues that need attention
 */
export const notificationTypeEnum = pgEnum('notification_type', ['info', 'success', 'warning', 'error']);

/**
 * Goal Priority Enumeration
 * 
 * Priority levels for student goals:
 * - low: Optional goals with flexible deadlines
 * - medium: Important goals for academic progress
 * - high: Critical goals that must be completed
 */
export const goalPriorityEnum = pgEnum('goal_priority', ['low', 'medium', 'high']);

/**
 * Goal Status Enumeration
 * 
 * Status of student goals:
 * - active: Currently working on this goal
 * - completed: Goal has been achieved
 * - overdue: Goal deadline has passed without completion
 */
export const goalStatusEnum = pgEnum('goal_status', ['active', 'completed', 'overdue']);

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
 * Subjects Table
 * 
 * Academic subjects/courses offered by the institution.
 * Links to departments and tracks course information for attendance monitoring.
 * 
 * Features:
 * - Subject codes for easy reference
 * - Department association
 * - Credit hours tracking
 * - Semester and year mapping
 */
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  code: varchar("code").notNull().unique(),
  departmentId: varchar("department_id").references(() => departments.id),
  credits: integer("credits").default(3),
  semester: integer("semester").notNull(),
  academicYear: varchar("academic_year").notNull(),
  facultyId: varchar("faculty_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Attendance Table
 * 
 * Student attendance tracking for all subjects.
 * Records daily attendance with status and timestamp.
 * 
 * Features:
 * - Student and subject association
 * - Date and time tracking
 * - Status enumeration (present/absent/late/excused)
 * - Remarks for special cases
 */
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  subjectId: varchar("subject_id").references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  attendanceDate: timestamp("attendance_date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  remarks: text("remarks"),
  markedBy: varchar("marked_by").references(() => users.id),
  markedAt: timestamp("marked_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Notifications Table
 * 
 * Student notification system for real-time updates and alerts.
 * Stores system-generated and manual notifications for student engagement.
 * 
 * Features:
 * - Type-based notification categorization
 * - Read/unread status tracking
 * - Optional action URLs for navigation
 * - Timestamp tracking for chronological ordering
 */
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default('info').notNull(),
  read: boolean("read").default(false).notNull(),
  actionUrl: varchar("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Goals Table
 * 
 * Student goal tracking and progress monitoring system.
 * Enables students to set and track academic and skill development goals.
 * 
 * Features:
 * - Target and current progress tracking
 * - Priority-based categorization
 * - Deadline management
 * - Status tracking (active/completed/overdue)
 */
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  target: integer("target").notNull(),
  current: integer("current").default(0).notNull(),
  deadline: timestamp("deadline").notNull(),
  category: varchar("category").notNull(),
  priority: goalPriorityEnum("priority").default('medium').notNull(),
  status: goalStatusEnum("status").default('active').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Achievements Table
 * 
 * Student achievement and milestone tracking system.
 * Records significant accomplishments, badges, and recognitions.
 * 
 * Features:
 * - Achievement categorization by type
 * - Verification status for credibility
 * - Points system for gamification
 * - Date tracking for chronological display
 */
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  type: varchar("type").notNull(),
  category: varchar("category").notNull(),
  verified: boolean("verified").default(false).notNull(),
  points: integer("points").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Day of Week Enumeration
 * 
 * Days of the week for class scheduling:
 * - monday to sunday: Standard week days
 */
export const dayOfWeekEnum = pgEnum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

/**
 * Recurrence Pattern Enumeration
 * 
 * Recurrence patterns for recurring classes:
 * - none: Single occurrence class
 * - weekly: Repeats every week on the same day
 * - biweekly: Repeats every two weeks
 */
export const recurrencePatternEnum = pgEnum('recurrence_pattern', ['none', 'weekly', 'biweekly']);

/**
 * Classes/Schedule Table
 * 
 * Student class schedule and timetable management.
 * Stores information about scheduled classes including time, location, and instructor details.
 * 
 * Features:
 * - Subject and instructor tracking
 * - Room/location management
 * - Time slot management with start and end times
 * - Day of week scheduling
 * - Support for recurring classes (weekly/biweekly patterns)
 * - Color coding for visual organization
 * - Notes for additional information
 */
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  subjectId: varchar("subject_id").references(() => subjects.id, { onDelete: 'set null' }),
  title: varchar("title").notNull(),
  description: text("description"),
  dayOfWeek: dayOfWeekEnum("day_of_week"),
  startDate: timestamp("start_date"),
  startTime: varchar("start_time").notNull(),
  endTime: varchar("end_time").notNull(),
  room: varchar("room"),
  instructor: varchar("instructor"),
  color: varchar("color").default('#3b82f6'),
  recurrencePattern: recurrencePatternEnum("recurrence_pattern").default('none').notNull(),
  recurrenceEndDate: timestamp("recurrence_end_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Assignment Status Enumeration
 * 
 * Tracks the submission and grading status of assignments:
 * - pending: Assignment created but not yet submitted by student
 * - submitted: Student has submitted the assignment, awaiting grading
 * - graded: Assignment has been graded by faculty
 */
export const assignmentStatusEnum = pgEnum('assignment_status', ['pending', 'submitted', 'graded']);

/**
 * Assignments Table
 * 
 * Course assignments created by faculty for students to complete.
 * Stores assignment details including due dates, marks, and descriptions.
 * 
 * Features:
 * - Assignment title, description, and instructions
 * - Due date tracking
 * - Maximum marks/points
 * - Subject/course association
 * - Created by faculty tracking
 */
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  subject: varchar("subject").notNull(),
  dueDate: timestamp("due_date").notNull(),
  maxMarks: integer("max_marks").notNull(),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Assignment Submissions Table
 * 
 * Student submissions for assignments with file attachments.
 * Tracks submission status, grades, and faculty feedback.
 * 
 * Workflow:
 * 1. Student submits assignment with attached files
 * 2. Submission starts in 'submitted' status
 * 3. Faculty grades and provides feedback
 * 4. Status changes to 'graded' with score and feedback
 * 
 * Features:
 * - Multiple file attachments per submission
 * - Grade and feedback from faculty
 * - Submission timestamp tracking
 * - Late submission detection
 */
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").references(() => assignments.id, { onDelete: 'cascade' }).notNull(),
  studentId: varchar("student_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: assignmentStatusEnum("status").default('submitted').notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  grade: integer("grade"),
  feedback: text("feedback"),
  gradedBy: varchar("graded_by").references(() => users.id),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Assignment Submission Files Table
 * 
 * Files attached to assignment submissions.
 * Stores metadata for uploaded files including path, type, and size.
 * 
 * Security Features:
 * - File type validation (PDF, DOC, DOCX, JPG, PNG)
 * - File size limit enforcement (10MB)
 * - Path validation to prevent directory traversal
 */
export const assignmentSubmissionFiles = pgTable("assignment_submission_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionId: varchar("submission_id").references(() => assignmentSubmissions.id, { onDelete: 'cascade' }).notNull(),
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

/**
 * Analytics Event Type Enumeration
 * 
 * Types of analytics events that can be tracked:
 * - activity: Student activity submissions, approvals, rejections
 * - attendance: Class attendance records
 * - goal: Goal creation, updates, completion
 * - system: System-wide events and milestones
 */
export const analyticsEventTypeEnum = pgEnum('analytics_event_type', ['activity', 'attendance', 'goal', 'system']);

/**
 * Analytics Events Table
 * 
 * Real-time tracking of all student-related events for analytics and insights.
 * This table powers the real-time analytics dashboard with detailed event data.
 * 
 * Features:
 * - Real-time event tracking across all system activities
 * - Flexible payload structure using JSONB for custom data
 * - High-performance indexing for analytics queries
 * - Supports streaming analytics and live dashboard updates
 */
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: analyticsEventTypeEnum("type").notNull(),
  ts: timestamp("ts").defaultNow().notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_analytics_events_student_ts").on(table.studentId, table.ts),
  index("idx_analytics_events_type_ts").on(table.type, table.ts),
]);

/**
 * Analytics Snapshots Table
 * 
 * Pre-computed analytics data for improved dashboard performance.
 * Stores cached results of complex analytics queries with automatic invalidation.
 * 
 * Features:
 * - Caching layer for expensive analytics computations
 * - Range-based data storage (daily, weekly, monthly, yearly)
 * - Automatic cache invalidation with computed timestamps
 * - Optimized for real-time dashboard loading
 */
export const analyticsSnapshots = pgTable("analytics_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  range: varchar("range").notNull(), // 'day', 'week', 'month', 'year'
  computedAt: timestamp("computed_at").defaultNow().notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_analytics_snapshots_student_range").on(table.studentId, table.range),
  index("idx_analytics_snapshots_computed").on(table.computedAt),
]);

/**
 * Database Relations
 * 
 * Defines the relationships between tables using Drizzle ORM relations.
 * These relations enable efficient joins and data fetching across related entities.
 */
export const usersRelations = relations(users, ({ many, one }) => ({
  activities: many(activities, { relationName: 'student_activities' }),
  verifiedActivities: many(activities, { relationName: 'faculty_verifications' }),
  notifications: many(notifications),
  goals: many(goals),
  achievements: many(achievements),
  attendance: many(attendance),
  analyticsEvents: many(analyticsEvents),
  analyticsSnapshots: many(analyticsSnapshots),
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
  subjects: many(subjects),
  headOfDepartment: one(users, {
    fields: [departments.headOfDepartment],
    references: [users.id],
  }),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  department: one(departments, {
    fields: [subjects.departmentId],
    references: [departments.id],
  }),
  faculty: one(users, {
    fields: [subjects.facultyId],
    references: [users.id],
  }),
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(users, {
    fields: [attendance.studentId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [attendance.subjectId],
    references: [subjects.id],
  }),
  markedBy: one(users, {
    fields: [attendance.markedBy],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  student: one(users, {
    fields: [notifications.studentId],
    references: [users.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  student: one(users, {
    fields: [goals.studentId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  student: one(users, {
    fields: [achievements.studentId],
    references: [users.id],
  }),
}));

export const classesRelations = relations(classes, ({ one }) => ({
  student: one(users, {
    fields: [classes.studentId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [classes.subjectId],
    references: [subjects.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [assignments.createdBy],
    references: [users.id],
  }),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one, many }) => ({
  assignment: one(assignments, {
    fields: [assignmentSubmissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(users, {
    fields: [assignmentSubmissions.studentId],
    references: [users.id],
  }),
  gradedBy: one(users, {
    fields: [assignmentSubmissions.gradedBy],
    references: [users.id],
  }),
  files: many(assignmentSubmissionFiles),
}));

export const assignmentSubmissionFilesRelations = relations(assignmentSubmissionFiles, ({ one }) => ({
  submission: one(assignmentSubmissions, {
    fields: [assignmentSubmissionFiles.submissionId],
    references: [assignmentSubmissions.id],
  }),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  student: one(users, {
    fields: [analyticsEvents.studentId],
    references: [users.id],
  }),
}));

export const analyticsSnapshotsRelations = relations(analyticsSnapshots, ({ one }) => ({
  student: one(users, {
    fields: [analyticsSnapshots.studentId],
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

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  markedAt: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateClassSchema = createInsertSchema(classes).omit({
  id: true,
  studentId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  submittedAt: true,
});

export const updateAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  assignmentId: true,
  studentId: true,
  createdAt: true,
  updatedAt: true,
  submittedAt: true,
}).partial();

export const insertAssignmentSubmissionFileSchema = createInsertSchema(assignmentSubmissionFiles).omit({
  id: true,
  uploadedAt: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSnapshotSchema = createInsertSchema(analyticsSnapshots).omit({
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
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type UpdateClass = z.infer<typeof updateClassSchema>;

// Assignment Types
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;
export type UpdateAssignmentSubmission = z.infer<typeof updateAssignmentSubmissionSchema>;
export type AssignmentSubmissionFile = typeof assignmentSubmissionFiles.$inferSelect;
export type InsertAssignmentSubmissionFile = z.infer<typeof insertAssignmentSubmissionFileSchema>;

// Analytics Types
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;
export type InsertAnalyticsSnapshot = z.infer<typeof insertAnalyticsSnapshotSchema>;

/**
 * Advanced Chart Data Type Schemas
 * 
 * Zod schemas for complex chart data structures used in the analytics dashboard.
 * These schemas ensure type safety for advanced visualizations.
 */

// Heatmap Chart Data Schema
export const heatmapCellSchema = z.object({
  date: z.string(),
  hour: z.number().min(0).max(23),
  value: z.number().min(0)
});

// Sankey Diagram Data Schema  
export const sankeyLinkSchema = z.object({
  source: z.string(),
  target: z.string(),
  value: z.number().min(0)
});

// Waterfall Chart Data Schema
export const waterfallStepSchema = z.object({
  label: z.string(),
  value: z.number()
});

// Gantt Timeline Data Schema
export const ganttTaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  start: z.date(),
  end: z.date(),
  progress: z.number().min(0).max(100),
  dependsOn: z.array(z.string()).optional()
});

// Analytics API Response Schemas
export const analyticsDataSchema = z.object({
  heatmapData: z.array(heatmapCellSchema),
  sankeyData: z.array(sankeyLinkSchema),
  waterfallData: z.array(waterfallStepSchema),
  ganttData: z.array(ganttTaskSchema),
  computedAt: z.date(),
  range: z.enum(['day', 'week', 'month', 'year'])
});

// Chart Data Type Exports
export type HeatmapCell = z.infer<typeof heatmapCellSchema>;
export type SankeyLink = z.infer<typeof sankeyLinkSchema>;
export type WaterfallStep = z.infer<typeof waterfallStepSchema>;
export type GanttTask = z.infer<typeof ganttTaskSchema>;
export type AnalyticsData = z.infer<typeof analyticsDataSchema>;

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
