/**
 * BACKEND TYPE DEFINITIONS
 *
 * TypeScript types and interfaces for the backend
 */

import { Request } from "express";

// Extend Express Session to include user
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number; // Changed from string to number to match schema serial type
      email: string;
      firstName: string;
      lastName: string;
      role: "student" | "faculty" | "admin" | "staff";
      rollNumber?: string;
      department?: string;
      currentSemester?: number;
      cgpa?: number;
      profileImageUrl?: string;
    };
  }
}

// Extended Request with user in session
export interface AuthenticatedRequest extends Request {
  session: import("express-session").Session &
    Partial<import("express-session").SessionData> & {
      user: {
        id: number; // Changed from string to number to match schema serial type
        email: string;
        firstName: string;
        lastName: string;
        role: "student" | "faculty" | "admin" | "staff";
        rollNumber?: string;
        department?: string;
        currentSemester?: number;
        cgpa?: number;
        profileImageUrl?: string;
      };
    };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// File Upload types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Query params types
export interface QueryFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  startDate?: string;
  endDate?: string;
}

// Statistics types
export interface DashboardStats {
  cgpa: number;
  attendancePercentage: number;
  pendingAssignments: number;
  upcomingExams: number;
  pendingActivities: number;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface AcademicStats {
  totalCourses: number;
  completedCourses: number;
  currentSemester: number;
  cgpa: number;
  totalCredits: number;
}
