// Firebase configuration for Smart Student Hub
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3GQbY14MlwzLC2hiZcwdK73qlu4lNifo",
  authDomain: "smart-student-hub-75.firebaseapp.com",
  projectId: "smart-student-hub-75",
  storageBucket: "smart-student-hub-75.firebasestorage.app",
  messagingSenderId: "77366186543",
  appId: "1:77366186543:web:a05fb48a11addde782acda"
};

// Initialize Firebase (prevent duplicate initialization)
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Firebase initialization error:', error);
  app = getApp(); // Try to get existing app
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
// IMPORTANT: Firestore is currently DISABLED due to configuration issues.
// The Firebase project does not have Firestore properly configured, which causes
// "AbortError: signal is aborted without reason" messages in the console.
// Authentication will work perfectly without Firestore - user data is stored in Firebase Auth.
// To enable Firestore: properly configure it in your Firebase Console and set ENABLE_FIRESTORE=true

const ENABLE_FIRESTORE = import.meta.env.VITE_ENABLE_FIRESTORE === 'true';
let db: ReturnType<typeof getFirestore> | null = null;
let firestoreAvailable = false;

if (ENABLE_FIRESTORE) {
  try {
    db = getFirestore(app);
    firestoreAvailable = true;
    console.log('Firestore enabled and initialized');
  } catch (error) {
    console.warn('Firestore initialization failed - authentication will work without Firestore:', error);
    firestoreAvailable = false;
    db = null;
  }
} else {
  console.log('Firestore disabled - authentication working with Firebase Auth only');
  firestoreAvailable = false;
  db = null;
}

export { db, firestoreAvailable };

// Export the app instance
export default app;