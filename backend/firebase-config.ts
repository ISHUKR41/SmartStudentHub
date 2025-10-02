/**
 * FIREBASE CONFIGURATION FOR 100,000+ STUDENTS
 *
 * Real-time database integration for:
 * - Student data synchronization
 * - Real-time updates across all devices
 * - Data isolation per student
 * - Scalable architecture for 100k users
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "smart-student-hub.firebaseapp.com",
  databaseURL:
    process.env.VITE_FIREBASE_DATABASE_URL ||
    "https://smart-student-hub-default-rtdb.firebaseio.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "smart-student-hub",
  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET || "smart-student-hub.appspot.com",
  messagingSenderId:
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const realtimeDB = getDatabase(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === "development") {
  // Only connect to emulators if not already connected
  try {
    connectFirestoreEmulator(firestore, "localhost", 8080);
    connectDatabaseEmulator(realtimeDB, "localhost", 9000);
    connectStorageEmulator(storage, "localhost", 9199);
  } catch (error) {
    console.log("Firebase emulators already connected");
  }
}

export default app;

// ==================== STUDENT DATA ISOLATION HELPERS ====================

/**
 * Get student-specific path for real-time database
 * Ensures each of 100k students has isolated data
 */
export const getStudentPath = (studentId: string, dataType: string) => {
  return `students/${studentId}/${dataType}`;
};

/**
 * Get shared data path for common information
 * Used for announcements, events, etc.
 */
export const getSharedPath = (dataType: string) => {
  return `shared/${dataType}`;
};

/**
 * Firestore collection paths with data isolation
 */
export const getStudentCollection = (studentId: string, collection: string) => {
  return `students/${studentId}/${collection}`;
};

// ==================== REAL-TIME SYNC HELPERS ====================

import {
  ref,
  onValue,
  off,
  set,
  push,
  update,
  remove,
} from "firebase/database";
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/**
 * Real-time listener for student data
 * Automatically updates UI when data changes
 */
export const subscribeToStudentData = (
  studentId: string,
  dataType: string,
  callback: (data: any) => void
) => {
  const dataRef = ref(realtimeDB, getStudentPath(studentId, dataType));

  const unsubscribe = onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });

  // Return cleanup function
  return () => off(dataRef);
};

/**
 * Update student data with real-time sync
 * Automatically syncs across all devices
 */
export const updateStudentData = async (
  studentId: string,
  dataType: string,
  data: any
) => {
  const dataRef = ref(realtimeDB, getStudentPath(studentId, dataType));
  await set(dataRef, {
    ...data,
    lastUpdated: Date.now(),
    studentId, // Ensure student ID is always included for data isolation
  });
};

/**
 * Add new student record with real-time sync
 */
export const addStudentRecord = async (
  studentId: string,
  dataType: string,
  record: any
) => {
  const collectionRef = ref(realtimeDB, getStudentPath(studentId, dataType));
  const newRef = push(collectionRef);

  await set(newRef, {
    ...record,
    id: newRef.key,
    studentId,
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  });

  return newRef.key;
};

/**
 * Delete student record with real-time sync
 */
export const deleteStudentRecord = async (
  studentId: string,
  dataType: string,
  recordId: string
) => {
  const recordRef = ref(
    realtimeDB,
    `${getStudentPath(studentId, dataType)}/${recordId}`
  );
  await remove(recordRef);
};

// ==================== BULK OPERATIONS FOR 100K STUDENTS ====================

/**
 * Batch update for multiple students (admin operations)
 * Optimized for handling large numbers of students
 */
export const batchUpdateStudents = async (
  updates: Array<{
    studentId: string;
    dataType: string;
    data: any;
  }>,
  batchSize: number = 500 // Process in batches to avoid memory issues
) => {
  const batches = [];
  for (let i = 0; i < updates.length; i += batchSize) {
    batches.push(updates.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const promises = batch.map(({ studentId, dataType, data }) =>
      updateStudentData(studentId, dataType, data)
    );

    await Promise.all(promises);

    // Small delay between batches to prevent overwhelming Firebase
    if (batches.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

// ==================== ANALYTICS & MONITORING ====================

/**
 * Track student activity for analytics
 * Helps monitor system performance with 100k users
 */
export const trackStudentActivity = async (
  studentId: string,
  activity: {
    action: string;
    page: string;
    timestamp: number;
    metadata?: any;
  }
) => {
  const activityRef = ref(
    realtimeDB,
    `analytics/student-activity/${studentId}`
  );
  const newActivityRef = push(activityRef);

  await set(newActivityRef, {
    ...activity,
    id: newActivityRef.key,
    studentId,
  });
};

/**
 * Get system statistics for monitoring
 */
export const getSystemStats = () => {
  return {
    totalStudents: ref(realtimeDB, "stats/totalStudents"),
    activeUsers: ref(realtimeDB, "stats/activeUsers"),
    systemLoad: ref(realtimeDB, "stats/systemLoad"),
  };
};
