// "use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogIn, Menu, X, Sun, Moon, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

export default function Navbar({ theme = "dark", onThemeToggle }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);
  const token = hasMounted ? Cookies.get("token") : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    setIsVisible(true);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    ...(token
      ? [
          { name: "Discussions", href: "/discussion", icon: null },
          { name: "Events", href: "/orgControl/events", icon: null },
          { name: "Profile", href: "/profile", icon: null },
        ]
      : [{ name: "Login", href: "/login", icon: LogIn }]),
  ];

  const isEventsPage = router.pathname === "/orgControl/events";
  const isEventsPageHome = router.pathname === "/events";
  const isOrganizationsPage = router.pathname === "/orgControl/organizations";
  const isProfilePage = router.pathname === "/profile";

  const logoutUser = async () => {
    try {
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3006/api"
        }/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Logout successful");
      Cookies.remove("token", { path: "/" }); // Remove token cookie
      console.log("Logout success:", response.data.message);
      router.push("/");
      return response.data;
    } catch (error) {
      console.error(
        "Logout failed:",
        error?.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error?.response?.data?.message || "Logout failed",
      };
    }
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div
          className={`mx-4 mt-4 rounded-2xl border transition-all duration-500 ${
            isScrolled
              ? "backdrop-blur-xl shadow-2xl"
              : "backdrop-blur-md shadow-lg"
          } ${
            theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-white/80 border-white/20"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <Link href="/" className="flex items-center gap-3 group">
                <div
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  } shadow-lg`}
                >
                  <Rocket className="w-5 h-5 text-white" />
                  <div
                    className={`absolute inset-0 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600"
                    }`}
                  ></div>
                </div>
                <div className="hidden sm:block">
                  <span
                    className={`font-black text-xl transition-all duration-300 ${
                      theme === "dark"
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-300"
                        : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                    }`}
                  >
                    Campus Connect
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2 ml-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                          theme === "dark"
                            ? "text-gray-300 hover:text-white hover:bg-white/10"
                            : "text-indigo-700 hover:text-indigo-900 hover:bg-indigo-200/70 border border-indigo-200"
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4 mr-2" />}
                        {item.name}
                        <div
                          className={`absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20"
                              : "bg-gradient-to-r from-indigo-100/50 to-purple-100/50"
                          }`}
                        ></div>
                      </Button>
                    </Link>
                  );
                })}
                {token && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      // Cookies.remove("token");
                      logoutUser();
                    }}
                    className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      theme === "dark"
                        ? "text-red-400 hover:text-white hover:bg-white/10"
                        : "text-red-600 hover:text-red-800 hover:bg-red-100 border border-red-200"
                    }`}
                  >
                    Logout
                  </Button>
                )}
              </div>

              {/* Theme Toggle & Mobile Menu */}
              <div className="flex items-center gap-3 ml-4">
                {/* Theme Toggle */}
                {onThemeToggle && (
                  <button
                    onClick={onThemeToggle}
                    className={`p-3 rounded-xl backdrop-blur-xl border transition-all duration-300 hover:scale-110 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20"
                        : "bg-indigo-100/50 border-indigo-200/50 text-indigo-600 hover:bg-indigo-200/50"
                    }`}
                  >
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`md:hidden p-3 rounded-xl backdrop-blur-xl border transition-all duration-300 hover:scale-110 ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      : "bg-indigo-100/50 border-indigo-200/50 text-indigo-600 hover:bg-indigo-200/50"
                  }`}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div
              className={`md:hidden overflow-hidden transition-all duration-500 ${
                isMobileMenuOpen
                  ? "max-h-96 opacity-100 mt-6"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div
                className={`border-t pt-6 space-y-3 ${
                  theme === "dark" ? "border-white/10" : "border-indigo-200/50"
                }`}
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          theme === "dark"
                            ? "text-gray-300 hover:text-white hover:bg-white/10"
                            : "text-indigo-700 hover:text-indigo-900 hover:bg-indigo-200/70 border border-indigo-200"
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4 mr-3" />}
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float opacity-30 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-400 to-yellow-300"
                  : "bg-gradient-to-r from-indigo-400 to-purple-400"
              }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </nav>
      <div
        className={`${
          isEventsPage ||
          isOrganizationsPage ||
          isProfilePage ||
          isEventsPageHome
            ? "h-20"
            : "h-12"
        } w-full`}
      />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
