/**
 * React Query client configuration for Smart Student Hub.
 * 
 * Provides standardized API communication with authentication integration
 * and custom error handling. Configured for explicit cache management.
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
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
 * Standardized API request function with authentication and error handling.
 * 
 * @param method - HTTP method
 * @param url - API endpoint URL  
 * @param data - Request body data
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

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Creates query function with configurable 401 handling.
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

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

/**
 * Global React Query client configured for Smart Student Hub.
 * 
 * Disables automatic refetching and retries for explicit cache control.
 * Uses custom query function with authentication handling.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
