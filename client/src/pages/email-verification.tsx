import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { Mail, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import { auth } from '@/firebase/config';
import { resendEmailVerification } from '@/firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

export default function EmailVerification() {
  const [, setLocation] = useLocation();
  const [userEmail, setUserEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Monitor auth state and check for email verification
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User is not logged in, redirect to signin
        setLocation('/firebase-signin');
        return;
      }

      setUserEmail(user.email || '');

      // Check if email is already verified
      if (user.emailVerified) {
        // Force reload to ensure auth state updates
        await auth.currentUser?.reload();
        
        // Force a token refresh to trigger onIdTokenChanged
        await auth.currentUser?.getIdToken(true);
        
        await Swal.fire({
          icon: 'success',
          title: 'Email Verified!',
          text: 'Your email has been successfully verified.',
          showConfirmButton: false,
          timer: 2000,
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
        });
        
        // Small delay to ensure useAuth updates
        setTimeout(() => {
          setLocation('/dashboard');
        }, 500);
        return;
      }

      setIsChecking(false);
    });

    return () => unsubscribe();
  }, [setLocation]);

  useEffect(() => {
    // Check email verification status every 3 seconds
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        // Reload user to get latest emailVerified status
        await user.reload();
        
        if (user.emailVerified) {
          clearInterval(interval);
          
          // Force reload to ensure auth state updates
          await auth.currentUser?.reload();
          
          // Force a token refresh to trigger onIdTokenChanged
          await auth.currentUser?.getIdToken(true);
          
          await Swal.fire({
            icon: 'success',
            title: 'Email Verified!',
            text: 'Your email has been successfully verified. Redirecting to dashboard...',
            showConfirmButton: false,
            timer: 2000,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
          });
          
          // Small delay to ensure useAuth updates
          setTimeout(() => {
            setLocation('/dashboard');
          }, 500);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [setLocation]);

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (!user) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No user found. Please sign in again.',
        confirmButtonColor: 'hsl(var(--primary))',
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
      });
      setLocation('/firebase-signin');
      return;
    }

    setIsResending(true);
    try {
      await resendEmailVerification(user);
      await Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        text: 'Verification email has been sent. Please check your inbox and spam folder.',
        confirmButtonColor: 'hsl(var(--primary))',
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
      });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Failed to Send',
        text: error.message || 'Failed to resend verification email. Please try again.',
        confirmButtonColor: 'hsl(var(--primary))',
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm font-medium text-foreground">Checking verification status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Particles Background */}
      <Particles
        id="tsparticles-verification"
        className="absolute inset-0 z-0"
        options={{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
            },
            modes: {
              push: {
                quantity: 2,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: '#6366f1',
            },
            links: {
              color: '#6366f1',
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Glassmorphism Card */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20 dark:border-gray-700/20">
            
            {/* Animated Email Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.2, 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
              className="flex justify-center mb-6"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
                className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <Mail className="w-12 h-12 text-primary" data-testid="icon-email-verification" />
              </motion.div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-4"
              data-testid="heading-verify-email"
            >
              Verify Your Email
            </motion.h1>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center text-muted-foreground mb-6"
              data-testid="text-verification-message"
            >
              We've sent a verification email to your inbox. Please click the link in the email to verify your account.
            </motion.p>

            {/* Email Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-8"
            >
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium" data-testid="text-user-email">
                  {userEmail}
                </span>
              </div>
            </motion.div>

            {/* Auto-check indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-6 flex items-center justify-center space-x-2 text-sm text-muted-foreground"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              <span data-testid="text-auto-check">Automatically checking for verification...</span>
            </motion.div>

            {/* Resend Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-4"
              data-testid="button-resend-verification"
            >
              {isResending ? (
                <>
                  <ClipLoader color="currentColor" size={20} />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </motion.button>

            {/* Back to Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center"
            >
              <button
                onClick={() => setLocation('/firebase-signin')}
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center space-x-1 transition-colors"
                data-testid="link-back-to-signin"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-border"
            >
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p>Check your spam or junk folder if you don't see the email</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p>The verification link is valid for 24 hours</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p>You'll be automatically redirected once verified</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
