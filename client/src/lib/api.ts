/**
 * API UTILITY WITH DATA ISOLATION FOR 100,000+ STUDENTS
 *
 * This file provides:
 * 1. ✅ Centralized API calls with authentication
 * 2. ✅ Automatic user-specific data fetching
 * 3. ✅ Error handling with proper messages
 * 4. ✅ TypeScript types for all responses
 * 5. ✅ Pagination support for large datasets
 *
 * CRITICAL: All API calls automatically include session credentials
 * This ensures each student sees ONLY their own data!
 */

// ==================== TYPES ====================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  rollNumber?: string;
  department?: string;
  currentSemester?: number;
  yearOfAdmission?: number;
  cgpa?: number;
  role: "student" | "faculty" | "admin" | "staff";
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  courseName?: string;
  examType: string;
  marksObtained: number;
  totalMarks: number;
  grade?: string;
  examDate: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  status?: "assigned" | "submitted" | "graded" | "late";
  submissionStatus?: "not_submitted" | "submitted" | "graded";
  marksObtained?: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
}

export interface FeePayment {
  id: string;
  studentId: string;
  semester: number;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentDate?: string;
}

export interface ScholarshipApplication {
  id: string;
  studentId: string;
  scholarshipId: string;
  scholarshipName?: string;
  amount?: number;
  status: "applied" | "under_review" | "approved" | "rejected";
  appliedAt: string;
}

export interface Activity {
  id: string;
  studentId: string;
  title: string;
  category: string;
  activityDate: string;
  points: number;
  status: "pending" | "approved" | "rejected";
}

export interface Goal {
  id: string;
  studentId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "active" | "completed" | "overdue";
  progress: number;
  targetDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// ==================== API CLIENT ====================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch wrapper with authentication
   * Automatically includes credentials for session-based auth
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: "include", // ✅ CRITICAL: Include session cookie
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: "Request failed",
        message: response.statusText,
        statusCode: response.status,
      }));

      throw error;
    }

    return response.json();
  }

  // ==================== USER APIs ====================

  /**
   * Get current user profile
   * Returns ONLY the logged-in user's data
   */
  async getCurrentUser(): Promise<User> {
    return this.request<User>("/users/me");
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // ==================== GRADES APIs ====================

  /**
   * Get current student's grades
   * ✅ Returns ONLY this student's grades (filtered by session userId)
   */
  async getMyGrades(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Grade>> {
    return this.request<PaginatedResponse<Grade>>(
      `/grades/me?page=${page}&limit=${limit}`
    );
  }

  /**
   * Get CGPA for current student
   */
  async getMyCGPA(): Promise<{ cgpa: number; userId: string }> {
    return this.request<{ cgpa: number; userId: string }>("/grades/cgpa");
  }

  /**
   * Get grades by semester
   */
  async getGradesBySemester(semester: number): Promise<Grade[]> {
    return this.request<Grade[]>(`/grades/semester/${semester}`);
  }

  // ==================== ASSIGNMENTS APIs ====================

  /**
   * Get current student's assignments
   * ✅ Returns ONLY assignments for courses this student is enrolled in
   * ✅ Shows ONLY this student's submission status
   */
  async getMyAssignments(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Assignment>> {
    return this.request<PaginatedResponse<Assignment>>(
      `/assignments/me?page=${page}&limit=${limit}`
    );
  }

  /**
   * Submit assignment
   * ✅ Student ID is automatically taken from session (cannot be manipulated)
   */
  async submitAssignment(
    assignmentId: string,
    submissionUrl: string
  ): Promise<any> {
    return this.request(`/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: JSON.stringify({ submissionUrl }),
    });
  }

  // ==================== ATTENDANCE APIs ====================

  /**
   * Get current student's attendance
   * ✅ Returns ONLY this student's attendance records
   */
  async getMyAttendance(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Attendance> & { stats?: any }> {
    return this.request(`/attendance/me?page=${page}&limit=${limit}`);
  }

  // ==================== FEE PAYMENTS APIs ====================

  /**
   * Get current student's fee payments
   * ✅ Returns ONLY this student's payment history
   */
  async getMyFeePayments(): Promise<{ payments: FeePayment[]; summary?: any }> {
    return this.request("/fees/me");
  }

  // ==================== SCHOLARSHIP APIs ====================

  /**
   * Get available scholarships (public data)
   */
  async getScholarships(): Promise<any[]> {
    return this.request("/scholarships");
  }

  /**
   * Get current student's scholarship applications
   * ✅ Returns ONLY this student's applications
   */
  async getMyScholarshipApplications(): Promise<ScholarshipApplication[]> {
    return this.request("/scholarships/applications/me");
  }

  /**
   * Apply for scholarship
   * ✅ Student ID is automatically taken from session
   */
  async applyForScholarship(
    scholarshipId: string
  ): Promise<ScholarshipApplication> {
    return this.request("/scholarships/apply", {
      method: "POST",
      body: JSON.stringify({ scholarshipId }),
    });
  }

  // ==================== ACTIVITIES APIs ====================

  /**
   * Get current student's activities
   * ✅ Returns ONLY this student's activities
   */
  async getMyActivities(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Activity> & { stats?: any }> {
    return this.request(`/activities/me?page=${page}&limit=${limit}`);
  }

  /**
   * Submit new activity
   * ✅ Student ID is automatically taken from session
   */
  async submitActivity(data: {
    title: string;
    category: string;
    activityDate: string;
    points: number;
    description?: string;
  }): Promise<Activity> {
    return this.request("/activities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ==================== GOALS APIs ====================

  /**
   * Get current student's goals
   * ✅ Returns ONLY this student's goals
   */
  async getMyGoals(): Promise<Goal[]> {
    return this.request("/goals/me");
  }

  /**
   * Create new goal
   * ✅ Student ID is automatically taken from session
   */
  async createGoal(data: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    targetDate: string;
  }): Promise<Goal> {
    return this.request("/goals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update goal
   * ✅ Can only update own goals (ownership verified on backend)
   */
  async updateGoal(goalId: string, data: Partial<Goal>): Promise<Goal> {
    return this.request(`/goals/${goalId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // ==================== NOTIFICATIONS APIs ====================

  /**
   * Get current user's notifications
   * ✅ Returns ONLY this user's notifications
   */
  async getMyNotifications(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Notification> & { unreadCount?: number }> {
    return this.request(`/notifications/me?page=${page}&limit=${limit}`);
  }

  /**
   * Mark notification as read
   * ✅ Can only mark own notifications
   */
  async markNotificationRead(notificationId: string): Promise<Notification> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return this.request("/notifications/read-all", {
      method: "PUT",
    });
  }

  // ==================== LIBRARY APIs ====================

  /**
   * Get current student's issued books
   * ✅ Returns ONLY this student's issued books
   */
  async getMyIssuedBooks(): Promise<any[]> {
    return this.request("/library/issues/me");
  }

  // ==================== GRIEVANCES APIs ====================

  /**
   * Get current student's grievances
   * ✅ Returns ONLY this student's grievances
   */
  async getMyGrievances(): Promise<any[]> {
    return this.request("/grievances/me");
  }

  /**
   * Submit grievance
   * ✅ Student ID is automatically taken from session
   */
  async submitGrievance(data: {
    title: string;
    description: string;
    category: string;
    priority: "low" | "medium" | "high" | "critical";
  }): Promise<any> {
    return this.request("/grievances", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ==================== DASHBOARD APIs ====================

  /**
   * Get dashboard statistics
   * ✅ Returns statistics for current user only
   */
  async getDashboardStats(): Promise<any> {
    return this.request("/dashboard/stats");
  }
}

// ==================== EXPORT ====================

/**
 * Singleton API client instance
 * Use this throughout the application for all API calls
 */
export const api = new ApiClient();

/**
 * React Query hooks for common operations
 * These provide caching, loading states, and automatic refetching
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => api.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get student's grades
 */
export function useMyGrades(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["grades", "me", page, limit],
    queryFn: () => api.getMyGrades(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get student's CGPA
 */
export function useMyCGPA() {
  return useQuery({
    queryKey: ["cgpa", "me"],
    queryFn: () => api.getMyCGPA(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get student's assignments
 */
export function useMyAssignments(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["assignments", "me", page, limit],
    queryFn: () => api.getMyAssignments(page, limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to submit assignment
 */
export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      submissionUrl,
    }: {
      assignmentId: string;
      submissionUrl: string;
    }) => api.submitAssignment(assignmentId, submissionUrl),
    onSuccess: () => {
      // Invalidate assignments query to refresh data
      queryClient.invalidateQueries({ queryKey: ["assignments", "me"] });
    },
  });
}

/**
 * Hook to get student's attendance
 */
export function useMyAttendance(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["attendance", "me", page, limit],
    queryFn: () => api.getMyAttendance(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get student's fee payments
 */
export function useMyFeePayments() {
  return useQuery({
    queryKey: ["fees", "me"],
    queryFn: () => api.getMyFeePayments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get student's activities
 */
export function useMyActivities(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["activities", "me", page, limit],
    queryFn: () => api.getMyActivities(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get student's goals
 */
export function useMyGoals() {
  return useQuery({
    queryKey: ["goals", "me"],
    queryFn: () => api.getMyGoals(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get student's notifications
 */
export function useMyNotifications(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["notifications", "me", page, limit],
    queryFn: () => api.getMyNotifications(page, limit),
    staleTime: 30 * 1000, // 30 seconds (notifications should be fresh)
  });
}

/**
 * Hook to get dashboard stats
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => api.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Export the API client and types
export default api;
