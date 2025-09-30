import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, firestoreAvailable } from './config';
import toast from 'react-hot-toast';

export interface UserData {
  name: string;
  email: string;
  username: string;
  college: string;
  registrationNo: string;
  age: number;
  createdAt: Date;
  emailVerified: boolean;
}

// Sign up new user with email verification
export const signUpUser = async (userData: Omit<UserData, 'createdAt' | 'emailVerified'>, password: string) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: userData.name
    });

    // Send email verification
    await sendEmailVerification(user);

    // Save additional user data to Firestore (optional - graceful fallback if Firestore fails)
    if (firestoreAvailable && db) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          createdAt: new Date(),
          emailVerified: false,
          uid: user.uid
        });
        console.log('User data saved to Firestore successfully');
      } catch (firestoreError: any) {
        console.warn('Failed to save user data to Firestore, but authentication succeeded:', firestoreError);
      }
    } else {
      console.warn('Firestore not available - user data stored in Firebase Auth only');
    }

    toast.success('Account created! Please check your email to verify your account.');
    
    return { user, success: true };
  } catch (error: any) {
    let errorMessage = 'Failed to create account';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address';
        break;
      default:
        errorMessage = error.message || 'Failed to create account';
    }
    
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Sign in user (redirect to verification if email not verified)
export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      // Don't sign out - let them access the verification page
      throw new Error('EMAIL_NOT_VERIFIED');
    }

    // Update email verification status in Firestore (optional - graceful fallback if Firestore fails)
    if (firestoreAvailable && db) {
      try {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, { emailVerified: true }, { merge: true });
        console.log('Email verification status updated in Firestore');
      } catch (firestoreError: any) {
        console.warn('Failed to update Firestore, but sign-in succeeded:', firestoreError);
      }
    }

    toast.success(`Welcome back, ${user.displayName || 'User'}!`);
    return { user, success: true };
  } catch (error: any) {
    let errorMessage = 'Failed to sign in';
    
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      throw new Error('EMAIL_NOT_VERIFIED');
    }
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
      default:
        errorMessage = error.message || 'Failed to sign in';
        toast.error(errorMessage);
    }
    
    throw new Error(errorMessage);
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    toast.success('Signed out successfully');
  } catch (error: any) {
    toast.error('Failed to sign out');
    throw new Error(error.message);
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent! Check your inbox.');
  } catch (error: any) {
    let errorMessage = 'Failed to send reset email';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address';
        break;
      default:
        errorMessage = error.message || 'Failed to send reset email';
    }
    
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Resend email verification
export const resendEmailVerification = async (user: User) => {
  try {
    await sendEmailVerification(user);
    toast.success('Verification email sent! Please check your inbox.');
  } catch (error: any) {
    toast.error('Failed to send verification email');
    throw new Error(error.message);
  }
};

// Get user profile data from Firestore
export const getUserProfile = async (uid: string) => {
  // If Firestore is not available, return null gracefully
  if (!firestoreAvailable || !db) {
    console.warn('Firestore not available - returning null profile data');
    return null;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error: any) {
    console.warn('Error fetching user profile from Firestore (fallback to Auth data):', error);
    return null;
  }
};