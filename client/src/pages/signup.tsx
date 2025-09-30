import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiUserCheck, 
  FiBook, 
  FiHash, 
  FiCalendar,
  FiStar,
  FiUsers,
  FiTrendingUp,
  FiAward
} from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";
import { ClipLoader } from "react-spinners";
import { signUpUser } from "@/firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const signupSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .toLowerCase(),
  college: z.string()
    .min(2, "College name must be at least 2 characters")
    .max(100, "College name must not exceed 100 characters"),
  registrationNo: z.string()
    .min(3, "Registration number must be at least 3 characters")
    .max(20, "Registration number must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Registration number can only contain letters, numbers, and dashes"),
  age: z.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be a number"
  })
    .min(16, "You must be at least 16 years old")
    .max(60, "Age must not exceed 60 years"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain uppercase, lowercase, number, and special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { password, confirmPassword, ...userData } = data;
      await signUpUser(userData, password);
      
      // Reset form and show success
      reset();
      
      // Redirect to signin after successful signup
      setTimeout(() => {
        setLocation("/firebase-signin");
      }, 2000);
      
    } catch (error: any) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Side - Information Panel */}
            <motion.div 
              className="hidden lg:block space-y-8 px-8"
              variants={itemVariants}
            >
              <div className="text-center lg:text-left">
                <motion.div
                  className="flex items-center justify-center lg:justify-start mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                    <HiAcademicCap className="text-white text-2xl" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Smart Student Hub
                  </h1>
                </motion.div>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Your comprehensive digital platform for managing academic activities, tracking achievements, and connecting with fellow students.
                </p>
              </div>

              <div className="space-y-6">
                <motion.div 
                  className="flex items-start space-x-4 p-4 bg-white/70 rounded-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiTrendingUp className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Track Academic Progress</h3>
                    <p className="text-sm text-gray-600">Monitor your grades, assignments, and academic milestones in real-time.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 p-4 bg-white/70 rounded-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiUsers className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Connect with Peers</h3>
                    <p className="text-sm text-gray-600">Join study groups, collaborate on projects, and build your academic network.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 p-4 bg-white/70 rounded-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiAward className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Earn Achievements</h3>
                    <p className="text-sm text-gray-600">Get recognized for your academic accomplishments and extracurricular activities.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 p-4 bg-white/70 rounded-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FiStar className="text-orange-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Personalized Dashboard</h3>
                    <p className="text-sm text-gray-600">Access a customized dashboard tailored to your academic needs and goals.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Signup Form */}
            <motion.div variants={itemVariants}>
              <Card className="w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Create Your Account
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">
                      Join thousands of students already using Smart Student Hub
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Enter your full name"
                          className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {errors.name && (
                        <motion.p 
                          className="text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="Enter your email address"
                          className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {errors.email && (
                        <motion.p 
                          className="text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Row with Username and Age */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Username Field */}
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                          Username
                        </Label>
                        <div className="relative">
                          <FiUserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            id="username"
                            {...register("username")}
                            placeholder="Choose a username"
                            className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        {errors.username && (
                          <motion.p 
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {errors.username.message}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* Age Field */}
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                          Age
                        </Label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            id="age"
                            type="number"
                            {...register("age", { valueAsNumber: true })}
                            placeholder="Your age"
                            min="16"
                            max="60"
                            className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        {errors.age && (
                          <motion.p 
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {errors.age.message}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    {/* College Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="college" className="text-sm font-medium text-gray-700">
                        College/University
                      </Label>
                      <div className="relative">
                        <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="college"
                          {...register("college")}
                          placeholder="Enter your college/university name"
                          className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {errors.college && (
                        <motion.p 
                          className="text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.college.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Registration Number Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="registrationNo" className="text-sm font-medium text-gray-700">
                        Registration Number
                      </Label>
                      <div className="relative">
                        <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="registrationNo"
                          {...register("registrationNo")}
                          placeholder="Enter your registration number"
                          className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {errors.registrationNo && (
                        <motion.p 
                          className="text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.registrationNo.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Password Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          placeholder="Create a strong password"
                          className="pl-10 pr-12 h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p 
                          className="text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.password.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Confirm Password Field */}
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword")}
                          placeholder="Confirm your password"
                          className="pl-10 pr-12 h-12 border-2 focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <motion.p 
                          className="text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.confirmPassword.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div className="pt-4" variants={itemVariants}>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <ClipLoader size={20} color="white" />
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  {/* Signin Link */}
                  <motion.div 
                    className="text-center pt-6 border-t border-gray-200"
                    variants={itemVariants}
                  >
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/signin"
                        className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}