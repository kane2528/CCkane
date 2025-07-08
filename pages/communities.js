import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Sun,
  Moon,
  Sparkles,
  Rocket,
  ArrowRight,
  CheckCircle,
  Star,
  User,
  ChevronLeft,
  Users,
  Plus,
  Search,
  Hash,
  MessageSquare,
  Bookmark,
  Settings,
  Bell,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function CommunityPage() {
  const [theme, setTheme] = useState("dark");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState({
    all: true,
    user: true,
    create: false,
  });
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const token = Cookies.get("token");

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    setIsVisible(true);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch communities data
  useEffect(() => {
    const fetchData = async () => {
      try {
        //   const token = localStorage.getItem("token"); // or get it from cookies/auth state

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [allRes, userRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/all-communities`,
            { headers }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/user-communities`,
            { headers }
          ),
        ]);

        setCommunities(allRes.data.communities);
        setUserCommunities(userRes.data.communities);
        setIsLoading((prev) => ({ ...prev, all: false, user: false }));
      } catch (error) {
        toast.error("Failed to load communities");
        setIsLoading((prev) => ({ ...prev, all: false, user: false }));
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();

    if (!createForm.name.trim()) {
      setErrors({ name: "Community name is required" });
      return;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    setIsLoading((prev) => ({ ...prev, create: true }));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/create-community`,
        createForm,
        { headers }
      );
      toast.success("Community created successfully!");
      setCommunities((prev) => [response.data.community, ...prev]);
      setUserCommunities((prev) => [response.data.community, ...prev]);
      setCreateForm({ name: "", description: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create community"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const fetchCommunityInfo = async (communityId) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/community-info/${communityId}`,
        { headers }
      );

      console.log("Community Info:", response.data.community);
      return response.data.community;
    } catch (error) {
      console.error("Error fetching community info:", error);
      toast.error("Failed to fetch community info");
      return null;
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/join-community/${communityId}`,
        {},
        { headers }
      );
      toast.success("Successfully joined the community!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join community");
    }
  };

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isMember = (communityId) => {
    return userCommunities.some((c) => c._id === communityId);
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
        <div className="max-w-6xl mx-auto">
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
                Explore Communities
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
              Join Amazing{" "}
              <span
                className={`text-transparent bg-clip-text animate-gradient-flow ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-400 via-yellow-300 to-indigo-400"
                    : "bg-gradient-to-r from-indigo-600 via-purple-600 to-yellow-500"
                }`}
              >
                Communities
              </span>
            </h1>

            <p
              className={`text-xl mb-8 max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-indigo-700"
              }`}
            >
              Connect with like-minded students, share knowledge, and grow
              together in specialized communities.
            </p>

            {/* Success indicators */}
            <div className="flex justify-center items-center gap-8 mb-8">
              {[
                {
                  icon: Users,
                  label: "50+ Communities",
                  color: "text-blue-400",
                },
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

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div
              className={`backdrop-blur-xl rounded-3xl border shadow-2xl transition-all duration-1000 delay-200 w-full md:w-64 h-fit ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              } ${
                theme === "dark"
                  ? "bg-white/5 border-white/10"
                  : "bg-white/80 border-indigo-200"
              }`}
            >
              <div className="p-6">
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  <Hash className="w-5 h-5" />
                  Navigation
                </h2>

                <nav className="space-y-3">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      activeTab === "all"
                        ? theme === "dark"
                          ? "bg-purple-600/50 text-white"
                          : "bg-indigo-600 text-white"
                        : theme === "dark"
                        ? "hover:bg-white/10 text-gray-300"
                        : "hover:bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    All Communities
                  </button>

                  <button
                    onClick={() => setActiveTab("your")}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      activeTab === "your"
                        ? theme === "dark"
                          ? "bg-purple-600/50 text-white"
                          : "bg-indigo-600 text-white"
                        : theme === "dark"
                        ? "hover:bg-white/10 text-gray-300"
                        : "hover:bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    <Bookmark className="w-5 h-5" />
                    Your Communities
                  </button>

                  <button
                    onClick={() => setActiveTab("create")}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      activeTab === "create"
                        ? theme === "dark"
                          ? "bg-purple-600/50 text-white"
                          : "bg-indigo-600 text-white"
                        : theme === "dark"
                        ? "hover:bg-white/10 text-gray-300"
                        : "hover:bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    Create New
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Panel */}
            <div className="flex-1">
              {/* Search Bar */}
              <div
                className={`backdrop-blur-xl rounded-3xl border shadow-2xl transition-all duration-1000 delay-200 mb-8 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white/80 border-indigo-200"
                }`}
              >
                <div className="p-6">
                  <div className="relative">
                    <Search
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        theme === "dark" ? "text-gray-400" : "text-indigo-500"
                      }`}
                    />
                    <Input
                      type="text"
                      placeholder="Search communities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-12 h-14 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                          : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Content based on active tab */}
              {activeTab === "all" && (
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
                  <div className="p-6">
                    <h2
                      className={`text-2xl font-bold mb-6 ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      All Communities
                    </h2>

                    {isLoading.all ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                      </div>
                    ) : filteredCommunities.length === 0 ? (
                      <div
                        className={`text-center py-12 rounded-xl ${
                          theme === "dark"
                            ? "bg-white/5 text-gray-300"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-60" />
                        <p className="text-lg">No communities found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredCommunities.map((community) => (
                          <div
                            key={community._id}
                            onClick={() => fetchCommunityInfo(community._id)}
                            className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                              theme === "dark"
                                ? "bg-white/5 border-white/10 hover:border-purple-400/30"
                                : "bg-white border-indigo-100 hover:border-indigo-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3
                                  className={`text-xl font-bold mb-1 ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-indigo-900"
                                  }`}
                                >
                                  {community.name}
                                </h3>
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-indigo-600"
                                  }`}
                                >
                                  Created by: {community.admin?.name}
                                </p>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  theme === "dark"
                                    ? "bg-purple-600/30 text-purple-300"
                                    : "bg-indigo-100 text-indigo-700"
                                }`}
                              >
                                {new Date(
                                  community.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>

                            <p
                              className={`mb-6 ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-indigo-700"
                              }`}
                            >
                              {community.description ||
                                "No description provided"}
                            </p>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Users
                                  className={`w-4 h-4 ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-indigo-500"
                                  }`}
                                />
                                <span
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-indigo-600"
                                  }`}
                                >
                                  {community.members?.length || 0} members
                                </span>
                              </div>

                              {/* {isMember(community._id) ? (
                                <Button
                                  className={`rounded-xl ${
                                    theme === "dark"
                                      ? "bg-green-600/20 text-green-300 hover:bg-green-600/30"
                                      : "bg-green-100 text-green-700 hover:bg-green-200"
                                  }`}
                                  disabled
                                >
                                  Joined
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    handleJoinCommunity(community._id)
                                  }
                                  className={`rounded-xl ${
                                    theme === "dark"
                                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                  }`}
                                >
                                  Join Community
                                </Button>
                              )} */}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "your" && (
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
                  <div className="p-6">
                    <h2
                      className={`text-2xl font-bold mb-6 ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      Your Communities
                    </h2>

                    {isLoading.user ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                      </div>
                    ) : userCommunities.length === 0 ? (
                      <div
                        className={`text-center py-12 rounded-xl ${
                          theme === "dark"
                            ? "bg-white/5 text-gray-300"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-60" />
                        <p className="text-lg">
                          You haven't joined any communities yet
                        </p>
                        <Button
                          onClick={() => setActiveTab("all")}
                          className={`mt-4 rounded-xl ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                          }`}
                        >
                          Explore Communities
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userCommunities.map((community) => (
                          <div
                            key={community._id}
                            className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                              theme === "dark"
                                ? "bg-white/5 border-white/10 hover:border-purple-400/30"
                                : "bg-white border-indigo-100 hover:border-indigo-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3
                                  className={`text-xl font-bold mb-1 ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-indigo-900"
                                  }`}
                                >
                                  {community.name}
                                </h3>
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-indigo-600"
                                  }`}
                                >
                                  Admin: {community.admin?.name}
                                </p>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  theme === "dark"
                                    ? "bg-purple-600/30 text-purple-300"
                                    : "bg-indigo-100 text-indigo-700"
                                }`}
                              >
                                Joined
                              </div>
                            </div>

                            <p
                              className={`mb-6 ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-indigo-700"
                              }`}
                            >
                              {community.description ||
                                "No description provided"}
                            </p>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Users
                                  className={`w-4 h-4 ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-indigo-500"
                                  }`}
                                />
                                <span
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-indigo-600"
                                  }`}
                                >
                                  {community.members?.length || 0} members
                                </span>
                              </div>

                              <Button
                                onClick={() =>
                                  router.push(`/community/${community._id}`)
                                }
                                className={`rounded-xl ${
                                  theme === "dark"
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                }`}
                              >
                                View Community
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "create" && (
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
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600"
                        } shadow-lg`}
                      >
                        <Plus className="w-8 h-8 text-white" />
                      </div>
                      <h2
                        className={`text-3xl font-black mb-2 ${
                          theme === "dark" ? "text-white" : "text-indigo-900"
                        }`}
                      >
                        Create New Community
                      </h2>
                      <p
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Start a new community and connect with like-minded
                        people
                      </p>
                    </div>

                    <form
                      onSubmit={handleCreateCommunity}
                      className="space-y-6"
                    >
                      <div>
                        <label
                          className={`block text-sm font-bold mb-3 ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          <Hash className="inline w-4 h-4 mr-2" />
                          Community Name
                        </label>
                        <Input
                          type="text"
                          value={createForm.name}
                          onChange={(e) =>
                            setCreateForm({
                              ...createForm,
                              name: e.target.value,
                            })
                          }
                          className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                            errors.name
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                              : theme === "dark"
                              ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                              : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                          }`}
                          placeholder="Enter a unique name for your community"
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
                          <MessageSquare className="inline w-4 h-4 mr-2" />
                          Description (Optional)
                        </label>
                        <textarea
                          value={createForm.description}
                          onChange={(e) =>
                            setCreateForm({
                              ...createForm,
                              description: e.target.value,
                            })
                          }
                          className={`w-full h-32 rounded-xl border-2 p-4 transition-all duration-300 focus:ring-4 ${
                            theme === "dark"
                              ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                              : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                          }`}
                          placeholder="What's this community about?"
                        />
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading.create}
                          className={`w-full h-14 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                        >
                          {isLoading.create ? (
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Creating...
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              Create Community
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
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
