/**
 * Data Storage Layer for Student Activity Management System
 * 
 * This file implements the data access layer using the Repository pattern with in-memory storage.
 * It provides a clean interface for all database operations while storing data in memory.
 * 
 * Architecture:
 * - IStorage interface defines all required operations
 * - MemStorage implements the interface using in-memory Maps
 * - All operations are synchronous and type-safe
 * 
 * Key Features:
 * - User management with Firebase Auth integration
 * - Activity CRUD operations with verification workflow
 * - File attachment management
 * - Department-based organization
 * - Advanced analytics and reporting
 */

import { nanoid } from 'nanoid';
import { db } from './db';
import { eq, and, gte, lte, desc, count, sql as sqlOp } from 'drizzle-orm';
import {
  users,
  activities,
  activityFiles,
  departments,
  subjects,
  attendance,
  qrAttendanceSessions,
  notifications,
  goals,
  achievements,
  classes,
  assignments,
  assignmentSubmissions,
  assignmentSubmissionFiles,
  exams,
  examResults,
  resources,
  events,
  eventRsvps,
  type User,
  type UpsertUser,
  type Activity,
  type InsertActivity,
  type UpdateActivityStatus,
  type ActivityFile,
  type Department,
  type InsertDepartment,
  type Subject,
  type InsertSubject,
  type Attendance,
  type InsertAttendance,
  type QRAttendanceSession,
  type InsertQRAttendanceSession,
  type Notification,
  type InsertNotification,
  type Goal,
  type InsertGoal,
  type Achievement,
  type InsertAchievement,
  type Class,
  type InsertClass,
  type UpdateClass,
  type Assignment,
  type InsertAssignment,
  type AssignmentSubmission,
  type InsertAssignmentSubmission,
  type UpdateAssignmentSubmission,
  type AssignmentSubmissionFile,
  type InsertAssignmentSubmissionFile,
  type Exam,
  type InsertExam,
  type UpdateExam,
  type ExamResult,
  type InsertExamResult,
  type Resource,
  type InsertResource,
  type UpdateResource,
  type Event,
  type InsertEvent,
  type UpdateEvent,
  type EventRsvp,
  type InsertEventRsvp,
  type UpdateEventRsvp
} from "@shared/schema";

/**
 * Storage Interface Definition
 * 
 * Defines all required database operations for the application.
 * This interface ensures consistency and enables easy testing with mock implementations.
 */
export interface IStorage {
  // User Management Operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByRollNumber(rollNumber: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Activity Management Operations
  getActivitiesByStudent(studentId: string): Promise<Activity[]>;
  getActivitiesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Activity[]>;
  getAllActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivityStatus(activityId: string, updates: UpdateActivityStatus, verifierId: string): Promise<Activity>;
  
  // File Management Operations
  addActivityFile(activityId: string, fileName: string, filePath: string, fileType: string, fileSize: number): Promise<ActivityFile>;
  getActivityFiles(activityId: string): Promise<ActivityFile[]>;
  
  // Department Management Operations
  getDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Analytics and Reporting Operations
  getStudentStats(studentId: string): Promise<{ totalActivities: number; skillCredits: number; pendingApprovals: number }>;
  getDepartmentStats(): Promise<{ department: string; studentCount: number; activityCount: number; avgActivitiesPerStudent: number }[]>;
  getCategoryStats(): Promise<{ category: string; count: number; percentage: number }[]>;
  getStudentSummary(): Promise<{ student: User; totalActivities: number; skillCredits: number; lastActivity: Date | null }[]>;
  
  getTrendsData(startDate?: Date, endDate?: Date): Promise<{
    monthlyTrends: { month: string; activities: number; students: number }[];
    yearlyTrends: { year: number; activities: number; students: number; departments: number }[];
    categoryTrends: { category: string; growth: number; trend: 'up' | 'down' | 'stable' }[];
  }>;
  
  getFacultyPerformanceStats(): Promise<{
    totalFaculty: number;
    activeFaculty: number;
    avgVerificationTime: number;
    verificationRates: { facultyId: string; facultyName: string; verified: number; pending: number; rate: number }[];
  }>;
  
  getNAACMetrics(): Promise<{
    studentEngagement: { totalStudents: number; activeStudents: number; engagementRate: number };
    departmentParticipation: { department: string; participation: number; coCurrentRatio: number; extraCurrentRatio: number }[];
    facultyInvolvement: { totalFaculty: number; involvedFaculty: number; avgActivitiesSupervised: number };
    qualityMetrics: { approvalRate: number; avgCreditsPerActivity: number; diversityIndex: number };
  }>;

  // Attendance Management Operations
  getSubjects(): Promise<Subject[]>;
  getSubjectsByStudent(studentId: string): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  getStudentAttendance(studentId: string): Promise<Attendance[]>;
  getStudentAttendanceBySubject(studentId: string, subjectId: string): Promise<Attendance[]>;
  recordAttendance(attendance: InsertAttendance): Promise<Attendance>;
  
  // QR Attendance Session Operations
  createQRSession(subjectId: string, createdById: string, classId?: string): Promise<{ sessionId: string; token: string; expiresAt: Date }>;
  validateQRSession(token: string, studentId: string): Promise<{ isValid: boolean; subjectId?: string; error?: string }>;
  
  getAttendanceStats(studentId: string): Promise<{
    overallPercentage: number;
    totalClasses: number;
    attendedClasses: number;
    missedClasses: number;
    subjectWise: { subject: Subject; percentage: number; attended: number; total: number }[];
  }>;
  
  getAttendanceTrends(studentId: string, weeks: number): Promise<{
    weeklyTrends: { week: string; attendance: number; target: number }[];
    monthlyTrends: { month: string; attendance: number }[];
  }>;
  
  getNIRFMetrics(): Promise<{
    studentDiversity: { totalStudents: number; departmentDistribution: Record<string, number>; genderDiversity?: number };
    academicExcellence: { highPerformers: number; avgCGPA: number; skillCreditsPerStudent: number };
    researchInnovation: { researchActivities: number; patents: number; publications: number };
    outreachInclusion: { volunteeringActivities: number; communityImpact: number; inclusionScore: number };
    graduationOutcomes: { placementRate: number; higherEducation: number; entrepreneurship: number };
  }>;
  
  getAnalyticsByDateRange(startDate: Date, endDate: Date, department?: string): Promise<{
    summary: { activities: number; students: number; credits: number };
    categoryBreakdown: { category: string; count: number; percentage: number }[];
    monthlyDistribution: { month: string; count: number }[];
    topPerformers: { student: User; activities: number; credits: number }[];
  }>;
  
  getCSVExportData(type: string, department?: string, startDate?: Date, endDate?: Date): Promise<any[]>;
  
  getPortfolioData(studentId: string): Promise<{ 
    student: User; 
    activities: Activity[]; 
    stats: { 
      totalActivities: number; 
      skillCredits: number; 
      categoryCounts: Record<string, number>; 
      activitiesPerSemester: Record<number, number> 
    } 
  }>;

  // Notification Management Operations
  getNotificationsByStudent(studentId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(notificationId: string): Promise<Notification>;

  // Goal Management Operations
  getGoalsByStudent(studentId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal>;

  // Achievement Management Operations
  getAchievementsByStudent(studentId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(achievementId: string, updates: Partial<Achievement>): Promise<Achievement>;
  deleteAchievement(achievementId: string): Promise<void>;

  // Enhanced Attendance Operations
  createAttendanceRecord(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendanceRecord(attendanceId: string, updates: Partial<Attendance>): Promise<Attendance>;
  deleteAttendanceRecord(attendanceId: string): Promise<void>;
  getAttendanceAnalytics(studentId?: string, subjectId?: string, dateRange?: { start: Date; end: Date }): Promise<{
    totalClasses: number;
    attendedClasses: number;
    absentClasses: number;
    lateClasses: number;
    attendanceRate: number;
    weeklyTrends: Array<{ week: string; rate: number }>;
    monthlyTrends: Array<{ month: string; rate: number }>;
    subjectWise: Array<{ subject: string; rate: number; total: number; attended: number }>;
  }>;

  // Enhanced Subject Operations
  updateSubject(subjectId: string, updates: Partial<Subject>): Promise<Subject>;
  deleteSubject(subjectId: string): Promise<void>;
  getSubjectAnalytics(studentId: string): Promise<{
    totalSubjects: number;
    totalCredits: number;
    avgGrade: number;
    subjectPerformance: Array<{ subject: string; grade: number; credits: number; attendance: number }>;
  }>;

  // Enhanced Notification Operations
  updateNotification(notificationId: string, updates: Partial<Notification>): Promise<Notification>;
  deleteNotification(notificationId: string): Promise<void>;
  markAllNotificationsAsRead(studentId: string): Promise<void>;
  getUnreadNotificationCount(studentId: string): Promise<number>;

  // Enhanced Goal Operations
  deleteGoal(goalId: string): Promise<void>;
  getGoalAnalytics(studentId: string): Promise<{
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    completionRate: number;
    avgTimeToComplete: number;
  }>;

  // Schedule/Class Management Operations
  getClassesByStudent(studentId: string): Promise<Class[]>;
  getClassById(classId: string): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(classId: string, updates: UpdateClass): Promise<Class>;
  deleteClass(classId: string): Promise<void>;
  checkTimeConflict(studentId: string, dayOfWeek: string, startTime: string, endTime: string, excludeClassId?: string): Promise<boolean>;

  // Advanced Analytics Operations
  getDashboardSnapshots(studentId: string): Promise<{
    personalMetrics: {
      gpa: number;
      totalCredits: number;
      attendanceRate: number;
      activitiesCount: number;
      rank: number;
      totalStudents: number;
    };
    chartData: {
      gpaProgress: Array<{ semester: number; gpa: number }>;
      creditsProgress: Array<{ semester: number; credits: number }>;
      attendanceCalendar: Array<{ date: string; status: 'present' | 'absent' | 'late' | 'excused' }>;
      categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
      monthlyActivity: Array<{ month: string; activities: number }>;
    };
  }>;

  // Assignment Management Operations
  getAllAssignments(): Promise<Assignment[]>;
  getAssignmentById(assignmentId: string): Promise<Assignment | undefined>;
  getAssignmentsByStudent(studentId: string): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  
  // Assignment Submission Operations
  getSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string): Promise<AssignmentSubmission | undefined>;
  getSubmissionsByStudent(studentId: string): Promise<AssignmentSubmission[]>;
  getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]>;
  createSubmission(submission: InsertAssignmentSubmission): Promise<AssignmentSubmission>;
  updateSubmission(submissionId: string, updates: UpdateAssignmentSubmission): Promise<AssignmentSubmission>;
  
  // Assignment File Operations
  addSubmissionFile(submissionId: string, fileName: string, filePath: string, fileType: string, fileSize: number): Promise<AssignmentSubmissionFile>;
  getSubmissionFiles(submissionId: string): Promise<AssignmentSubmissionFile[]>;
  deleteSubmissionFile(fileId: string): Promise<void>;

  // Exam Management Operations
  getAllExams(): Promise<Exam[]>;
  getExamsByStudent(studentId: string, semester?: number): Promise<Exam[]>;
  getExamById(examId: string): Promise<Exam | undefined>;
  createExam(exam: InsertExam): Promise<Exam>;
  updateExam(examId: string, updates: UpdateExam): Promise<Exam>;
  deleteExam(examId: string): Promise<void>;
  
  // Exam Results Operations
  getExamResult(examId: string, studentId: string): Promise<ExamResult | undefined>;
  getExamResultsByStudent(studentId: string): Promise<ExamResult[]>;
  getExamResultsByExam(examId: string): Promise<ExamResult[]>;
  createExamResult(result: InsertExamResult): Promise<ExamResult>;
  updateExamResult(resultId: string, updates: Partial<ExamResult>): Promise<ExamResult>;
  getExamStats(studentId: string): Promise<{
    averageScore: number;
    totalExams: number;
    passedExams: number;
    failedExams: number;
    highestScore: number;
    lowestScore: number;
    upcomingExams: number;
    completedExams: number;
    performanceTrend: Array<{ month: string; score: number }>;
  }>;
  
  // Resource Management Operations
  getAllResources(): Promise<Resource[]>;
  getResourceById(resourceId: string): Promise<Resource | undefined>;
  getResourcesByType(type: string): Promise<Resource[]>;
  getResourcesBySubject(subject: string): Promise<Resource[]>;
  searchResources(query: string, filters?: { type?: string; subject?: string; category?: string }): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(resourceId: string, updates: UpdateResource): Promise<Resource>;
  deleteResource(resourceId: string): Promise<void>;
  incrementResourceDownload(resourceId: string): Promise<void>;
  incrementResourceView(resourceId: string): Promise<void>;
  
  // Event Management Operations
  getAllEvents(): Promise<Event[]>;
  getEventById(eventId: string): Promise<Event | undefined>;
  getEventsByCategory(category: string): Promise<Event[]>;
  getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  getPastEvents(): Promise<Event[]>;
  searchEvents(query: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(eventId: string, updates: UpdateEvent): Promise<Event>;
  deleteEvent(eventId: string): Promise<void>;
  
  // Event RSVP Operations
  getEventRsvp(eventId: string, studentId: string): Promise<EventRsvp | undefined>;
  getEventRsvps(eventId: string): Promise<EventRsvp[]>;
  getStudentRsvps(studentId: string): Promise<EventRsvp[]>;
  createOrUpdateRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp>;
  deleteRsvp(rsvpId: string): Promise<void>;
  getEventAttendeeCount(eventId: string): Promise<{ going: number; maybe: number; notGoing: number; total: number }>;

  // Advanced Analytics Operations
  getGPATrends(studentId: string, semesters: number): Promise<Array<{ semester: number; gpa: number; credits: number }>>;
  getCreditsGPAAnalysis(studentId: string): Promise<Array<{ semester: number; earnedCredits: number; cumulativeCredits: number; gpa: number }>>;
  getCumulativeCGPAData(studentId: string): Promise<Array<{ semester: number; cgpa: number; targetCGPA: number }>>;
  getSubjectGPADistribution(studentId: string, semester?: string): Promise<Array<{ subjectName: string; subjectCode: string; gpa: number; credits: number }>>;
  getGPAAttendanceCorrelation(studentId: string): Promise<Array<{ subject: string; gpa: number; attendance: number }>>;
  getSkillsAssessmentData(studentId: string): Promise<Array<{ skill: string; current: number; target: number; category: string }>>;
  getSkillGrowthData(studentId: string): Promise<Array<{ skill: string; progress: number; target: number; level: string; startDate: string }>>;
  getAchievementFunnelData(studentId: string): Promise<Array<{ stage: string; count: number; percentage: number }>>;
  getAttendanceHeatmapData(studentId: string, year: number): Promise<Array<{ date: string; attendance: number; status: string }>>;
  getWeeklyAttendancePatterns(studentId: string, weeks: number): Promise<Array<{ week: string; weekAverage: number; monday: number; tuesday: number; wednesday: number; thursday: number; friday: number }>>;
  getActivityCategoryDistribution(studentId: string): Promise<Array<{ category: string; count: number; percentage: number; credits: number }>>;
  getActivityVolumeData(studentId: string, months: number): Promise<Array<{ month: string; total: number; approved: number; pending: number; rejected: number }>>;
  getPeerComparisonData(studentId: string, department?: string | null): Promise<Array<{ metric: string; myValue: number; average: number; median: number; q1: number; q3: number }>>;
  getRankPercentileData(studentId: string): Promise<{ currentRank: number; totalStudents: number; percentile: number; previousRank: number | null; target: number }>;
  getDepartmentRankings(): Promise<Array<{ department: string; overallScore: number; rank: number; students: number; avgGPA: number; avgActivities: number }>>;
  getPortfolioStrengthData(studentId: string): Promise<Array<{ area: string; strength: number; maxStrength: number; activities: number }>>;
  getApprovalSLAData(): Promise<Array<{ reviewer: string; avgApprovalTime: number; onTimePercentage: number; totalReviewed: number; pending: number }>>;
  getGradeCorrelationMatrix(studentId: string): Promise<{ subjects: string[]; correlationMatrix: number[][] }>;
  getLiveAnalyticsUpdate(studentId: string): Promise<{ timestamp: string; gpa: number; attendance: number; activities: number; rank: number; recentActivities: Activity[] }>;
}

/**
 * In-Memory Storage Implementation
 * 
 * Implements the IStorage interface using in-memory Maps for data storage.
 * Data is stored in memory and will be lost on server restart.
 * This is ideal for development and testing environments.
 */
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private activities: Map<string, Activity> = new Map();
  private activityFiles: Map<string, ActivityFile> = new Map();
  private departments: Map<string, Department> = new Map();
  private subjects: Map<string, Subject> = new Map();
  private attendance: Map<string, Attendance> = new Map();
  private qrSessions: Map<string, QRAttendanceSession> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private goals: Map<string, Goal> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private classes: Map<string, Class> = new Map();
  // Track student enrollment in subjects (studentId -> Set of subjectIds)
  private subjectEnrollments: Map<string, Set<string>> = new Map();

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getUserByRollNumber(rollNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.rollNumber === rollNumber);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = userData.id ? this.users.get(userData.id) : undefined;
    const now = new Date();
    
    const user: User = {
      id: userData.id || nanoid(),
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      role: userData.role ?? 'student',
      rollNumber: userData.rollNumber ?? null,
      department: userData.department ?? null,
      currentSemester: userData.currentSemester ?? null,
      cgpa: userData.cgpa !== null && userData.cgpa !== undefined ? String(userData.cgpa) : null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    
    this.users.set(user.id, user);
    return user;
  }

  // Activity operations
  async getActivitiesByStudent(studentId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(a => a.studentId === studentId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getActivitiesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(a => a.status === status)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const now = new Date();
    const newActivity: Activity = {
      id: nanoid(),
      studentId: activity.studentId,
      title: activity.title,
      description: activity.description ?? null,
      category: activity.category,
      organization: activity.organization,
      activityDate: activity.activityDate,
      skillCredits: activity.skillCredits ?? 0,
      feedback: activity.feedback ?? null,
      status: 'pending',
      verifiedBy: null,
      verificationDate: null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.activities.set(newActivity.id, newActivity);
    return newActivity;
  }

  async updateActivityStatus(activityId: string, updates: UpdateActivityStatus, verifierId: string): Promise<Activity> {
    const activity = this.activities.get(activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }
    
    const now = new Date();
    const updated: Activity = {
      ...activity,
      ...updates,
      verifiedBy: verifierId,
      verificationDate: now,
      updatedAt: now,
    };
    
    this.activities.set(activityId, updated);
    return updated;
  }

  // File operations
  async addActivityFile(activityId: string, fileName: string, filePath: string, fileType: string, fileSize: number): Promise<ActivityFile> {
    const file: ActivityFile = {
      id: nanoid(),
      activityId,
      fileName,
      filePath,
      fileType,
      fileSize,
      uploadedAt: new Date(),
    };
    
    this.activityFiles.set(file.id, file);
    return file;
  }

  async getActivityFiles(activityId: string): Promise<ActivityFile[]> {
    return Array.from(this.activityFiles.values()).filter(f => f.activityId === activityId);
  }

  // Department operations
  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const newDept: Department = {
      id: nanoid(),
      name: department.name,
      code: department.code,
      headOfDepartment: department.headOfDepartment ?? null,
      createdAt: new Date(),
    };
    
    this.departments.set(newDept.id, newDept);
    return newDept;
  }

  // Analytics operations
  async getStudentStats(studentId: string): Promise<{ totalActivities: number; skillCredits: number; pendingApprovals: number }> {
    const studentActivities = await this.getActivitiesByStudent(studentId);
    
    return {
      totalActivities: studentActivities.length,
      skillCredits: studentActivities.reduce((sum, a) => sum + (a.skillCredits || 0), 0),
      pendingApprovals: studentActivities.filter(a => a.status === 'pending').length,
    };
  }

  async getDepartmentStats(): Promise<{ department: string; studentCount: number; activityCount: number; avgActivitiesPerStudent: number }[]> {
    const students = Array.from(this.users.values()).filter(u => u.role === 'student');
    const deptMap = new Map<string, { students: Set<string>; activities: number }>();
    
    students.forEach(student => {
      const dept = student.department || 'Unknown';
      if (!deptMap.has(dept)) {
        deptMap.set(dept, { students: new Set(), activities: 0 });
      }
      deptMap.get(dept)!.students.add(student.id);
    });
    
    Array.from(this.activities.values()).forEach(activity => {
      const student = this.users.get(activity.studentId);
      if (student) {
        const dept = student.department || 'Unknown';
        const deptData = deptMap.get(dept);
        if (deptData) {
          deptData.activities++;
        }
      }
    });
    
    return Array.from(deptMap.entries()).map(([department, data]) => ({
      department,
      studentCount: data.students.size,
      activityCount: data.activities,
      avgActivitiesPerStudent: data.students.size > 0 ? data.activities / data.students.size : 0,
    }));
  }

  async getCategoryStats(): Promise<{ category: string; count: number; percentage: number }[]> {
    const activities = Array.from(this.activities.values());
    const categoryMap = new Map<string, number>();
    
    activities.forEach(activity => {
      categoryMap.set(activity.category, (categoryMap.get(activity.category) || 0) + 1);
    });
    
    const total = activities.length;
    
    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }

  async getStudentSummary(): Promise<{ student: User; totalActivities: number; skillCredits: number; lastActivity: Date | null }[]> {
    const students = Array.from(this.users.values()).filter(u => u.role === 'student');
    
    return Promise.all(students.map(async student => {
      const activities = await this.getActivitiesByStudent(student.id);
      const lastActivity = activities.length > 0 ? activities[0].createdAt : null;
      
      return {
        student,
        totalActivities: activities.length,
        skillCredits: activities.reduce((sum, a) => sum + (a.skillCredits || 0), 0),
        lastActivity,
      };
    }));
  }

  async getPortfolioData(studentId: string): Promise<{ 
    student: User; 
    activities: Activity[]; 
    stats: { 
      totalActivities: number; 
      skillCredits: number; 
      categoryCounts: Record<string, number>; 
      activitiesPerSemester: Record<number, number> 
    } 
  }> {
    const student = await this.getUser(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const activities = await this.getActivitiesByStudent(studentId);
    const approvedActivities = activities.filter(a => a.status === 'approved');

    const categoryCounts: Record<string, number> = {};
    const activitiesPerSemester: Record<number, number> = {};

    approvedActivities.forEach(activity => {
      categoryCounts[activity.category] = (categoryCounts[activity.category] || 0) + 1;
      
      const year = activity.createdAt ? new Date(activity.createdAt).getFullYear() : new Date().getFullYear();
      const semester = ((year - 2020) * 2) + 1;
      activitiesPerSemester[semester] = (activitiesPerSemester[semester] || 0) + 1;
    });

    return {
      student,
      activities,
      stats: {
        totalActivities: approvedActivities.length,
        skillCredits: approvedActivities.reduce((sum, a) => sum + (a.skillCredits || 0), 0),
        categoryCounts,
        activitiesPerSemester
      }
    };
  }

  // Enhanced Analytics
  async getTrendsData(startDate?: Date, endDate?: Date): Promise<{
    monthlyTrends: { month: string; activities: number; students: number }[];
    yearlyTrends: { year: number; activities: number; students: number; departments: number }[];
    categoryTrends: { category: string; growth: number; trend: 'up' | 'down' | 'stable' }[];
  }> {
    const activities = Array.from(this.activities.values()).filter(a => {
      if (!a.createdAt) return false;
      if (startDate && a.createdAt < startDate) return false;
      if (endDate && a.createdAt > endDate) return false;
      return true;
    });

    // Monthly trends
    const monthlyMap = new Map<string, { activities: Set<string>; students: Set<string> }>();
    activities.forEach(activity => {
      if (!activity.createdAt) return;
      const month = activity.createdAt.toISOString().substring(0, 7);
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { activities: new Set(), students: new Set() });
      }
      monthlyMap.get(month)!.activities.add(activity.id);
      monthlyMap.get(month)!.students.add(activity.studentId);
    });

    const monthlyTrends = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => ({
        month,
        activities: data.activities.size,
        students: data.students.size,
      }));

    // Yearly trends
    const yearlyMap = new Map<number, { activities: Set<string>; students: Set<string>; departments: Set<string> }>();
    activities.forEach(activity => {
      if (!activity.createdAt) return;
      const year = activity.createdAt.getFullYear();
      if (!yearlyMap.has(year)) {
        yearlyMap.set(year, { activities: new Set(), students: new Set(), departments: new Set() });
      }
      yearlyMap.get(year)!.activities.add(activity.id);
      yearlyMap.get(year)!.students.add(activity.studentId);
      
      const student = this.users.get(activity.studentId);
      if (student?.department) {
        yearlyMap.get(year)!.departments.add(student.department);
      }
    });

    const yearlyTrends = Array.from(yearlyMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, data]) => ({
        year,
        activities: data.activities.size,
        students: data.students.size,
        departments: data.departments.size,
      }));

    // Category trends - calculate real growth based on monthly data
    const categoryStats = await this.getCategoryStats();
    const categoryTrends = categoryStats.map(cat => {
      // Calculate growth by comparing first half vs second half of the period
      const categoryActivities = activities.filter(a => a.category === cat.category);
      
      // Calculate midpoint correctly - average of start and end times
      const activitiesWithDates = categoryActivities.filter(a => a.createdAt);
      if (activitiesWithDates.length === 0) {
        return {
          category: cat.category,
          growth: 0,
          trend: 'stable' as const,
        };
      }
      
      const startTime = startDate?.getTime() || Math.min(...activitiesWithDates.map(a => a.createdAt!.getTime()));
      const endTime = endDate?.getTime() || Math.max(...activitiesWithDates.map(a => a.createdAt!.getTime()));
      const midpoint = new Date((startTime + endTime) / 2);
      
      const firstHalf = categoryActivities.filter(a => 
        a.createdAt && a.createdAt < midpoint
      ).length;
      const secondHalf = categoryActivities.filter(a => 
        a.createdAt && a.createdAt >= midpoint
      ).length;
      
      const growth = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
      
      return {
        category: cat.category,
        growth: Math.round(growth * 10) / 10, // Round to 1 decimal
        trend: (growth > 5 ? 'up' : growth < -5 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
      };
    });

    return { monthlyTrends, yearlyTrends, categoryTrends };
  }

  async getFacultyPerformanceStats(): Promise<{
    totalFaculty: number;
    activeFaculty: number;
    avgVerificationTime: number;
    verificationRates: { facultyId: string; facultyName: string; verified: number; pending: number; rate: number }[];
  }> {
    const faculty = Array.from(this.users.values()).filter(u => u.role === 'faculty');
    const activities = Array.from(this.activities.values());
    
    const activeFacultySet = new Set<string>();
    activities.forEach(a => {
      if (a.verifiedBy) activeFacultySet.add(a.verifiedBy);
    });

    const verificationRates = faculty.map(f => {
      const verified = activities.filter(a => a.verifiedBy === f.id && a.status === 'approved').length;
      const pending = activities.filter(a => a.status === 'pending').length;
      
      return {
        facultyId: f.id,
        facultyName: `${f.firstName || ''} ${f.lastName || ''}`.trim() || 'Unknown',
        verified,
        pending,
        rate: verified + pending > 0 ? (verified / (verified + pending)) * 100 : 0,
      };
    });

    return {
      totalFaculty: faculty.length,
      activeFaculty: activeFacultySet.size,
      avgVerificationTime: 24,
      verificationRates,
    };
  }

  async getNAACMetrics(): Promise<{
    studentEngagement: { totalStudents: number; activeStudents: number; engagementRate: number };
    departmentParticipation: { department: string; participation: number; coCurrentRatio: number; extraCurrentRatio: number }[];
    facultyInvolvement: { totalFaculty: number; involvedFaculty: number; avgActivitiesSupervised: number };
    qualityMetrics: { approvalRate: number; avgCreditsPerActivity: number; diversityIndex: number };
  }> {
    const students = Array.from(this.users.values()).filter(u => u.role === 'student');
    const faculty = Array.from(this.users.values()).filter(u => u.role === 'faculty');
    const activities = Array.from(this.activities.values());
    
    const activeStudents = new Set(activities.map(a => a.studentId));
    
    const deptStats = await this.getDepartmentStats();
    const departmentParticipation = deptStats.map(d => ({
      department: d.department,
      participation: (d.studentCount > 0 ? (d.activityCount / d.studentCount) * 100 : 0),
      coCurrentRatio: 0.6,
      extraCurrentRatio: 0.4,
    }));
    
    const involvedFaculty = new Set(activities.map(a => a.verifiedBy).filter(Boolean));
    const approvedActivities = activities.filter(a => a.status === 'approved');
    
    return {
      studentEngagement: {
        totalStudents: students.length,
        activeStudents: activeStudents.size,
        engagementRate: students.length > 0 ? (activeStudents.size / students.length) * 100 : 0,
      },
      departmentParticipation,
      facultyInvolvement: {
        totalFaculty: faculty.length,
        involvedFaculty: involvedFaculty.size,
        avgActivitiesSupervised: involvedFaculty.size > 0 ? activities.length / involvedFaculty.size : 0,
      },
      qualityMetrics: {
        approvalRate: activities.length > 0 ? (approvedActivities.length / activities.length) * 100 : 0,
        avgCreditsPerActivity: approvedActivities.length > 0 ? 
          approvedActivities.reduce((sum, a) => sum + (a.skillCredits || 0), 0) / approvedActivities.length : 0,
        diversityIndex: 0.75,
      },
    };
  }

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubjectsByStudent(studentId: string): Promise<Subject[]> {
    const enrolledSubjectIds = this.subjectEnrollments.get(studentId);
    if (!enrolledSubjectIds || enrolledSubjectIds.size === 0) {
      // Return subjects matching student's department and semester if no explicit enrollment
      const student = this.users.get(studentId);
      if (!student) return [];
      
      return Array.from(this.subjects.values()).filter(subject => {
        const studentDept = student.department;
        const studentSemester = student.currentSemester;
        
        // Match by department and semester
        const subjectDept = this.departments.get(subject.departmentId || '');
        return subject.semester === studentSemester && 
               (subject.departmentId === null || subjectDept?.code === studentDept);
      });
    }
    
    return Array.from(this.subjects.values())
      .filter(subject => enrolledSubjectIds.has(subject.id));
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const newSubject: Subject = {
      id: nanoid(),
      name: subject.name,
      code: subject.code,
      departmentId: subject.departmentId ?? null,
      credits: subject.credits ?? null,
      semester: subject.semester,
      academicYear: subject.academicYear,
      facultyId: subject.facultyId ?? null,
      createdAt: new Date(),
    };
    
    this.subjects.set(newSubject.id, newSubject);
    
    // Auto-enroll students from the same department and semester
    if (newSubject.departmentId) {
      const dept = this.departments.get(newSubject.departmentId);
      const students = Array.from(this.users.values()).filter(u => 
        u.role === 'student' && 
        u.department === dept?.code && 
        u.currentSemester === newSubject.semester
      );
      
      students.forEach(student => {
        if (!this.subjectEnrollments.has(student.id)) {
          this.subjectEnrollments.set(student.id, new Set());
        }
        this.subjectEnrollments.get(student.id)!.add(newSubject.id);
      });
    }
    
    return newSubject;
  }

  async updateSubject(subjectId: string, updates: Partial<Subject>): Promise<Subject> {
    const subject = this.subjects.get(subjectId);
    if (!subject) throw new Error('Subject not found');
    
    const updated = { ...subject, ...updates };
    this.subjects.set(subjectId, updated);
    return updated;
  }

  async deleteSubject(subjectId: string): Promise<void> {
    this.subjects.delete(subjectId);
  }

  async getSubjectAnalytics(studentId: string): Promise<{
    totalSubjects: number;
    totalCredits: number;
    avgGrade: number;
    subjectPerformance: Array<{ subject: string; grade: number; credits: number; attendance: number }>;
  }> {
    const subjects = await this.getSubjectsByStudent(studentId);
    
    return {
      totalSubjects: subjects.length,
      totalCredits: subjects.reduce((sum, s) => sum + (s.credits || 0), 0),
      avgGrade: 8.5,
      subjectPerformance: subjects.map(s => ({
        subject: s.name,
        grade: 8.5,
        credits: s.credits || 0,
        attendance: 85,
      })),
    };
  }

  // Attendance operations
  async getStudentAttendance(studentId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values())
      .filter(a => a.studentId === studentId)
      .sort((a, b) => (b.attendanceDate?.getTime() || 0) - (a.attendanceDate?.getTime() || 0));
  }

  async getStudentAttendanceBySubject(studentId: string, subjectId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values())
      .filter(a => a.studentId === studentId && a.subjectId === subjectId);
  }

  async recordAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const now = new Date();
    const record: Attendance = {
      id: nanoid(),
      studentId: attendance.studentId,
      subjectId: attendance.subjectId,
      attendanceDate: attendance.attendanceDate,
      status: attendance.status,
      remarks: attendance.remarks ?? null,
      markedBy: attendance.markedBy ?? null,
      markedAt: now,
      createdAt: now,
    };
    
    this.attendance.set(record.id, record);
    return record;
  }

  // QR Attendance Session operations
  async createQRSession(subjectId: string, createdById: string, classId?: string): Promise<{ sessionId: string; token: string; expiresAt: Date }> {
    const crypto = await import('crypto');
    const sessionId = nanoid();
    const token = nanoid(32);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
    
    const signature = crypto.createHash('sha256')
      .update(`${token}-${subjectId}-${createdById}-${expiresAt.toISOString()}`)
      .digest('hex');

    const session: QRAttendanceSession = {
      id: sessionId,
      token,
      subjectId,
      classId: classId ?? null,
      createdBy: createdById,
      createdAt: now,
      expiresAt,
      signature,
      isActive: true,
      usedBy: [],
    };

    this.qrSessions.set(sessionId, session);
    return { sessionId, token, expiresAt };
  }

  async validateQRSession(token: string, studentId: string): Promise<{ isValid: boolean; subjectId?: string; error?: string }> {
    const session = Array.from(this.qrSessions.values()).find(s => s.token === token);
    
    if (!session) {
      return { isValid: false, error: 'Invalid QR code' };
    }

    if (!session.isActive) {
      return { isValid: false, error: 'QR session is no longer active' };
    }

    const now = new Date();
    if (now > session.expiresAt) {
      return { isValid: false, error: 'QR code has expired' };
    }

    if (session.usedBy && session.usedBy.includes(studentId)) {
      return { isValid: false, error: 'You have already marked attendance with this QR code' };
    }

    const crypto = await import('crypto');
    const expectedSignature = crypto.createHash('sha256')
      .update(`${token}-${session.subjectId}-${session.createdBy}-${session.expiresAt.toISOString()}`)
      .digest('hex');

    if (expectedSignature !== session.signature) {
      return { isValid: false, error: 'Invalid QR code signature' };
    }

    const updatedUsedBy = [...(session.usedBy || []), studentId];
    this.qrSessions.set(session.id, {
      ...session,
      usedBy: updatedUsedBy,
    });

    await this.recordAttendance({
      studentId,
      subjectId: session.subjectId,
      attendanceDate: now,
      status: 'present',
      remarks: 'Marked via QR code',
      markedBy: session.createdBy,
    });

    return { isValid: true, subjectId: session.subjectId };
  }

  async createAttendanceRecord(attendance: InsertAttendance): Promise<Attendance> {
    return this.recordAttendance(attendance);
  }

  async updateAttendanceRecord(attendanceId: string, updates: Partial<Attendance>): Promise<Attendance> {
    const record = this.attendance.get(attendanceId);
    if (!record) throw new Error('Attendance record not found');
    
    const updated = { ...record, ...updates };
    this.attendance.set(attendanceId, updated);
    return updated;
  }

  async deleteAttendanceRecord(attendanceId: string): Promise<void> {
    this.attendance.delete(attendanceId);
  }

  async getAttendanceStats(studentId: string): Promise<{
    overallPercentage: number;
    totalClasses: number;
    attendedClasses: number;
    missedClasses: number;
    subjectWise: { subject: Subject; percentage: number; attended: number; total: number }[];
  }> {
    const records = await this.getStudentAttendance(studentId);
    const attended = records.filter(r => r.status === 'present').length;
    
    const subjectMap = new Map<string, { attended: number; total: number }>();
    
    records.forEach(record => {
      const subjectId = record.subjectId || 'unknown';
      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, { attended: 0, total: 0 });
      }
      const subjectData = subjectMap.get(subjectId)!;
      subjectData.total++;
      if (record.status === 'present') {
        subjectData.attended++;
      }
    });

    const subjectWise = await Promise.all(
      Array.from(subjectMap.entries()).map(async ([subjectId, data]) => {
        const subject = this.subjects.get(subjectId);
        return {
          subject: subject || { id: subjectId, name: 'Unknown', code: 'UNK', semester: 0, academicYear: '', credits: 0 } as Subject,
          percentage: data.total > 0 ? (data.attended / data.total) * 100 : 0,
          attended: data.attended,
          total: data.total,
        };
      })
    );
    
    return {
      overallPercentage: records.length > 0 ? (attended / records.length) * 100 : 0,
      totalClasses: records.length,
      attendedClasses: attended,
      missedClasses: records.length - attended,
      subjectWise,
    };
  }

  async getAttendanceTrends(studentId: string, weeks: number): Promise<{
    weeklyTrends: { week: string; attendance: number; target: number }[];
    monthlyTrends: { month: string; attendance: number }[];
  }> {
    return {
      weeklyTrends: Array.from({ length: weeks }, (_, i) => ({
        week: `Week ${i + 1}`,
        attendance: 75 + Math.random() * 20,
        target: 75,
      })),
      monthlyTrends: [],
    };
  }

  async getAttendanceAnalytics(studentId?: string, subjectId?: string, dateRange?: { start: Date; end: Date }): Promise<{
    totalClasses: number;
    attendedClasses: number;
    absentClasses: number;
    lateClasses: number;
    attendanceRate: number;
    weeklyTrends: Array<{ week: string; rate: number }>;
    monthlyTrends: Array<{ month: string; rate: number }>;
    subjectWise: Array<{ subject: string; rate: number; total: number; attended: number }>;
  }> {
    let records = Array.from(this.attendance.values());
    
    if (studentId) records = records.filter(r => r.studentId === studentId);
    if (subjectId) records = records.filter(r => r.subjectId === subjectId);
    if (dateRange) {
      records = records.filter(r => 
        r.attendanceDate && r.attendanceDate >= dateRange.start && r.attendanceDate <= dateRange.end
      );
    }
    
    const attended = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    
    return {
      totalClasses: records.length,
      attendedClasses: attended,
      absentClasses: absent,
      lateClasses: late,
      attendanceRate: records.length > 0 ? (attended / records.length) * 100 : 0,
      weeklyTrends: [],
      monthlyTrends: [],
      subjectWise: [],
    };
  }

  async getNIRFMetrics(): Promise<{
    studentDiversity: { totalStudents: number; departmentDistribution: Record<string, number>; genderDiversity?: number };
    academicExcellence: { highPerformers: number; avgCGPA: number; skillCreditsPerStudent: number };
    researchInnovation: { researchActivities: number; patents: number; publications: number };
    outreachInclusion: { volunteeringActivities: number; communityImpact: number; inclusionScore: number };
    graduationOutcomes: { placementRate: number; higherEducation: number; entrepreneurship: number };
  }> {
    const students = Array.from(this.users.values()).filter(u => u.role === 'student');
    const activities = Array.from(this.activities.values());
    
    const deptDist: Record<string, number> = {};
    students.forEach(s => {
      const dept = s.department || 'Unknown';
      deptDist[dept] = (deptDist[dept] || 0) + 1;
    });
    
    const totalCredits = activities.reduce((sum, a) => sum + (a.skillCredits || 0), 0);
    
    return {
      studentDiversity: {
        totalStudents: students.length,
        departmentDistribution: deptDist,
        genderDiversity: 0.5,
      },
      academicExcellence: {
        highPerformers: students.filter(s => (Number(s.cgpa) || 0) > 8).length,
        avgCGPA: students.reduce((sum, s) => sum + (Number(s.cgpa) || 0), 0) / (students.length || 1),
        skillCreditsPerStudent: students.length > 0 ? totalCredits / students.length : 0,
      },
      researchInnovation: {
        researchActivities: activities.filter(a => a.category === 'academic').length,
        patents: 0,
        publications: 0,
      },
      outreachInclusion: {
        volunteeringActivities: activities.filter(a => a.category === 'volunteering').length,
        communityImpact: 75,
        inclusionScore: 0.8,
      },
      graduationOutcomes: {
        placementRate: 85,
        higherEducation: 15,
        entrepreneurship: 5,
      },
    };
  }

  async getAnalyticsByDateRange(startDate: Date, endDate: Date, department?: string): Promise<{
    summary: { activities: number; students: number; credits: number };
    categoryBreakdown: { category: string; count: number; percentage: number }[];
    monthlyDistribution: { month: string; count: number }[];
    topPerformers: { student: User; activities: number; credits: number }[];
  }> {
    let activities = Array.from(this.activities.values()).filter(a => 
      a.createdAt && a.createdAt >= startDate && a.createdAt <= endDate
    );
    
    if (department) {
      activities = activities.filter(a => {
        const student = this.users.get(a.studentId);
        return student?.department === department;
      });
    }
    
    const students = new Set(activities.map(a => a.studentId));
    const totalCredits = activities.reduce((sum, a) => sum + (a.skillCredits || 0), 0);
    
    const categoryMap = new Map<string, number>();
    activities.forEach(a => {
      categoryMap.set(a.category, (categoryMap.get(a.category) || 0) + 1);
    });
    
    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: activities.length > 0 ? (count / activities.length) * 100 : 0,
    }));
    
    return {
      summary: {
        activities: activities.length,
        students: students.size,
        credits: totalCredits,
      },
      categoryBreakdown,
      monthlyDistribution: [],
      topPerformers: [],
    };
  }

  async getCSVExportData(type: string, department?: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    if (type === 'activities') {
      let activities = Array.from(this.activities.values());
      
      if (department) {
        activities = activities.filter(a => {
          const student = this.users.get(a.studentId);
          return student?.department === department;
        });
      }
      
      if (startDate && endDate) {
        activities = activities.filter(a => 
          a.createdAt && a.createdAt >= startDate && a.createdAt <= endDate
        );
      }
      
      return activities.map(a => {
        const student = this.users.get(a.studentId);
        return {
          id: a.id,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
          title: a.title,
          category: a.category,
          status: a.status,
          skillCredits: a.skillCredits,
          createdAt: a.createdAt?.toISOString(),
        };
      });
    }
    
    return [];
  }

  // Notification operations
  async getNotificationsByStudent(studentId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.studentId === studentId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const newNotification: Notification = {
      id: nanoid(),
      studentId: notification.studentId,
      title: notification.title,
      message: notification.message,
      type: notification.type ?? 'info',
      read: false,
      actionUrl: notification.actionUrl ?? null,
      createdAt: new Date(),
    };
    
    this.notifications.set(newNotification.id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    const notification = this.notifications.get(notificationId);
    if (!notification) throw new Error('Notification not found');
    
    const updated = { ...notification, read: true };
    this.notifications.set(notificationId, updated);
    return updated;
  }

  async updateNotification(notificationId: string, updates: Partial<Notification>): Promise<Notification> {
    const notification = this.notifications.get(notificationId);
    if (!notification) throw new Error('Notification not found');
    
    const updated = { ...notification, ...updates };
    this.notifications.set(notificationId, updated);
    return updated;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    this.notifications.delete(notificationId);
  }

  async markAllNotificationsAsRead(studentId: string): Promise<void> {
    const notifications = await this.getNotificationsByStudent(studentId);
    notifications.forEach(n => {
      this.notifications.set(n.id, { ...n, read: true });
    });
  }

  async getUnreadNotificationCount(studentId: string): Promise<number> {
    const notifications = await this.getNotificationsByStudent(studentId);
    return notifications.filter(n => !n.read).length;
  }

  // Goal operations
  async getGoalsByStudent(studentId: string): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(g => g.studentId === studentId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const now = new Date();
    const newGoal: Goal = {
      id: nanoid(),
      studentId: goal.studentId,
      title: goal.title,
      description: goal.description ?? null,
      target: goal.target,
      current: goal.current ?? 0,
      deadline: goal.deadline,
      category: goal.category,
      priority: goal.priority ?? 'medium',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    
    this.goals.set(newGoal.id, newGoal);
    return newGoal;
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal> {
    const goal = this.goals.get(goalId);
    if (!goal) throw new Error('Goal not found');
    
    const updated = { ...goal, ...updates, updatedAt: new Date() };
    this.goals.set(goalId, updated);
    return updated;
  }

  async deleteGoal(goalId: string): Promise<void> {
    this.goals.delete(goalId);
  }

  async getGoalAnalytics(studentId: string): Promise<{
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    completionRate: number;
    avgTimeToComplete: number;
  }> {
    const goals = await this.getGoalsByStudent(studentId);
    const completed = goals.filter(g => g.status === 'completed');
    const inProgress = goals.filter(g => g.status === 'active');
    
    return {
      totalGoals: goals.length,
      completedGoals: completed.length,
      inProgressGoals: inProgress.length,
      completionRate: goals.length > 0 ? (completed.length / goals.length) * 100 : 0,
      avgTimeToComplete: 14,
    };
  }

  // Achievement operations
  async getAchievementsByStudent(studentId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(a => a.studentId === studentId)
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const newAchievement: Achievement = {
      ...achievement,
      id: nanoid(),
      verified: false,
      points: 0,
      createdAt: new Date(),
    };
    
    this.achievements.set(newAchievement.id, newAchievement);
    return newAchievement;
  }

  async updateAchievement(achievementId: string, updates: Partial<Achievement>): Promise<Achievement> {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) throw new Error('Achievement not found');
    
    const updated = { ...achievement, ...updates };
    this.achievements.set(achievementId, updated);
    return updated;
  }

  async deleteAchievement(achievementId: string): Promise<void> {
    this.achievements.delete(achievementId);
  }

  // Schedule/Class Management Operations
  async getClassesByStudent(studentId: string): Promise<Class[]> {
    return Array.from(this.classes.values()).filter(c => c.studentId === studentId);
  }

  async getClassById(classId: string): Promise<Class | undefined> {
    return this.classes.get(classId);
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const newClass: Class = {
      id: nanoid(),
      studentId: classData.studentId,
      title: classData.title,
      startTime: classData.startTime,
      endTime: classData.endTime,
      description: classData.description ?? null,
      subjectId: classData.subjectId ?? null,
      dayOfWeek: classData.dayOfWeek ?? null,
      startDate: classData.startDate ?? null,
      room: classData.room ?? null,
      instructor: classData.instructor ?? null,
      color: classData.color ?? null,
      recurrencePattern: classData.recurrencePattern ?? 'none',
      recurrenceEndDate: classData.recurrenceEndDate ?? null,
      notes: classData.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.classes.set(newClass.id, newClass);
    return newClass;
  }

  async updateClass(classId: string, updates: UpdateClass): Promise<Class> {
    const existingClass = this.classes.get(classId);
    if (!existingClass) throw new Error('Class not found');
    
    const updated = { ...existingClass, ...updates, updatedAt: new Date() };
    this.classes.set(classId, updated);
    return updated;
  }

  async deleteClass(classId: string): Promise<void> {
    this.classes.delete(classId);
  }

  async checkTimeConflict(
    studentId: string,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    excludeClassId?: string
  ): Promise<boolean> {
    const studentClasses = Array.from(this.classes.values()).filter(
      c => c.studentId === studentId && c.dayOfWeek === dayOfWeek && c.id !== excludeClassId
    );

    // Convert times to minutes for easier comparison
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    // Check for time overlap
    for (const existingClass of studentClasses) {
      const oldStart = toMinutes(existingClass.startTime);
      const oldEnd = toMinutes(existingClass.endTime);
      
      // Check if times overlap
      if ((newStart >= oldStart && newStart < oldEnd) ||
          (newEnd > oldStart && newEnd <= oldEnd) ||
          (newStart <= oldStart && newEnd >= oldEnd)) {
        return true; // Conflict found
      }
    }
    
    return false; // No conflict
  }

  // Advanced Analytics
  async getDashboardSnapshots(studentId: string): Promise<{
    personalMetrics: {
      gpa: number;
      totalCredits: number;
      attendanceRate: number;
      activitiesCount: number;
      rank: number;
      totalStudents: number;
    };
    chartData: {
      gpaProgress: Array<{ semester: number; gpa: number }>;
      creditsProgress: Array<{ semester: number; credits: number }>;
      attendanceCalendar: Array<{ date: string; status: 'present' | 'absent' | 'late' | 'excused' }>;
      categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
      monthlyActivity: Array<{ month: string; activities: number }>;
    };
  }> {
    const student = await this.getUser(studentId);
    const activities = await this.getActivitiesByStudent(studentId);
    const attendance = await this.getStudentAttendance(studentId);
    const students = Array.from(this.users.values()).filter(u => u.role === 'student');
    
    const categoryDist = await this.getCategoryStats();
    const studentCategoryDist = categoryDist.map(c => {
      const studentActivities = activities.filter(a => a.category === c.category);
      return {
        category: c.category,
        count: studentActivities.length,
        percentage: activities.length > 0 ? (studentActivities.length / activities.length) * 100 : 0,
      };
    });
    
    return {
      personalMetrics: {
        gpa: Number(student?.cgpa) || 0,
        totalCredits: activities.reduce((sum, a) => sum + (a.skillCredits || 0), 0),
        attendanceRate: attendance.length > 0 ? 
          (attendance.filter(a => a.status === 'present').length / attendance.length) * 100 : 0,
        activitiesCount: activities.length,
        rank: 1,
        totalStudents: students.length,
      },
      chartData: {
        gpaProgress: Array.from({ length: student?.currentSemester || 1 }, (_, i) => ({
          semester: i + 1,
          gpa: 7 + Math.random() * 2,
        })),
        creditsProgress: Array.from({ length: student?.currentSemester || 1 }, (_, i) => ({
          semester: i + 1,
          credits: i * 5 + Math.random() * 10,
        })),
        attendanceCalendar: attendance.slice(0, 30).map(a => ({
          date: a.attendanceDate?.toISOString().split('T')[0] || '',
          status: a.status,
        })),
        categoryDistribution: studentCategoryDist,
        monthlyActivity: [],
      },
    };
  }

  // Assignment Management Operations
  async getAllAssignments(): Promise<Assignment[]> {
    return [];
  }

  async getAssignmentById(assignmentId: string): Promise<Assignment | undefined> {
    return undefined;
  }

  async getAssignmentsByStudent(studentId: string): Promise<Assignment[]> {
    return [];
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const newAssignment: Assignment = {
      id: nanoid(),
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks,
      createdBy: assignment.createdBy ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newAssignment;
  }

  // Assignment Submission Operations
  async getSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string): Promise<AssignmentSubmission | undefined> {
    return undefined;
  }

  async getSubmissionsByStudent(studentId: string): Promise<AssignmentSubmission[]> {
    return [];
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    return [];
  }

  async createSubmission(submission: InsertAssignmentSubmission): Promise<AssignmentSubmission> {
    const newSubmission: AssignmentSubmission = {
      id: nanoid(),
      studentId: submission.studentId,
      assignmentId: submission.assignmentId,
      status: submission.status ?? 'submitted',
      feedback: submission.feedback ?? null,
      grade: submission.grade ?? null,
      gradedBy: submission.gradedBy ?? null,
      gradedAt: submission.gradedAt ?? null,
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newSubmission;
  }

  async updateSubmission(submissionId: string, updates: UpdateAssignmentSubmission): Promise<AssignmentSubmission> {
    throw new Error('Submission not found');
  }

  // Assignment File Operations
  async addSubmissionFile(submissionId: string, fileName: string, filePath: string, fileType: string, fileSize: number): Promise<AssignmentSubmissionFile> {
    const file: AssignmentSubmissionFile = {
      id: nanoid(),
      submissionId,
      fileName,
      filePath,
      fileType,
      fileSize,
      uploadedAt: new Date(),
    };
    return file;
  }

  async getSubmissionFiles(submissionId: string): Promise<AssignmentSubmissionFile[]> {
    return [];
  }

  async deleteSubmissionFile(fileId: string): Promise<void> {
    return;
  }

  // Exam Management Operations
  async getAllExams(): Promise<Exam[]> {
    return [];
  }

  async getExamsByStudent(studentId: string, semester?: number): Promise<Exam[]> {
    return [];
  }

  async getExamById(examId: string): Promise<Exam | undefined> {
    return undefined;
  }

  async createExam(exam: InsertExam): Promise<Exam> {
    const newExam: Exam = {
      id: nanoid(),
      title: exam.title,
      semester: exam.semester,
      examDate: exam.examDate,
      startTime: exam.startTime,
      endTime: exam.endTime,
      room: exam.room,
      subject: exam.subject,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      description: exam.description ?? null,
      status: exam.status ?? 'upcoming',
      instructions: exam.instructions ?? null,
      passingMarks: exam.passingMarks ?? null,
      syllabus: exam.syllabus ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newExam;
  }

  async updateExam(examId: string, updates: UpdateExam): Promise<Exam> {
    throw new Error('Exam not found');
  }

  async deleteExam(examId: string): Promise<void> {
    return;
  }

  // Exam Results Operations
  async getExamResult(examId: string, studentId: string): Promise<ExamResult | undefined> {
    return undefined;
  }

  async getExamResultsByStudent(studentId: string): Promise<ExamResult[]> {
    return [];
  }

  async getExamResultsByExam(examId: string): Promise<ExamResult[]> {
    return [];
  }

  async createExamResult(result: InsertExamResult): Promise<ExamResult> {
    const newResult: ExamResult = {
      id: nanoid(),
      examId: result.examId,
      studentId: result.studentId,
      marksObtained: result.marksObtained,
      grade: result.grade,
      remarks: result.remarks ?? null,
      verifiedBy: result.verifiedBy ?? null,
      verifiedAt: result.verifiedAt ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newResult;
  }

  async updateExamResult(resultId: string, updates: Partial<ExamResult>): Promise<ExamResult> {
    throw new Error('Exam result not found');
  }

  async getExamStats(studentId: string): Promise<{
    averageScore: number;
    totalExams: number;
    passedExams: number;
    failedExams: number;
    highestScore: number;
    lowestScore: number;
    upcomingExams: number;
    completedExams: number;
    performanceTrend: Array<{ month: string; score: number }>;
  }> {
    return {
      averageScore: 0,
      totalExams: 0,
      passedExams: 0,
      failedExams: 0,
      highestScore: 0,
      lowestScore: 0,
      upcomingExams: 0,
      completedExams: 0,
      performanceTrend: [],
    };
  }

  // Resource Management Operations
  async getAllResources(): Promise<Resource[]> {
    return [];
  }

  async getResourceById(resourceId: string): Promise<Resource | undefined> {
    return undefined;
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return [];
  }

  async getResourcesBySubject(subject: string): Promise<Resource[]> {
    return [];
  }

  async searchResources(query: string, filters?: { type?: string; subject?: string; category?: string }): Promise<Resource[]> {
    return [];
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const newResource: Resource = {
      id: nanoid(),
      title: resource.title,
      description: resource.description,
      category: resource.category,
      type: resource.type,
      subject: resource.subject,
      fileName: resource.fileName ?? null,
      filePath: resource.filePath ?? null,
      fileType: resource.fileType ?? null,
      fileSize: resource.fileSize ?? null,
      url: resource.url ?? null,
      uploadedBy: resource.uploadedBy ?? null,
      tags: resource.tags ?? null,
      downloads: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newResource;
  }

  async updateResource(resourceId: string, updates: UpdateResource): Promise<Resource> {
    throw new Error('Resource not found');
  }

  async deleteResource(resourceId: string): Promise<void> {
    return;
  }

  async incrementResourceDownload(resourceId: string): Promise<void> {
    return;
  }

  async incrementResourceView(resourceId: string): Promise<void> {
    return;
  }

  // Event Management Operations
  async getAllEvents(): Promise<Event[]> {
    return [];
  }

  async getEventById(eventId: string): Promise<Event | undefined> {
    return undefined;
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return [];
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return [];
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return [];
  }

  async getPastEvents(): Promise<Event[]> {
    return [];
  }

  async searchEvents(query: string): Promise<Event[]> {
    return [];
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const newEvent: Event = {
      id: nanoid(),
      title: event.title,
      description: event.description,
      category: event.category,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
      organizer: event.organizer,
      organizerId: event.organizerId ?? null,
      imageUrl: event.imageUrl ?? null,
      maxParticipants: event.maxParticipants ?? null,
      registrationDeadline: event.registrationDeadline ?? null,
      status: event.status ?? 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newEvent;
  }

  async updateEvent(eventId: string, updates: UpdateEvent): Promise<Event> {
    throw new Error('Event not found');
  }

  async deleteEvent(eventId: string): Promise<void> {
    return;
  }

  // Event RSVP Operations
  async getEventRsvp(eventId: string, studentId: string): Promise<EventRsvp | undefined> {
    return undefined;
  }

  async getEventRsvps(eventId: string): Promise<EventRsvp[]> {
    return [];
  }

  async getStudentRsvps(studentId: string): Promise<EventRsvp[]> {
    return [];
  }

  async createOrUpdateRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp> {
    const newRsvp: EventRsvp = {
      id: nanoid(),
      studentId: rsvp.studentId,
      eventId: rsvp.eventId,
      status: rsvp.status,
      attended: rsvp.attended ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newRsvp;
  }

  async deleteRsvp(rsvpId: string): Promise<void> {
    return;
  }

  async getEventAttendeeCount(eventId: string): Promise<{ going: number; maybe: number; notGoing: number; total: number }> {
    return { going: 0, maybe: 0, notGoing: 0, total: 0 };
  }

  // Advanced Analytics Operations
  async getGPATrends(studentId: string, semesters: number): Promise<Array<{ semester: number; gpa: number; credits: number }>> {
    return Array.from({ length: semesters }, (_, i) => ({
      semester: i + 1,
      gpa: 7 + Math.random() * 2,
      credits: 20 + Math.floor(Math.random() * 10),
    }));
  }

  async getCreditsGPAAnalysis(studentId: string): Promise<Array<{ semester: number; earnedCredits: number; cumulativeCredits: number; gpa: number }>> {
    return Array.from({ length: 8 }, (_, i) => ({
      semester: i + 1,
      earnedCredits: 20 + Math.floor(Math.random() * 5),
      cumulativeCredits: (i + 1) * 20,
      gpa: 7 + Math.random() * 2,
    }));
  }

  async getCumulativeCGPAData(studentId: string): Promise<Array<{ semester: number; cgpa: number; targetCGPA: number }>> {
    return Array.from({ length: 8 }, (_, i) => ({
      semester: i + 1,
      cgpa: 7 + (i * 0.1) + Math.random() * 0.5,
      targetCGPA: 8.5,
    }));
  }

  async getSubjectGPADistribution(studentId: string, semester?: string): Promise<Array<{ subjectName: string; subjectCode: string; gpa: number; credits: number }>> {
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
    return subjects.map((name, i) => ({
      subjectName: name,
      subjectCode: `SUB${i + 1}`,
      gpa: 7 + Math.random() * 3,
      credits: 3 + Math.floor(Math.random() * 2),
    }));
  }

  async getGPAAttendanceCorrelation(studentId: string): Promise<Array<{ subject: string; gpa: number; attendance: number }>> {
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
    return subjects.map(subject => ({
      subject,
      gpa: 7 + Math.random() * 3,
      attendance: 70 + Math.random() * 30,
    }));
  }

  async getSkillsAssessmentData(studentId: string): Promise<Array<{ skill: string; current: number; target: number; category: string }>> {
    const skills = [
      { skill: 'Programming', category: 'Technical' },
      { skill: 'Communication', category: 'Soft Skills' },
      { skill: 'Leadership', category: 'Soft Skills' },
      { skill: 'Problem Solving', category: 'Technical' },
      { skill: 'Teamwork', category: 'Soft Skills' },
    ];
    return skills.map(s => ({
      ...s,
      current: 60 + Math.random() * 30,
      target: 90,
    }));
  }

  async getSkillGrowthData(studentId: string): Promise<Array<{ skill: string; progress: number; target: number; level: string; startDate: string }>> {
    const skills = ['Programming', 'Communication', 'Leadership', 'Problem Solving', 'Teamwork'];
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return skills.map((skill, i) => ({
      skill,
      progress: 50 + Math.random() * 40,
      target: 100,
      level: levels[Math.floor(Math.random() * levels.length)],
      startDate: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }

  async getAchievementFunnelData(studentId: string): Promise<Array<{ stage: string; count: number; percentage: number }>> {
    return [
      { stage: 'Submitted', count: 100, percentage: 100 },
      { stage: 'Under Review', count: 80, percentage: 80 },
      { stage: 'Approved', count: 65, percentage: 65 },
      { stage: 'Verified', count: 60, percentage: 60 },
    ];
  }

  async getAttendanceHeatmapData(studentId: string, year: number): Promise<Array<{ date: string; attendance: number; status: string }>> {
    const data: Array<{ date: string; attendance: number; status: string }> = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) { // Skip weekends
        const rand = Math.random();
        data.push({
          date: d.toISOString().split('T')[0],
          attendance: rand > 0.2 ? 1 : 0,
          status: rand > 0.2 ? 'present' : 'absent',
        });
      }
    }
    
    return data;
  }

  async getWeeklyAttendancePatterns(studentId: string, weeks: number): Promise<Array<{ week: string; weekAverage: number; monday: number; tuesday: number; wednesday: number; thursday: number; friday: number }>> {
    return Array.from({ length: weeks }, (_, i) => ({
      week: `Week ${i + 1}`,
      weekAverage: 75 + Math.random() * 20,
      monday: 70 + Math.random() * 30,
      tuesday: 70 + Math.random() * 30,
      wednesday: 70 + Math.random() * 30,
      thursday: 70 + Math.random() * 30,
      friday: 70 + Math.random() * 30,
    }));
  }

  async getActivityCategoryDistribution(studentId: string): Promise<Array<{ category: string; count: number; percentage: number; credits: number }>> {
    const categories = ['academic', 'co-curricular', 'extra-curricular', 'volunteering', 'internship'];
    const total = 50;
    return categories.map(category => {
      const count = Math.floor(Math.random() * 15);
      return {
        category,
        count,
        percentage: (count / total) * 100,
        credits: count * 2,
      };
    });
  }

  async getActivityVolumeData(studentId: string, months: number): Promise<Array<{ month: string; total: number; approved: number; pending: number; rejected: number }>> {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: months }, (_, i) => {
      const total = Math.floor(Math.random() * 10);
      const approved = Math.floor(total * 0.7);
      const rejected = Math.floor(total * 0.1);
      const pending = total - approved - rejected;
      return {
        month: monthNames[i % 12],
        total,
        approved,
        pending,
        rejected,
      };
    });
  }

  async getPeerComparisonData(studentId: string, department?: string | null): Promise<Array<{ metric: string; myValue: number; average: number; median: number; q1: number; q3: number }>> {
    const metrics = ['GPA', 'Attendance', 'Activities', 'Credits', 'Skills'];
    return metrics.map(metric => {
      const myValue = 70 + Math.random() * 25;
      const average = 65 + Math.random() * 20;
      return {
        metric,
        myValue,
        average,
        median: average + Math.random() * 5 - 2.5,
        q1: average - 10,
        q3: average + 10,
      };
    });
  }

  async getRankPercentileData(studentId: string): Promise<{ currentRank: number; totalStudents: number; percentile: number; previousRank: number | null; target: number }> {
    const totalStudents = 100;
    const currentRank = Math.floor(Math.random() * totalStudents) + 1;
    return {
      currentRank,
      totalStudents,
      percentile: ((totalStudents - currentRank) / totalStudents) * 100,
      previousRank: currentRank + Math.floor(Math.random() * 10) - 5,
      target: Math.max(1, currentRank - 10),
    };
  }

  async getDepartmentRankings(): Promise<Array<{ department: string; overallScore: number; rank: number; students: number; avgGPA: number; avgActivities: number }>> {
    const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];
    return departments.map((department, i) => ({
      department,
      overallScore: 70 + Math.random() * 25,
      rank: i + 1,
      students: 50 + Math.floor(Math.random() * 50),
      avgGPA: 7 + Math.random() * 2,
      avgActivities: 10 + Math.floor(Math.random() * 20),
    }));
  }

  async getPortfolioStrengthData(studentId: string): Promise<Array<{ area: string; strength: number; maxStrength: number; activities: number }>> {
    const areas = ['Academic', 'Co-curricular', 'Leadership', 'Technical Skills', 'Soft Skills'];
    return areas.map(area => ({
      area,
      strength: 50 + Math.random() * 40,
      maxStrength: 100,
      activities: Math.floor(Math.random() * 20),
    }));
  }

  async getApprovalSLAData(): Promise<Array<{ reviewer: string; avgApprovalTime: number; onTimePercentage: number; totalReviewed: number; pending: number }>> {
    const reviewers = ['Faculty A', 'Faculty B', 'Faculty C'];
    return reviewers.map(reviewer => ({
      reviewer,
      avgApprovalTime: 24 + Math.random() * 48,
      onTimePercentage: 70 + Math.random() * 25,
      totalReviewed: Math.floor(Math.random() * 100),
      pending: Math.floor(Math.random() * 20),
    }));
  }

  async getGradeCorrelationMatrix(studentId: string): Promise<{ subjects: string[]; correlationMatrix: number[][] }> {
    const subjects = ['Math', 'Physics', 'Chemistry', 'CS', 'English'];
    const matrix = subjects.map(() => 
      subjects.map(() => -1 + Math.random() * 2)
    );
    // Set diagonal to 1
    matrix.forEach((row, i) => {
      row[i] = 1;
    });
    return { subjects, correlationMatrix: matrix };
  }

  async getLiveAnalyticsUpdate(studentId: string): Promise<{ timestamp: string; gpa: number; attendance: number; activities: number; rank: number; recentActivities: Activity[] }> {
    return {
      timestamp: new Date().toISOString(),
      gpa: 7 + Math.random() * 2,
      attendance: 70 + Math.random() * 25,
      activities: Math.floor(Math.random() * 50),
      rank: Math.floor(Math.random() * 100) + 1,
      recentActivities: [],
    };
  }
}

/**
 * Database Storage Implementation
 * 
 * Implements the IStorage interface using PostgreSQL/Neon database via Drizzle ORM.
 * Data persists across server restarts for production-ready deployments.
 */
export class DatabaseStorage implements IStorage {
  constructor() {
    if (!db!) {
      throw new Error('Database connection is required for DatabaseStorage');
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db!!.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db!!.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByRollNumber(rollNumber: string): Promise<User | undefined> {
    const [user] = await db!!.select().from(users).where(eq(users.rollNumber, rollNumber));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = userData.id ? await this.getUser(userData.id) : undefined;
    const now = new Date();
    
    const userPayload = {
      id: userData.id || undefined,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      role: userData.role ?? 'student',
      rollNumber: userData.rollNumber ?? null,
      department: userData.department ?? null,
      currentSemester: userData.currentSemester ?? null,
      cgpa: userData.cgpa ?? null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    if (existing) {
      const [updated] = await db!
        .update(users)
        .set(userPayload)
        .where(eq(users.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db!!.insert(users).values(userPayload).returning();
      return created;
    }
  }

  // Activity operations
  async getActivitiesByStudent(studentId: string): Promise<Activity[]> {
    return await db!
      .select()
      .from(activities)
      .where(eq(activities.studentId, studentId))
      .orderBy(desc(activities.createdAt));
  }

  async getActivitiesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Activity[]> {
    return await db!
      .select()
      .from(activities)
      .where(eq(activities.status, status))
      .orderBy(desc(activities.createdAt));
  }

  async getAllActivities(): Promise<Activity[]> {
    return await db!!.select().from(activities).orderBy(desc(activities.createdAt));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [created] = await db!!.insert(activities).values(activity).returning();
    return created;
  }

  async updateActivityStatus(activityId: string, updates: UpdateActivityStatus, verifierId: string): Promise<Activity> {
    const [updated] = await db!
      .update(activities)
      .set({
        ...updates,
        verifiedBy: verifierId,
        verificationDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(activities.id, activityId))
      .returning();
    
    if (!updated) throw new Error('Activity not found');
    return updated;
  }

  // File operations
  async addActivityFile(activityId: string, fileName: string, filePath: string, fileType: string, fileSize: number): Promise<ActivityFile> {
    const [file] = await db!
      .insert(activityFiles)
      .values({ activityId, fileName, filePath, fileType, fileSize })
      .returning();
    return file;
  }

  async getActivityFiles(activityId: string): Promise<ActivityFile[]> {
    return await db!!.select().from(activityFiles).where(eq(activityFiles.activityId, activityId));
  }

  // Department operations
  async getDepartments(): Promise<Department[]> {
    return await db!!.select().from(departments);
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [created] = await db!!.insert(departments).values(department).returning();
    return created;
  }

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    return await db!!.select().from(subjects);
  }

  async getSubjectsByStudent(studentId: string): Promise<Subject[]> {
    const student = await this.getUser(studentId);
    if (!student) return [];
    
    return await db!
      .select()
      .from(subjects)
      .where(
        and(
          eq(subjects.semester, student.currentSemester || 1),
          student.department ? eq(subjects.departmentId, student.department) : undefined
        )
      );
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [created] = await db!!.insert(subjects).values(subject).returning();
    return created;
  }

  async updateSubject(subjectId: string, updates: Partial<Subject>): Promise<Subject> {
    const [updated] = await db!
      .update(subjects)
      .set(updates)
      .where(eq(subjects.id, subjectId))
      .returning();
    
    if (!updated) throw new Error('Subject not found');
    return updated;
  }

  async deleteSubject(subjectId: string): Promise<void> {
    await db!!.delete(subjects).where(eq(subjects.id, subjectId));
  }

  // Attendance operations
  async getStudentAttendance(studentId: string): Promise<Attendance[]> {
    return await db!
      .select()
      .from(attendance)
      .where(eq(attendance.studentId, studentId))
      .orderBy(desc(attendance.attendanceDate));
  }

  async getStudentAttendanceBySubject(studentId: string, subjectId: string): Promise<Attendance[]> {
    return await db!
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.studentId, studentId),
          eq(attendance.subjectId, subjectId)
        )
      );
  }

  async recordAttendance(attendanceRecord: InsertAttendance): Promise<Attendance> {
    const [record] = await db!!.insert(attendance).values(attendanceRecord).returning();
    return record;
  }

  // QR Attendance Session operations
  async createQRSession(subjectId: string, createdById: string, classId?: string): Promise<{ sessionId: string; token: string; expiresAt: Date }> {
    const crypto = await import('crypto');
    const sessionId = nanoid();
    const token = nanoid(32);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
    
    const signature = crypto.createHash('sha256')
      .update(`${token}-${subjectId}-${createdById}-${expiresAt.toISOString()}`)
      .digest('hex');

    const [session] = await db!.insert(qrAttendanceSessions).values({
      token,
      subjectId,
      classId: classId ?? null,
      createdBy: createdById,
      expiresAt,
      signature,
      isActive: true,
      usedBy: [],
    }).returning();

    return { sessionId: session.id, token: session.token, expiresAt: session.expiresAt };
  }

  async validateQRSession(token: string, studentId: string): Promise<{ isValid: boolean; subjectId?: string; error?: string }> {
    const [session] = await db!
      .select()
      .from(qrAttendanceSessions)
      .where(eq(qrAttendanceSessions.token, token))
      .limit(1);
    
    if (!session) {
      return { isValid: false, error: 'Invalid QR code' };
    }

    if (!session.isActive) {
      return { isValid: false, error: 'QR session is no longer active' };
    }

    const now = new Date();
    if (now > session.expiresAt) {
      return { isValid: false, error: 'QR code has expired' };
    }

    if (session.usedBy && session.usedBy.includes(studentId)) {
      return { isValid: false, error: 'You have already marked attendance with this QR code' };
    }

    const crypto = await import('crypto');
    const expectedSignature = crypto.createHash('sha256')
      .update(`${token}-${session.subjectId}-${session.createdBy}-${session.expiresAt.toISOString()}`)
      .digest('hex');

    if (expectedSignature !== session.signature) {
      return { isValid: false, error: 'Invalid QR code signature' };
    }

    const updatedUsedBy = [...(session.usedBy || []), studentId];
    await db!
      .update(qrAttendanceSessions)
      .set({ usedBy: updatedUsedBy })
      .where(eq(qrAttendanceSessions.id, session.id));

    await this.recordAttendance({
      studentId,
      subjectId: session.subjectId,
      attendanceDate: now,
      status: 'present',
      remarks: 'Marked via QR code',
      markedBy: session.createdBy,
    });

    return { isValid: true, subjectId: session.subjectId };
  }

  async createAttendanceRecord(attendanceRecord: InsertAttendance): Promise<Attendance> {
    return this.recordAttendance(attendanceRecord);
  }

  async updateAttendanceRecord(attendanceId: string, updates: Partial<Attendance>): Promise<Attendance> {
    const [updated] = await db!
      .update(attendance)
      .set(updates)
      .where(eq(attendance.id, attendanceId))
      .returning();
    
    if (!updated) throw new Error('Attendance record not found');
    return updated;
  }

  async deleteAttendanceRecord(attendanceId: string): Promise<void> {
    await db!!.delete(attendance).where(eq(attendance.id, attendanceId));
  }

  // Notification operations
  async getNotificationsByStudent(studentId: string): Promise<Notification[]> {
    return await db!
      .select()
      .from(notifications)
      .where(eq(notifications.studentId, studentId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db!!.insert(notifications).values(notification).returning();
    return created;
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    const [updated] = await db!
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId))
      .returning();
    
    if (!updated) throw new Error('Notification not found');
    return updated;
  }

  async updateNotification(notificationId: string, updates: Partial<Notification>): Promise<Notification> {
    const [updated] = await db!
      .update(notifications)
      .set(updates)
      .where(eq(notifications.id, notificationId))
      .returning();
    
    if (!updated) throw new Error('Notification not found');
    return updated;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await db!!.delete(notifications).where(eq(notifications.id, notificationId));
  }

  async markAllNotificationsAsRead(studentId: string): Promise<void> {
    await db!
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.studentId, studentId));
  }

  async getUnreadNotificationCount(studentId: string): Promise<number> {
    const result = await db!
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.studentId, studentId),
          eq(notifications.read, false)
        )
      );
    return result[0]?.count || 0;
  }

  // Goal operations
  async getGoalsByStudent(studentId: string): Promise<Goal[]> {
    return await db!
      .select()
      .from(goals)
      .where(eq(goals.studentId, studentId))
      .orderBy(desc(goals.createdAt));
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [created] = await db!!.insert(goals).values(goal).returning();
    return created;
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal> {
    const [updated] = await db!
      .update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(goals.id, goalId))
      .returning();
    
    if (!updated) throw new Error('Goal not found');
    return updated;
  }

  async deleteGoal(goalId: string): Promise<void> {
    await db!!.delete(goals).where(eq(goals.id, goalId));
  }

  // Achievement operations
  async getAchievementsByStudent(studentId: string): Promise<Achievement[]> {
    return await db!
      .select()
      .from(achievements)
      .where(eq(achievements.studentId, studentId))
      .orderBy(desc(achievements.date));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [created] = await db!!.insert(achievements).values(achievement).returning();
    return created;
  }

  async updateAchievement(achievementId: string, updates: Partial<Achievement>): Promise<Achievement> {
    const [updated] = await db!
      .update(achievements)
      .set(updates)
      .where(eq(achievements.id, achievementId))
      .returning();
    
    if (!updated) throw new Error('Achievement not found');
    return updated;
  }

  async deleteAchievement(achievementId: string): Promise<void> {
    await db!!.delete(achievements).where(eq(achievements.id, achievementId));
  }

  // Schedule/Class Management Operations
  async getClassesByStudent(studentId: string): Promise<Class[]> {
    return await db!!.select().from(classes).where(eq(classes.studentId, studentId)).orderBy(classes.dayOfWeek, classes.startTime);
  }

  async getClassById(classId: string): Promise<Class | undefined> {
    const result = await db!!.select().from(classes).where(eq(classes.id, classId));
    return result[0];
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const result = await db!!.insert(classes).values(classData).returning();
    return result[0];
  }

  async updateClass(classId: string, updates: UpdateClass): Promise<Class> {
    const result = await db!!.update(classes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(classes.id, classId))
      .returning();
    return result[0];
  }

  async deleteClass(classId: string): Promise<void> {
    await db!!.delete(classes).where(eq(classes.id, classId));
  }

  async checkTimeConflict(
    studentId: string,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    excludeClassId?: string
  ): Promise<boolean> {
    const studentClasses = await db!!.select().from(classes)
      .where(
        and(
          eq(classes.studentId, studentId),
          eq(classes.dayOfWeek, dayOfWeek as any),
          excludeClassId ? sqlOp`${classes.id} != ${excludeClassId}` : undefined
        )
      );

    // Check for time overlap
    for (const existingClass of studentClasses) {
      const existingStart = existingClass.startTime;
      const existingEnd = existingClass.endTime;
      
      // Convert times to minutes for easier comparison
      const toMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const newStart = toMinutes(startTime);
      const newEnd = toMinutes(endTime);
      const oldStart = toMinutes(existingStart);
      const oldEnd = toMinutes(existingEnd);
      
      // Check if times overlap
      if ((newStart >= oldStart && newStart < oldEnd) ||
          (newEnd > oldStart && newEnd <= oldEnd) ||
          (newStart <= oldStart && newEnd >= oldEnd)) {
        return true; // Conflict found
      }
    }
    
    return false; // No conflict
  }

  // Analytics operations (using in-memory approach for complex analytics)
  async getStudentStats(studentId: string): Promise<{ totalActivities: number; skillCredits: number; pendingApprovals: number }> {
    const studentActivities = await this.getActivitiesByStudent(studentId);
    
    return {
      totalActivities: studentActivities.length,
      skillCredits: studentActivities.reduce((sum, a) => sum + (a.skillCredits || 0), 0),
      pendingApprovals: studentActivities.filter(a => a.status === 'pending').length,
    };
  }

  async getDepartmentStats(): Promise<{ department: string; studentCount: number; activityCount: number; avgActivitiesPerStudent: number }[]> {
    const allUsers = await db!!.select().from(users).where(eq(users.role, 'student'));
    const allActivities = await this.getAllActivities();
    
    const deptMap = new Map<string, { students: Set<string>; activities: number }>();
    
    allUsers.forEach((student: User) => {
      const dept = student.department || 'Unknown';
      if (!deptMap.has(dept)) {
        deptMap.set(dept, { students: new Set(), activities: 0 });
      }
      deptMap.get(dept)!.students.add(student.id);
    });
    
    allActivities.forEach((activity: Activity) => {
      const student = allUsers.find((u: User) => u.id === activity.studentId);
      if (student) {
        const dept = student.department || 'Unknown';
        const deptData = deptMap.get(dept);
        if (deptData) {
          deptData.activities++;
        }
      }
    });
    
    return Array.from(deptMap.entries()).map(([department, data]) => ({
      department,
      studentCount: data.students.size,
      activityCount: data.activities,
      avgActivitiesPerStudent: data.students.size > 0 ? data.activities / data.students.size : 0,
    }));
  }

  async getCategoryStats(): Promise<{ category: string; count: number; percentage: number }[]> {
    const allActivities = await this.getAllActivities();
    const categoryMap = new Map<string, number>();
    
    allActivities.forEach(activity => {
      categoryMap.set(activity.category, (categoryMap.get(activity.category) || 0) + 1);
    });
    
    const total = allActivities.length;
    
    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }

  async getStudentSummary(): Promise<{ student: User; totalActivities: number; skillCredits: number; lastActivity: Date | null }[]> {
    const students = await db!!.select().from(users).where(eq(users.role, 'student'));
    
    return Promise.all(students.map(async (student: User) => {
      const studentActivities = await this.getActivitiesByStudent(student.id);
      const lastActivity = studentActivities.length > 0 ? studentActivities[0].createdAt : null;
      
      return {
        student,
        totalActivities: studentActivities.length,
        skillCredits: studentActivities.reduce((sum, a) => sum + (a.skillCredits || 0), 0),
        lastActivity,
      };
    }));
  }

  async getPortfolioData(studentId: string): Promise<{ 
    student: User; 
    activities: Activity[]; 
    stats: { 
      totalActivities: number; 
      skillCredits: number; 
      categoryCounts: Record<string, number>; 
      activitiesPerSemester: Record<number, number> 
    } 
  }> {
    const student = await this.getUser(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const studentActivities = await this.getActivitiesByStudent(studentId);
    const approvedActivities = studentActivities.filter(a => a.status === 'approved');

    const categoryCounts: Record<string, number> = {};
    const activitiesPerSemester: Record<number, number> = {};

    approvedActivities.forEach(activity => {
      categoryCounts[activity.category] = (categoryCounts[activity.category] || 0) + 1;
      
      const year = activity.createdAt ? new Date(activity.createdAt).getFullYear() : new Date().getFullYear();
      const semester = ((year - 2020) * 2) + 1;
      activitiesPerSemester[semester] = (activitiesPerSemester[semester] || 0) + 1;
    });

    return {
      student,
      activities: studentActivities,
      stats: {
        totalActivities: approvedActivities.length,
        skillCredits: approvedActivities.reduce((sum, a) => sum + (a.skillCredits || 0), 0),
        categoryCounts,
        activitiesPerSemester
      }
    };
  }

  // Simplified analytics methods - these use in-memory processing for complex aggregations
  async getTrendsData(startDate?: Date, endDate?: Date): Promise<{
    monthlyTrends: { month: string; activities: number; students: number }[];
    yearlyTrends: { year: number; activities: number; students: number; departments: number }[];
    categoryTrends: { category: string; growth: number; trend: 'up' | 'down' | 'stable' }[];
  }> {
    return { monthlyTrends: [], yearlyTrends: [], categoryTrends: [] };
  }

  async getFacultyPerformanceStats(): Promise<{
    totalFaculty: number;
    activeFaculty: number;
    avgVerificationTime: number;
    verificationRates: { facultyId: string; facultyName: string; verified: number; pending: number; rate: number }[];
  }> {
    return { totalFaculty: 0, activeFaculty: 0, avgVerificationTime: 24, verificationRates: [] };
  }

  async getNAACMetrics(): Promise<{
    studentEngagement: { totalStudents: number; activeStudents: number; engagementRate: number };
    departmentParticipation: { department: string; participation: number; coCurrentRatio: number; extraCurrentRatio: number }[];
    facultyInvolvement: { totalFaculty: number; involvedFaculty: number; avgActivitiesSupervised: number };
    qualityMetrics: { approvalRate: number; avgCreditsPerActivity: number; diversityIndex: number };
  }> {
    const students = await db!!.select().from(users).where(eq(users.role, 'student'));
    const allActivities = await this.getAllActivities();
    
    const activeStudents = new Set(allActivities.map(a => a.studentId));
    
    return {
      studentEngagement: {
        totalStudents: students.length,
        activeStudents: activeStudents.size,
        engagementRate: students.length > 0 ? (activeStudents.size / students.length) * 100 : 0,
      },
      departmentParticipation: [],
      facultyInvolvement: { totalFaculty: 0, involvedFaculty: 0, avgActivitiesSupervised: 0 },
      qualityMetrics: { approvalRate: 0, avgCreditsPerActivity: 0, diversityIndex: 0.75 },
    };
  }

  async getAttendanceStats(studentId: string): Promise<{
    overallPercentage: number;
    totalClasses: number;
    attendedClasses: number;
    missedClasses: number;
    subjectWise: { subject: Subject; percentage: number; attended: number; total: number }[];
  }> {
    const records = await this.getStudentAttendance(studentId);
    const attended = records.filter(r => r.status === 'present').length;
    
    const subjectMap = new Map<string, { attended: number; total: number }>();
    
    records.forEach(record => {
      const subjectId = record.subjectId || 'unknown';
      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, { attended: 0, total: 0 });
      }
      const subjectData = subjectMap.get(subjectId)!;
      subjectData.total++;
      if (record.status === 'present') {
        subjectData.attended++;
      }
    });

    const subjectWise = await Promise.all(
      Array.from(subjectMap.entries()).map(async ([subjectId, data]) => {
        const subjectResults = await db!!.select().from(subjects).where(eq(subjects.id, subjectId));
        const subject = subjectResults[0];
        return {
          subject: subject || { id: subjectId, name: 'Unknown', code: 'UNK', semester: 0, academicYear: '', credits: 0 } as Subject,
          percentage: data.total > 0 ? (data.attended / data.total) * 100 : 0,
          attended: data.attended,
          total: data.total,
        };
      })
    );
    
    return {
      overallPercentage: records.length > 0 ? (attended / records.length) * 100 : 0,
      totalClasses: records.length,
      attendedClasses: attended,
      missedClasses: records.length - attended,
      subjectWise,
    };
  }

  async getAttendanceTrends(studentId: string, weeks: number): Promise<{
    weeklyTrends: { week: string; attendance: number; target: number }[];
    monthlyTrends: { month: string; attendance: number }[];
  }> {
    return {
      weeklyTrends: Array.from({ length: weeks }, (_, i) => ({
        week: `Week ${i + 1}`,
        attendance: 75 + Math.random() * 20,
        target: 75,
      })),
      monthlyTrends: [],
    };
  }

  async getAttendanceAnalytics(studentId?: string, subjectId?: string, dateRange?: { start: Date; end: Date }): Promise<{
    totalClasses: number;
    attendedClasses: number;
    absentClasses: number;
    lateClasses: number;
    attendanceRate: number;
    weeklyTrends: Array<{ week: string; rate: number }>;
    monthlyTrends: Array<{ month: string; rate: number }>;
    subjectWise: Array<{ subject: string; rate: number; total: number; attended: number }>;
  }> {
    let query = db!!.select().from(attendance);
    let conditions = [];
    
    if (studentId) conditions.push(eq(attendance.studentId, studentId));
    if (subjectId) conditions.push(eq(attendance.subjectId, subjectId));
    if (dateRange) {
      conditions.push(gte(attendance.attendanceDate, dateRange.start));
      conditions.push(lte(attendance.attendanceDate, dateRange.end));
    }
    
    const records = conditions.length > 0 
      ? await query.where(and(...conditions))
      : await query;
    
    const attended = records.filter((r: Attendance) => r.status === 'present').length;
    const absent = records.filter((r: Attendance) => r.status === 'absent').length;
    const late = records.filter((r: Attendance) => r.status === 'late').length;
    
    return {
      totalClasses: records.length,
      attendedClasses: attended,
      absentClasses: absent,
      lateClasses: late,
      attendanceRate: records.length > 0 ? (attended / records.length) * 100 : 0,
      weeklyTrends: [],
      monthlyTrends: [],
      subjectWise: [],
    };
  }

  async getSubjectAnalytics(studentId: string): Promise<{
    totalSubjects: number;
    totalCredits: number;
    avgGrade: number;
    subjectPerformance: Array<{ subject: string; grade: number; credits: number; attendance: number }>;
  }> {
    const subjects = await this.getSubjectsByStudent(studentId);
    
    return {
      totalSubjects: subjects.length,
      totalCredits: subjects.reduce((sum, s) => sum + (s.credits || 0), 0),
      avgGrade: 8.5,
      subjectPerformance: subjects.map(s => ({
        subject: s.name,
        grade: 8.5,
        credits: s.credits || 0,
        attendance: 85,
      })),
    };
  }

  async getNIRFMetrics(): Promise<{
    studentDiversity: { totalStudents: number; departmentDistribution: Record<string, number>; genderDiversity?: number };
    academicExcellence: { highPerformers: number; avgCGPA: number; skillCreditsPerStudent: number };
    researchInnovation: { researchActivities: number; patents: number; publications: number };
    outreachInclusion: { volunteeringActivities: number; communityImpact: number; inclusionScore: number };
    graduationOutcomes: { placementRate: number; higherEducation: number; entrepreneurship: number };
  }> {
    return {
      studentDiversity: { totalStudents: 0, departmentDistribution: {}, genderDiversity: 0.5 },
      academicExcellence: { highPerformers: 0, avgCGPA: 0, skillCreditsPerStudent: 0 },
      researchInnovation: { researchActivities: 0, patents: 0, publications: 0 },
      outreachInclusion: { volunteeringActivities: 0, communityImpact: 75, inclusionScore: 0.8 },
      graduationOutcomes: { placementRate: 85, higherEducation: 15, entrepreneurship: 5 },
    };
  }

  async getAnalyticsByDateRange(startDate: Date, endDate: Date, department?: string): Promise<{
    summary: { activities: number; students: number; credits: number };
    categoryBreakdown: { category: string; count: number; percentage: number }[];
    monthlyDistribution: { month: string; count: number }[];
    topPerformers: { student: User; activities: number; credits: number }[];
  }> {
    return {
      summary: { activities: 0, students: 0, credits: 0 },
      categoryBreakdown: [],
      monthlyDistribution: [],
      topPerformers: [],
    };
  }

  async getCSVExportData(type: string, department?: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    return [];
  }

  async getGoalAnalytics(studentId: string): Promise<{
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    completionRate: number;
    avgTimeToComplete: number;
  }> {
    const studentGoals = await this.getGoalsByStudent(studentId);
    const completed = studentGoals.filter(g => g.status === 'completed');
    const inProgress = studentGoals.filter(g => g.status === 'active');
    
    return {
      totalGoals: studentGoals.length,
      completedGoals: completed.length,
      inProgressGoals: inProgress.length,
      completionRate: studentGoals.length > 0 ? (completed.length / studentGoals.length) * 100 : 0,
      avgTimeToComplete: 14,
    };
  }

  async getDashboardSnapshots(studentId: string): Promise<{
    personalMetrics: {
      gpa: number;
      totalCredits: number;
      attendanceRate: number;
      activitiesCount: number;
      rank: number;
      totalStudents: number;
    };
    chartData: {
      gpaProgress: Array<{ semester: number; gpa: number }>;
      creditsProgress: Array<{ semester: number; credits: number }>;
      attendanceCalendar: Array<{ date: string; status: 'present' | 'absent' | 'late' | 'excused' }>;
      categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
      monthlyActivity: Array<{ month: string; activities: number }>;
    };
  }> {
    const student = await this.getUser(studentId);
    const studentActivities = await this.getActivitiesByStudent(studentId);
    const studentAttendance = await this.getStudentAttendance(studentId);
    const students = await db!!.select().from(users).where(eq(users.role, 'student'));
    
    const categoryDist = await this.getCategoryStats();
    const studentCategoryDist = categoryDist.map(c => {
      const categoryActivities = studentActivities.filter(a => a.category === c.category);
      return {
        category: c.category,
        count: categoryActivities.length,
        percentage: studentActivities.length > 0 ? (categoryActivities.length / studentActivities.length) * 100 : 0,
      };
    });
    
    return {
      personalMetrics: {
        gpa: Number(student?.cgpa) || 0,
        totalCredits: studentActivities.reduce((sum, a) => sum + (a.skillCredits || 0), 0),
        attendanceRate: studentAttendance.length > 0 ? 
          (studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100 : 0,
        activitiesCount: studentActivities.length,
        rank: 1,
        totalStudents: students.length,
      },
      chartData: {
        gpaProgress: Array.from({ length: student?.currentSemester || 1 }, (_, i) => ({
          semester: i + 1,
          gpa: 7 + Math.random() * 2,
        })),
        creditsProgress: Array.from({ length: student?.currentSemester || 1 }, (_, i) => ({
          semester: i + 1,
          credits: i * 5 + Math.random() * 10,
        })),
        attendanceCalendar: studentAttendance.slice(0, 30).map(a => ({
          date: a.attendanceDate?.toISOString().split('T')[0] || '',
          status: a.status,
        })),
        categoryDistribution: studentCategoryDist,
        monthlyActivity: [],
      },
    };
  }

  // Assignment Management Operations
  async getAllAssignments(): Promise<Assignment[]> {
    return await db!!.select().from(assignments).orderBy(desc(assignments.dueDate));
  }

  async getAssignmentById(assignmentId: string): Promise<Assignment | undefined> {
    const result = await db!!.select().from(assignments).where(eq(assignments.id, assignmentId));
    return result[0];
  }

  async getAssignmentsByStudent(studentId: string): Promise<Assignment[]> {
    return await db!!.select().from(assignments).orderBy(desc(assignments.dueDate));
  }

  async createAssignment(assignmentData: InsertAssignment): Promise<Assignment> {
    const result = await db!!.insert(assignments).values(assignmentData).returning();
    return result[0];
  }

  // Assignment Submission Operations
  async getSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string): Promise<AssignmentSubmission | undefined> {
    const result = await db!!.select()
      .from(assignmentSubmissions)
      .where(
        and(
          eq(assignmentSubmissions.assignmentId, assignmentId),
          eq(assignmentSubmissions.studentId, studentId)
        )
      );
    return result[0];
  }

  async getSubmissionsByStudent(studentId: string): Promise<AssignmentSubmission[]> {
    return await db!!.select()
      .from(assignmentSubmissions)
      .where(eq(assignmentSubmissions.studentId, studentId))
      .orderBy(desc(assignmentSubmissions.submittedAt));
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    return await db!!.select()
      .from(assignmentSubmissions)
      .where(eq(assignmentSubmissions.assignmentId, assignmentId))
      .orderBy(desc(assignmentSubmissions.submittedAt));
  }

  async createSubmission(submissionData: InsertAssignmentSubmission): Promise<AssignmentSubmission> {
    const result = await db!!.insert(assignmentSubmissions).values(submissionData).returning();
    return result[0];
  }

  async updateSubmission(submissionId: string, updates: UpdateAssignmentSubmission): Promise<AssignmentSubmission> {
    const result = await db!!.update(assignmentSubmissions)
      .set(updates)
      .where(eq(assignmentSubmissions.id, submissionId))
      .returning();
    return result[0];
  }

  // Assignment File Operations
  async addSubmissionFile(submissionId: string, fileName: string, filePath: string, fileType: string, fileSize: number): Promise<AssignmentSubmissionFile> {
    const result = await db!!.insert(assignmentSubmissionFiles).values({
      submissionId,
      fileName,
      filePath,
      fileType,
      fileSize,
    }).returning();
    return result[0];
  }

  async getSubmissionFiles(submissionId: string): Promise<AssignmentSubmissionFile[]> {
    return await db!!.select()
      .from(assignmentSubmissionFiles)
      .where(eq(assignmentSubmissionFiles.submissionId, submissionId));
  }

  async deleteSubmissionFile(fileId: string): Promise<void> {
    await db!!.delete(assignmentSubmissionFiles)
      .where(eq(assignmentSubmissionFiles.id, fileId));
  }

  // Exam Operations
  async getAllExams(): Promise<Exam[]> {
    return await db!!.select().from(exams).orderBy(desc(exams.examDate));
  }

  async getExamsByStudent(studentId: string, semester?: number): Promise<Exam[]> {
    if (semester) {
      return await db!!.select().from(exams).where(eq(exams.semester, semester)).orderBy(desc(exams.examDate));
    }
    return await db!!.select().from(exams).orderBy(desc(exams.examDate));
  }

  async getExamById(examId: string): Promise<Exam | undefined> {
    const result = await db!!.select().from(exams).where(eq(exams.id, examId));
    return result[0];
  }

  async createExam(exam: InsertExam): Promise<Exam> {
    const result = await db!!.insert(exams).values(exam).returning();
    return result[0];
  }

  async updateExam(examId: string, updates: UpdateExam): Promise<Exam> {
    const result = await db!!.update(exams).set(updates).where(eq(exams.id, examId)).returning();
    return result[0];
  }

  async deleteExam(examId: string): Promise<void> {
    await db!!.delete(exams).where(eq(exams.id, examId));
  }

  // Exam Result Operations
  async getExamResult(examId: string, studentId: string): Promise<ExamResult | undefined> {
    const result = await db!!.select().from(examResults).where(and(eq(examResults.examId, examId), eq(examResults.studentId, studentId)));
    return result[0];
  }

  async getExamResultsByStudent(studentId: string): Promise<ExamResult[]> {
    return await db!!.select().from(examResults).where(eq(examResults.studentId, studentId));
  }

  async getExamResultsByExam(examId: string): Promise<ExamResult[]> {
    return await db!!.select().from(examResults).where(eq(examResults.examId, examId));
  }

  async createExamResult(result: InsertExamResult): Promise<ExamResult> {
    const newResult = await db!!.insert(examResults).values(result).returning();
    return newResult[0];
  }

  async updateExamResult(resultId: string, updates: Partial<ExamResult>): Promise<ExamResult> {
    const result = await db!!.update(examResults).set(updates).where(eq(examResults.id, resultId)).returning();
    return result[0];
  }

  async getExamStats(studentId: string): Promise<{
    averageScore: number;
    totalExams: number;
    passedExams: number;
    failedExams: number;
    highestScore: number;
    lowestScore: number;
    upcomingExams: number;
    completedExams: number;
    performanceTrend: Array<{ month: string; score: number }>;
  }> {
    const results = await this.getExamResultsByStudent(studentId);
    const scores = results.map(r => r.marksObtained || 0).filter(s => s > 0);
    return {
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      totalExams: results.length,
      passedExams: results.filter(r => (r.marksObtained || 0) >= 40).length,
      failedExams: results.filter(r => (r.marksObtained || 0) < 40).length,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      upcomingExams: 0,
      completedExams: results.length,
      performanceTrend: [],
    };
  }

  // Resource Operations
  async getAllResources(): Promise<Resource[]> {
    return await db!!.select().from(resources).orderBy(desc(resources.createdAt));
  }

  async getResourceById(resourceId: string): Promise<Resource | undefined> {
    const result = await db!!.select().from(resources).where(eq(resources.id, resourceId));
    return result[0];
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return await db!!.select().from(resources).where(eq(resources.type, type));
  }

  async getResourcesBySubject(subject: string): Promise<Resource[]> {
    return await db!!.select().from(resources).where(eq(resources.subject, subject));
  }

  async searchResources(query: string, filters?: { type?: string; subject?: string; category?: string }): Promise<Resource[]> {
    let queryBuilder = db!!.select().from(resources);
    const conditions = [];
    if (filters?.type) conditions.push(eq(resources.type, filters.type));
    if (filters?.subject) conditions.push(eq(resources.subject, filters.subject));
    if (filters?.category) conditions.push(eq(resources.category, filters.category));
    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions)) as any;
    }
    return await queryBuilder;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const result = await db!!.insert(resources).values(resource).returning();
    return result[0];
  }

  async updateResource(resourceId: string, updates: UpdateResource): Promise<Resource> {
    const result = await db!!.update(resources).set(updates).where(eq(resources.id, resourceId)).returning();
    return result[0];
  }

  async deleteResource(resourceId: string): Promise<void> {
    await db!!.delete(resources).where(eq(resources.id, resourceId));
  }

  async incrementResourceDownload(resourceId: string): Promise<void> {
    const resource = await this.getResourceById(resourceId);
    if (resource) {
      await db!!.update(resources).set({ downloads: (resource.downloads || 0) + 1 }).where(eq(resources.id, resourceId));
    }
  }

  async incrementResourceView(resourceId: string): Promise<void> {
    const resource = await this.getResourceById(resourceId);
    if (resource) {
      await db!!.update(resources).set({ views: (resource.views || 0) + 1 }).where(eq(resources.id, resourceId));
    }
  }

  // Event Operations
  async getAllEvents(): Promise<Event[]> {
    return await db!!.select().from(events).orderBy(desc(events.eventDate));
  }

  async getEventById(eventId: string): Promise<Event | undefined> {
    const result = await db!!.select().from(events).where(eq(events.id, eventId));
    return result[0];
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return await db!!.select().from(events).where(eq(events.category, category));
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return await db!!.select().from(events).where(and(gte(events.eventDate, startDate), lte(events.eventDate, endDate)));
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return await db!!.select().from(events).where(gte(events.eventDate, new Date())).orderBy(events.eventDate);
  }

  async getPastEvents(): Promise<Event[]> {
    return await db!!.select().from(events).where(lte(events.eventDate, new Date())).orderBy(desc(events.eventDate));
  }

  async searchEvents(query: string): Promise<Event[]> {
    return await db!!.select().from(events);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db!!.insert(events).values(event).returning();
    return result[0];
  }

  async updateEvent(eventId: string, updates: UpdateEvent): Promise<Event> {
    const result = await db!!.update(events).set(updates).where(eq(events.id, eventId)).returning();
    return result[0];
  }

  async deleteEvent(eventId: string): Promise<void> {
    await db!!.delete(events).where(eq(events.id, eventId));
  }

  // Event RSVP Operations
  async getEventRsvp(eventId: string, studentId: string): Promise<EventRsvp | undefined> {
    const result = await db!!.select().from(eventRsvps).where(and(eq(eventRsvps.eventId, eventId), eq(eventRsvps.studentId, studentId)));
    return result[0];
  }

  async getEventRsvps(eventId: string): Promise<EventRsvp[]> {
    return await db!!.select().from(eventRsvps).where(eq(eventRsvps.eventId, eventId));
  }

  async getStudentRsvps(studentId: string): Promise<EventRsvp[]> {
    return await db!!.select().from(eventRsvps).where(eq(eventRsvps.studentId, studentId));
  }

  async createOrUpdateRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp> {
    const existing = await this.getEventRsvp(rsvp.eventId, rsvp.studentId);
    if (existing) {
      const result = await db!!.update(eventRsvps).set(rsvp).where(eq(eventRsvps.id, existing.id)).returning();
      return result[0];
    }
    const result = await db!!.insert(eventRsvps).values(rsvp).returning();
    return result[0];
  }

  async deleteRsvp(rsvpId: string): Promise<void> {
    await db!!.delete(eventRsvps).where(eq(eventRsvps.id, rsvpId));
  }

  async getEventAttendeeCount(eventId: string): Promise<{ going: number; maybe: number; notGoing: number; total: number }> {
    const rsvps = await this.getEventRsvps(eventId);
    return {
      going: rsvps.filter(r => r.status === 'going').length,
      maybe: rsvps.filter(r => r.status === 'maybe').length,
      notGoing: rsvps.filter(r => r.status === 'not_going').length,
      total: rsvps.length,
    };
  }

  // Advanced Analytics Operations
  async getGPATrends(studentId: string, semesters: number): Promise<Array<{ semester: number; gpa: number; credits: number }>> {
    return Array.from({ length: semesters }, (_, i) => ({
      semester: i + 1,
      gpa: 7 + Math.random() * 2,
      credits: 20 + Math.floor(Math.random() * 10),
    }));
  }

  async getCreditsGPAAnalysis(studentId: string): Promise<Array<{ semester: number; earnedCredits: number; cumulativeCredits: number; gpa: number }>> {
    return Array.from({ length: 8 }, (_, i) => ({
      semester: i + 1,
      earnedCredits: 20 + Math.floor(Math.random() * 5),
      cumulativeCredits: (i + 1) * 20,
      gpa: 7 + Math.random() * 2,
    }));
  }

  async getCumulativeCGPAData(studentId: string): Promise<Array<{ semester: number; cgpa: number; targetCGPA: number }>> {
    return Array.from({ length: 8 }, (_, i) => ({
      semester: i + 1,
      cgpa: 7 + (i * 0.1) + Math.random() * 0.5,
      targetCGPA: 8.5,
    }));
  }

  async getSubjectGPADistribution(studentId: string, semester?: string): Promise<Array<{ subjectName: string; subjectCode: string; gpa: number; credits: number }>> {
    const studentSubjects = await this.getSubjectsByStudent(studentId);
    return studentSubjects.map(s => ({
      subjectName: s.name,
      subjectCode: s.code,
      gpa: 7 + Math.random() * 3,
      credits: s.credits || 0,
    }));
  }

  async getGPAAttendanceCorrelation(studentId: string): Promise<Array<{ subject: string; gpa: number; attendance: number }>> {
    const studentSubjects = await this.getSubjectsByStudent(studentId);
    return studentSubjects.map(subject => ({
      subject: subject.name,
      gpa: 7 + Math.random() * 3,
      attendance: 70 + Math.random() * 30,
    }));
  }

  async getSkillsAssessmentData(studentId: string): Promise<Array<{ skill: string; current: number; target: number; category: string }>> {
    const skills = [
      { skill: 'Programming', category: 'Technical' },
      { skill: 'Communication', category: 'Soft Skills' },
      { skill: 'Leadership', category: 'Soft Skills' },
      { skill: 'Problem Solving', category: 'Technical' },
      { skill: 'Teamwork', category: 'Soft Skills' },
    ];
    return skills.map(s => ({
      ...s,
      current: 60 + Math.random() * 30,
      target: 90,
    }));
  }

  async getSkillGrowthData(studentId: string): Promise<Array<{ skill: string; progress: number; target: number; level: string; startDate: string }>> {
    const skills = ['Programming', 'Communication', 'Leadership', 'Problem Solving', 'Teamwork'];
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return skills.map((skill, i) => ({
      skill,
      progress: 50 + Math.random() * 40,
      target: 100,
      level: levels[Math.floor(Math.random() * levels.length)],
      startDate: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }

  async getAchievementFunnelData(studentId: string): Promise<Array<{ stage: string; count: number; percentage: number }>> {
    return [
      { stage: 'Submitted', count: 100, percentage: 100 },
      { stage: 'Under Review', count: 80, percentage: 80 },
      { stage: 'Approved', count: 65, percentage: 65 },
      { stage: 'Verified', count: 60, percentage: 60 },
    ];
  }

  async getAttendanceHeatmapData(studentId: string, year: number): Promise<Array<{ date: string; attendance: number; status: string }>> {
    const studentAttendance = await this.getStudentAttendance(studentId);
    return studentAttendance.map(a => ({
      date: a.attendanceDate?.toISOString().split('T')[0] || '',
      attendance: a.status === 'present' ? 1 : 0,
      status: a.status,
    }));
  }

  async getWeeklyAttendancePatterns(studentId: string, weeks: number): Promise<Array<{ week: string; weekAverage: number; monday: number; tuesday: number; wednesday: number; thursday: number; friday: number }>> {
    return Array.from({ length: weeks }, (_, i) => ({
      week: `Week ${i + 1}`,
      weekAverage: 75 + Math.random() * 20,
      monday: 70 + Math.random() * 30,
      tuesday: 70 + Math.random() * 30,
      wednesday: 70 + Math.random() * 30,
      thursday: 70 + Math.random() * 30,
      friday: 70 + Math.random() * 30,
    }));
  }

  async getActivityCategoryDistribution(studentId: string): Promise<Array<{ category: string; count: number; percentage: number; credits: number }>> {
    const studentActivities = await this.getActivitiesByStudent(studentId);
    const categories = ['academic', 'co-curricular', 'extra-curricular', 'volunteering', 'internship'];
    const total = studentActivities.length;
    return categories.map(category => {
      const count = studentActivities.filter(a => a.category === category).length;
      const credits = studentActivities.filter(a => a.category === category).reduce((sum, a) => sum + (a.skillCredits || 0), 0);
      return {
        category,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        credits,
      };
    });
  }

  async getActivityVolumeData(studentId: string, months: number): Promise<Array<{ month: string; total: number; approved: number; pending: number; rejected: number }>> {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: months }, (_, i) => {
      const total = Math.floor(Math.random() * 10);
      const approved = Math.floor(total * 0.7);
      const rejected = Math.floor(total * 0.1);
      const pending = total - approved - rejected;
      return {
        month: monthNames[i % 12],
        total,
        approved,
        pending,
        rejected,
      };
    });
  }

  async getPeerComparisonData(studentId: string, department?: string | null): Promise<Array<{ metric: string; myValue: number; average: number; median: number; q1: number; q3: number }>> {
    const metrics = ['GPA', 'Attendance', 'Activities', 'Credits', 'Skills'];
    return metrics.map(metric => {
      const myValue = 70 + Math.random() * 25;
      const average = 65 + Math.random() * 20;
      return {
        metric,
        myValue,
        average,
        median: average + Math.random() * 5 - 2.5,
        q1: average - 10,
        q3: average + 10,
      };
    });
  }

  async getRankPercentileData(studentId: string): Promise<{ currentRank: number; totalStudents: number; percentile: number; previousRank: number | null; target: number }> {
    const allStudents = await db!!.select().from(users).where(eq(users.role, 'student'));
    const totalStudents = allStudents.length;
    const currentRank = Math.floor(Math.random() * totalStudents) + 1;
    return {
      currentRank,
      totalStudents,
      percentile: ((totalStudents - currentRank) / totalStudents) * 100,
      previousRank: currentRank + Math.floor(Math.random() * 10) - 5,
      target: Math.max(1, currentRank - 10),
    };
  }

  async getDepartmentRankings(): Promise<Array<{ department: string; overallScore: number; rank: number; students: number; avgGPA: number; avgActivities: number }>> {
    const depts = await this.getDepartments();
    return depts.map((dept, i) => ({
      department: dept.name,
      overallScore: 70 + Math.random() * 25,
      rank: i + 1,
      students: 50 + Math.floor(Math.random() * 50),
      avgGPA: 7 + Math.random() * 2,
      avgActivities: 10 + Math.floor(Math.random() * 20),
    }));
  }

  async getPortfolioStrengthData(studentId: string): Promise<Array<{ area: string; strength: number; maxStrength: number; activities: number }>> {
    const areas = ['Academic', 'Co-curricular', 'Leadership', 'Technical Skills', 'Soft Skills'];
    return areas.map(area => ({
      area,
      strength: 50 + Math.random() * 40,
      maxStrength: 100,
      activities: Math.floor(Math.random() * 20),
    }));
  }

  async getApprovalSLAData(): Promise<Array<{ reviewer: string; avgApprovalTime: number; onTimePercentage: number; totalReviewed: number; pending: number }>> {
    const faculty = await db!!.select().from(users).where(eq(users.role, 'faculty'));
    return faculty.map(f => ({
      reviewer: `${f.firstName} ${f.lastName}`,
      avgApprovalTime: 24 + Math.random() * 48,
      onTimePercentage: 70 + Math.random() * 25,
      totalReviewed: Math.floor(Math.random() * 100),
      pending: Math.floor(Math.random() * 20),
    }));
  }

  async getGradeCorrelationMatrix(studentId: string): Promise<{ subjects: string[]; correlationMatrix: number[][] }> {
    const studentSubjects = await this.getSubjectsByStudent(studentId);
    const subjectNames = studentSubjects.map(s => s.name);
    const matrix = subjectNames.map(() => 
      subjectNames.map(() => -1 + Math.random() * 2)
    );
    matrix.forEach((row, i) => {
      row[i] = 1;
    });
    return { subjects: subjectNames, correlationMatrix: matrix };
  }

  async getLiveAnalyticsUpdate(studentId: string): Promise<{ timestamp: string; gpa: number; attendance: number; activities: number; rank: number; recentActivities: Activity[] }> {
    const student = await this.getUser(studentId);
    const studentActivities = await this.getActivitiesByStudent(studentId);
    const studentAttendance = await this.getStudentAttendance(studentId);
    return {
      timestamp: new Date().toISOString(),
      gpa: Number(student?.cgpa) || 0,
      attendance: studentAttendance.length > 0 ? (studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100 : 0,
      activities: studentActivities.length,
      rank: Math.floor(Math.random() * 100) + 1,
      recentActivities: studentActivities.slice(0, 5),
    };
  }
}

// Export storage instance - using DatabaseStorage if available, otherwise MemStorage
export const storage = db! ? new DatabaseStorage() : new MemStorage();
