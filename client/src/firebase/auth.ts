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
import { auth, db } from './config';
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

    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: new Date(),
      emailVerified: false,
      uid: user.uid
    });

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

// Sign in user (only if email is verified)
export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      await signOut(auth);
      toast.error('Please verify your email before signing in. Check your inbox!');
      throw new Error('Email not verified');
    }

    // Update email verification status in Firestore
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, { emailVerified: true }, { merge: true });

    toast.success(`Welcome back, ${user.displayName || 'User'}!`);
    return { user, success: true };
  } catch (error: any) {
    let errorMessage = 'Failed to sign in';
    
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
        if (error.message !== 'Email not verified') {
          errorMessage = error.message || 'Failed to sign in';
          toast.error(errorMessage);
        }
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
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};