import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Lock,
  Sun,
  Moon,
  Sparkles,
  Rocket,
  ArrowRight,
  CheckCircle,
  Star,
  User,
  ChevronLeft,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [theme, setTheme] = useState("dark");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

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
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.otp.trim()) newErrors.otp = "OTP is required";
    if (!formData.newPassword) newErrors.newPassword = "Password is required";
    if (formData.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/reset-password`,
        {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }
      );

      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      if (error.response) {
        setErrors({ submit: error.response.data.message || "Reset failed" });
      } else {
        setErrors({ submit: "Network error. Please try again." });
      }
    } finally {
      setIsLoading(false);
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
        <div className="max-w-md mx-auto">
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
                Reset Your Password
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
              Set New{" "}
              <span
                className={`text-transparent bg-clip-text animate-gradient-flow ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-400 via-yellow-300 to-indigo-400"
                    : "bg-gradient-to-r from-indigo-600 via-purple-600 to-yellow-500"
                }`}
              >
                Password
              </span>
            </h1>

            <p
              className={`text-xl mb-8 max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-indigo-700"
              }`}
            >
              Enter the OTP sent to your email and create a new password
            </p>

            {/* Success indicators */}
            <div className="flex justify-center items-center gap-8 mb-8">
              {[
                { icon: User, label: "50K+ Students", color: "text-blue-400" },
                { icon: Star, label: "4.9/5 Rating", color: "text-yellow-400" },
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
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
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
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2
                  className={`text-3xl font-black mb-2 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Password Reset
                </h2>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-indigo-700"
                  }`}
                >
                  Enter OTP and new password
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600"
                      }`}
                    >
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h3
                      className={`text-xl font-bold ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      Account Verification
                    </h3>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-bold mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
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
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      <Lock className="inline w-4 h-4 mr-2" />
                      OTP (Check your email)
                    </label>
                    <Input
                      type="text"
                      value={formData.otp}
                      onChange={(e) => handleInputChange("otp", e.target.value)}
                      className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                        errors.otp
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : theme === "dark"
                          ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                          : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                      }`}
                    />
                    {errors.otp && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {errors.otp}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600"
                      }`}
                    >
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h3
                      className={`text-xl font-bold ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      New Password
                    </h3>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-bold mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      <Lock className="inline w-4 h-4 mr-2" />
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) =>
                          handleInputChange("newPassword", e.target.value)
                        }
                        className={`h-12 rounded-xl border-2 pr-12 transition-all duration-300 focus:ring-4 ${
                          errors.newPassword
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
                    {errors.newPassword && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-bold mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      <Lock className="inline w-4 h-4 mr-2" />
                      Confirm Password
                    </label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : theme === "dark"
                          ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                          : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {errors.confirmPassword}
                      </p>
                    )}
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
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-14 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        Reset Password
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </Button>
                </div>

                {/* Back to Login Link */}
                <div className="text-center pt-4">
                  <Link
                    href="/login"
                    className={`flex items-center justify-center gap-2 font-medium transition-colors hover:underline ${
                      theme === "dark"
                        ? "text-purple-400 hover:text-purple-300"
                        : "text-indigo-600 hover:text-indigo-800"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

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
