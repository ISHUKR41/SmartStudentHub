import { useState, useEffect, useRef, MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Particles from '@tsparticles/react';
import { TypeAnimation } from 'react-type-animation';
import VanillaTilt from 'vanilla-tilt';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { Eye, EyeOff, Mail, Lock, GraduationCap, Users, TrendingUp, Award } from 'lucide-react';
import { signInUser, resetPassword } from '@/firebase/auth';

const signinSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

type SigninFormData = z.infer<typeof signinSchema>;

export default function FirebaseSignin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tiltRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowControls = useAnimation();

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

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
      });
    }
    return () => {
      if (tiltRef.current && (tiltRef.current as any).vanillaTilt) {
        (tiltRef.current as any).vanillaTilt.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const animateGlow = async () => {
      await glowControls.start({
        x: ['0%', '200%'],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        },
      });
    };
    animateGlow();
  }, [glowControls]);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleRippleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
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

      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="relative z-10 flex min-h-screen">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-600 to-primary-800 p-12 flex-col justify-center items-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 animate-pulse" />

          <div className="relative z-10 max-w-lg space-y-8">
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

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div ref={tiltRef} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, value: '10K+', label: 'Active Students' },
                    { icon: Award, value: '50K+', label: 'Achievements' },
                    { icon: TrendingUp, value: '98%', label: 'Success Rate' },
                    { icon: GraduationCap, value: '200+', label: 'Institutions' },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-4 bg-white/5 rounded-xl"
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: 'easeInOut',
                      }}
                    >
                      <stat.icon className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-white/70">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

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

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background"
        >
          <div className="w-full max-w-md">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={glowControls}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
                  width: '50%',
                }}
              />

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10"
              >
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground">Sign in to access your dashboard</p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div variants={itemVariants} className="relative">
                    <motion.div
                      animate={{
                        scale: emailFocused ? 1.1 : 1,
                        rotate: emailFocused ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                    >
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                    <input
                      {...register('email')}
                      type="email"
                      className={`peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 placeholder-transparent ${
                        emailFocused
                          ? 'border-transparent bg-gradient-to-r from-primary/20 to-purple-500/20 shadow-lg shadow-primary/50'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      placeholder="Email"
                      data-testid="input-email"
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                    {emailFocused && (
                      <motion.div
                        layoutId="email-border"
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
                          backgroundSize: '200% 100%',
                          padding: '2px',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                        }}
                        animate={{
                          backgroundPosition: ['0% 0%', '200% 0%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}
                    <label
                      className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                        emailValue
                          ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                          : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                      }`}
                    >
                      Email Address
                    </label>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="mt-1 text-sm text-destructive"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={itemVariants} className="relative">
                    <motion.div
                      animate={{
                        scale: passwordFocused ? 1.1 : 1,
                        rotate: passwordFocused ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                    >
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`peer w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 placeholder-transparent ${
                        passwordFocused
                          ? 'border-transparent bg-gradient-to-r from-primary/20 to-purple-500/20 shadow-lg shadow-primary/50'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      placeholder="Password"
                      data-testid="input-password"
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    {passwordFocused && (
                      <motion.div
                        layoutId="password-border"
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
                          backgroundSize: '200% 100%',
                          padding: '2px',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                        }}
                        animate={{
                          backgroundPosition: ['0% 0%', '200% 0%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}
                    <label
                      className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                        passwordValue
                          ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                          : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                      }`}
                    >
                      Password
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                      data-testid="button-toggle-password"
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                    <AnimatePresence>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="mt-1 text-sm text-destructive"
                        >
                          {errors.password.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex justify-end">
                    <motion.button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-primary hover:text-primary-600 transition-colors font-medium"
                      data-testid="button-forgot-password"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Forgot Password?
                    </motion.button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <motion.button
                      ref={buttonRef}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary-600 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden"
                      data-testid="button-signin"
                      onMouseMove={handleMouseMove}
                      onClick={handleRippleClick}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        transform: !isLoading
                          ? `translate(${(mousePosition.x - 150) / 50}px, ${(mousePosition.y - 25) / 50}px)`
                          : 'none',
                      }}
                    >
                      <AnimatePresence>
                        {ripples.map((ripple) => (
                          <motion.span
                            key={ripple.id}
                            className="absolute bg-white/30 rounded-full"
                            initial={{ width: 0, height: 0, opacity: 1 }}
                            animate={{ width: 300, height: 300, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                              left: ripple.x,
                              top: ripple.y,
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        ))}
                      </AnimatePresence>
                      {isLoading ? (
                        <>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ['-100%', '200%'],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />
                          <ClipLoader color="white" size={20} />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </motion.button>
                  </motion.div>

                  <motion.div variants={itemVariants} className="text-center">
                    <p className="text-muted-foreground">
                      Don't have an account?{' '}
                      <motion.button
                        type="button"
                        onClick={() => setLocation('/firebase-signup')}
                        className="text-primary hover:text-primary-600 font-semibold transition-colors"
                        data-testid="link-signup"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Create an account
                      </motion.button>
                    </p>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
