/**
 * Authentication state management hook for Smart Student Hub.
 * 
 * Integrates with Replit Auth to provide reactive authentication state throughout
 * the application. Manages user session data via React Query caching.
 * 
 * @returns Authentication state with user data, loading status, and computed authentication flag
 */

import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
  };
}
