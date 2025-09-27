/**
 * React Query Client Configuration
 * 
 * Sets up the global React Query client with custom configuration
 * for the Student Activity Management System. Provides standardized
 * API communication and caching strategies.
 * 
 * Features:
 * - Automatic request/response handling
 * - Error handling with proper HTTP status codes
 * - Authentication integration with cookies
 * - Optimized caching and refetch strategies
 * - Consistent API request patterns
 * 
 * Security Features:
 * - Credential inclusion for authentication
 * - Proper error status handling
 * - Unauthorized request handling
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * HTTP Response Error Handler
 * 
 * Checks if a fetch response is successful and throws descriptive
 * errors for failed requests. Provides consistent error handling
 * across all API calls.
 * 
 * @param res - Fetch response object
 * @throws Error with status code and message for failed requests
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * API Request Function
 * 
 * Standardized function for making API requests with proper headers,
 * authentication, and error handling. Used by React Query mutations
 * for consistent API communication.
 * 
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param url - API endpoint URL
 * @param data - Request body data (automatically JSON serialized)
 * @returns Promise resolving to the fetch Response
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Include cookies for authentication
  });

  await throwIfResNotOk(res);
  return res;
}

/**
 * Unauthorized Request Behavior Types
 * 
 * Defines how the query function should handle 401 Unauthorized responses.
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Custom Query Function Factory
 * 
 * Creates a query function for React Query with configurable unauthorized
 * request handling. Used as the default query function for all React Query requests.
 * 
 * @param options - Configuration for handling 401 responses
 * @returns QueryFunction configured with the specified behavior
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include", // Include authentication cookies
    });

    // Handle unauthorized requests based on configuration
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null; // Return null for auth failures instead of throwing
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

/**
 * Global React Query Client
 * 
 * Configured with optimized settings for the Student Activity Management System.
 * Provides consistent caching, error handling, and request behavior across
 * the entire application.
 * 
 * Configuration:
 * - Custom query function with authentication handling
 * - Disabled automatic refetching for better control
 * - No retries to avoid spamming failed requests
 * - Infinite stale time for explicit cache management
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }), // Throw on auth failures
      refetchInterval: false,                   // No automatic refetching
      refetchOnWindowFocus: false,             // No refetch on window focus
      staleTime: Infinity,                     // Data never becomes stale automatically
      retry: false,                            // No automatic retries
    },
    mutations: {
      retry: false, // No automatic retries for mutations
    },
  },
});
