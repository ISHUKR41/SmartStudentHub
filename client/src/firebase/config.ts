// Firebase configuration for Smart Student Hub
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3GQbY14MlwzLC2hiZcwdK73qlu4lNifo",
  authDomain: "smart-student-hub-75.firebaseapp.com",
  projectId: "smart-student-hub-75",
  storageBucket: "smart-student-hub-75.firebasestorage.app",
  messagingSenderId: "77366186543",
  appId: "1:77366186543:web:a1b2c3d4e5f6g7h8i9j0k1l2"
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Export the app instance
export default app;