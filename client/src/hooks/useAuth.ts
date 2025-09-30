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
    // Safety timeout: if Firebase doesn't respond within 3 seconds, stop loading
    const timeoutId = setTimeout(() => {
      console.warn('Firebase auth initialization timeout - continuing with no user');
      setIsLoading(false);
    }, 3000);

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      clearTimeout(timeoutId); // Clear timeout since Firebase responded
      
      if (firebaseUser) {
        // Reload user to get latest emailVerified status
        await firebaseUser.reload();
        const currentUser = auth.currentUser;
        
        if (currentUser && currentUser.emailVerified) {
          // Try to get additional user data from Firestore
          // Fallback to Firebase Auth data if Firestore is unavailable
          const userData = await getUserProfile(currentUser.uid);
          
          if (userData) {
            // Full user data from Firestore
            setUser({
              id: currentUser.uid,
              firstName: userData.name?.split(' ')[0] || currentUser.displayName,
              lastName: userData.name?.split(' ')[1] || '',
              role: 'student',
              ...userData
            });
          } else {
            // Fallback to minimal Firebase Auth data
            console.warn('Using minimal Firebase Auth data (Firestore unavailable)');
            const displayName = currentUser.displayName || '';
            const nameParts = displayName.split(' ');
            setUser({
              id: currentUser.uid,
              email: currentUser.email,
              firstName: nameParts[0] || displayName,
              lastName: nameParts[1] || '',
              name: displayName,
              role: 'student',
              emailVerified: currentUser.emailVerified
            });
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
