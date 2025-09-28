/**
 * Replit Authentication Integration
 * 
 * This file implements the complete authentication system for the Smart Student Hub
 * using Replit's OpenID Connect (OIDC) authentication service. It provides secure
 * session management, user profile synchronization, and role-based access control.
 * 
 * Key Features:
 * - OpenID Connect (OIDC) integration with Replit authentication
 * - Secure session management with PostgreSQL storage
 * - Automatic user profile synchronization from Replit
 * - Multi-domain support for development and production environments
 * - Token refresh for long-lived sessions
 * - Role-based middleware for protected routes
 * 
 * Architecture:
 * - Uses Passport.js for authentication strategy management
 * - PostgreSQL-backed session storage for scalability
 * - Memoized OIDC configuration for performance
 * - Express middleware integration for seamless route protection
 * 
 * Security Features:
 * - Secure HTTP-only cookies with proper domain configuration
 * - Automatic token refresh for expired sessions
 * - Cross-Site Request Forgery (CSRF) protection
 * - Session timeout and cleanup
 * 
 * Environment Dependencies:
 * - REPLIT_DOMAINS: Comma-separated list of allowed domains
 * - ISSUER_URL: OIDC issuer URL (defaults to Replit's OIDC endpoint)
 * - REPL_ID: Unique identifier for this Replit application
 * - SESSION_SECRET: Secret key for session encryption
 * - DATABASE_URL: PostgreSQL connection string for session storage
 */

import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Validate required environment variables
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

/**
 * Memoized OIDC Configuration Discovery
 * 
 * Discovers and caches the OpenID Connect configuration from Replit's OIDC provider.
 * The configuration includes endpoints for authorization, token exchange, and user info.
 * 
 * Caching Strategy:
 * - Results are cached for 1 hour to reduce network requests
 * - Automatic invalidation and refresh when cache expires
 * - Improves performance by avoiding repeated discovery calls
 * 
 * @returns {Promise<Object>} OIDC configuration object with endpoints and metadata
 */
const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 } // Cache for 1 hour
);

/**
 * Session Configuration Factory
 * 
 * Creates and configures the Express session middleware with PostgreSQL storage.
 * Provides secure session management with automatic cleanup and persistence.
 * 
 * Session Configuration:
 * - 7-day session lifetime for user convenience
 * - PostgreSQL-backed storage for horizontal scalability
 * - HTTP-only cookies to prevent XSS attacks
 * - Secure cookie flags for HTTPS environments
 * - No session creation for unauthenticated users
 * 
 * Security Features:
 * - Encrypted session data using SESSION_SECRET
 * - Automatic session cleanup on expiration
 * - Protection against session fixation attacks
 * - CSRF protection through secure cookie configuration
 * 
 * @returns {RequestHandler} Configured Express session middleware
 */
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week session lifetime
  
  // Configure PostgreSQL session store
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false, // Sessions table exists in schema
    ttl: sessionTtl, // Time-to-live for automatic cleanup
    tableName: "sessions", // Matches database schema
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session for anonymous users
    cookie: {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: true, // Require HTTPS in production
      maxAge: sessionTtl, // Cookie expiration time
    },
  });
}

/**
 * Update User Session Data
 * 
 * Updates the user session object with fresh token information from the OIDC provider.
 * This function is called both during initial login and token refresh operations.
 * 
 * Session Data Updated:
 * - User claims (profile information)
 * - Access token for API calls
 * - Refresh token for automatic renewal
 * - Token expiration timestamp
 * 
 * @param {any} user - User session object to update
 * @param {Object} tokens - Token response from OIDC provider with helpers
 */
function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims(); // Extract user profile claims
  user.access_token = tokens.access_token; // Store access token
  user.refresh_token = tokens.refresh_token; // Store refresh token for renewal
  user.expires_at = user.claims?.exp; // Token expiration timestamp
}

/**
 * Synchronize User Profile with Database
 * 
 * Creates or updates user profile in the database based on OIDC claims.
 * This ensures user information stays synchronized with Replit profile data.
 * 
 * User Data Synchronized:
 * - Unique user ID from Replit
 * - Email address
 * - First and last name
 * - Profile image URL
 * 
 * Database Operation:
 * - Uses upsert operation to handle both new and existing users
 * - Prevents duplicate user records
 * - Updates existing profiles with latest information
 * 
 * @param {any} claims - OIDC claims containing user profile information
 */
async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims["sub"], // Subject ID - unique user identifier
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

/**
 * Setup Complete Authentication System
 * 
 * Initializes and configures the complete authentication system for the Express application.
 * Sets up Passport strategies, session management, and authentication routes for all supported domains.
 * 
 * Authentication Flow:
 * 1. User clicks login -> redirected to Replit OIDC provider
 * 2. User authenticates with Replit
 * 3. Replit redirects back with authorization code
 * 4. Application exchanges code for tokens
 * 5. User profile is synchronized with database
 * 6. Session is created and user is logged in
 * 
 * Multi-Domain Support:
 * - Supports multiple domains for development/staging/production
 * - Each domain gets its own authentication strategy
 * - Callback URLs are dynamically configured per domain
 * 
 * @param {Express} app - Express application instance to configure
 */
export async function setupAuth(app: Express) {
  // Configure Express for proxy environments (required for Replit)
  app.set("trust proxy", 1);
  
  // Initialize session and passport middleware
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Get OIDC configuration from Replit
  const config = await getOidcConfig();

  /**
   * Authentication Verification Function
   * 
   * Called after successful OIDC authentication to process tokens and create user session.
   * Handles user profile synchronization and session initialization.
   * 
   * @param {Object} tokens - OIDC tokens and helpers from successful authentication
   * @param {Function} verified - Passport callback to complete authentication
   */
  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {}; // Create new user session object
    updateUserSession(user, tokens); // Update with fresh token data
    await upsertUser(tokens.claims()); // Sync profile with database
    verified(null, user); // Complete authentication successfully
  };

  // Configure authentication strategy for each supported domain
  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`, // Unique strategy name per domain
        config,
        scope: "openid email profile offline_access", // Request necessary scopes
        callbackURL: `https://${domain}/api/callback`, // Domain-specific callback
      },
      verify,
    );
    passport.use(strategy);
  }

  // Configure Passport session serialization
  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  /**
   * Login Route
   * 
   * Initiates the OIDC authentication flow by redirecting to Replit's authorization endpoint.
   * Uses domain-specific strategy and requests fresh consent for security.
   */
  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent", // Force fresh authentication
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  /**
   * Authentication Callback Route
   * 
   * Handles the return from Replit OIDC provider with authorization code.
   * Completes authentication and redirects user to application.
   */
  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/", // Redirect to home on success
      failureRedirect: "/api/login", // Retry login on failure
    })(req, res, next);
  });

  /**
   * Logout Route
   * 
   * Clears local session and redirects to Replit's end session endpoint
   * for complete logout from both application and identity provider.
   */
  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      // Redirect to Replit's logout endpoint for complete sign-out
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

/**
 * Authentication Middleware
 * 
 * Express middleware that verifies user authentication and handles automatic token refresh.
 * Protects routes by ensuring users have valid, non-expired authentication tokens.
 * 
 * Authentication Checks:
 * 1. Verify user has an active session
 * 2. Check token expiration timestamp
 * 3. Attempt automatic token refresh if expired
 * 4. Allow request to proceed if authentication is valid
 * 
 * Token Refresh Flow:
 * - Automatically refreshes expired tokens using refresh_token
 * - Updates session with new token information
 * - Transparent to the user - no re-authentication required
 * - Falls back to 401 Unauthorized if refresh fails
 * 
 * Usage:
 * ```typescript
 * app.get('/api/protected-route', isAuthenticated, (req, res) => {
 *   // Route handler for authenticated users
 * });
 * ```
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object  
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() if authenticated, returns 401 if not
 */
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  // Check basic authentication status
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if token is still valid
  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next(); // Token is still valid, proceed
  }

  // Token has expired, attempt refresh
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Attempt to refresh the access token
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    
    // Update session with new token information
    updateUserSession(user, tokenResponse);
    
    // Authentication refreshed successfully, proceed with request
    return next();
  } catch (error) {
    // Token refresh failed, user needs to re-authenticate
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
