"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Users,
  FileText,
  Bookmark,
  MessageSquare,
  Building,
  Edit,
  Camera,
  Loader2,
  ExternalLink,
  Heart,
  Eye,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";

export default function ProfilePage() {
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("overview");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // API Configuration
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3006/api";

  // Get auth token from localStorage or your auth context
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return Cookies.get("token") || null;
    }
    return null;
  };

  // Axios instance with auth header
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add auth token to requests
  apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/auth/profile");
      const user = response?.data?.user;

      const profileData = {
        // Basic user info
        id: user?._id || "1",
        name: user?.name || "John Doe",
        email: user?.email || "john.doe@example.com",
        username: user?.role || "johndoe",
        // profilePicture:
        //   user?.profilePicture || "/placeholder.svg?height=200&width=200",
        bio:
          user?.bio ||
          "Passionate developer and tech enthusiast. Love building innovative solutions and connecting with like-minded people.",
        joinedDate: user?.createdAt || new Date().toISOString(),
        location: user?.preferredLocation || "Unknown",
        
        mobile: user?.mobile || "",
        industry: user?.industry || "",
        interests: user?.interests || [],
        skills: user?.skills || [],
        payments: user?.payments || [],
        roles: user?.roles || [],

        // Education
        university: user?.university || "",
        graduationYear: user?.graduationYear || "",
        branch: user?.branch || "",
        rollNumber: user?.rollNumber || "",
        year: user?.year || "",

        // Social Links
        linkedinUrl: user?.linkedinUrl || "",
        resumeUrl: user?.resumeUrl || "",
        referredBy: user?.referredBy || "",
        website: user?.portfolioUrl || "https://example.dev",

        // Arrays (if any)
        posts: user?.posts || [],
        savedPosts: user?.savedPosts || [],
        comments: user?.comments || [],
        communities: user?.communitiesJoined || [],
        organisations:
          user?.organisation?.map((org) => ({
            id: org._id,
            name: org.name,
            // logo: "/placeholder.svg?height=50&width=50",
            // joinedDate: user?.createdAt || new Date().toISOString(), // fallback
            // role: "Member", // if no role provided, default
          })) || [],
        events: user?.eventsRegistered || [],

        // Stats (you can calculate from above arrays if needed)
        stats: {
          totalPosts: user?.posts?.length || 0,
          totalComments: user?.comments?.length || 0,
          totalLikes: 0,
          totalViews: 0,
          communitiesJoined: user?.communitiesJoined?.length || 0,
          eventsAttended: user?.eventsRegistered?.length || 0,
        },
      };

      setUserProfile(profileData);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    fetchUserProfile();
    console.log("fetchUserProfile called");
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "communities", label: "Communities", icon: Users },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "comments", label: "Comments", icon: MessageSquare },
    { id: "organizations", label: "Organizations", icon: Building },
    { id: "events", label: "Events", icon: Calendar },
  ];

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen transition-all duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"
            : "bg-gradient-to-br from-yellow-50 via-indigo-50 to-purple-50"
        }`}
      >
        <Navbar theme={theme} onThemeToggle={toggleTheme} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2
              className={`w-12 h-12 animate-spin mx-auto mb-4 ${
                theme === "dark" ? "text-purple-400" : "text-indigo-600"
              }`}
            />
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-indigo-700"
              }`}
            >
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`min-h-screen transition-all duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"
            : "bg-gradient-to-br from-yellow-50 via-indigo-50 to-purple-50"
        }`}
      >
        <Navbar theme={theme} onThemeToggle={toggleTheme} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div
              className={`text-6xl mb-4 ${
                theme === "dark" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              😞
            </div>
            <h3
              className={`text-2xl font-bold mb-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Error loading profile
            </h3>
            <p
              className={`text-lg mb-4 ${
                theme === "dark" ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {error}
            </p>
            <Button onClick={fetchUserProfile} className="px-6 py-2">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"
          : "bg-gradient-to-br from-yellow-50 via-indigo-50 to-purple-50"
      }`}
    >
      <Navbar theme={theme} onThemeToggle={toggleTheme} />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div
            className={`backdrop-blur-xl rounded-3xl border p-8 mb-8 ${
              theme === "dark"
                ? "bg-white/5 border-white/10"
                : "bg-white/80 border-indigo-200"
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Profile Picture and Basic Info */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                    <Image
                      src={userProfile.profilePicture || "/placeholder.svg"}
                      alt={userProfile.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <button
                    className={`absolute bottom-2 right-2 p-2 rounded-full backdrop-blur-xl border transition-all duration-300 hover:scale-110 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        : "bg-white/80 border-indigo-200 text-indigo-600 hover:bg-white"
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center sm:text-left">
                  <h1
                    className={`text-3xl font-black mb-2 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    {userProfile.name}
                  </h1>
                  <p
                    className={`text-lg mb-2 ${
                      theme === "dark" ? "text-purple-400" : "text-indigo-600"
                    }`}
                  >
                    @{userProfile.username}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {userProfile.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Joined{" "}
                        {new Date(userProfile.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                    {userProfile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin
                          className={`w-4 h-4 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {userProfile.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio and Actions */}
              <div className="flex-1">
                <p
                  className={`text-lg mb-6 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {userProfile.bio}
                </p>

                {userProfile.website && (
                  <a
                    href={userProfile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 mb-6 hover:underline ${
                      theme === "dark" ? "text-purple-400" : "text-indigo-600"
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {"LinkedIn"}
                  </a>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className={`px-6 py-2 rounded-xl font-bold ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    }`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {userProfile.stats.totalPosts}
                </div>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Posts
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {userProfile.stats.totalComments}
                </div>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Comments
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {userProfile.stats.totalLikes}
                </div>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Likes
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {userProfile.stats.totalViews}
                </div>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Views
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {userProfile.stats.communitiesJoined}
                </div>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Communities
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {userProfile.stats.eventsAttended}
                </div>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Events
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      activeTab === tab.id
                        ? theme === "dark"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : theme === "dark"
                        ? "bg-white/10 text-gray-300 hover:bg-white/20"
                        : "bg-white/80 text-indigo-700 hover:bg-white border border-indigo-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Posts */}
                <div
                  className={`backdrop-blur-xl rounded-3xl border p-6 ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10"
                      : "bg-white/80 border-indigo-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Recent Posts
                  </h3>
                  <div className="space-y-4">
                    {userProfile.posts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className={`p-4 rounded-xl border ${
                          theme === "dark"
                            ? "bg-white/5 border-white/10"
                            : "bg-indigo-50 border-indigo-200"
                        }`}
                      >
                        <h4
                          className={`font-bold mb-2 ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          {post.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className={`px-2 py-1 rounded-full ${
                              theme === "dark"
                                ? "bg-purple-900/50 text-purple-300"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {post.category}
                          </span>
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {new Date(post.createdDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Communities */}
                <div
                  className={`backdrop-blur-xl rounded-3xl border p-6 ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10"
                      : "bg-white/80 border-indigo-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Communities
                  </h3>
                  <div className="space-y-4">
                    {userProfile.communities.slice(0, 3).map((community) => (
                      <div
                        key={community.id}
                        className={`p-4 rounded-xl border ${
                          theme === "dark"
                            ? "bg-white/5 border-white/10"
                            : "bg-indigo-50 border-indigo-200"
                        }`}
                      >
                        <h4
                          className={`font-bold mb-1 ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          {community.name}
                        </h4>
                        <p
                          className={`text-sm mb-2 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {community.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Users
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {community.memberCount} members
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div
                className={`backdrop-blur-xl rounded-3xl border p-6 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white/80 border-indigo-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  My Posts ({userProfile.posts.length})
                </h3>
                <div className="grid gap-6">
                  {userProfile.posts.map((post) => (
                    <div
                      key={post.id}
                      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4
                          className={`text-lg font-bold ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          {post.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            theme === "dark"
                              ? "bg-purple-900/50 text-purple-300"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {post.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart
                              className={`w-4 h-4 ${
                                theme === "dark"
                                  ? "text-red-400"
                                  : "text-red-500"
                              }`}
                            />
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-700"
                              }`}
                            >
                              {post.likes}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare
                              className={`w-4 h-4 ${
                                theme === "dark"
                                  ? "text-blue-400"
                                  : "text-blue-500"
                              }`}
                            />
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-700"
                              }`}
                            >
                              {post.comments}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye
                              className={`w-4 h-4 ${
                                theme === "dark"
                                  ? "text-green-400"
                                  : "text-green-500"
                              }`}
                            />
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-700"
                              }`}
                            >
                              {post.views}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {new Date(post.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Communities Tab */}
            {activeTab === "communities" && (
              <div
                className={`backdrop-blur-xl rounded-3xl border p-6 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white/80 border-indigo-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  My Communities ({userProfile.communities.length})
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {userProfile.communities.map((community) => (
                    <div
                      key={community.id}
                      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4
                          className={`text-lg font-bold ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          {community.name}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            theme === "dark"
                              ? "bg-purple-900/50 text-purple-300"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {community.category}
                        </span>
                      </div>
                      <p
                        className={`text-sm mb-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {community.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {community.memberCount} members
                          </span>
                        </div>
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Joined{" "}
                          {new Date(community.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Posts Tab */}
            {activeTab === "saved" && (
              <div
                className={`backdrop-blur-xl rounded-3xl border p-6 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white/80 border-indigo-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Saved Posts ({userProfile.savedPosts.length})
                </h3>
                <div className="grid gap-6">
                  {userProfile.savedPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4
                          className={`text-lg font-bold ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          {post.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            theme === "dark"
                              ? "bg-purple-900/50 text-purple-300"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {post.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          By {post.author}
                        </span>
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Saved {new Date(post.savedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div
                className={`backdrop-blur-xl rounded-3xl border p-6 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white/80 border-indigo-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  My Comments ({userProfile.comments.length})
                </h3>
                <div className="space-y-6">
                  {userProfile.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      <p
                        className={`text-lg mb-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {`"${comment.text}"`}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-purple-400"
                              : "text-indigo-600"
                          }`}
                        >
                          On: {comment.postTitle}
                        </span>
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {new Date(comment.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizations Tab */}
            {activeTab === "organizations" && (
              <div
                className={`backdrop-blur-xl rounded-3xl border p-6 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white/80 border-indigo-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  My Organizations ({userProfile.organisations.length})
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {userProfile.organisations.map((org) => (
                    <div
                      key={org.id}
                      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={org.logo || "/placeholder.svg"}
                            alt={`${org.name} logo`}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4
                            className={`text-lg font-bold ${
                              theme === "dark"
                                ? "text-white"
                                : "text-indigo-900"
                            }`}
                          >
                            {org.name}
                          </h4>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-purple-400"
                                : "text-indigo-600"
                            }`}
                          >
                            {org.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Joined {new Date(org.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div
                className={`backdrop-blur-xl rounded-3xl border p-6 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white/80 border-indigo-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  My Events ({userProfile.events.length})
                </h3>
                <div className="grid gap-6">
                  {userProfile.events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4
                          className={`text-lg font-bold ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          {event.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            event.status === "Completed"
                              ? theme === "dark"
                                ? "bg-green-900/50 text-green-300"
                                : "bg-green-100 text-green-700"
                              : event.status === "Attending"
                              ? theme === "dark"
                                ? "bg-blue-900/50 text-blue-300"
                                : "bg-blue-100 text-blue-700"
                              : theme === "dark"
                              ? "bg-purple-900/50 text-purple-300"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {event.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        userProfile={userProfile}
        onUpdate={(updatedProfile) => {
          setUserProfile(updatedProfile);
          // Optionally refresh the profile data
          fetchUserProfile();
        }}
        theme={theme}
      />
    </div>
  );
}

// Edit Profile Modal Component
function EditProfileModal({ isOpen, onClose, userProfile, onUpdate, theme }) {
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    mobile: "",
    bio: "",
    preferredLocation: "",

    // Education
    year: "",
    branch: "",
    graduationYear: "",
    university: "",
    rollNumber: "",

    // Professional Details
    resumeURL: "",
    linkedinURL: "",
    portfolioURL: "",
    industry: "",
    roles: [],

    // Skills & Interests
    skills: [],
    interests: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  // Pre-fill form with existing user data
  useEffect(() => {
    if (userProfile && isOpen) {
      console.log("User Profile Data:", userProfile);
      setFormData({
        name: userProfile.name || "",
        mobile: userProfile.mobile || "",
        bio: userProfile.bio || "",
        preferredLocation:
          userProfile.preferredLocation || userProfile.location || "",
        year: userProfile.year || "",
        branch: userProfile.branch || "",
        graduationYear: userProfile?.graduationYear || "",
        university: userProfile?.university || "",
        rollNumber: userProfile?.rollNumber || "",
        resumeURL: userProfile.resumeUrl || "",
        linkedinURL: userProfile.linkedinUrl || "",
        portfolioURL: userProfile.portfolioUrl || "",
        industry: userProfile.industry || "",
        roles: userProfile.roles || [],
        skills: userProfile.skills || [],
        interests: userProfile.interests || [],
        roles: userProfile.roles || [],
      });
      setErrors({});
    }
  }, [userProfile, isOpen]);

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateURL = (url) => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateMobile = (mobile) => {
    if (!mobile) return true; // Optional field
    return /^[+]?[\d\s\-$$$$]{10,}$/.test(mobile);
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic Info validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.mobile && !validateMobile(formData.mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    if (formData.bio.length > 500) {
      newErrors.bio = "Bio must be 500 characters or less";
    }

    // Education validation
    if (formData.year && (formData.year < 1 || formData.year > 4)) {
      newErrors.year = "Year must be between 1 and 4";
    }

    if (formData.graduationYear) {
      const currentYear = new Date().getFullYear();
      if (
        formData.graduationYear < 1950 ||
        formData.graduationYear > currentYear + 10
      ) {
        newErrors.graduationYear = "Please enter a valid graduation year";
      }
    }

    // Professional Details validation
    if (formData.resumeURL && !validateURL(formData.resumeURL)) {
      newErrors.resumeURL = "Please enter a valid URL";
    }

    if (formData.linkedinURL && !validateURL(formData.linkedinURL)) {
      newErrors.linkedinURL = "Please enter a valid LinkedIn URL";
    }

    if (formData.portfolioURL && !validateURL(formData.portfolioURL)) {
      newErrors.portfolioURL = "Please enter a valid portfolio URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addArrayItem = (field, value, setter) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter("");
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = Cookies.get("token") || null;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/edit-profile`,
        {
          name: formData.name,
          mobile: formData.mobile,
          bio: formData.bio,
          preferredLocation: formData.preferredLocation,

          // Education
          year: formData.year ? Number.parseInt(formData.year) : null,
          branch: formData.branch,
          graduationYear: formData.graduationYear
            ? Number.parseInt(formData.graduationYear)
            : null,
          university: formData.university,
          rollNumber: formData.rollNumber,

          // Professional
          resumeUrl: formData.resumeURL,
          linkedinUrl: formData.linkedinURL,
          portfolioUrl: formData.portfolioURL,
          industry: formData.industry,
          roles: formData.roles,

          // Arrays
          skills: formData.skills,
          interests: formData.interests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        onUpdate(response.data); // Optional callback with updated data
        onClose(); // Close modal/dialog
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({
        submit: error?.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const years = [1, 2, 3, 4];
  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Media",
    "Government",
    "Non-profit",
    "Other",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border ${
          theme === "dark"
            ? "bg-slate-900/95 border-white/20"
            : "bg-white/95 border-indigo-200"
        }`}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-indigo-900"
              }`}
            >
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:scale-110 transition-transform ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-indigo-900"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div>
              <h3
                className={`text-lg font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-400"
                        : theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      errors.mobile
                        ? "border-red-500 focus:ring-red-400"
                        : theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="Enter your mobile number"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Bio ({formData.bio.length}/500)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                    maxLength={500}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      errors.bio
                        ? "border-red-500 focus:ring-red-400"
                        : theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    value={formData.preferredLocation}
                    onChange={(e) =>
                      handleInputChange("preferredLocation", e.target.value)
                    }
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="Enter your preferred location"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div>
              <h3
                className={`text-lg font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      errors.year
                        ? "border-red-500 focus:ring-red-400"
                        : theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Branch
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) =>
                      handleInputChange("branch", e.target.value)
                    }
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) =>
                      handleInputChange("graduationYear", e.target.value)
                    }
                    min="1950"
                    max={new Date().getFullYear() + 10}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      errors.graduationYear
                        ? "border-red-500 focus:ring-red-400"
                        : theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="e.g., 2024"
                  />
                  {errors.graduationYear && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.graduationYear}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    University
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) =>
                      handleInputChange("university", e.target.value)
                    }
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="Enter your university name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) =>
                      handleInputChange("rollNumber", e.target.value)
                    }
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="Enter your roll number"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div>
              <h3
                className={`text-lg font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Resume URL
                  </label>
                  <input
                    type="url"
                    value={formData.resumeURL}
                    onChange={(e) =>
                      handleInputChange("resumeURL", e.target.value)
                    }
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      errors.resumeURL
                        ? "border-red-500 focus:ring-red-400"
                        : theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="https://example.com/resume.pdf"
                  />
                  {errors.resumeURL && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.resumeURL}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinURL}
                    onChange={(e) =>
                      handleInputChange("linkedinURL", e.target.value)
                    }
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      errors.linkedinURL
                        ? "border-red-500 focus:ring-red-400"
                        : theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="https://linkedin.com/in/username"
                  />
                  {errors.linkedinURL && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.linkedinURL}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioURL}
                    onChange={(e) =>
                      handleInputChange("portfolioURL", e.target.value)
                    }
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      errors.portfolioURL
                        ? "border-red-500 focus:ring-red-400"
                        : theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                    placeholder="https://yourportfolio.com"
                  />
                  {errors.portfolioURL && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.portfolioURL}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) =>
                      handleInputChange("industry", e.target.value)
                    }
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                        : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Roles */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Roles
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(),
                        addArrayItem("roles", newRole, setNewRole))
                      }
                      className={`flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                          : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                      }`}
                      placeholder="Add a role (e.g., Frontend Developer)"
                    />
                    <Button
                      type="button"
                      onClick={() => addArrayItem("roles", newRole, setNewRole)}
                      className="px-4 py-3 rounded-xl"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.roles.map((role, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                          theme === "dark"
                            ? "bg-purple-900/50 text-purple-300"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => removeArrayItem("roles", index)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Interests Section */}
            <div>
              <h3
                className={`text-lg font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                Skills & Interests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(),
                        addArrayItem("skills", newSkill, setNewSkill))
                      }
                      className={`flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                          : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                      }`}
                      placeholder="Add a skill (e.g., React)"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        addArrayItem("skills", newSkill, setNewSkill)
                      }
                      className="px-4 py-3 rounded-xl"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                          theme === "dark"
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeArrayItem("skills", index)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Interests
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(),
                        addArrayItem("interests", newInterest, setNewInterest))
                      }
                      className={`flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                          : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                      }`}
                      placeholder="Add an interest (e.g., Machine Learning)"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        addArrayItem("interests", newInterest, setNewInterest)
                      }
                      className="px-4 py-3 rounded-xl"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                          theme === "dark"
                            ? "bg-green-900/50 text-green-300"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeArrayItem("interests", index)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 rounded-xl bg-red-100 border border-red-200 text-red-700">
                {errors.submit}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <Button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-xl font-bold ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className={`px-8 py-3 rounded-xl font-bold border-2 ${
                  theme === "dark"
                    ? "border-white/20 text-indigo-700 hover:bg-white/10"
                    : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
