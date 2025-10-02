/**
 * FIREBASE-ENHANCED API HOOKS FOR 100,000+ STUDENTS
 *
 * Real-time data synchronization with automatic fallback to REST API
 * Optimized for massive scale with proper data isolation per student
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ref, get } from "firebase/database";
import {
  useRealtimeGrades,
  useRealtimeAssignments,
  useRealtimeAttendance,
  useRealtimeNotifications,
  useBatchedData,
  useNetworkStatus,
  realtimeDB,
} from "./firebase";
import { updateStudentData } from "../../../backend/firebase-config";

// API Client type - will be replaced with actual implementation
const ApiClient = {
  getGrades: () => fetch("/api/grades/me").then((r) => r.json()),
  getAssignments: () => fetch("/api/assignments/me").then((r) => r.json()),
  getAttendance: () => fetch("/api/attendance/me").then((r) => r.json()),
  getNotifications: () => fetch("/api/notifications/me").then((r) => r.json()),
  getProfile: () => fetch("/api/profile/me").then((r) => r.json()),
  updateProfile: (data: any) =>
    fetch("/api/profile/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

// ==================== ENHANCED HOOKS WITH FIREBASE SYNC ====================

/**
 * Enhanced grades hook with Firebase real-time updates
 * Falls back to REST API when Firebase is unavailable
 */
export const useGradesEnhanced = (studentId: string, options = {}) => {
  const isOnline = useNetworkStatus();
  const {
    data: firebaseData,
    loading: firebaseLoading,
    error: firebaseError,
  } = useRealtimeGrades(studentId);

  // Fallback to REST API when Firebase fails or offline
  const restQuery = useQuery({
    queryKey: ["grades", studentId],
    queryFn: () => ApiClient.getGrades(),
    enabled: Boolean(!firebaseData && (firebaseError || !isOnline)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

  // Return Firebase data when available, otherwise REST data
  return {
    data: firebaseData || restQuery.data,
    loading: firebaseLoading || restQuery.isLoading,
    error: firebaseError || restQuery.error,
    isRealtime: !!firebaseData,
    isOnline,
    refetch: restQuery.refetch,
  };
};

/**
 * Enhanced assignments hook with Firebase real-time updates
 */
export const useAssignmentsEnhanced = (studentId: string, options = {}) => {
  const isOnline = useNetworkStatus();
  const {
    data: firebaseData,
    loading: firebaseLoading,
    error: firebaseError,
  } = useRealtimeAssignments(studentId);

  const restQuery = useQuery({
    queryKey: ["assignments", studentId],
    queryFn: () => ApiClient.getAssignments(),
    enabled: Boolean(!firebaseData && (firebaseError || !isOnline)),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  return {
    data: firebaseData || restQuery.data,
    loading: firebaseLoading || restQuery.isLoading,
    error: firebaseError || restQuery.error,
    isRealtime: !!firebaseData,
    isOnline,
    refetch: restQuery.refetch,
  };
};

/**
 * Enhanced attendance hook with Firebase real-time updates
 */
export const useAttendanceEnhanced = (studentId: string, options = {}) => {
  const isOnline = useNetworkStatus();
  const {
    data: firebaseData,
    loading: firebaseLoading,
    error: firebaseError,
  } = useRealtimeAttendance(studentId);

  const restQuery = useQuery({
    queryKey: ["attendance", studentId],
    queryFn: () => ApiClient.getAttendance(),
    enabled: Boolean(!firebaseData && (firebaseError || !isOnline)),
    staleTime: 3 * 60 * 1000, // 3 minutes for attendance
    ...options,
  });

  return {
    data: firebaseData || restQuery.data,
    loading: firebaseLoading || restQuery.isLoading,
    error: firebaseError || restQuery.error,
    isRealtime: !!firebaseData,
    isOnline,
    refetch: restQuery.refetch,
  };
};

/**
 * Enhanced notifications hook with Firebase real-time updates
 * Shorter cache time for real-time notifications
 */
export const useNotificationsEnhanced = (studentId: string, options = {}) => {
  const isOnline = useNetworkStatus();
  const {
    data: firebaseData,
    loading: firebaseLoading,
    error: firebaseError,
  } = useRealtimeNotifications(studentId);

  const restQuery = useQuery({
    queryKey: ["notifications", studentId],
    queryFn: () => ApiClient.getNotifications(),
    enabled: Boolean(!firebaseData && (firebaseError || !isOnline)),
    staleTime: 1 * 60 * 1000, // 1 minute for notifications
    refetchInterval: 2 * 60 * 1000, // Auto-refetch every 2 minutes
    ...options,
  });

  return {
    data: firebaseData || restQuery.data,
    loading: firebaseLoading || restQuery.isLoading,
    error: firebaseError || restQuery.error,
    isRealtime: !!firebaseData,
    isOnline,
    refetch: restQuery.refetch,
  };
};

// ==================== BULK DATA LOADING FOR DASHBOARD ====================

/**
 * Load multiple data types efficiently for dashboard
 * Optimized for 100k students with batching
 */
export const useDashboardData = (studentId: string) => {
  const isOnline = useNetworkStatus();

  // Load multiple data types in batches via Firebase
  const { data: batchedData, loading: batchLoading } = useBatchedData(
    studentId,
    ["grades", "assignments", "attendance", "notifications"],
    3 // Batch size
  );

  // Individual fallback queries
  const gradesQuery = useQuery({
    queryKey: ["grades", studentId],
    queryFn: () => ApiClient.getGrades(),
    enabled: !batchedData?.grades && !batchLoading,
    staleTime: 5 * 60 * 1000,
  });

  const assignmentsQuery = useQuery({
    queryKey: ["assignments", studentId],
    queryFn: () => ApiClient.getAssignments(),
    enabled: !batchedData?.assignments && !batchLoading,
    staleTime: 5 * 60 * 1000,
  });

  const attendanceQuery = useQuery({
    queryKey: ["attendance", studentId],
    queryFn: () => ApiClient.getAttendance(),
    enabled: !batchedData?.attendance && !batchLoading,
    staleTime: 3 * 60 * 1000,
  });

  const notificationsQuery = useQuery({
    queryKey: ["notifications", studentId],
    queryFn: () => ApiClient.getNotifications(),
    enabled: !batchedData?.notifications && !batchLoading,
    staleTime: 1 * 60 * 1000,
  });

  const isLoading =
    batchLoading ||
    gradesQuery.isLoading ||
    assignmentsQuery.isLoading ||
    attendanceQuery.isLoading ||
    notificationsQuery.isLoading;

  return {
    grades: batchedData?.grades || gradesQuery.data,
    assignments: batchedData?.assignments || assignmentsQuery.data,
    attendance: batchedData?.attendance || attendanceQuery.data,
    notifications: batchedData?.notifications || notificationsQuery.data,
    loading: isLoading,
    isRealtime: !!batchedData,
    isOnline,
    refetch: () => {
      gradesQuery.refetch();
      assignmentsQuery.refetch();
      attendanceQuery.refetch();
      notificationsQuery.refetch();
    },
  };
};

// ==================== PERFORMANCE MONITORING ====================

/**
 * Hook to monitor Firebase performance for 100k students
 */
export const useFirebasePerformance = () => {
  const isOnline = useNetworkStatus();

  return useQuery({
    queryKey: ["firebase-performance"],
    queryFn: async () => {
      const start = performance.now();

      try {
        // Test Firebase connectivity
        const testRef = ref(realtimeDB, "health-check");
        await get(testRef);

        const end = performance.now();
        return {
          isConnected: true,
          latency: end - start,
          timestamp: Date.now(),
        };
      } catch (error) {
        return {
          isConnected: false,
          latency: null as number | null,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: Date.now(),
        };
      }
    },
    refetchInterval: 30 * 1000, // Check every 30 seconds
    enabled: isOnline,
    retry: false,
  });
};

// ==================== STUDENT PROFILE WITH REAL-TIME UPDATES ====================

/**
 * Complete student profile with real-time updates
 */
export const useStudentProfile = (studentId: string) => {
  const queryClient = useQueryClient();

  // Get user profile (usually cached)
  const profileQuery = useQuery({
    queryKey: ["profile", studentId],
    queryFn: () => ApiClient.getProfile(),
    staleTime: 10 * 60 * 1000, // Profile changes less frequently
  });

  // Real-time dashboard data
  const dashboardData = useDashboardData(studentId);

  // Update mutation with Firebase sync
  const updateProfileMutation = useMutation({
    mutationFn: ApiClient.updateProfile,
    onSuccess: (updatedProfile) => {
      // Update local cache
      queryClient.setQueryData(["profile", studentId], updatedProfile);

      // Sync with Firebase
      updateStudentData(studentId, "profile", updatedProfile);
    },
  });

  return {
    profile: profileQuery.data,
    ...dashboardData,
    updateProfile: updateProfileMutation.mutate,
    updating: updateProfileMutation.isPending,
    profileLoading: profileQuery.isLoading,
  };
};

// Export enhanced hooks as default for easy migration
export default {
  useGradesEnhanced,
  useAssignmentsEnhanced,
  useAttendanceEnhanced,
  useNotificationsEnhanced,
  useDashboardData,
  useStudentProfile,
  useFirebasePerformance,
};
