/**
 * Authentication state management hook for Smart Student Hub.
 * 
 * Integrates with Firebase Auth to provide reactive authentication state throughout
 * the application. Manages user session data via Firebase auth state listener.
 * 
 * @returns Authentication state with user data, loading status, and computed authentication flag
 */

import { useState, useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { getUserProfile } from '@/firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Reload user to get latest emailVerified status
        await firebaseUser.reload();
        const currentUser = auth.currentUser;
        
        if (currentUser && currentUser.emailVerified) {
          // Get additional user data from Firestore
          const userData = await getUserProfile(currentUser.uid);
          setUser({
            id: currentUser.uid,
            email: currentUser.email,
            firstName: userData?.name?.split(' ')[0] || currentUser.displayName,
            lastName: userData?.name?.split(' ')[1] || '',
            role: 'student',
            ...userData
          });
        } else {
          setUser(null);
        }
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
