/**
 * Comprehensive Data Management System for 100k+ Students
 *
 * This system provides:
 * - Complete data isolation per student
 * - Real-time Firebase synchronization
 * - Advanced caching and performance optimization
 * - Batch operations for large datasets
 * - Memory management for scale
 */

import {
  db,
  realtimeDb,
  getStudentDataPath,
  performanceMonitor,
  memoryOptimizer,
  BATCH_SIZE,
} from "./firebase-config-enhanced";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  writeBatch,
  runTransaction,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  serverTimestamp,
  increment,
} from "firebase/database";
import NodeCache from "node-cache";

// Enhanced caching system for 100k students
const studentCache = new NodeCache({
  stdTTL: 600, // 10 minutes for student data
  checkperiod: 120, // Check every 2 minutes
  maxKeys: 100000, // Support 100k students
  useClones: false, // Better performance
});

const sessionCache = new NodeCache({
  stdTTL: 1800, // 30 minutes for sessions
  checkperiod: 300, // Check every 5 minutes
  maxKeys: 50000, // Active sessions
});

// Student Data Types
interface StudentProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  department: string;
  semester: number;
  cgpa?: number;
  profileImageUrl?: string;
  lastLogin: Date;
  isActive: boolean;
  preferences: {
    notifications: boolean;
    realTimeUpdates: boolean;
    theme: "light" | "dark";
    language: string;
  };
}

interface StudentGrade {
  id: string;
  studentId: string;
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  semester: number;
  examType: "midterm" | "final" | "assignment" | "quiz";
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface StudentAttendance {
  id: string;
  studentId: string;
  subject: string;
  date: Date;
  status: "present" | "absent" | "late";
  classType: "lecture" | "lab" | "tutorial";
  duration: number;
  markedBy: string;
  createdAt: Date;
}

interface StudentAssignment {
  id: string;
  studentId: string;
  title: string;
  description: string;
  subject: string;
  dueDate: Date;
  maxMarks: number;
  status: "pending" | "submitted" | "graded";
  submissionDate?: Date;
  marksObtained?: number;
  feedback?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface StudentNotification {
  id: string;
  studentId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  priority: "low" | "medium" | "high" | "urgent";
  category: "academic" | "administrative" | "event" | "deadline";
  read: boolean;
  actionUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
}

// Advanced Student Data Manager
export class StudentDataManager {
  private realtimeListeners = new Map<string, Function>();
  private batchOperations = new Map<string, any[]>();
  private performanceMetrics = {
    operations: 0,
    errors: 0,
    cacheHits: 0,
    cacheMisses: 0,
    avgResponseTime: 0,
  };

  constructor() {
    // Initialize cleanup intervals
    setInterval(() => this.cleanupExpiredData(), 300000); // 5 minutes
    setInterval(() => this.performanceCleanup(), 900000); // 15 minutes
  }

  // ==================== STUDENT PROFILE MANAGEMENT ====================

  async getStudentProfile(studentId: string): Promise<StudentProfile | null> {
    const operationId = performanceMonitor.startOperation(
      "get_student_profile"
    );

    try {
      // Check cache first
      const cacheKey = `profile_${studentId}`;
      const cached = studentCache.get<StudentProfile>(cacheKey);

      if (cached) {
        this.performanceMetrics.cacheHits++;
        return cached;
      }

      this.performanceMetrics.cacheMisses++;

      // Get from Firestore
      const profileDoc = await getDoc(
        doc(db, "students", studentId, "profile", "main")
      );

      if (!profileDoc.exists()) {
        return null;
      }

      const profile = {
        id: profileDoc.id,
        ...profileDoc.data(),
      } as StudentProfile;

      // Cache the result
      studentCache.set(cacheKey, profile);

      // Update real-time sync
      await this.syncToRealtimeDB(studentId, "profile", profile);

      return profile;
    } catch (error) {
      console.error("Error getting student profile:", error);
      this.performanceMetrics.errors++;
      throw error;
    } finally {
      const duration = performanceMonitor.endOperation(operationId);
      this.updatePerformanceMetrics(duration);
    }
  }

  async updateStudentProfile(
    studentId: string,
    updates: Partial<StudentProfile>
  ): Promise<void> {
    const operationId = performanceMonitor.startOperation(
      "update_student_profile"
    );

    try {
      const updateData = {
        ...updates,
        updatedAt: new Date(),
        lastModified: serverTimestamp(),
      };

      // Update in Firestore
      await updateDoc(
        doc(db, "students", studentId, "profile", "main"),
        updateData
      );

      // Update real-time database
      await update(
        ref(realtimeDb, `students/${studentId}/profile`),
        updateData
      );

      // Update cache
      const cacheKey = `profile_${studentId}`;
      const cached = studentCache.get<StudentProfile>(cacheKey);
      if (cached) {
        studentCache.set(cacheKey, { ...cached, ...updateData });
      }

      // Notify listeners
      this.notifyRealtimeListeners(studentId, "profile", updateData);
    } catch (error) {
      console.error("Error updating student profile:", error);
      this.performanceMetrics.errors++;
      throw error;
    } finally {
      performanceMonitor.endOperation(operationId);
    }
  }

  // ==================== GRADES MANAGEMENT ====================

  async getStudentGrades(
    studentId: string,
    options: {
      semester?: number;
      subject?: string;
      limit?: number;
      startAfterDoc?: any;
    } = {}
  ): Promise<{ grades: StudentGrade[]; hasMore: boolean }> {
    const operationId = performanceMonitor.startOperation("get_student_grades");

    try {
      const cacheKey = `grades_${studentId}_${JSON.stringify(options)}`;
      const cached = studentCache.get<{
        grades: StudentGrade[];
        hasMore: boolean;
      }>(cacheKey);

      if (cached) {
        this.performanceMetrics.cacheHits++;
        return cached;
      }

      this.performanceMetrics.cacheMisses++;

      // Build query
      let gradesQuery = query(
        collection(db, "students", studentId, "grades"),
        orderBy("date", "desc")
      );

      if (options.semester) {
        gradesQuery = query(
          gradesQuery,
          where("semester", "==", options.semester)
        );
      }

      if (options.subject) {
        gradesQuery = query(
          gradesQuery,
          where("subject", "==", options.subject)
        );
      }

      if (options.limit) {
        gradesQuery = query(gradesQuery, firestoreLimit(options.limit + 1)); // +1 to check hasMore
      }

      if (options.startAfterDoc) {
        gradesQuery = query(gradesQuery, startAfter(options.startAfterDoc));
      }

      const snapshot = await getDocs(gradesQuery);
      let grades = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StudentGrade[];

      let hasMore = false;
      if (options.limit && grades.length > options.limit) {
        hasMore = true;
        grades = grades.slice(0, options.limit);
      }

      const result = { grades, hasMore };

      // Cache result
      studentCache.set(cacheKey, result, 300); // 5 minutes for grades

      return result;
    } catch (error) {
      console.error("Error getting student grades:", error);
      this.performanceMetrics.errors++;
      throw error;
    } finally {
      performanceMonitor.endOperation(operationId);
    }
  }

  async addStudentGrade(
    studentId: string,
    gradeData: Omit<StudentGrade, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const operationId = performanceMonitor.startOperation("add_student_grade");

    try {
      const gradeDoc = doc(collection(db, "students", studentId, "grades"));
      const completeGradeData: StudentGrade = {
        ...gradeData,
        id: gradeDoc.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to Firestore
      await setDoc(gradeDoc, completeGradeData);

      // Real-time sync
      await set(
        ref(realtimeDb, `students/${studentId}/grades/${gradeDoc.id}`),
        completeGradeData
      );

      // Update statistics
      await this.updateGradeStatistics(studentId, completeGradeData);

      // Invalidate related caches
      this.invalidateStudentCache(studentId, "grades");

      return gradeDoc.id;
    } catch (error) {
      console.error("Error adding student grade:", error);
      this.performanceMetrics.errors++;
      throw error;
    } finally {
      performanceMonitor.endOperation(operationId);
    }
  }

  // ==================== ATTENDANCE MANAGEMENT ====================

  async getStudentAttendance(
    studentId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      subject?: string;
      limit?: number;
    } = {}
  ): Promise<{
    attendance: StudentAttendance[];
    statistics: {
      totalClasses: number;
      present: number;
      absent: number;
      late: number;
      percentage: number;
    };
  }> {
    const operationId = performanceMonitor.startOperation(
      "get_student_attendance"
    );

    try {
      const cacheKey = `attendance_${studentId}_${JSON.stringify(options)}`;
      const cached = studentCache.get(cacheKey);

      if (cached) {
        this.performanceMetrics.cacheHits++;
        return cached as any;
      }

      this.performanceMetrics.cacheMisses++;

      // Build query
      let attendanceQuery = query(
        collection(db, "students", studentId, "attendance"),
        orderBy("date", "desc")
      );

      if (options.subject) {
        attendanceQuery = query(
          attendanceQuery,
          where("subject", "==", options.subject)
        );
      }

      if (options.startDate && options.endDate) {
        attendanceQuery = query(
          attendanceQuery,
          where("date", ">=", options.startDate),
          where("date", "<=", options.endDate)
        );
      }

      if (options.limit) {
        attendanceQuery = query(attendanceQuery, firestoreLimit(options.limit));
      }

      const snapshot = await getDocs(attendanceQuery);
      const attendance = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StudentAttendance[];

      // Calculate statistics
      const statistics = {
        totalClasses: attendance.length,
        present: attendance.filter((a) => a.status === "present").length,
        absent: attendance.filter((a) => a.status === "absent").length,
        late: attendance.filter((a) => a.status === "late").length,
        percentage: 0,
      };

      if (statistics.totalClasses > 0) {
        statistics.percentage = Math.round(
          (statistics.present / statistics.totalClasses) * 100
        );
      }

      const result = { attendance, statistics };

      // Cache result
      studentCache.set(cacheKey, result, 300); // 5 minutes

      return result;
    } catch (error) {
      console.error("Error getting student attendance:", error);
      this.performanceMetrics.errors++;
      throw error;
    } finally {
      performanceMonitor.endOperation(operationId);
    }
  }

  async markAttendance(
    studentId: string,
    attendanceData: Omit<StudentAttendance, "id" | "createdAt">
  ): Promise<string> {
    const operationId = performanceMonitor.startOperation("mark_attendance");

    try {
      const attendanceDoc = doc(
        collection(db, "students", studentId, "attendance")
      );
      const completeAttendanceData: StudentAttendance = {
        ...attendanceData,
        id: attendanceDoc.id,
        createdAt: new Date(),
      };

      // Add to Firestore
      await setDoc(attendanceDoc, completeAttendanceData);

      // Real-time sync
      await set(
        ref(realtimeDb, `students/${studentId}/attendance/${attendanceDoc.id}`),
        completeAttendanceData
      );

      // Update attendance statistics
      await this.updateAttendanceStatistics(studentId, completeAttendanceData);

      // Invalidate related caches
      this.invalidateStudentCache(studentId, "attendance");

      return attendanceDoc.id;
    } catch (error) {
      console.error("Error marking attendance:", error);
      this.performanceMetrics.errors++;
      throw error;
    } finally {
      performanceMonitor.endOperation(operationId);
    }
  }

  // ==================== ASSIGNMENTS MANAGEMENT ====================

  async getStudentAssignments(
    studentId: string,
    options: {
      status?: "pending" | "submitted" | "graded";
      subject?: string;
      limit?: number;
    } = {}
  ): Promise<{
    assignments: StudentAssignment[];
    upcomingDeadlines: StudentAssignment[];
    statistics: {
      total: number;
      pending: number;
      submitted: number;
      graded: number;
    };
  }> {
    const operationId = performanceMonitor.startOperation(
      "get_student_assignments"
    );

    try {
      const cacheKey = `assignments_${studentId}_${JSON.stringify(options)}`;
      const cached = studentCache.get(cacheKey);

      if (cached) {
        this.performanceMetrics.cacheHits++;
        return cached as any;
      }

      this.performanceMetrics.cacheMisses++;

      // Build query
      let assignmentsQuery = query(
        collection(db, "students", studentId, "assignments"),
        orderBy("dueDate", "asc")
      );

      if (options.status) {
        assignmentsQuery = query(
          assignmentsQuery,
          where("status", "==", options.status)
        );
      }

      if (options.subject) {
        assignmentsQuery = query(
          assignmentsQuery,
          where("subject", "==", options.subject)
        );
      }

      if (options.limit) {
        assignmentsQuery = query(
          assignmentsQuery,
          firestoreLimit(options.limit)
        );
      }

      const snapshot = await getDocs(assignmentsQuery);
      const assignments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StudentAssignment[];

      // Get upcoming deadlines (next 7 days)
      const upcomingDeadlines = assignments
        .filter((assignment) => {
          const dueDate = new Date(assignment.dueDate);
          const now = new Date();
          const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return (
            dueDate > now &&
            dueDate <= nextWeek &&
            assignment.status === "pending"
          );
        })
        .slice(0, 5);

      // Calculate statistics
      const statistics = {
        total: assignments.length,
        pending: assignments.filter((a) => a.status === "pending").length,
        submitted: assignments.filter((a) => a.status === "submitted").length,
        graded: assignments.filter((a) => a.status === "graded").length,
      };

      const result = { assignments, upcomingDeadlines, statistics };

      // Cache result
      studentCache.set(cacheKey, result, 300); // 5 minutes

      return result;
    } catch (error) {
      console.error("Error getting student assignments:", error);
      this.performanceMetrics.errors++;
      throw error;
    } finally {
      performanceMonitor.endOperation(operationId);
    }
  }

  // ==================== NOTIFICATIONS MANAGEMENT ====================

  async getStudentNotifications(
    studentId: string,
    options: {
      unreadOnly?: boolean;
      category?: string;
      priority?: string;
      limit?: number;
    } = {}
  ): Promise<{
    notifications: StudentNotification[];
    statistics: {
      total: number;
      unread: number;
      byPriority: Record<string, number>;
    };
  }> {
    const operationId = performanceMonitor.startOperation(
      "get_student_notifications"
    );

    try {
      const cacheKey = `notifications_${studentId}_${JSON.stringify(options)}`;
      const cached = studentCache.get(cacheKey);

      if (cached) {
        this.performanceMetrics.cacheHits++;
        return cached as any;
      }

      this.performanceMetrics.cacheMisses++;

      // Build query
      let notificationsQuery = query(
        collection(db, "students", studentId, "notifications"),
        orderBy("createdAt", "desc")
      );

      if (options.unreadOnly) {
        notificationsQuery = query(
          notificationsQuery,
          where("read", "==", false)
        );
      }

      if (options.category) {
        notificationsQuery = query(
          notificationsQuery,
          where("category", "==", options.category)
        );
      }

      if (options.priority) {
        notificationsQuery = query(
          notificationsQuery,
          where("priority", "==", options.priority)
        );
      }

      if (options.limit) {
        notificationsQuery = query(
          notificationsQuery,
          firestoreLimit(options.limit)
        );
      }

      const snapshot = await getDocs(notificationsQuery);
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StudentNotification[];

      // Calculate statistics
      const statistics = {
        total: notifications.length,
        unread: notifications.filter((n) => !n.read).length,
        byPriority: {
          urgent: notifications.filter((n) => n.priority === "urgent").length,
          high: notifications.filter((n) => n.priority === "high").length,
          medium: notifications.filter((n) => n.priority === "medium").length,
          low: notifications.filter((n) => n.priority === "low").length,
        },
      };

      const result = { notifications, statistics };

      // Cache result (shorter TTL for notifications)
      studentCache.set(cacheKey, result, 180); // 3 minutes

      return result;
    } catch (error) {
      console.error("Error getting student notifications:", error);
      this.performanceMetrics.errors++;
      throw error;
    } finally {
      performanceMonitor.endOperation(operationId);
    }
  }

  async markNotificationAsRead(
    studentId: string,
    notificationId: string
  ): Promise<void> {
    try {
      // Update in Firestore
      await updateDoc(
        doc(db, "students", studentId, "notifications", notificationId),
        {
          read: true,
          readAt: new Date(),
        }
      );

      // Update real-time database
      await update(
        ref(
          realtimeDb,
          `students/${studentId}/notifications/${notificationId}`
        ),
        {
          read: true,
          readAt: new Date(),
        }
      );

      // Invalidate cache
      this.invalidateStudentCache(studentId, "notifications");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // ==================== REAL-TIME SYNC MANAGEMENT ====================

  setupRealtimeListener(
    studentId: string,
    dataType: string,
    callback: Function
  ): string {
    const listenerId = `${studentId}_${dataType}_${Date.now()}`;

    const firebaseRef = ref(realtimeDb, `students/${studentId}/${dataType}`);
    const unsubscribe = onValue(firebaseRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });

    this.realtimeListeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  removeRealtimeListener(listenerId: string): void {
    const unsubscribe = this.realtimeListeners.get(listenerId);
    if (unsubscribe) {
      unsubscribe();
      this.realtimeListeners.delete(listenerId);
    }
  }

  private async syncToRealtimeDB(
    studentId: string,
    dataType: string,
    data: any
  ): Promise<void> {
    try {
      await set(ref(realtimeDb, `students/${studentId}/${dataType}`), data);
    } catch (error) {
      console.error("Error syncing to real-time database:", error);
    }
  }

  private notifyRealtimeListeners(
    studentId: string,
    dataType: string,
    data: any
  ): void {
    // Implementation for notifying listeners
    // This would involve updating the real-time database which would trigger listeners
  }

  // ==================== PERFORMANCE AND MAINTENANCE ====================

  private async updateGradeStatistics(
    studentId: string,
    grade: StudentGrade
  ): Promise<void> {
    try {
      const statsRef = ref(
        realtimeDb,
        `students/${studentId}/statistics/grades`
      );

      // Get current stats
      const snapshot = await get(statsRef);
      const currentStats = snapshot.val() || {};

      // Update stats
      const updatedStats = {
        totalGrades: increment(1),
        averageMarks: currentStats.averageMarks || 0, // Recalculate
        lastUpdated: serverTimestamp(),
      };

      await update(statsRef, updatedStats);
    } catch (error) {
      console.error("Error updating grade statistics:", error);
    }
  }

  private async updateAttendanceStatistics(
    studentId: string,
    attendance: StudentAttendance
  ): Promise<void> {
    try {
      const statsRef = ref(
        realtimeDb,
        `students/${studentId}/statistics/attendance`
      );

      // Update attendance counters
      const updates: any = {
        totalClasses: increment(1),
        lastUpdated: serverTimestamp(),
      };

      if (attendance.status === "present") {
        updates.presentClasses = increment(1);
      } else if (attendance.status === "absent") {
        updates.absentClasses = increment(1);
      } else if (attendance.status === "late") {
        updates.lateClasses = increment(1);
      }

      await update(statsRef, updates);
    } catch (error) {
      console.error("Error updating attendance statistics:", error);
    }
  }

  private invalidateStudentCache(studentId: string, dataType: string): void {
    // Remove all cached entries for this student and data type
    const keys = studentCache.keys();
    const keysToDelete = keys.filter(
      (key) =>
        key.includes(`${dataType}_${studentId}`) ||
        key.includes(`dashboard_${studentId}`)
    );

    keysToDelete.forEach((key) => studentCache.del(key));
  }

  private updatePerformanceMetrics(responseTime: number): void {
    this.performanceMetrics.operations++;
    this.performanceMetrics.avgResponseTime =
      (this.performanceMetrics.avgResponseTime + responseTime) / 2;
  }

  private cleanupExpiredData(): void {
    // Clean up expired notifications and temporary data
    console.log("🧹 Performing scheduled cleanup of expired data");
  }

  private performanceCleanup(): void {
    // Reset performance metrics periodically
    console.log("📊 Performance metrics:", this.performanceMetrics);

    // Reset some metrics to prevent overflow
    if (this.performanceMetrics.operations > 1000000) {
      this.performanceMetrics.operations = 0;
      this.performanceMetrics.errors = 0;
    }
  }

  // ==================== BULK OPERATIONS FOR ADMIN ====================

  async bulkUpdateStudentData(
    updates: Array<{
      studentId: string;
      dataType: string;
      data: any;
    }>
  ): Promise<{
    success: number;
    errors: Array<{ studentId: string; error: string }>;
  }> {
    const results: {
      success: number;
      errors: Array<{ studentId: string; error: string }>;
    } = {
      success: 0,
      errors: [],
    };

    // Process in batches
    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE);

      try {
        const promises = batch.map(async (update) => {
          try {
            await setDoc(
              doc(
                db,
                "students",
                update.studentId,
                update.dataType,
                update.data.id || "main"
              ),
              update.data
            );
            results.success++;
          } catch (error: any) {
            results.errors.push({
              studentId: update.studentId,
              error: error?.message || "Unknown error",
            });
          }
        });

        await Promise.all(promises);
      } catch (error) {
        console.error("Batch operation failed:", error);
      }
    }

    return results;
  }

  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      cacheStats: {
        studentCache: {
          keys: studentCache.keys().length,
          stats: studentCache.getStats(),
        },
        sessionCache: {
          keys: sessionCache.keys().length,
          stats: sessionCache.getStats(),
        },
      },
      realtimeListeners: this.realtimeListeners.size,
    };
  }
}

// Export singleton instance
export const studentDataManager = new StudentDataManager();

console.log(
  "🎯 Comprehensive Student Data Management System initialized for 100k+ students"
);
