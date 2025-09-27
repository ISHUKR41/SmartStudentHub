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

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum('user_role', ['student', 'faculty', 'admin']);

// Activity status enum
export const activityStatusEnum = pgEnum('activity_status', ['pending', 'approved', 'rejected']);

// Activity category enum
export const activityCategoryEnum = pgEnum('activity_category', [
  'academic',
  'co-curricular', 
  'extra-curricular',
  'volunteering',
  'internship',
  'leadership',
  'mooc'
]);

// Users table for Replit Auth
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

// Activities table
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

// Activity files table
export const activityFiles = pgTable("activity_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activityId: varchar("activity_id").references(() => activities.id, { onDelete: 'cascade' }).notNull(),
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Departments table
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  code: varchar("code").notNull().unique(),
  headOfDepartment: varchar("head_of_department").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
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

// Schemas for validation
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

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type UpdateActivityStatus = z.infer<typeof updateActivityStatusSchema>;
export type ActivityFile = typeof activityFiles.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
