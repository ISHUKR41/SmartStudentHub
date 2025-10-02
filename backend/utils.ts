/**
 * BACKEND UTILITY FUNCTIONS
 *
 * Helper functions for common operations
 */

import { randomBytes, createHash } from "crypto";
import { Request } from "express";

// ==================== PASSWORD UTILITIES ====================

/**
 * Generate a random password
 */
export function generatePassword(length: number = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  const randomValues = randomBytes(length);

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
}

/**
 * Hash a string using SHA-256
 */
export function hashString(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

// ==================== DATE UTILITIES ====================

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

/**
 * Get current academic year
 */
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 0-indexed

  // Academic year starts in July (month 7)
  if (month >= 7) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

/**
 * Get current semester based on month
 */
export function getCurrentSemester(): number {
  const now = new Date();
  const month = now.getMonth() + 1;

  // Odd semester: July-December (7-12)
  // Even semester: January-June (1-6)
  if (month >= 7) {
    return 1; // Odd semester
  } else {
    return 2; // Even semester
  }
}

/**
 * Calculate days between two dates
 */
export function daysBetween(
  date1: Date | string,
  date2: Date | string
): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  return new Date(date) < new Date();
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  return new Date(date) > new Date();
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ==================== STRING UTILITIES ====================

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const randomStr = randomBytes(8).toString("hex");
  return prefix
    ? `${prefix}-${timestamp}-${randomStr}`
    : `${timestamp}-${randomStr}`;
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate string with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert to title case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

// ==================== NUMBER UTILITIES ====================

/**
 * Calculate percentage
 */
export function calculatePercentage(obtained: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100 * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate grade based on percentage
 */
export function calculateGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C+";
  if (percentage >= 40) return "C";
  if (percentage >= 35) return "D";
  return "F";
}

/**
 * Calculate grade points from grade
 */
export function gradeToPoints(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    "A+": 10,
    A: 9,
    "B+": 8,
    B: 7,
    "C+": 6,
    C: 5,
    D: 4,
    F: 0,
  };
  return gradeMap[grade] || 0;
}

/**
 * Calculate CGPA from grades
 */
export function calculateCGPA(
  grades: Array<{ grade: string; credits: number }>
): number {
  if (grades.length === 0) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  for (const g of grades) {
    const points = gradeToPoints(g.grade);
    totalPoints += points * g.credits;
    totalCredits += g.credits;
  }

  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}

/**
 * Format currency (INR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

// ==================== VALIDATION UTILITIES ====================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

/**
 * Validate roll number format
 */
export function isValidRollNumber(rollNo: string): boolean {
  // Example: 21CSE123, 20ECE045
  const rollRegex = /^\d{2}[A-Z]{2,4}\d{3,4}$/;
  return rollRegex.test(rollNo);
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}

// ==================== ARRAY UTILITIES ====================

/**
 * Paginate array
 */
export function paginate<T>(
  array: T[],
  page: number,
  limit: number
): {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} {
  const total = array.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = array.slice(start, end);

  return {
    data,
    page,
    limit,
    total,
    totalPages,
  };
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as { [key: string]: T[] });
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==================== FILE UTILITIES ====================

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Check if file is image
 */
export function isImageFile(mimetype: string): boolean {
  return mimetype.startsWith("image/");
}

/**
 * Check if file is PDF
 */
export function isPDFFile(mimetype: string): boolean {
  return mimetype === "application/pdf";
}

/**
 * Check if file is document
 */
export function isDocumentFile(mimetype: string): boolean {
  const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  return documentTypes.includes(mimetype);
}

// ==================== REQUEST UTILITIES ====================

/**
 * Get client IP address
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

/**
 * Get user agent
 */
export function getUserAgent(req: Request): string {
  return req.headers["user-agent"] || "unknown";
}

/**
 * Check if request is from mobile
 */
export function isMobileRequest(req: Request): boolean {
  const userAgent = getUserAgent(req).toLowerCase();
  return /mobile|android|iphone|ipad|phone/i.test(userAgent);
}

// ==================== STATISTICS UTILITIES ====================

/**
 * Calculate average
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round((sum / numbers.length) * 100) / 100;
}

/**
 * Calculate median
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = average(numbers);
  const squareDiffs = numbers.map((num) => Math.pow(num - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

// ==================== ERROR UTILITIES ====================

/**
 * Create custom error with status code
 */
export function createError(
  message: string,
  statusCode: number = 500,
  details?: any
): Error {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  if (details) error.details = details;
  return error;
}

/**
 * Log error with context
 */
export function logError(error: Error, context?: string): void {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${context ? `[${context}] ` : ""}`, error);
}

// ==================== EXPORT ALL ====================

export default {
  // Password
  generatePassword,
  hashString,

  // Date
  formatDate,
  getCurrentAcademicYear,
  getCurrentSemester,
  daysBetween,
  isPastDate,
  isFutureDate,
  addDays,

  // String
  generateId,
  slugify,
  truncate,
  capitalize,
  toTitleCase,

  // Number
  calculatePercentage,
  calculateGrade,
  gradeToPoints,
  calculateCGPA,
  formatCurrency,

  // Validation
  isValidEmail,
  isValidPhone,
  isValidRollNumber,
  sanitizeFilename,

  // Array
  paginate,
  groupBy,
  unique,
  shuffle,

  // File
  getFileExtension,
  formatFileSize,
  isImageFile,
  isPDFFile,
  isDocumentFile,

  // Request
  getClientIP,
  getUserAgent,
  isMobileRequest,

  // Statistics
  average,
  median,
  standardDeviation,

  // Error
  createError,
  logError,
};
