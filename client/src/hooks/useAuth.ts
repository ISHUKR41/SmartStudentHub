/**
 * Authentication Hook
 * 
 * Custom React hook that manages user authentication state throughout the application.
 * Integrates with Replit Auth and provides a clean interface for checking
 * authentication status and user information.
 * 
 * Features:
 * - Authentication state management via React Query
 * - User profile data retrieval from API
 * - Loading state handling during auth checks
 * - Reactive authentication status updates
 * 
 * Usage:
 * - Use in components that need authentication information
 * - Integrates with React Query caching system
 * - Provides consistent authentication state across the app
 * - Throws errors on authentication failures (401 responses)
 * 
 * Returns:
 * - user: Current user object or null if not authenticated
 * - isLoading: Boolean indicating if authentication check is in progress
 * - isAuthenticated: Boolean indicating if user is logged in
 */

import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  // Query user authentication status and profile data
  // Disabled retry to avoid repeated failed authentication attempts
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false, // Don't retry authentication failures
  });

  // Return authentication state with computed properties
  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user, // Convert user object to boolean
  };
}
