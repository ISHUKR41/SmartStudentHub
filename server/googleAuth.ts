/**
 * Google OAuth Authentication Configuration
 *
 * This file implements Google OAuth 2.0 authentication for the Smart Student Hub
 * using Passport.js and Google OAuth strategy. It provides secure authentication
 * with Google accounts for students and faculty.
 *
 * Features:
 * - Google OAuth 2.0 integration
 * - Automatic user profile creation/update
 * - Session management
 * - Role assignment based on email domain
 *
 * Environment Variables Required:
 * - GOOGLE_CLIENT_ID: Google OAuth client ID
 * - GOOGLE_CLIENT_SECRET: Google OAuth client secret
 * - GOOGLE_CALLBACK_URL: OAuth callback URL
 */

import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";
import { storage } from "./storage";

// Check if running in development mode
const isDevelopment = process.env.NODE_ENV === "development";

// Google OAuth configuration
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID || "dummy-client-id",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret",
  callbackURL:
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:3000/api/auth/google/callback",
};

/**
 * Configure Google OAuth Strategy
 */
export function setupGoogleAuth(app: Express) {
  // Setup session middleware first
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fallback-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Skip Google Auth setup in development if credentials not provided
  if (
    isDevelopment &&
    (googleConfig.clientID === "dummy-client-id" ||
      googleConfig.clientSecret === "dummy-client-secret")
  ) {
    console.log(
      "🔧 Development mode: Google OAuth credentials not configured, using mock authentication"
    );
    return setupMockAuth(app);
  }

  // Configure Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user information from Google profile
          const googleUser = {
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            profileImageUrl: profile.photos?.[0]?.value || "",
            displayName: profile.displayName || "",
          };

          // Determine user role based on email domain (you can customize this logic)
          let role: "student" | "faculty" | "admin" = "student";
          if (
            googleUser.email.includes("@faculty.") ||
            googleUser.email.includes("@staff.")
          ) {
            role = "faculty";
          } else if (googleUser.email.includes("@admin.")) {
            role = "admin";
          }

          // Check if user already exists
          let user = await storage.getUserByEmail(googleUser.email);

          if (user) {
            // Update existing user with Google profile data
            const updatedUser = await storage.upsertUser({
              id: user.id,
              email: googleUser.email,
              firstName: googleUser.firstName || user.firstName,
              lastName: googleUser.lastName || user.lastName,
              profileImageUrl:
                googleUser.profileImageUrl || user.profileImageUrl,
              rollNumber: user.rollNumber,
              department: user.department,
              currentSemester: user.currentSemester,
              role: user.role || role,
            });
            return done(null, updatedUser as any);
          } else {
            // Create new user
            const newUser = await storage.upsertUser({
              id: generateUserId(),
              email: googleUser.email,
              firstName: googleUser.firstName,
              lastName: googleUser.lastName,
              profileImageUrl: googleUser.profileImageUrl,
              rollNumber: null, // Will be filled during profile completion
              department: null,
              currentSemester: null,
              role: role,
            });
            return done(null, newUser as any);
          }
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error, false);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user as any);
    } catch (error) {
      done(error, false);
    }
  });

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  console.log("✅ Google OAuth authentication configured");
}

/**
 * Setup mock authentication for development
 */
function setupMockAuth(app: Express) {
  // Mock user for development
  const mockUser = {
    id: "dev-user-123",
    email: "student@example.com",
    firstName: "Test",
    lastName: "Student",
    profileImageUrl: "",
    rollNumber: "CS2021001",
    department: "Computer Science",
    currentSemester: 6,
    role: "student" as const,
  };

  // Serialize mock user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize mock user
  passport.deserializeUser((id: string, done) => {
    done(null, mockUser);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  console.log("🔧 Mock authentication configured for development");
}

/**
 * Authentication middleware
 */
export function isAuthenticated(req: any, res: any, next: any) {
  if (
    isDevelopment &&
    (!process.env.GOOGLE_CLIENT_ID ||
      process.env.GOOGLE_CLIENT_ID === "dummy-client-id")
  ) {
    // Mock authentication for development
    req.user = {
      id: "dev-user-123",
      email: "student@example.com",
      firstName: "Test",
      lastName: "Student",
      profileImageUrl: "",
      rollNumber: "CS2021001",
      department: "Computer Science",
      currentSemester: 6,
      role: "student",
    };
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ message: "Authentication required" });
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return (
    "user_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  );
}
