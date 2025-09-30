import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import { TypeAnimation } from 'react-type-animation';
import { VanillaTilt } from 'vanilla-tilt-react';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { Eye, EyeOff, Mail, Lock, GraduationCap, Users, TrendingUp, Award } from 'lucide-react';
import { signInUser, resetPassword } from '@/firebase/auth';

// Form validation schema
const signinSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

type SigninFormData = z.infer<typeof signinSchema>;

export default function FirebaseSignin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');

  // Form submission handler
  const onSubmit = async (data: SigninFormData) => {
    setIsLoading(true);
    try {
      await signInUser(data.email, data.password);
      
      await Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'You have successfully signed in.',
        showConfirmButton: false,
        timer: 2000,
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
      });

      setLocation('/dashboard');
    } catch (error: any) {
      // Check if email is not verified
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        await Swal.fire({
          icon: 'warning',
          title: 'Email Not Verified',
          text: 'Please verify your email before signing in. Redirecting to verification page...',
          showConfirmButton: false,
          timer: 2000,
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
        });
        setLocation('/email-verification');
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Sign In Failed',
          text: error.message || 'Failed to sign in. Please try again.',
          confirmButtonColor: 'hsl(var(--primary))',
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Reset Password',
      input: 'email',
      inputLabel: 'Enter your email address',
      inputPlaceholder: 'Enter your email',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      confirmButtonColor: 'hsl(var(--primary))',
      background: 'hsl(var(--card))',
      color: 'hsl(var(--card-foreground))',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter an email address!';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address!';
        }
      },
    });

    if (email) {
      try {
        await resetPassword(email);
        await Swal.fire({
          icon: 'success',
          title: 'Email Sent!',
          text: 'Password reset link has been sent to your email.',
          confirmButtonColor: 'hsl(var(--primary))',
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
        });
      } catch (error: any) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to send reset email.',
          confirmButtonColor: 'hsl(var(--primary))',
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
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

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Platform Information */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-600 to-primary-800 p-12 flex-col justify-center items-center relative overflow-hidden"
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 animate-pulse" />

          <div className="relative z-10 max-w-lg space-y-8">
            {/* Logo and Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Smart Student Hub</h1>
            </motion.div>

            {/* Typewriter Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <TypeAnimation
                sequence={[
                  'Track Your Academic Journey',
                  2000,
                  'Manage Your Achievements',
                  2000,
                  'Build Your Digital Portfolio',
                  2000,
                  'Connect With Opportunities',
                  2000,
                ]}
                wrapper="h2"
                speed={50}
                className="text-2xl font-semibold text-white/90"
                repeat={Infinity}
              />
            </motion.div>

            {/* 3D Tilt Card with Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <VanillaTilt
                options={{
                  max: 15,
                  speed: 400,
                  glare: true,
                  'max-glare': 0.3,
                }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <Users className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">10K+</p>
                      <p className="text-sm text-white/70">Active Students</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <Award className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">50K+</p>
                      <p className="text-sm text-white/70">Achievements</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">98%</p>
                      <p className="text-sm text-white/70">Success Rate</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <GraduationCap className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">200+</p>
                      <p className="text-sm text-white/70">Institutions</p>
                    </div>
                  </div>
                </div>
              </VanillaTilt>
            </motion.div>

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-3"
            >
              {[
                'Comprehensive activity tracking',
                'Real-time progress monitoring',
                'Digital portfolio generation',
                'Institutional verification',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                  className="flex items-center space-x-2 text-white/80"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Sign In Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background"
        >
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>

            {/* Glassmorphism Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
                <p className="text-muted-foreground">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Input with Floating Label */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <input
                    {...register('email')}
                    type="email"
                    className="peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 placeholder-transparent"
                    placeholder="Email"
                    data-testid="input-email"
                  />
                  <label
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      emailValue
                        ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                        : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                    }`}
                  >
                    Email Address
                  </label>
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input with Floating Label */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="peer w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 placeholder-transparent"
                    placeholder="Password"
                    data-testid="input-password"
                  />
                  <label
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      passwordValue
                        ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                        : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                    }`}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:text-primary-600 transition-colors font-medium"
                    data-testid="button-forgot-password"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-600 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  data-testid="button-signin"
                >
                  {isLoading ? (
                    <>
                      <ClipLoader color="white" size={20} />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setLocation('/firebase-signup')}
                      className="text-primary hover:text-primary-600 font-semibold transition-colors"
                      data-testid="link-signup"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
