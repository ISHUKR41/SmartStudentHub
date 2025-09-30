import { useState, useMemo } from 'react';
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
import zxcvbn from 'zxcvbn';
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

// Form validation schema
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

  // Password strength calculation using zxcvbn
  const passwordStrength = useMemo(() => {
    if (!passwordValue || passwordValue.length === 0) return null;
    return zxcvbn(passwordValue);
  }, [passwordValue]);

  // Password requirements
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

  // Get strength color and label
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

  // Form submission handler
  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { firstName, lastName, confirmPassword, ...rest } = data;
      const fullName = `${firstName} ${lastName}`;
      
      // Create username from email
      const username = data.email.split('@')[0].toLowerCase();
      
      await signUpUser(
        {
          name: fullName,
          username,
          email: rest.email,
          college: rest.college,
          registrationNo: rest.registrationNo,
          age: 18, // Default age, can be made configurable
        },
        rest.password
      );

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

        {/* Right Side - Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background overflow-y-auto"
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
                <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
                <p className="text-muted-foreground">Join the Smart Student Hub community</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* First Name Input */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <input
                    {...register('firstName')}
                    type="text"
                    className="peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 placeholder-transparent"
                    placeholder="First Name"
                    data-testid="input-firstname"
                  />
                  <label
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      formValues.firstName
                        ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                        : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                    }`}
                  >
                    First Name
                  </label>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name Input */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <input
                    {...register('lastName')}
                    type="text"
                    className="peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 placeholder-transparent"
                    placeholder="Last Name"
                    data-testid="input-lastname"
                  />
                  <label
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      formValues.lastName
                        ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                        : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                    }`}
                  >
                    Last Name
                  </label>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>

                {/* College Input */}
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <input
                    {...register('college')}
                    type="text"
                    className="peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 placeholder-transparent"
                    placeholder="College"
                    data-testid="input-college"
                  />
                  <label
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      formValues.college
                        ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                        : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                    }`}
                  >
                    College Name
                  </label>
                  {errors.college && (
                    <p className="mt-1 text-sm text-destructive">{errors.college.message}</p>
                  )}
                </div>

                {/* Registration Number Input */}
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <input
                    {...register('registrationNo')}
                    type="text"
                    className="peer w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 placeholder-transparent"
                    placeholder="Registration Number"
                    data-testid="input-regno"
                  />
                  <label
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      formValues.registrationNo
                        ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                        : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                    }`}
                  >
                    Registration Number
                  </label>
                  {errors.registrationNo && (
                    <p className="mt-1 text-sm text-destructive">{errors.registrationNo.message}</p>
                  )}
                </div>

                {/* Email Input */}
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
                      formValues.email
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

                {/* Password Input with Strength Indicator */}
                <div className="space-y-2">
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
                        formValues.password
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
                  </div>

                  {/* Password Strength Bar */}
                  {passwordValue && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Password Strength:</span>
                        <span className={`text-xs font-semibold ${strengthInfo.color.replace('bg-', 'text-')}`}>
                          {strengthInfo.label}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: strengthInfo.width }}
                          transition={{ duration: 0.3 }}
                          className={`h-full ${strengthInfo.color} transition-all duration-300`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Requirements Checklist */}
                  {passwordValue && (
                    <div className="space-y-1 text-xs">
                      <p className="text-muted-foreground font-medium">Password must contain:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <div className={`flex items-center space-x-1 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordRequirements.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>8+ characters</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordRequirements.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>Uppercase</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordRequirements.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>Lowercase</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordRequirements.number ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordRequirements.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>Number</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordRequirements.special ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordRequirements.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>Special char</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="peer w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 placeholder-transparent"
                    placeholder="Confirm Password"
                    data-testid="input-confirm-password"
                  />
                  <label
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      formValues.confirmPassword
                        ? '-top-2.5 text-xs bg-background px-2 text-primary font-medium'
                        : 'top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-primary peer-focus:font-medium'
                    }`}
                  >
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                    data-testid="button-toggle-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-600 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  data-testid="button-signup"
                >
                  {isLoading ? (
                    <>
                      <ClipLoader color="white" size={20} />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setLocation('/firebase-signin')}
                      className="text-primary hover:text-primary-600 font-semibold transition-colors"
                      data-testid="link-signin"
                    >
                      Sign In
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
