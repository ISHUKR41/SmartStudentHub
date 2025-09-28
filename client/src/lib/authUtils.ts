/**
 * Authentication utility functions for Smart Student Hub.
 * 
 * Provides standardized error handling for authentication flows
 * and integrates with React Query error boundaries.
 */

/**
 * Detects 401 Unauthorized errors by examining error message format.
 * 
 * Used with React Query to distinguish authentication failures from other API errors,
 * enabling appropriate retry logic and user feedback.
 * 
 * @param error - The error object to examine
 * @returns True if error represents a 401 Unauthorized response
 * 
 * @example
 * ```tsx
 * if (error && isUnauthorizedError(error)) {
 *   window.location.href = '/api/login';
 * }
 * ```
 */
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}