import { useState, useMemo, useEffect, useRef, MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import Particles from '@tsparticles/react';
import { TypeAnimation } from 'react-type-animation';
import VanillaTilt from 'vanilla-tilt';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import zxcvbn from 'zxcvbn';
import Confetti from 'react-confetti';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Award,
  User,
  Building,
  Hash,
  Check,
  X
} from 'lucide-react';
import { signUpUser } from '@/firebase/auth';

const signupSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name should only contain letters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name should only contain letters'),
  college: z.string()
    .min(2, 'College name must be at least 2 characters')
    .max(100, 'College name must not exceed 100 characters'),
  registrationNo: z.string()
    .min(3, 'Registration number must be at least 3 characters')
    .max(20, 'Registration number must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Registration number can only contain letters, numbers, and dashes'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function FirebaseSignup() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const tiltRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const glowControls = useAnimation();
  const isInView = useInView(formRef, { once: false, amount: 0.3 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const formValues = watch();
  const passwordValue = watch('password');

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const passwordStrength = useMemo(() => {
    if (!passwordValue || passwordValue.length === 0) return null;
    return zxcvbn(passwordValue);
  }, [passwordValue]);

  const passwordRequirements = useMemo(() => {
    const pwd = passwordValue || '';
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
  }, [passwordValue]);

  const getStrengthInfo = () => {
    if (!passwordStrength) return { color: 'bg-gray-300', label: '', width: '0%' };
    
    const score = passwordStrength.score;
    
    if (score === 0) return { color: 'bg-red-500', label: 'Very Weak', width: '20%' };
    if (score === 1) return { color: 'bg-orange-500', label: 'Weak', width: '40%' };
    if (score === 2) return { color: 'bg-yellow-500', label: 'Fair', width: '60%' };
    if (score === 3) return { color: 'bg-blue-500', label: 'Good', width: '80%' };
    return { color: 'bg-green-500', label: 'Strong', width: '100%' };
  };

  const strengthInfo = getStrengthInfo();

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

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { firstName, lastName, confirmPassword, ...rest } = data;
      const fullName = `${firstName} ${lastName}`;
      
      const username = data.email.split('@')[0].toLowerCase();
      
      await signUpUser(
        {
          name: fullName,
          username,
          email: rest.email,
          college: rest.college,
          registrationNo: rest.registrationNo,
          age: 18,
        },
        rest.password
      );

      setShowConfetti(true);
      
      setTimeout(async () => {
        setShowConfetti(false);
        await Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          html: 'Please check your email to verify your account.<br/>Check your spam folder if you don\'t see it.',
          showConfirmButton: true,
          confirmButtonText: 'Continue to Verification',
          confirmButtonColor: 'hsl(var(--primary))',
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
        });
        setLocation('/email-verification');
      }, 3000);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Sign Up Failed',
        text: error.message || 'Failed to create account. Please try again.',
        confirmButtonColor: 'hsl(var(--primary))',
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}
      </AnimatePresence>

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
                  'Start Your Academic Journey',
                  2000,
                  'Build Your Success Story',
                  2000,
                  'Unlock Your Potential',
                  2000,
                  'Join Our Community',
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
                'Create your digital portfolio',
                'Track all your achievements',
                'Connect with opportunities',
                'Get institutional verification',
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
          className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background overflow-y-auto"
        >
          <div className="w-full max-w-md" ref={formRef}>
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
                animate={isInView ? "visible" : "hidden"}
                className="relative z-10"
              >
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
                  <p className="text-muted-foreground">Join the Smart Student Hub community</p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <motion.div variants={itemVariants} className="relative">
                    <motion.div
                      animate={{
                        scale: focusedField === 'firstName' ? 1.1 : 1,
                        rotate: focusedField === 'firstName' ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                    >
                      <User className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                    <input
                      {...register('firstName')}
                      type="text"
                      className={`peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 placeholder-transparent ${
                        focusedField === 'firstName'
                          ? 'border-transparent bg-gradient-to-r from-primary/20 to-purple-500/20 shadow-lg shadow-primary/50'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      placeholder="First Name"
                      data-testid="input-firstname"
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {focusedField === 'firstName' && (
                      <motion.div
                        layoutId="firstName-border"
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
                        formValues.firstName
                          ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                          : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                      }`}
                    >
                      First Name
                    </label>
                    <AnimatePresence>
                      {errors.firstName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="mt-1 text-sm text-destructive"
                        >
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={itemVariants} className="relative">
                    <motion.div
                      animate={{
                        scale: focusedField === 'lastName' ? 1.1 : 1,
                        rotate: focusedField === 'lastName' ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                    >
                      <User className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                    <input
                      {...register('lastName')}
                      type="text"
                      className={`peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 placeholder-transparent ${
                        focusedField === 'lastName'
                          ? 'border-transparent bg-gradient-to-r from-primary/20 to-purple-500/20 shadow-lg shadow-primary/50'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      placeholder="Last Name"
                      data-testid="input-lastname"
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {focusedField === 'lastName' && (
                      <motion.div
                        layoutId="lastName-border"
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
                        formValues.lastName
                          ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                          : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                      }`}
                    >
                      Last Name
                    </label>
                    <AnimatePresence>
                      {errors.lastName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="mt-1 text-sm text-destructive"
                        >
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={itemVariants} className="relative">
                    <motion.div
                      animate={{
                        scale: focusedField === 'college' ? 1.1 : 1,
                        rotate: focusedField === 'college' ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                    >
                      <Building className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                    <input
                      {...register('college')}
                      type="text"
                      className={`peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 placeholder-transparent ${
                        focusedField === 'college'
                          ? 'border-transparent bg-gradient-to-r from-primary/20 to-purple-500/20 shadow-lg shadow-primary/50'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      placeholder="College"
                      data-testid="input-college"
                      onFocus={() => setFocusedField('college')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {focusedField === 'college' && (
                      <motion.div
                        layoutId="college-border"
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
                        formValues.college
                          ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                          : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                      }`}
                    >
                      College Name
                    </label>
                    <AnimatePresence>
                      {errors.college && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="mt-1 text-sm text-destructive"
                        >
                          {errors.college.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={itemVariants} className="relative">
                    <motion.div
                      animate={{
                        scale: focusedField === 'registrationNo' ? 1.1 : 1,
                        rotate: focusedField === 'registrationNo' ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                    >
                      <Hash className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                    <input
                      {...register('registrationNo')}
                      type="text"
                      className={`peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 placeholder-transparent ${
                        focusedField === 'registrationNo'
                          ? 'border-transparent bg-gradient-to-r from-primary/20 to-purple-500/20 shadow-lg shadow-primary/50'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      placeholder="Registration Number"
                      data-testid="input-regno"
                      onFocus={() => setFocusedField('registrationNo')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {focusedField === 'registrationNo' && (
                      <motion.div
                        layoutId="registrationNo-border"
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
                        formValues.registrationNo
                          ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                          : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                      }`}
                    >
                      Registration Number
                    </label>
                    <AnimatePresence>
                      {errors.registrationNo && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="mt-1 text-sm text-destructive"
                        >
                          {errors.registrationNo.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={itemVariants} className="relative">
                    <motion.div
                      animate={{
                        scale: focusedField === 'email' ? 1.1 : 1,
                        rotate: focusedField === 'email' ? [0, -10, 10, 0] : 0,
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
                        focusedField === 'email'
                          ? 'border-transparent bg-gradient-to-r from-primary/20 to-purple-500/20 shadow-lg shadow-primary/50'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      placeholder="Email"
                      data-testid="input-email"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {focusedField === 'email' && (
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
                        formValues.email
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

                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: focusedField === 'password' ? 1.1 : 1,
                          rotate: focusedField === 'password' ? [0, -10, 10, 0] : 0,
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
                          focusedField === 'password'
                            ? 'border-transparent bg-gradient-to-r from-primary/20 to-purple-500/20 shadow-lg shadow-primary/50'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        placeholder="Password"
                        data-testid="input-password"
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                      />
                      {focusedField === 'password' && (
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
                          formValues.password
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
                    </div>

                    <AnimatePresence>
                      {passwordValue && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Password Strength:</span>
                            <motion.span
                              className="text-xs font-medium"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              {strengthInfo.label}
                            </motion.span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${strengthInfo.color}`}
                              initial={{ width: '0%' }}
                              animate={{ width: strengthInfo.width }}
                              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {Object.entries(passwordRequirements).map(([key, met], index) => (
                              <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
                                className={`flex items-center space-x-1 text-xs ${
                                  met ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                                }`}
                              >
                                <motion.div
                                  animate={{
                                    scale: met ? [1, 1.3, 1] : 1,
                                    rotate: met ? [0, 360] : 0,
                                  }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                >
                                  {met ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <X className="w-4 h-4" />
                                  )}
                                </motion.div>
                                <span className="capitalize">
                                  {key === 'length' ? '8+ chars' : key}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

                  <motion.div variants={itemVariants} className="relative">
                    <motion.div
                      animate={{
                        scale: focusedField === 'confirmPassword' ? 1.1 : 1,
                        rotate: focusedField === 'confirmPassword' ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                    >
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`peer w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 rounded-xl focus:outline-none transition-all duration-300 placeholder-transparent ${
                        focusedField === 'confirmPassword'
                          ? 'border-transparent bg-gradient-to-r from-primary/20 to-purple-500/20 shadow-lg shadow-primary/50'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      placeholder="Confirm Password"
                      data-testid="input-confirm-password"
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {focusedField === 'confirmPassword' && (
                      <motion.div
                        layoutId="confirmPassword-border"
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
                        formValues.confirmPassword
                          ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                          : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                      }`}
                    >
                      Confirm Password
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                      data-testid="button-toggle-confirm-password"
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                    <AnimatePresence>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="mt-1 text-sm text-destructive"
                        >
                          {errors.confirmPassword.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <motion.button
                      ref={buttonRef}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary-600 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden"
                      data-testid="button-signup"
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
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </motion.button>
                  </motion.div>

                  <motion.div variants={itemVariants} className="text-center">
                    <p className="text-muted-foreground">
                      Already have an account?{' '}
                      <motion.button
                        type="button"
                        onClick={() => setLocation('/firebase-signin')}
                        className="text-primary hover:text-primary-600 font-semibold transition-colors"
                        data-testid="link-signin"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Sign in
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
