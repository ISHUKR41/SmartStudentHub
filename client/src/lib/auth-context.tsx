/**
 * AUTHENTICATION CONTEXT FOR 100,000+ STUDENTS
 *
 * This context provides:
 * 1. ✅ Current user state management
 * 2. ✅ Login/Logout functionality
 * 3. ✅ Role-based access control
 * 4. ✅ Session persistence
 * 5. ✅ Loading states
 *
 * CRITICAL: This ensures only authenticated users can access data
 * and each user sees only their own information!
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api, { User } from "./api";

// ==================== TYPES ====================

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  hasRole: (roles: string | string[]) => boolean;
}

// ==================== CONTEXT ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated by fetching current user
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login function
   */
  const login = async (email: string, password: string) => {
    try {
      // Call login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ CRITICAL: Include session cookie
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const loggedInUser = await response.json();
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  /**
   * Update user information
   */
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  /**
   * Check if user has required role(s)
   */
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==================== HOOK ====================

/**
 * Hook to access authentication context
 *
 * Usage:
 * ```typescript
 * const { user, isAuthenticated, login, logout } = useAuth();
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// ==================== PROTECTED ROUTE COMPONENT ====================

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  fallback?: ReactNode;
}

/**
 * Component to protect routes that require authentication
 *
 * Usage:
 * ```typescript
 * <ProtectedRoute requiredRole="student">
 *   <GradesPage />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { user, isLoading, hasRole } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              Please login to access this page
            </p>
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Login
            </a>
          </div>
        </div>
      )
    );
  }

  // Check role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page
            </p>
            <p className="text-sm text-muted-foreground">
              Required role:{" "}
              {Array.isArray(requiredRole)
                ? requiredRole.join(", ")
                : requiredRole}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Your role: {user.role}
            </p>
            <a
              href="/"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Home
            </a>
          </div>
        </div>
      )
    );
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
}

// ==================== USER INFO COMPONENT ====================

/**
 * Component to display current user information
 * Shows student's name, roll number, and CGPA
 */
export function UserInfo() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-semibold">
          {user.firstName[0]}
          {user.lastName[0]}
        </span>
      </div>
      <div className="flex-1">
        <p className="font-medium">
          {user.firstName} {user.lastName}
        </p>
        {user.rollNumber && (
          <p className="text-xs text-muted-foreground">
            Roll No: {user.rollNumber}
          </p>
        )}
        {user.cgpa !== undefined && (
          <p className="text-xs text-muted-foreground">CGPA: {user.cgpa}</p>
        )}
      </div>
    </div>
  );
}

export default AuthContext;
