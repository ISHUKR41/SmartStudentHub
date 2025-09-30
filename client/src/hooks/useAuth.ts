/**
 * Authentication state management hook for Smart Student Hub.
 * 
 * Integrates with Firebase Auth to provide reactive authentication state throughout
 * the application. Manages user session data via Firebase auth state listener.
 * 
 * @returns Authentication state with user data, loading status, and computed authentication flag
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { getUserProfile } from '@/firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        // Get additional user data from Firestore
        const userData = await getUserProfile(firebaseUser.uid);
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: userData?.name?.split(' ')[0] || firebaseUser.displayName,
          lastName: userData?.name?.split(' ')[1] || '',
          role: 'student', // Default role, can be fetched from Firestore
          ...userData
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
