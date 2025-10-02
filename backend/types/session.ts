/**
 * SESSION TYPE DEFINITIONS FOR STUDENT DATA ISOLATION
 *
 * Extends express-session to include user data for proper data isolation
 * Critical for ensuring each of 100k students sees only their own data
 */

import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
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

export interface AuthenticatedRequest extends Express.Request {
  session: {
    user: {
      id: number;
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
  } & Express.Request["session"];
}
