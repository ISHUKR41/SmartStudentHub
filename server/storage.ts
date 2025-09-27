import {
  users,
  activities,
  activityFiles,
  departments,
  type User,
  type UpsertUser,
  type Activity,
  type InsertActivity,
  type UpdateActivityStatus,
  type ActivityFile,
  type Department,
  type InsertDepartment
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Activity operations
  getActivitiesByStudent(studentId: string): Promise<Activity[]>;
  getActivitiesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Activity[]>;
  getAllActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivityStatus(activityId: string, updates: UpdateActivityStatus, verifierId: string): Promise<Activity>;
  
  // File operations
  addActivityFile(activityId: string, fileName: string, filePath: string, fileType: string, fileSize: number): Promise<ActivityFile>;
  getActivityFiles(activityId: string): Promise<ActivityFile[]>;
  
  // Department operations
  getDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Analytics operations
  getStudentStats(studentId: string): Promise<{ totalActivities: number; skillCredits: number; pendingApprovals: number }>;
  getDepartmentStats(): Promise<{ department: string; studentCount: number; activityCount: number; avgActivitiesPerStudent: number }[]>;
  getCategoryStats(): Promise<{ category: string; count: number; percentage: number }[]>;
  getStudentSummary(): Promise<{ student: User; totalActivities: number; skillCredits: number; lastActivity: Date | null }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Activity operations
  async getActivitiesByStudent(studentId: string): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.studentId, studentId))
      .orderBy(desc(activities.createdAt));
  }

  async getActivitiesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.status, status))
      .orderBy(desc(activities.createdAt));
  }

  async getAllActivities(): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }

  async updateActivityStatus(activityId: string, updates: UpdateActivityStatus, verifierId: string): Promise<Activity> {
    const [updatedActivity] = await db
      .update(activities)
      .set({
        ...updates,
        verifiedBy: verifierId,
        verificationDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(activities.id, activityId))
      .returning();
    return updatedActivity;
  }

  // File operations
  async addActivityFile(activityId: string, fileName: string, filePath: string, fileType: string, fileSize: number): Promise<ActivityFile> {
    const [file] = await db
      .insert(activityFiles)
      .values({
        activityId,
        fileName,
        filePath,
        fileType,
        fileSize,
      })
      .returning();
    return file;
  }

  async getActivityFiles(activityId: string): Promise<ActivityFile[]> {
    return await db
      .select()
      .from(activityFiles)
      .where(eq(activityFiles.activityId, activityId));
  }

  // Department operations
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db
      .insert(departments)
      .values(department)
      .returning();
    return newDepartment;
  }

  // Analytics operations
  async getStudentStats(studentId: string): Promise<{ totalActivities: number; skillCredits: number; pendingApprovals: number }> {
    const [stats] = await db
      .select({
        totalActivities: count(),
        skillCredits: sql<number>`COALESCE(SUM(${activities.skillCredits}), 0)`,
        pendingApprovals: sql<number>`COUNT(CASE WHEN ${activities.status} = 'pending' THEN 1 END)`,
      })
      .from(activities)
      .where(eq(activities.studentId, studentId));
    
    return {
      totalActivities: stats.totalActivities,
      skillCredits: Number(stats.skillCredits),
      pendingApprovals: Number(stats.pendingApprovals),
    };
  }

  async getDepartmentStats(): Promise<{ department: string; studentCount: number; activityCount: number; avgActivitiesPerStudent: number }[]> {
    const stats = await db
      .select({
        department: users.department,
        studentCount: count(sql`DISTINCT ${users.id}`),
        activityCount: count(activities.id),
      })
      .from(users)
      .leftJoin(activities, eq(users.id, activities.studentId))
      .where(eq(users.role, 'student'))
      .groupBy(users.department);

    return stats.map(stat => ({
      department: stat.department || 'Unknown',
      studentCount: stat.studentCount,
      activityCount: stat.activityCount,
      avgActivitiesPerStudent: stat.studentCount > 0 ? stat.activityCount / stat.studentCount : 0,
    }));
  }

  async getCategoryStats(): Promise<{ category: string; count: number; percentage: number }[]> {
    const stats = await db
      .select({
        category: activities.category,
        count: count(),
      })
      .from(activities)
      .groupBy(activities.category);

    const totalActivities = stats.reduce((sum, stat) => sum + stat.count, 0);

    return stats.map(stat => ({
      category: stat.category,
      count: stat.count,
      percentage: totalActivities > 0 ? (stat.count / totalActivities) * 100 : 0,
    }));
  }

  async getStudentSummary(): Promise<{ student: User; totalActivities: number; skillCredits: number; lastActivity: Date | null }[]> {
    const summary = await db
      .select({
        student: users,
        totalActivities: sql<number>`COUNT(${activities.id})`,
        skillCredits: sql<number>`COALESCE(SUM(${activities.skillCredits}), 0)`,
        lastActivity: sql<Date | null>`MAX(${activities.createdAt})`,
      })
      .from(users)
      .leftJoin(activities, eq(users.id, activities.studentId))
      .where(eq(users.role, 'student'))
      .groupBy(users.id);

    return summary.map(item => ({
      student: item.student,
      totalActivities: Number(item.totalActivities),
      skillCredits: Number(item.skillCredits),
      lastActivity: item.lastActivity,
    }));
  }
}

export const storage = new DatabaseStorage();
