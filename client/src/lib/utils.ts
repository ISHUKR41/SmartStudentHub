/**
 * Utility Functions for Smart Student Hub
 * 
 * This file contains essential utility functions used throughout the application
 * for styling, class name manipulation, and common helper operations.
 * 
 * Key Features:
 * - Tailwind CSS class name merging with conflict resolution
 * - Conditional class name application with proper precedence
 * - TypeScript support for type-safe class name operations
 * - Integration with clsx for flexible conditional class handling
 * 
 * Dependencies:
 * - clsx: Utility for constructing className strings conditionally
 * - tailwind-merge: Utility for merging Tailwind CSS classes without conflicts
 * 
 * Architecture:
 * This utility follows the shadcn/ui pattern for class name management,
 * providing a single function that combines the power of clsx and tailwind-merge
 * to handle complex styling scenarios in React components.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Class Name Utility Function
 * 
 * Combines and merges CSS class names intelligently, handling Tailwind CSS
 * class conflicts and conditional class application. This is the primary
 * utility for styling throughout the Smart Student Hub application.
 * 
 * Key Benefits:
 * - Resolves Tailwind CSS class conflicts (e.g., "p-4 p-6" becomes "p-6")
 * - Handles conditional classes with proper precedence
 * - Supports all clsx input types (strings, objects, arrays, functions)
 * - Ensures consistent styling across all UI components
 * 
 * @param {...ClassValue[]} inputs - Variable number of class value inputs
 * @returns {string} Merged and deduplicated class name string
 * 
 * @example
 * ```tsx
 * // Basic usage
 * cn("text-center", "text-blue-500") // "text-center text-blue-500"
 * 
 * // Conditional classes
 * cn("px-4 py-2", isActive && "bg-blue-500", isDisabled && "opacity-50")
 * 
 * // Tailwind conflict resolution
 * cn("p-4 p-6") // "p-6" (latter takes precedence)
 * 
 * // Complex conditional object
 * cn("btn", {
 *   "btn-primary": variant === "primary",
 *   "btn-secondary": variant === "secondary",
 *   "btn-disabled": disabled
 * })
 * 
 * // Array inputs
 * cn(["text-sm", "font-medium"], additionalClasses)
 * 
 * // Component prop merging
 * function Button({ className, ...props }) {
 *   return (
 *     <button 
 *       className={cn("btn btn-default", className)} 
 *       {...props} 
 *     />
 *   );
 * }
 * ```
 * 
 * Implementation Notes:
 * - Uses clsx to handle conditional logic and input normalization
 * - Uses tailwind-merge to resolve Tailwind CSS class conflicts
 * - Order matters: later classes override earlier conflicting classes
 * - Maintains excellent performance even with complex class combinations
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
