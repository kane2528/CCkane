"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import {
  Search,
  Edit,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Building,
  Eye,
  Loader2,
  X,
  Save,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";

export default function OrganizationsPage() {
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showOrgDetails, setShowOrgDetails] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [editingOrg, setEditingOrg] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // API Configuration
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3006";

  // Get auth token from localStorage or your auth context
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return Cookies.get("token");
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

  // New Event State
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    category: "Tech",
    eventDate: "",
    eventStart: "",
    eventEnd: "",
    eventType: {
      type: "Offline",
      locationDetails: "",
    },
    registrationDeadline: "",
    maxParticipants: "",
    tags: "",
    bannerImage: "",
  });

  // Event Categories
  const eventCategories = [
    "Tech",
    "Cultural",
    "Sports",
    "Workshop",
    "Webinar",
    "Other",
  ];

  // Event Types
  const eventTypes = ["Offline", "Online"];

  // Fetch organizations from API
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/auth/get-organisations-for-admin");
      if (response.data && response.data.organisations) {
        const firstOrgId = response.data.organisations[0]?._id;
        if (firstOrgId) {
          Cookies.set("orgId", firstOrgId, { expires: 7 }); // Expires in 7 days
          console.log("Organization ID cookie set:", firstOrgId);
        }
        // Transform API data to match our component structure
        const transformedOrgs = response.data.organisations.map((org) => ({
          id: org._id,
          name: org.name || "Unnamed Organization",
          description: org.description || "",
          type: org.type || "General",
          category: org.category || "Other",
          website: org.website || "",
          email: org.email || "",
          phone: org.phone || "",
          address: org.address || "",
          city: org.city || "",
          state: org.state || "",
          country: org.country || "",
          logo: org.logo || "/placeholder.svg?height=200&width=200",
          banner: org.banner || "/placeholder.svg?height=300&width=600",
          establishedYear: org.establishedYear || "",
          memberCount: org.memberCount || 0,
          eventsCount: org.events?.length || 0,
          socialLinks: org.socialLinks || {},
          status: org.status || "Active",
          createdAt: org.createdAt,
          updatedAt: org.updatedAt,
        }));
        setOrganizations(transformedOrgs);
      }
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setError(err.response?.data?.message || "Failed to fetch organizations");
      // Fallback to sample data for development
      setOrganizations([
        {
          id: 1,
          name: "Tech Innovation Club",
          description:
            "A community of tech enthusiasts working on cutting-edge projects and innovations.",
          type: "Club",
          category: "Tech",
          website: "https://techinnovation.club",
          email: "contact@techinnovation.club",
          phone: "+91 98765 43210",
          address: "123 Tech Street",
          city: "Bangalore",
          state: "Karnataka",
          country: "India",
          logo: "/placeholder.svg?height=200&width=200",
          banner: "/placeholder.svg?height=300&width=600",
          establishedYear: "2020",
          memberCount: 150,
          eventsCount: 12,
          socialLinks: {
            twitter: "https://twitter.com/techinnovation",
            linkedin: "https://linkedin.com/company/techinnovation",
          },
          status: "Active",
          createdAt: "2023-01-15T00:00:00.000Z",
        },
        {
          id: 2,
          name: "Entrepreneurship Cell",
          description:
            "Fostering entrepreneurial spirit and supporting startup initiatives among students.",
          type: "Cell",
          category: "Business",
          website: "https://ecell.university.edu",
          email: "info@ecell.university.edu",
          phone: "+91 87654 32109",
          address: "456 Business Avenue",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          logo: "/placeholder.svg?height=200&width=200",
          banner: "/placeholder.svg?height=300&width=600",
          establishedYear: "2018",
          memberCount: 200,
          eventsCount: 8,
          socialLinks: {
            instagram: "https://instagram.com/ecell_university",
            facebook: "https://facebook.com/ecell.university",
          },
          status: "Active",
          createdAt: "2023-02-20T00:00:00.000Z",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const [newOrg, setNewOrg] = useState({
    name: "",
    description: "",
    type: "Club",
    category: "Tech",
    website: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    establishedYear: "",
    socialLinks: {
      website: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      facebook: "",
    },
  });

  // Filter organizations based on search
  const filteredOrganizations = organizations.filter((org) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      org.name.toLowerCase().includes(searchLower) ||
      org.description.toLowerCase().includes(searchLower) ||
      org.type.toLowerCase().includes(searchLower) ||
      org.category.toLowerCase().includes(searchLower) ||
      org.city.toLowerCase().includes(searchLower)
    );
  });

  const handleAddOrganization = async () => {
    if (newOrg.name && newOrg.description) {
      try {
        // Prepare data for API
        const orgData = {
          name: newOrg.name,
          description: newOrg.description,
          type: newOrg.type,
          category: newOrg.category,
          website: newOrg.website,
          email: newOrg.email,
          phone: newOrg.phone,
          address: newOrg.address,
          city: newOrg.city,
          state: newOrg.state,
          country: newOrg.country,
          establishedYear: newOrg.establishedYear
            ? Number.parseInt(newOrg.establishedYear)
            : null,
          socialLinks: newOrg.socialLinks,
        };

        // Make API call to create organization
        const response = await apiClient.post("/create-organisation", orgData);
        if (response.data) {
          // Refresh organizations list
          await fetchOrganizations();
          // Reset form
          setNewOrg({
            name: "",
            description: "",
            type: "Club",
            category: "Tech",
            website: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            country: "",
            establishedYear: "",
            socialLinks: {
              website: "",
              twitter: "",
              linkedin: "",
              instagram: "",
              facebook: "",
            },
          });
          setShowOrgModal(false);
        }
      } catch (err) {
        console.error("Error creating organization:", err);
        setError(
          err.response?.data?.message || "Failed to create organization"
        );
      }
    }
  };

  const handleEditOrganization = (org) => {
    setEditingOrg({
      ...org,
      socialLinks: org.socialLinks || {
        website: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        facebook: "",
      },
    });
    setShowOrgModal(true);
  };

  const handleUpdateOrganization = async () => {
    if (editingOrg.name && editingOrg.description) {
      try {
        // Prepare data for API
        const orgData = {
          name: editingOrg.name,
          description: editingOrg.description,
          type: editingOrg.type,
          category: editingOrg.category,
          website: editingOrg.website,
          email: editingOrg.email,
          phone: editingOrg.phone,
          address: editingOrg.address,
          city: editingOrg.city,
          state: editingOrg.state,
          country: editingOrg.country,
          establishedYear: editingOrg.establishedYear
            ? Number.parseInt(editingOrg.establishedYear)
            : null,
          socialLinks: editingOrg.socialLinks,
        };

        // Make API call to update organization
        const response = await apiClient.put(
          `/update-organisation/${editingOrg.id}`,
          orgData
        );
        if (response.data) {
          // Refresh organizations list
          await fetchOrganizations();
          setEditingOrg(null);
          setShowOrgModal(false);
        }
      } catch (err) {
        console.error("Error updating organization:", err);
        setError(
          err.response?.data?.message || "Failed to update organization"
        );
      }
    }
  };

  const handleDeleteOrganization = async (orgId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this organization? This action cannot be undone."
      )
    ) {
      try {
        await apiClient.delete(`/delete-organisation/${orgId}`);
        // Refresh organizations list
        await fetchOrganizations();
      } catch (err) {
        console.error("Error deleting organization:", err);
        setError(
          err.response?.data?.message || "Failed to delete organization"
        );
      }
    }
  };

  const openOrgDetails = (org) => {
    setSelectedOrg(org);
    setShowOrgDetails(true);
  };

  // Handle Add Event
  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.description && selectedOrg) {
      try {
        const startDateTime = new Date(
          `${newEvent.eventDate}T${newEvent.eventStart}`
        );
        const endDateTime = new Date(
          `${newEvent.eventDate}T${newEvent.eventEnd}`
        );
        // Prepare event data for API
        const eventData = {
          title: newEvent.title,
          description: newEvent.description,
          category: newEvent.category,
          eventDate: new Date(newEvent.eventDate),
          eventStart: startDateTime.toISOString(),
          eventEnd: endDateTime.toISOString(),
          eventType: {
            type: newEvent.eventType.type,
            locationDetails: newEvent.eventType.locationDetails,
          },
          registrationDeadline: new Date(
            newEvent.registrationDeadline
          ).toISOString(),
          maxParticipants: newEvent.maxParticipants
            ? Number.parseInt(newEvent.maxParticipants)
            : null,
          tags: newEvent.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          bannerImage: newEvent.bannerImage,
        };

        // const eventData = {
        //   title: newEvent.title,
        //   description: newEvent.description,
        //   category: newEvent.category,
        //   eventDate: newEvent.eventDate,
        //   eventStart: newEvent.eventStart,
        //   eventEnd: newEvent.eventEnd,
        //   eventType: {
        //     type: newEvent.eventType.type,
        //     locationDetails: newEvent.eventType.locationDetails,
        //   },
        //   registrationDeadline: newEvent.registrationDeadline,
        //   maxParticipants: newEvent.maxParticipants
        //     ? Number.parseInt(newEvent.maxParticipants)
        //     : null,
        //   tags: newEvent.tags
        //     .split(",")
        //     .map((tag) => tag.trim())
        //     .filter((tag) => tag),
        //   bannerImage: newEvent.bannerImage,
        //   organizationId: selectedOrg.id, // Pass the organization ID
        // };

        // Make API call to create event
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/event/add-event/${selectedOrg.id}`,
          eventData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        if (response.data) {
          // Reset form
          setNewEvent({
            title: "",
            description: "",
            category: "Tech",
            eventDate: "",
            eventStart: "",
            eventEnd: "",
            eventType: {
              type: "Offline",
              locationDetails: "",
            },
            registrationDeadline: "",
            maxParticipants: "",
            tags: "",
            bannerImage: "",
          });
          setShowEventModal(false);
          // Optionally refresh organizations to update event count
          await fetchOrganizations();
        }
      } catch (err) {
        console.error("Error creating event:", err);
        setError(err.response?.data?.message || "Failed to create event");
      }
    }
  };

  const currentOrg = editingOrg || newOrg;

  const orgTypes = [
    "Club",
    "Cell",
    "Society",
    "Committee",
    "Department",
    "Institute",
    "Foundation",
    "Other",
  ];

  const orgCategories = [
    "Tech",
    "Cultural",
    "Sports",
    "Workshop",
    "Webinar",
    "Other",
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
              Loading organizations...
            </p>
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
        <section className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1
                className={`text-4xl md:text-5xl font-black mb-6 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                My{" "}
                <span
                  className={`text-transparent bg-clip-text ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-400 to-yellow-300"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  Organizations
                </span>
              </h1>
              <p
                className={`text-xl max-w-2xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Manage and oversee the organizations you lead
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className={`mb-6 p-4 rounded-xl border ${
                  theme === "dark"
                    ? "bg-red-900/20 border-red-500/30 text-red-300"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <p className="font-medium">Error: {error}</p>
                <button
                  onClick={fetchOrganizations}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Search and Add Organization */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 ${
                    theme === "dark" ? "text-gray-400" : "text-indigo-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search organizations by name, type, category, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-14 pr-6 py-4 rounded-2xl text-lg font-medium border-2 focus:outline-none focus:ring-4 ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
              </div>
            </div>

            {/* Organizations Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white/80 border-indigo-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building
                    className={`w-8 h-8 ${
                      theme === "dark" ? "text-purple-400" : "text-indigo-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      {organizations.length}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-indigo-600"
                      }`}
                    >
                      Total Organizations
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white/80 border-indigo-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users
                    className={`w-8 h-8 ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      {organizations.reduce(
                        (total, org) => total + org.memberCount,
                        0
                      )}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-indigo-600"
                      }`}
                    >
                      Total Members
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white/80 border-indigo-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar
                    className={`w-8 h-8 ${
                      theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      {organizations.reduce(
                        (total, org) => total + org.eventsCount,
                        0
                      )}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-indigo-600"
                      }`}
                    >
                      Total Events
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white/80 border-indigo-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building
                    className={`w-8 h-8 ${
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      {
                        organizations.filter((org) => org.status === "Active")
                          .length
                      }
                    </p>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-indigo-600"
                      }`}
                    >
                      Active Orgs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizations Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrganizations.map((org) => (
                <div
                  key={org.id}
                  className={`group relative backdrop-blur-xl rounded-3xl overflow-hidden border transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ${
                    theme === "dark"
                      ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
                      : "bg-white/80 hover:bg-white border-indigo-200 hover:border-indigo-300"
                  }`}
                >
                  {/* Organization Type Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        theme === "dark"
                          ? "bg-purple-900/80 text-purple-300"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {org.type}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        org.status === "Active"
                          ? theme === "dark"
                            ? "bg-green-900/80 text-green-300"
                            : "bg-green-100 text-green-700"
                          : theme === "dark"
                          ? "bg-red-900/80 text-red-300"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {org.status}
                    </span>
                  </div>

                  {/* Organization Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={org.banner || "/placeholder.svg"}
                      alt={org.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Organization Logo */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/20 backdrop-blur-sm">
                        <Image
                          src={org.logo || "/placeholder.svg"}
                          alt={`${org.name} logo`}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Organization Content */}
                  <div className="p-6">
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      {org.name}
                    </h3>
                    <p
                      className={`text-sm mb-4 line-clamp-2 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      {org.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Building
                          className={`w-4 h-4 ${
                            theme === "dark"
                              ? "text-purple-400"
                              : "text-indigo-600"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          {org.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin
                          className={`w-4 h-4 ${
                            theme === "dark"
                              ? "text-purple-400"
                              : "text-indigo-600"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          {org.city}, {org.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users
                          className={`w-4 h-4 ${
                            theme === "dark"
                              ? "text-purple-400"
                              : "text-indigo-600"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          {org.memberCount} members
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar
                          className={`w-4 h-4 ${
                            theme === "dark"
                              ? "text-purple-400"
                              : "text-indigo-600"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          {org.eventsCount} events
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => openOrgDetails(org)}
                      className={`w-full py-3 rounded-xl font-bold transform hover:scale-105 transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      }`}
                    >
                      <Eye className="w-4 h-4 mr-2 inline" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredOrganizations.length === 0 && !loading && (
              <div className="text-center py-12">
                <div
                  className={`text-6xl mb-4 ${
                    theme === "dark" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  🏢
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No organizations found
                </h3>
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Create your first organization to get started"}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add/Edit Organization Modal */}
      {showOrgModal && (
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
                  {editingOrg ? "Edit Organization" : "Add New Organization"}
                </h2>
                <button
                  onClick={() => {
                    setShowOrgModal(false);
                    setEditingOrg(null);
                  }}
                  className={`p-2 rounded-full hover:scale-110 transition-transform ${
                    theme === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-indigo-900"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                {/* Basic Information */}
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
                        Organization Name *
                      </label>
                      <input
                        type="text"
                        value={currentOrg.name}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                name: e.target.value,
                              })
                            : setNewOrg({ ...newOrg, name: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="Enter organization name"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Type
                      </label>
                      <select
                        value={currentOrg.type}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                type: e.target.value,
                              })
                            : setNewOrg({ ...newOrg, type: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                      >
                        {orgTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Category
                      </label>
                      <select
                        value={currentOrg.category}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                category: e.target.value,
                              })
                            : setNewOrg({ ...newOrg, category: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                      >
                        {orgCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Established Year
                      </label>
                      <input
                        type="number"
                        value={currentOrg.establishedYear}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                establishedYear: e.target.value,
                              })
                            : setNewOrg({
                                ...newOrg,
                                establishedYear: e.target.value,
                              })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="e.g., 2020"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      Description *
                    </label>
                    <textarea
                      value={currentOrg.description}
                      onChange={(e) =>
                        editingOrg
                          ? setEditingOrg({
                              ...editingOrg,
                              description: e.target.value,
                            })
                          : setNewOrg({
                              ...newOrg,
                              description: e.target.value,
                            })
                      }
                      rows={3}
                      className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                          : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                      }`}
                      placeholder="Enter organization description"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={currentOrg.email}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                email: e.target.value,
                              })
                            : setNewOrg({ ...newOrg, email: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={currentOrg.phone}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                phone: e.target.value,
                              })
                            : setNewOrg({ ...newOrg, phone: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      value={currentOrg.website}
                      onChange={(e) =>
                        editingOrg
                          ? setEditingOrg({
                              ...editingOrg,
                              website: e.target.value,
                            })
                          : setNewOrg({ ...newOrg, website: e.target.value })
                      }
                      className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                          : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                      }`}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        value={currentOrg.address}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                address: e.target.value,
                              })
                            : setNewOrg({ ...newOrg, address: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="Enter street address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          City
                        </label>
                        <input
                          type="text"
                          value={currentOrg.city}
                          onChange={(e) =>
                            editingOrg
                              ? setEditingOrg({
                                  ...editingOrg,
                                  city: e.target.value,
                                })
                              : setNewOrg({ ...newOrg, city: e.target.value })
                          }
                          className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                            theme === "dark"
                              ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                              : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                          }`}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          State
                        </label>
                        <input
                          type="text"
                          value={currentOrg.state}
                          onChange={(e) =>
                            editingOrg
                              ? setEditingOrg({
                                  ...editingOrg,
                                  state: e.target.value,
                                })
                              : setNewOrg({ ...newOrg, state: e.target.value })
                          }
                          className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                            theme === "dark"
                              ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                              : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                          }`}
                          placeholder="Enter state"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          value={currentOrg.country}
                          onChange={(e) =>
                            editingOrg
                              ? setEditingOrg({
                                  ...editingOrg,
                                  country: e.target.value,
                                })
                              : setNewOrg({
                                  ...newOrg,
                                  country: e.target.value,
                                })
                          }
                          className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                            theme === "dark"
                              ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                              : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                          }`}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Social Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={currentOrg.socialLinks?.twitter || ""}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                socialLinks: {
                                  ...editingOrg.socialLinks,
                                  twitter: e.target.value,
                                },
                              })
                            : setNewOrg({
                                ...newOrg,
                                socialLinks: {
                                  ...newOrg.socialLinks,
                                  twitter: e.target.value,
                                },
                              })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={currentOrg.socialLinks?.linkedin || ""}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                socialLinks: {
                                  ...editingOrg.socialLinks,
                                  linkedin: e.target.value,
                                },
                              })
                            : setNewOrg({
                                ...newOrg,
                                socialLinks: {
                                  ...newOrg.socialLinks,
                                  linkedin: e.target.value,
                                },
                              })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="https://linkedin.com/company/name"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={currentOrg.socialLinks?.instagram || ""}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                socialLinks: {
                                  ...editingOrg.socialLinks,
                                  instagram: e.target.value,
                                },
                              })
                            : setNewOrg({
                                ...newOrg,
                                socialLinks: {
                                  ...newOrg.socialLinks,
                                  instagram: e.target.value,
                                },
                              })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={currentOrg.socialLinks?.facebook || ""}
                        onChange={(e) =>
                          editingOrg
                            ? setEditingOrg({
                                ...editingOrg,
                                socialLinks: {
                                  ...editingOrg.socialLinks,
                                  facebook: e.target.value,
                                },
                              })
                            : setNewOrg({
                                ...newOrg,
                                socialLinks: {
                                  ...newOrg.socialLinks,
                                  facebook: e.target.value,
                                },
                              })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="https://facebook.com/page"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button
                  onClick={
                    editingOrg
                      ? handleUpdateOrganization
                      : handleAddOrganization
                  }
                  className={`flex-1 py-3 rounded-xl font-bold ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {editingOrg ? "Update Organization" : "Create Organization"}
                </Button>
                <Button
                  onClick={() => {
                    setShowOrgModal(false);
                    setEditingOrg(null);
                  }}
                  variant="outline"
                  className={`px-8 py-3 rounded-xl font-bold border-2 ${
                    theme === "dark"
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Organization Details Modal */}
      {showOrgDetails && selectedOrg && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border ${
              theme === "dark"
                ? "bg-slate-900/95 border-white/20"
                : "bg-white/95 border-indigo-200"
            }`}
          >
            <div className="relative">
              {/* Organization Banner */}
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <Image
                  src={selectedOrg.banner || "/placeholder.svg"}
                  alt={selectedOrg.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button
                  onClick={() => setShowOrgDetails(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 backdrop-blur-sm">
                    <Image
                      src={selectedOrg.logo || "/placeholder.svg"}
                      alt={`${selectedOrg.name} logo`}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        theme === "dark"
                          ? "bg-purple-900/80 text-purple-300"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {selectedOrg.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2
                      className={`text-3xl font-bold mb-2 ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      {selectedOrg.name}
                    </h2>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      {selectedOrg.category} • Established{" "}
                      {selectedOrg.establishedYear}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      selectedOrg.status === "Active"
                        ? theme === "dark"
                          ? "bg-green-900/50 text-green-300"
                          : "bg-green-100 text-green-700"
                        : theme === "dark"
                        ? "bg-red-900/50 text-red-300"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedOrg.status}
                  </span>
                </div>
                <p
                  className={`text-lg mb-8 ${
                    theme === "dark" ? "text-gray-300" : "text-indigo-700"
                  }`}
                >
                  {selectedOrg.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <h3
                        className={`text-xl font-bold mb-4 ${
                          theme === "dark" ? "text-white" : "text-indigo-900"
                        }`}
                      >
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        {selectedOrg.email && (
                          <div className="flex items-center gap-3">
                            <Mail
                              className={`w-5 h-5 ${
                                theme === "dark"
                                  ? "text-purple-400"
                                  : "text-indigo-600"
                              }`}
                            />
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-indigo-700"
                              }`}
                            >
                              {selectedOrg.email}
                            </span>
                          </div>
                        )}
                        {selectedOrg.phone && (
                          <div className="flex items-center gap-3">
                            <Phone
                              className={`w-5 h-5 ${
                                theme === "dark"
                                  ? "text-purple-400"
                                  : "text-indigo-600"
                              }`}
                            />
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-indigo-700"
                              }`}
                            >
                              {selectedOrg.phone}
                            </span>
                          </div>
                        )}
                        {selectedOrg.website && (
                          <div className="flex items-center gap-3">
                            <Building
                              className={`w-5 h-5 ${
                                theme === "dark"
                                  ? "text-purple-400"
                                  : "text-indigo-600"
                              }`}
                            />
                            <a
                              href={selectedOrg.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`hover:underline ${
                                theme === "dark"
                                  ? "text-purple-400"
                                  : "text-indigo-600"
                              }`}
                            >
                              {selectedOrg.website}
                            </a>
                          </div>
                        )}
                        {(selectedOrg.address || selectedOrg.city) && (
                          <div className="flex items-start gap-3">
                            <MapPin
                              className={`w-5 h-5 mt-0.5 ${
                                theme === "dark"
                                  ? "text-purple-400"
                                  : "text-indigo-600"
                              }`}
                            />
                            <div
                              className={`${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-indigo-700"
                              }`}
                            >
                              {selectedOrg.address && (
                                <div>{selectedOrg.address}</div>
                              )}
                              <div>
                                {selectedOrg.city}
                                {selectedOrg.state && `, ${selectedOrg.state}`}
                                {selectedOrg.country &&
                                  `, ${selectedOrg.country}`}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3
                        className={`text-xl font-bold mb-4 ${
                          theme === "dark" ? "text-white" : "text-indigo-900"
                        }`}
                      >
                        Statistics
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`p-4 rounded-xl border ${
                            theme === "dark"
                              ? "bg-white/5 border-white/10"
                              : "bg-indigo-50 border-indigo-200"
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              theme === "dark"
                                ? "text-white"
                                : "text-indigo-900"
                            }`}
                          >
                            {selectedOrg.memberCount}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-indigo-600"
                            }`}
                          >
                            Members
                          </div>
                        </div>
                        <div
                          className={`p-4 rounded-xl border ${
                            theme === "dark"
                              ? "bg-white/5 border-white/10"
                              : "bg-indigo-50 border-indigo-200"
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              theme === "dark"
                                ? "text-white"
                                : "text-indigo-900"
                            }`}
                          >
                            {selectedOrg.eventsCount}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-indigo-600"
                            }`}
                          >
                            Events
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedOrg.socialLinks &&
                      Object.values(selectedOrg.socialLinks).some(
                        (link) => link
                      ) && (
                        <div>
                          <h3
                            className={`text-xl font-bold mb-4 ${
                              theme === "dark"
                                ? "text-white"
                                : "text-indigo-900"
                            }`}
                          >
                            Social Links
                          </h3>
                          <div className="space-y-2">
                            {selectedOrg.socialLinks.twitter && (
                              <a
                                href={selectedOrg.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block hover:underline ${
                                  theme === "dark"
                                    ? "text-purple-400"
                                    : "text-indigo-600"
                                }`}
                              >
                                Twitter
                              </a>
                            )}
                            {selectedOrg.socialLinks.linkedin && (
                              <a
                                href={selectedOrg.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block hover:underline ${
                                  theme === "dark"
                                    ? "text-purple-400"
                                    : "text-indigo-600"
                                }`}
                              >
                                LinkedIn
                              </a>
                            )}
                            {selectedOrg.socialLinks.instagram && (
                              <a
                                href={selectedOrg.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block hover:underline ${
                                  theme === "dark"
                                    ? "text-purple-400"
                                    : "text-indigo-600"
                                }`}
                              >
                                Instagram
                              </a>
                            )}
                            {selectedOrg.socialLinks.facebook && (
                              <a
                                href={selectedOrg.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block hover:underline ${
                                  theme === "dark"
                                    ? "text-purple-400"
                                    : "text-indigo-600"
                                }`}
                              >
                                Facebook
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowEventModal(true)}
                    className={`flex-1 py-3 rounded-xl font-bold ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    }`}
                  >
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                  <Button
                    onClick={() => {
                      setShowOrgDetails(false);
                      handleEditOrganization(selectedOrg);
                    }}
                    className={`flex-1 py-3 rounded-xl font-bold ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    }`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Organization
                  </Button>
                  <Button
                    onClick={() => setShowOrgDetails(false)}
                    variant="outline"
                    className={`px-8 py-3 rounded-xl font-bold border-2 ${
                      theme === "dark"
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    }`}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showEventModal && selectedOrg && (
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
                  Add New Event for {selectedOrg.name}
                </h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className={`p-2 rounded-full hover:scale-110 transition-transform ${
                    theme === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-indigo-900"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Event Information */}
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
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, title: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Category
                      </label>
                      <select
                        value={newEvent.category}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, category: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                      >
                        {eventCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      Description *
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                          : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                      }`}
                      placeholder="Enter event description"
                    />
                  </div>
                </div>

                {/* Date and Time Information */}
                <div>
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Date & Time
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Event Date *
                      </label>
                      <input
                        type="date"
                        value={newEvent.eventDate}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            eventDate: e.target.value,
                          })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={newEvent.eventStart}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            eventStart: e.target.value,
                          })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        End Time *
                      </label>
                      <input
                        type="time"
                        value={newEvent.eventEnd}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, eventEnd: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Event Type and Location */}
                <div>
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Event Type & Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Event Type *
                      </label>
                      <select
                        value={newEvent.eventType.type}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            eventType: {
                              ...newEvent.eventType,
                              type: e.target.value,
                            },
                          })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                      >
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Location Details *
                      </label>
                      <input
                        type="text"
                        value={newEvent.eventType.locationDetails}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            eventType: {
                              ...newEvent.eventType,
                              locationDetails: e.target.value,
                            },
                          })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder={
                          newEvent.eventType.type === "Virtual"
                            ? "Meeting link or platform"
                            : newEvent.eventType.type === "Hybrid"
                            ? "Physical address + Meeting link"
                            : "Physical address or venue"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Registration and Participation */}
                <div>
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Registration & Participation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Registration Deadline
                      </label>
                      <input
                        type="datetime-local"
                        value={newEvent.registrationDeadline}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            registrationDeadline: e.target.value,
                          })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Max Participants
                      </label>
                      <input
                        type="number"
                        value={newEvent.maxParticipants}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            maxParticipants: e.target.value,
                          })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="Leave empty for unlimited"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Tags
                      </label>
                      <input
                        type="text"
                        value={newEvent.tags}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, tags: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="Enter tags separated by commas (e.g., workshop, networking, tech)"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Banner Image URL
                      </label>
                      <input
                        type="url"
                        value={newEvent.bannerImage}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            bannerImage: e.target.value,
                          })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="https://example.com/banner-image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={handleAddEvent}
                  className={`flex-1 py-3 rounded-xl font-bold ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  }`}
                >
                  <CalendarPlus className="w-5 h-5 mr-2" />
                  Create Event
                </Button>
                <Button
                  onClick={() => setShowEventModal(false)}
                  variant="outline"
                  className={`px-8 py-3 rounded-xl font-bold border-2 ${
                    theme === "dark"
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
