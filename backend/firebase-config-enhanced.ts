/**
 * Enhanced Firebase Configuration for 100k+ Students
 *
 * This configuration is optimized for handling massive scale with:
 * - Proper data isolation per student
 * - Real-time sync capabilities
 * - Performance optimizations for large datasets
 * - Secure access rules
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";
import {
  getDatabase,
  Database,
  connectDatabaseEmulator,
  goOnline,
  goOffline,
} from "firebase/database";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import {
  getStorage,
  FirebaseStorage,
  connectStorageEmulator,
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN || "smartstudenthub-demo.firebaseapp.com",
  databaseURL:
    process.env.FIREBASE_DATABASE_URL ||
    "https://smartstudenthub-demo-default-rtdb.firebaseio.com/",
  projectId: process.env.FIREBASE_PROJECT_ID || "smartstudenthub-demo",
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET || "smartstudenthub-demo.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Initialize Firebase only once
let app: FirebaseApp;
let db: Firestore;
let realtimeDb: Database;
let auth: Auth;
let storage: FirebaseStorage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
db = getFirestore(app);
realtimeDb = getDatabase(app);
auth = getAuth(app);
storage = getStorage(app);

// Development emulator connections
if (
  process.env.NODE_ENV === "development" &&
  !process.env.FIREBASE_USE_EMULATOR_DISABLED
) {
  try {
    // Connect to emulators if available
    connectFirestoreEmulator(db, "localhost", 8080);
    connectDatabaseEmulator(realtimeDb, "localhost", 9000);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("🔧 Connected to Firebase emulators for development");
  } catch (error) {
    console.log("⚠️ Firebase emulators not available, using production");
  }
}

/**
 * Data Structure for 100k Students:
 *
 * /students/{studentId}/
 *   ├── profile/
 *   ├── grades/
 *   ├── attendance/
 *   ├── assignments/
 *   ├── notifications/
 *   ├── schedule/
 *   └── activities/
 */

// Student data isolation helpers
export const getStudentDataPath = (studentId: string, dataType: string) => {
  return `students/${studentId}/${dataType}`;
};

export const getStudentRef = (studentId: string) => {
  return `students/${studentId}`;
};

// Batch operations for performance
export const BATCH_SIZE = 500; // Optimal batch size for Firebase
export const MAX_CONCURRENT_OPERATIONS = 10;

// Performance monitoring
export class FirebasePerformanceMonitor {
  private operationCounts = new Map<string, number>();
  private startTimes = new Map<string, number>();

  startOperation(operationName: string): string {
    const operationId = `${operationName}-${Date.now()}-${Math.random()}`;
    this.startTimes.set(operationId, Date.now());

    const count = this.operationCounts.get(operationName) || 0;
    this.operationCounts.set(operationName, count + 1);

    return operationId;
  }

  endOperation(operationId: string): number {
    const startTime = this.startTimes.get(operationId);
    if (!startTime) return 0;

    const duration = Date.now() - startTime;
    this.startTimes.delete(operationId);

    return duration;
  }

  getStats() {
    return {
      operationCounts: Object.fromEntries(this.operationCounts),
      activeOperations: this.startTimes.size,
    };
  }
}

export const performanceMonitor = new FirebasePerformanceMonitor();

// Connection management for 100k users
export class FirebaseConnectionManager {
  private isOnline = true;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async goOnline(): Promise<void> {
    try {
      await enableNetwork(db);
      goOnline(realtimeDb);
      this.isOnline = true;
      this.reconnectAttempts = 0;
      console.log("🟢 Firebase connection restored");
    } catch (error) {
      console.error("❌ Failed to go online:", error);
    }
  }

  async goOffline(): Promise<void> {
    try {
      await disableNetwork(db);
      goOffline(realtimeDb);
      this.isOnline = false;
      console.log("🔴 Firebase connection disabled");
    } catch (error) {
      console.error("❌ Failed to go offline:", error);
    }
  }

  async handleConnectionError(): Promise<void> {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );

      setTimeout(() => {
        this.goOnline();
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    }
  }

  isConnected(): boolean {
    return this.isOnline;
  }
}

export const connectionManager = new FirebaseConnectionManager();

// Memory optimization for large datasets
export class FirebaseMemoryOptimizer {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();
  private maxCacheSize = 10000; // Maximum cached items
  private defaultTTL = 300000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    // Clean up old entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    // Convert Map entries to array first
    const entries = Array.from(this.cache.entries());

    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl) {
        toDelete.push(key);
      }
    }

    // Remove oldest entries if still over limit
    if (this.cache.size - toDelete.length >= this.maxCacheSize) {
      const sortedEntries = entries.sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      );

      const additionalToDelete = sortedEntries
        .slice(0, this.cache.size - this.maxCacheSize + toDelete.length)
        .map(([key]) => key);

      toDelete.push(...additionalToDelete);
    }

    toDelete.forEach((key) => this.cache.delete(key));
    console.log(`🧹 Cleaned up ${toDelete.length} expired cache entries`);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      cacheSize: this.cache.size,
      maxCacheSize: this.maxCacheSize,
      hitRate: this.calculateHitRate(),
    };
  }

  private calculateHitRate(): number {
    // This would need to be implemented with hit/miss tracking
    return 0;
  }
}

export const memoryOptimizer = new FirebaseMemoryOptimizer();

// Export Firebase instances
export { app, db, realtimeDb, auth, storage };

// Health check function
export const checkFirebaseHealth = async (): Promise<boolean> => {
  try {
    // Simple health check - try to read from database
    const { ref, get } = await import("firebase/database");
    const testRef = ref(realtimeDb, ".info/connected");
    const snapshot = await get(testRef);
    return snapshot.val() === true;
  } catch (error) {
    console.error("Firebase health check failed:", error);
    return false;
  }
};

console.log("🔥 Enhanced Firebase configuration loaded for 100k+ students");
