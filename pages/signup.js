import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Building,
  BookOpen,
  Lock,
  Hash,
  Sun,
  Moon,
  Sparkles,
  Rocket,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    mobile: "",
    email: "",
    year: "",
    role: "",
    password: "",
    confirmPassword: "",
    university: "",
    branch: "",
    graduationYear: "",
    interests: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [theme, setTheme] = useState("dark");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const interestOptions = [
    "Web Development",
    "Machine Learning",
    "Open Source",
    "Mobile Development",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
    "Blockchain",
    "Game Development",
  ];

  const branches = [
    "Computer Engineering",
    "Electronics and Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Computer Science and Engineering",
    "Information Technology",
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    setIsVisible(true);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.rollNumber.trim())
      newErrors.rollNumber = "Roll number is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile number must be 10 digits";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.university.trim())
      newErrors.university = "University is required";
    else if (!/^[a-zA-Z\s\-&,.()']{3,}$/.test(formData.university))
      newErrors.university = "Please enter a valid university name";

    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.branch) newErrors.branch = "Branch is required";
    if (!formData.graduationYear)
      newErrors.graduationYear = "Graduation year is required";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(formData.password))
      newErrors.password = "Password must contain at least 1 capital letter";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
      newErrors.password = "Password must contain at least 1 special character";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (formData.interests.length === 0)
      newErrors.interests = "Please select at least one interest";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     if (!validateForm()) return;

  //     setIsLoading(true);
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:3005/api/auth/signup",
  //         {
  //           name: formData.name,
  //           rollNumber: formData.rollNumber,
  //           mobile: formData.mobile,
  //           email: formData.email,
  //           year: formData.year,
  //           role: formData.role,
  //           password: formData.password,
  //           university: formData.university,
  //           branch: formData.branch,
  //           graduationYear: Number.parseInt(formData.graduationYear),
  //           interests: formData.interests,
  //         }
  //       );

  //       // Handle successful signup
  //       toast.success("Signup successful");
  //       // Redirect to login page
  //       //   window.location.href = "/login";
  //     } catch (error) {
  //       setErrors({
  //         submit:
  //           error.response?.data?.message || "Signup failed. Please try again.",
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const role = formData.university.toLowerCase().includes("thapar")
      ? "thaparStudent"
      : "nonThaparStudent";

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/signup`,
        {
          name: formData.name,
          rollNumber: formData.rollNumber,
          mobile: formData.mobile,
          email: formData.email,
          year: formData.year,
          role: role,
          password: formData.password,
          university: formData.university,
          branch: formData.branch,
          graduationYear: Number.parseInt(formData.graduationYear),
          interests: formData.interests,
        }
      );

      if (response.status === 201) {
        setSignupSuccess(true);
        setVerificationStep(true);
        toast.success("Signup successful! Please verify your email.");
        setSignupSuccess(true);
        setOtpSent(false); // Reset OTP sent state
        setOtp("");
      }
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message || "Signup failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setOtpError(""); // Clear any previous errors
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/send-email-otp`,
        {
          email: formData.email,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "OTP sent successfully");
        setOtpSent(true); // Mark OTP as sent
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
      setOtpSent(false); // Ensure OTP sent state is false on error
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify-email-otp`,
        {
          email: formData.email,
          otp: otp,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Email verified successfully");
        // Redirect to login or dashboard after successful verification
        window.location.href = "/login";
      }
    } catch (error) {
      setOtpError(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"
          : "bg-gradient-to-br from-yellow-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl border transition-all duration-300 hover:scale-110 ${
          theme === "dark"
            ? "bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20"
            : "bg-indigo-100 border-indigo-200 text-indigo-600 hover:bg-indigo-200"
        }`}
      >
        {theme === "dark" ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>
      {verificationStep ? (
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div
            className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl backdrop-blur-xl ${
              theme === "dark"
                ? "bg-white/5 border-white/10"
                : "bg-white/80 border-indigo-200"
            }`}
          >
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                } shadow-lg`}
              >
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2
                className={`text-3xl font-black mb-2 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                {otpSent ? "Verify Your Email" : "Send Verification Code"}
              </h2>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                {otpSent
                  ? `We've sent a verification code to ${formData.email}`
                  : "Click the button below to receive a verification code"}
              </p>
            </div>

            <div className="space-y-6">
              {otpSent ? (
                <>
                  <div>
                    <label
                      className={`block text-sm font-bold mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      Enter 6-digit OTP
                    </label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setOtpError("");
                      }}
                      placeholder="123456"
                      maxLength={6}
                      className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                        otpError
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : theme === "dark"
                          ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                          : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                      }`}
                    />
                    {otpError && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {otpError}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className={`flex-1 h-12 rounded-xl ${
                        theme === "dark"
                          ? "bg-white/10 hover:bg-white/20"
                          : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                      }`}
                    >
                      {isSendingOtp ? "Sending..." : "Resend OTP"}
                    </Button>
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={isVerifying}
                      className={`flex-1 h-12 rounded-xl font-bold ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      }`}
                    >
                      {isVerifying ? "Verifying..." : "Verify Email"}
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className={`w-full h-12 rounded-xl font-bold ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  {isSendingOtp ? "Sending OTP..." : "Send Verification Code"}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Enhanced animated background */}
          <div className="absolute inset-0">
            <div
              className={`absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-slow ${
                theme === "dark"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                  : "bg-gradient-to-r from-indigo-300 to-purple-300"
              }`}
            ></div>
            <div
              className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-slow animation-delay-2000 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-500 to-yellow-400"
                  : "bg-gradient-to-r from-purple-300 to-yellow-200"
              }`}
            ></div>
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl animate-pulse-slow animation-delay-4000 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-yellow-400 to-indigo-500"
                  : "bg-gradient-to-r from-yellow-200 to-indigo-300"
              }`}
            ></div>

            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full animate-float ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-indigo-400 to-yellow-300 opacity-40"
                    : "bg-gradient-to-r from-indigo-400 to-purple-400 opacity-60"
                }`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              ></div>
            ))}
          </div>
          {/* Mouse follower effect */}
          <div
            className={`fixed w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-screen transition-all duration-100 ease-out ${
              theme === "dark"
                ? "bg-gradient-to-r from-indigo-500 to-yellow-300 opacity-30"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"
            }`}
            style={{
              left: mousePosition.x - 16,
              top: mousePosition.y - 16,
              transform: "scale(0.8)",
            }}
          ></div>
          <div className="relative z-10 py-12 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div
                className={`text-center mb-12 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div
                  className={`inline-flex items-center gap-3 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border transition-all duration-1000 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-500/20 to-yellow-400/20 border-white/20"
                      : "bg-gradient-to-r from-indigo-100 to-yellow-100 border-indigo-200"
                  }`}
                >
                  <div className="relative">
                    <Rocket
                      className={`w-6 h-6 animate-bounce ${
                        theme === "dark" ? "text-purple-400" : "text-indigo-600"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 rounded-full blur-md opacity-50 animate-pulse ${
                        theme === "dark" ? "bg-purple-400" : "bg-indigo-400"
                      }`}
                    ></div>
                  </div>
                  <span
                    className={`font-bold text-lg ${
                      theme === "dark"
                        ? "text-white bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-transparent"
                        : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                    }`}
                  >
                    Join the Community
                  </span>
                  <Sparkles
                    className={`w-6 h-6 animate-spin-slow ${
                      theme === "dark" ? "text-yellow-400" : "text-purple-500"
                    }`}
                  />
                </div>

                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Create Your{" "}
                  <span
                    className={`text-transparent bg-clip-text animate-gradient-flow ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-400 via-yellow-300 to-indigo-400"
                        : "bg-gradient-to-r from-indigo-600 via-purple-600 to-yellow-500"
                    }`}
                  >
                    Campus Connect
                  </span>{" "}
                  Account
                </h1>

                <p
                  className={`text-xl mb-8 max-w-2xl mx-auto ${
                    theme === "dark" ? "text-gray-300" : "text-indigo-700"
                  }`}
                >
                  Join thousands of students connecting, collaborating, and
                  creating amazing experiences together
                </p>

                {/* Success indicators */}
                <div className="flex justify-center items-center gap-8 mb-8">
                  {[
                    {
                      icon: User,
                      label: "50K+ Students",
                      color: "text-blue-400",
                    },
                    {
                      icon: Star,
                      label: "4.9/5 Rating",
                      color: "text-yellow-400",
                    },
                    {
                      icon: CheckCircle,
                      label: "Verified Safe",
                      color: "text-green-400",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Form Card */}
              <div
                className={`backdrop-blur-xl rounded-3xl border shadow-2xl transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white/80 border-indigo-200"
                }`}
              >
                {/* Card Header */}
                <div
                  className={`p-8 border-b rounded-t-3xl ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-white/10"
                      : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600"
                      } shadow-lg`}
                    >
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h2
                      className={`text-3xl font-black mb-2 ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      Student Registration
                    </h2>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      Fill in your details to get started
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600"
                          }`}
                        >
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <h3
                          className={`text-xl font-bold ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          Personal Information *
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-bold mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-700"
                            }`}
                          >
                            <User className="inline w-4 h-4 mr-2" />
                            Full Name
                          </label>
                          <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter your full name"
                            className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                              errors.name
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : theme === "dark"
                                ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-bold mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-700"
                            }`}
                          >
                            <Hash className="inline w-4 h-4 mr-2" />
                            Roll Number
                          </label>
                          <Input
                            type="text"
                            value={formData.rollNumber}
                            onChange={(e) =>
                              handleInputChange("rollNumber", e.target.value)
                            }
                            placeholder="Enter your roll number"
                            className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                              errors.rollNumber
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : theme === "dark"
                                ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                            }`}
                          />
                          {errors.rollNumber && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.rollNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-bold mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-700"
                            }`}
                          >
                            <Mail className="inline w-4 h-4 mr-2" />
                            Email Address
                          </label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="your.email@thapar.edu"
                            className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                              errors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : theme === "dark"
                                ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-bold mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-700"
                            }`}
                          >
                            <Phone className="inline w-4 h-4 mr-2" />
                            Mobile Number
                          </label>
                          <Input
                            type="tel"
                            value={formData.mobile}
                            onChange={(e) =>
                              handleInputChange("mobile", e.target.value)
                            }
                            placeholder="Enter 10-digit mobile number"
                            className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                              errors.mobile
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : theme === "dark"
                                ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                            }`}
                          />
                          {errors.mobile && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.mobile}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Academic Information Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600"
                          }`}
                        >
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h3
                          className={`text-xl font-bold ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          Academic Information
                        </h3>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-bold mb-3 ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          <Building className="inline w-4 h-4 mr-2" />
                          University
                        </label>
                        <Input
                          type="text"
                          value={formData.university}
                          onChange={(e) =>
                            handleInputChange("university", e.target.value)
                          }
                          placeholder="Enter your university name"
                          className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                            errors.university
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                              : theme === "dark"
                              ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                              : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                          }`}
                        />
                        {errors.university && (
                          <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                            {errors.university}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-bold mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-700"
                            }`}
                          >
                            <BookOpen className="inline w-4 h-4 mr-2" />
                            Branch
                          </label>
                          <Select
                            value={formData.branch}
                            onValueChange={(value) =>
                              handleInputChange("branch", value)
                            }
                          >
                            <SelectTrigger
                              className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                                errors.branch
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                  : theme === "dark"
                                  ? "bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20"
                                  : "bg-white border-indigo-200 text-indigo-900 focus:border-indigo-500 focus:ring-indigo-500/20"
                              }`}
                            >
                              <SelectValue placeholder="Select your branch" />
                            </SelectTrigger>
                            <SelectContent>
                              {branches.map((branch) => (
                                <SelectItem key={branch} value={branch}>
                                  {branch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.branch && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.branch}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-bold mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-700"
                            }`}
                          >
                            <Calendar className="inline w-4 h-4 mr-2" />
                            Current Year
                          </label>
                          <Select
                            value={formData.year}
                            onValueChange={(value) =>
                              handleInputChange("year", value)
                            }
                          >
                            <SelectTrigger
                              className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                                errors.year
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                  : theme === "dark"
                                  ? "bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20"
                                  : "bg-white border-indigo-200 text-indigo-900 focus:border-indigo-500 focus:ring-indigo-500/20"
                              }`}
                            >
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1st Year</SelectItem>
                              <SelectItem value="2">2nd Year</SelectItem>
                              <SelectItem value="3">3rd Year</SelectItem>
                              <SelectItem value="4">4th Year</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.year && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.year}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-bold mb-3 ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          <GraduationCap className="inline w-4 h-4 mr-2" />
                          Expected Graduation Year
                        </label>
                        <Input
                          type="number"
                          value={formData.graduationYear}
                          onChange={(e) =>
                            handleInputChange("graduationYear", e.target.value)
                          }
                          placeholder="e.g., 2026"
                          min="2024"
                          max="2030"
                          className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                            errors.graduationYear
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                              : theme === "dark"
                              ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                              : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                          }`}
                        />
                        {errors.graduationYear && (
                          <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                            {errors.graduationYear}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Interests Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : "bg-gradient-to-r from-yellow-500 to-orange-500"
                          }`}
                        >
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <h3
                          className={`text-xl font-bold ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          Interests & Skills
                        </h3>
                      </div>

                      <p
                        className={`text-sm mb-4 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Select your areas of interest to help us connect you
                        with relevant opportunities
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {interestOptions.map((interest) => (
                          <div
                            key={interest}
                            className={`group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                              formData.interests.includes(interest)
                                ? theme === "dark"
                                  ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-400 shadow-lg shadow-purple-500/20"
                                  : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-500 shadow-lg shadow-indigo-500/20"
                                : theme === "dark"
                                ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                : "bg-white border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                            }`}
                            // onClick={(e) => {
                            //   e.preventDefault();
                            //   handleInterestToggle(interest);
                            // }}
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={interest}
                                checked={formData.interests.includes(interest)}
                                onCheckedChange={() =>
                                  handleInterestToggle(interest)
                                }
                              />
                              <label
                                htmlFor={interest}
                                className={`text-sm font-medium cursor-pointer ${
                                  formData.interests.includes(interest)
                                    ? theme === "dark"
                                      ? "text-purple-300"
                                      : "text-indigo-700"
                                    : theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }`}
                              >
                                {interest}
                              </label>
                            </div>
                            {formData.interests.includes(interest) && (
                              <div
                                className={`absolute inset-0 rounded-xl opacity-10 ${
                                  theme === "dark"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                    : "bg-gradient-to-r from-indigo-400 to-purple-400"
                                }`}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                      {errors.interests && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                          {errors.interests}
                        </p>
                      )}
                    </div>

                    {/* Security Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-green-500 to-teal-500"
                              : "bg-gradient-to-r from-green-600 to-teal-600"
                          }`}
                        >
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                        <h3
                          className={`text-xl font-bold ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          Security
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-bold mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-700"
                            }`}
                          >
                            <Lock className="inline w-4 h-4 mr-2" />
                            Password
                          </label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              placeholder="Create a strong password"
                              className={`h-12 rounded-xl border-2 pr-12 transition-all duration-300 focus:ring-4 ${
                                errors.password
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                  : theme === "dark"
                                  ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                  : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                                theme === "dark"
                                  ? "text-gray-400 hover:text-gray-200"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-bold mb-3 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-700"
                            }`}
                          >
                            <Lock className="inline w-4 h-4 mr-2" />
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              placeholder="Confirm your password"
                              className={`h-12 rounded-xl border-2 pr-12 transition-all duration-300 focus:ring-4 ${
                                errors.confirmPassword
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                  : theme === "dark"
                                  ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                  : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                                theme === "dark"
                                  ? "text-gray-400 hover:text-gray-200"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                      <div
                        className={`p-4 rounded-xl border ${
                          theme === "dark"
                            ? "bg-red-900/20 border-red-500/50 text-red-300"
                            : "bg-red-50 border-red-200 text-red-600"
                        }`}
                      >
                        <p className="text-sm font-medium">{errors.submit}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-6 relative group w-full">
                      <Button
                        type="submit"
                        // disabled={isLoading || Object.keys(errors).length > 0}
                        className={`w-full h-14 rounded-xl font-bold text-lg transition-all duration-300 transform shadow-xl cursor-pointer
      ${
        theme === "dark"
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
      }
      hover:scale-105
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Creating Your Account...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            Create Account
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        )}
                      </Button>

                      {/* Custom Tooltip */}
                      {(isLoading || Object.keys(errors).length > 0) && (
                        <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2 z-10 hidden group-hover:block">
                          <div className="bg-black text-white text-xs px-3 py-2 rounded-lg shadow-md whitespace-nowrap">
                            ⚠️ Please fill all the fields
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Login Link */}
                    <div className="text-center pt-4">
                      <p
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Already have an account?{" "}
                        <Link
                          href="/login"
                          className={`font-bold transition-colors hover:underline ${
                            theme === "dark"
                              ? "text-purple-400 hover:text-purple-300"
                              : "text-indigo-600 hover:text-indigo-800"
                          }`}
                        >
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes gradient-flow {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
