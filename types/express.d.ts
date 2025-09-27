import 'express-session';

declare global {
  namespace Express {
    interface User {
      // Auth properties from Replit integration
      claims?: Record<string, any>;
      access_token?: string;
      refresh_token?: string;
      expires_at?: number;
      
      // User properties from database schema
      id?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
      role?: 'student' | 'faculty' | 'admin';
      rollNumber?: string;
      department?: string;
      currentSemester?: number;
      cgpa?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
}

// Authenticated user type with guaranteed claims.sub
export type AuthenticatedUser = Express.User & {
  claims: { sub: string } & Record<string, any>;
};

export {};