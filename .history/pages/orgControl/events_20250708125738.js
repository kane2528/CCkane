"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import {
  Search,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import RoleBasedAccess from "@/components/RoleBasedAccess";

export default function EventsPage() {
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminOrganizations, setAdminOrganizations] = useState([]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const categories = [
    "All",
    "Technology",
    "Business",
    "Workshop",
    "Hackathon",
    "Conference",
    "Networking",
    "Sports",
    "Cultural",
  ];

  const eventTypes = ["Offline", "Online"];

  // API Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

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

  // Helper function to safely extract string values
  const safeString = (value) => {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      // Handle location object
      if (value.locationDetails) return value.locationDetails;
      if (value.type && value.locationDetails)
        return `${value.type}: ${value.locationDetails}`;
      // Handle other object types
      if (value.name) return value.name;
      if (value.title) return value.title;
      // Convert object to string as fallback
      return JSON.stringify(value);
    }
    return value ? String(value) : "";
  };

  // Helper function to safely extract array values
  const safeArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string")
      return value.split(",").map((item) => item.trim());
    return [];
  };

  // Fetch events from API
  // const fetchEvents = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const orgResponse = await apiClient.get("/api/event/get-admin-events");
  //     const organizations = orgResponse.data?.data || [];
  //     setAdminOrganizations(organizations);

  //     const response = await apiClient.get("/api/event/get-upcoming-events");
  //     if (response.data && response.data.events) {
  //       const transformedEvents = response.data.events.map((event) => ({
  //         id: event._id,
  //         title: safeString(event.title),
  //         name: safeString(event.title), // Keep for backward compatibility
  //         description: safeString(event.description),
  //         category: safeString(event.category),
  //         eventDate: event.eventDate
  //           ? new Date(event.eventDate).toISOString().split("T")[0]
  //           : "",
  //         eventStart: event.eventStart
  //           ? new Date(event.eventStart).toTimeString().slice(0, 5)
  //           : "",
  //         eventEnd: event.eventEnd
  //           ? new Date(event.eventEnd).toTimeString().slice(0, 5)
  //           : "",
  //         registrationDeadline: event.registrationDeadline
  //           ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
  //           : "",
  //         maxParticipants: event.maxParticipants || 0,
  //         tags: safeArray(event.tags),
  //         bannerImage:
  //           safeString(event.bannerImage) ||
  //           "/placeholder.svg?height=200&width=400",
  //         hostedBy: safeString(event.organiser?.name) || "Unknown Organizer",
  //         eventType: {
  //           type: safeString(event.eventType?.type) || "offline",
  //           locationDetails: safeString(event.eventType?.locationDetails) || "",
  //         },
  //         // Additional fields for display
  //         type: safeString(event.eventType?.type) || "General",
  //         date: event.eventDate
  //           ? new Date(event.eventDate).toISOString().split("T")[0]
  //           : "",
  //         time:
  //           event.eventStart && event.eventEnd
  //             ? `${new Date(event.eventStart).toLocaleTimeString([], {
  //                 hour: "2-digit",
  //                 minute: "2-digit",
  //               })} - ${new Date(event.eventEnd).toLocaleTimeString([], {
  //                 hour: "2-digit",
  //                 minute: "2-digit",
  //               })}`
  //             : "TBD",
  //         location: safeString(
  //           event.eventType?.locationDetails || event.locationDetails
  //         ),
  //         attendees: event.participants?.length || 0,
  //         organizer: safeString(event.organiser?.name) || "Unknown Organizer",
  //         organizerHead: safeString(event.organiser?.head?.name),
  //         organizerEmail: safeString(event.organiser?.head?.email),
  //         organizerPhone: safeString(event.organiser?.head?.mobile),
  //         registrationStart: "", // not provided in your sample
  //         registrationEnd: event.registrationDeadline
  //           ? new Date(event.registrationDeadline).toISOString().split("T")[0]
  //           : "",
  //         banner:
  //           safeString(event.bannerImage) ||
  //           "/placeholder.svg?height=200&width=400",
  //         requirements: safeString(event.requirements),
  //         contact: safeString(event.organiser?.head?.email),
  //         fee: event.registrationFee ? `₹${event.registrationFee}` : "Free",
  //         status: safeString(event.status) || "Upcoming",
  //         eventMode: safeString(event.eventType?.type),
  //         eventCategory: safeString(event.category),
  //         prizes: safeArray(event.prizes),
  //         sponsors: safeArray(event.sponsors),
  //         agenda: safeString(event.agenda),
  //       }));
  //       setEvents(transformedEvents);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching events:", err);
  //     setError(err.response?.data?.message || "Failed to fetch events");
  //     // Optional fallback
  //     setEvents([
  //       {
  //         id: 1,
  //         title: "AI & Machine Learning Summit",
  //         name: "AI & Machine Learning Summit",
  //         description:
  //           "Join industry experts for a comprehensive discussion on the latest AI trends.",
  //         category: "Technology",
  //         eventDate: "2025-07-10",
  //         eventStart: "10:00",
  //         eventEnd: "13:00",
  //         registrationDeadline: "2025-07-09T23:59",
  //         maxParticipants: 500,
  //         tags: ["AI", "ML", "Innovation"],
  //         bannerImage: "/placeholder.svg?height=200&width=400",
  //         hostedBy: "Tech Innovation Club",
  //         eventType: {
  //           type: "offline",
  //           locationDetails: "IIT Delhi, New Delhi",
  //         },
  //         type: "Technology",
  //         date: "2025-07-10",
  //         time: "10:00 AM - 01:00 PM",
  //         location: "IIT Delhi, New Delhi",
  //         attendees: 0,
  //         organizer: "Tech Innovation Club",
  //         registrationStart: "2025-06-01",
  //         registrationEnd: "2025-07-09",
  //         banner: "/placeholder.svg?height=200&width=400",
  //         requirements: "Basic programming",
  //         contact: "tech@iitdelhi.ac.in",
  //         fee: "Free",
  //         status: "Upcoming",
  //         eventMode: "Offline",
  //         eventCategory: "Tech",
  //         prizes: [],
  //         sponsors: [],
  //         agenda: "Talks, Panel, Networking",
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch the admin's organizations
      const orgResponse = await apiClient.get("/api/event/get-admin-events");
      const organizations = orgResponse.data?.data || [];
      setAdminOrganizations(organizations);

      // Step 2: Extract organization IDs for filtering
      const adminOrgIds = organizations.map((org) => org.organisationId);

      // Step 3: Fetch all upcoming events
      const eventsResponse = await apiClient.get(
        "/api/event/get-upcoming-events"
      );

      if (eventsResponse.data && eventsResponse.data.events) {
        // Filter events to only include those from the admin's organizations
        const filteredEvents = eventsResponse.data.events.filter((event) => {
          // Check if the event has an organizer and if its ID is in adminOrgIds
          return event.organiser && adminOrgIds.includes(event.organiser._id);
        });

        // Transform the filtered events
        const transformedEvents = filteredEvents.map((event) => ({
          id: event._id,
          title: safeString(event.title),
          name: safeString(event.title),
          description: safeString(event.description),
          category: safeString(event.category),
          eventDate: event.eventDate
            ? new Date(event.eventDate).toISOString().split("T")[0]
            : "",
          eventStart: event.eventStart
            ? new Date(event.eventStart).toTimeString().slice(0, 5)
            : "",
          eventEnd: event.eventEnd
            ? new Date(event.eventEnd).toTimeString().slice(0, 5)
            : "",
          registrationDeadline: event.registrationDeadline
            ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
            : "",
          maxParticipants: event.maxParticipants || 0,
          tags: safeArray(event.tags),
          bannerImage:
            safeString(event.bannerImage) ||
            "/placeholder.svg?height=200&width=400",
          hostedBy: safeString(event.hostedBy) || "Unknown Organizer",
          eventType: {
            type: safeString(event.eventType?.type) || "offline",
            locationDetails: safeString(event.eventType?.locationDetails) || "",
          },
          type: safeString(event.eventType?.type) || "General",
          date: event.eventDate
            ? new Date(event.eventDate).toISOString().split("T")[0]
            : "",
          time:
            event.eventStart && event.eventEnd
              ? `${new Date(event.eventStart).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${new Date(event.eventEnd).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "TBD",
          location: safeString(
            event.eventType?.locationDetails || event.locationDetails
          ),
          attendees: event.participants?.length || 0,
          organizer: safeString(event.organiser?.name) || "Unknown Organizer",
          organizerHead: safeString(event.organiser?.head?.name),
          organizerEmail: safeString(event.organiser?.head?.email),
          organizerPhone: safeString(event.organiser?.head?.mobile),
          registrationStart: "",
          registrationEnd: event.registrationDeadline
            ? new Date(event.registrationDeadline).toISOString().split("T")[0]
            : "",
          banner:
            safeString(event.bannerImage) ||
            "/placeholder.svg?height=200&width=400",
          requirements: safeString(event.requirements),
          contact: safeString(event.organiser?.head?.email),
          fee: event.registrationFee ? `₹${event.registrationFee}` : "Free",
          status: safeString(event.status) || "Upcoming",
          eventMode: safeString(event.eventType?.type),
          eventCategory: safeString(event.category),
          prizes: safeArray(event.prizes),
          sponsors: safeArray(event.sponsors),
          agenda: safeString(event.agenda),
          organiser: event.organiser,
        }));

        setEvents(transformedEvents);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    const token = getAuthToken();
    try {
      const response = await axios.delete(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3006/api"
        }/event/delete-event`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            eventId,
          },
        }
      );
      // Refresh events after successful deletion
      await fetchEvents();
      return response.data;
    } catch (error) {
      console.error(
        "Delete Event Error:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Failed to delete event");
      throw (
        error.response?.data ||
        new Error("An error occurred while deleting the event.")
      );
    }
  };

  // Initialize editing event state
  const [editingEventData, setEditingEventData] = useState({
    title: "",
    description: "",
    category: "Technology",
    eventDate: "",
    eventStart: "",
    eventEnd: "",
    registrationDeadline: "",
    maxParticipants: "",
    tags: "",
    bannerImage: "",
    hostedBy: "",
    eventType: {
      type: "offline",
      locationDetails: "",
    },
  });

  // Filter events based on search and category
  const filteredEvents = events.filter((event) => {
    const searchableText = [
      event.name,
      event.description,
      event.organizer,
      event.location,
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = searchableText.includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEditingEventData({
      title: event.title || event.name || "",
      description: event.description || "",
      category: event.category || event.eventCategory || "Technology",
      eventDate: event.eventDate || event.date || "",
      eventStart: event.eventStart || "",
      eventEnd: event.eventEnd || "",
      registrationDeadline: event.registrationDeadline || "",
      maxParticipants: event.maxParticipants?.toString() || "",
      tags: Array.isArray(event.tags)
        ? event.tags.join(", ")
        : event.tags || "",
      bannerImage: event.bannerImage || event.banner || "",
      hostedBy: event.hostedBy || event.organizer || "",
      eventType: {
        type: event.eventType?.type || event.eventMode || "offline",
        locationDetails:
          event.eventType?.locationDetails || event.location || "",
      },
    });
    setShowEventModal(true);
  };

  const handleUpdateEvent = async () => {
    if (
      editingEventData.title &&
      editingEventData.description &&
      editingEventData.eventDate
    ) {
      const eventStartDateTime = new Date(
        `${editingEventData.eventDate}T${editingEventData.eventStart}`
      );
      const eventEndDateTime = new Date(
        `${editingEventData.eventDate}T${editingEventData.eventEnd}`
      );

      try {
        // Prepare data for API
        const eventData = {
          title: editingEventData.title,
          description: editingEventData.description,
          category: editingEventData.category,
          eventDate: editingEventData.eventDate,
          eventStart: eventStartDateTime,
          eventEnd: eventEndDateTime,
          registrationDeadline: editingEventData.registrationDeadline,
          maxParticipants: editingEventData.maxParticipants
            ? Number.parseInt(editingEventData.maxParticipants)
            : 0,
          tags: editingEventData.tags
            ? editingEventData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : [],
          bannerImage: editingEventData.bannerImage,
          hostedBy: editingEventData.hostedById, // ✅ Must be ObjectId
          eventType: {
            type:
              editingEventData.eventType.type === "In-Person"
                ? "Offline"
                : editingEventData.eventType.type,
            locationDetails: editingEventData.eventType.locationDetails,
          },
        };

        // Make API call to update event
        const response = await apiClient.put(
          `/edit-event?eventId=${editingEvent.id}`,
          eventData
        );
        if (response.data) {
          // Refresh events list
          await fetchEvents();
          setEditingEvent(null);
          setEditingEventData({
            title: "",
            description: "",
            category: "Technology",
            eventDate: "",
            eventStart: "",
            eventEnd: "",
            registrationDeadline: "",
            maxParticipants: "",
            tags: "",
            bannerImage: "",
            hostedBy: "",
            eventType: {
              type: "Offline",
              locationDetails: "",
            },
          });
          setShowEventModal(false);
        }
      } catch (err) {
        console.error("Error updating event:", err);
        setError(err.response?.data?.message || "Failed to update event");
      }
    }
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const registerForEvent = async (eventId) => {
    const token = getAuthToken();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/event/register-for-event/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Something went wrong!";
      toast.error(errMsg);
      throw error.response?.data || { message: errMsg };
    }
  };

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
              Loading events...
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
                Discover{" "}
                <span
                  className={`text-transparent bg-clip-text ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-400 to-yellow-300"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  Amazing Events
                </span>
              </h1>
              <p
                className={`text-xl max-w-2xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Find and join events that match your interests, or create your
                own
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
                  onClick={fetchEvents}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Search and Add Event */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 ${
                    theme === "dark" ? "text-gray-400" : "text-indigo-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search events by name, description, organizer, or location..."
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

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category
                        ? theme === "dark"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : theme === "dark"
                        ? "bg-white/10 text-gray-300 hover:bg-white/20"
                        : "bg-white/80 text-indigo-700 hover:bg-white border border-indigo-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`group relative backdrop-blur-xl rounded-3xl overflow-hidden border transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ${
                    theme === "dark"
                      ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
                      : "bg-white/80 hover:bg-white border-indigo-200 hover:border-indigo-300"
                  }`}
                >
                  {/* Event Type Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        theme === "dark"
                          ? "bg-purple-900/80 text-purple-300"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {Array.isArray(event.eventCategory)
                        ? event.eventCategory.join(", ")
                        : event.eventCategory}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className={`p-2 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-110 ${
                        theme === "dark"
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-white/80 hover:bg-white text-indigo-600"
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className={`p-2 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-110 ${
                        theme === "dark"
                          ? "bg-red-900/50 hover:bg-red-900/70 text-red-300"
                          : "bg-red-100 hover:bg-red-200 text-red-600"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Event Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.banner || "/placeholder.svg"}
                      alt={event.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3
                      className={`text-xl font-bold mb-3 ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      {event.name}
                    </h3>
                    <p
                      className={`text-sm mb-4 line-clamp-2 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }`}
                    >
                      {event.description}
                    </p>
                    <div className="space-y-2 mb-4">
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
                          {event.date
                            ? new Date(event.date).toLocaleDateString()
                            : "Date TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock
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
                          {event.time || "Time TBD"}
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
                          {event.location || "Location TBD"}
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
                          {event.attendees} / {event.maxParticipants} attendees
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User
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
                          Hosted by {event.organizer}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => openEventDetails(event)}
                      className={`w-full py-3 rounded-xl font-bold transform hover:scale-105 transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      }`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && !loading && (
              <div className="text-center py-12">
                <div
                  className={`text-6xl mb-4 ${
                    theme === "dark" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  🔍
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No events found
                </h3>
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Try adjusting your search terms or browse different categories
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Edit Event Modal */}
      {showEventModal && editingEvent && (
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
                  Edit Event
                </h2>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                    setEditingEventData({
                      title: "",
                      description: "",
                      category: "Technology",
                      eventDate: "",
                      eventStart: "",
                      eventEnd: "",
                      registrationDeadline: "",
                      maxParticipants: "",
                      tags: "",
                      bannerImage: "",
                      hostedBy: "",
                      eventType: {
                        type: "Offline",
                        locationDetails: "",
                      },
                    });
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
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={editingEventData.title}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
                            title: e.target.value,
                          })
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
                        value={editingEventData.category}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
                            category: e.target.value,
                          })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                      >
                        {categories.slice(1).map((category) => (
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
                      value={editingEventData.description}
                      onChange={(e) =>
                        setEditingEventData({
                          ...editingEventData,
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
                        value={editingEventData.eventDate}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
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
                        value={editingEventData.eventStart}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
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
                        value={editingEventData.eventEnd}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
                            eventEnd: e.target.value,
                          })
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
                        value={editingEventData.eventType.type}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
                            eventType: {
                              ...editingEventData.eventType,
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
                        value={editingEventData.eventType.locationDetails}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
                            eventType: {
                              ...editingEventData.eventType,
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
                          editingEventData.eventType.type === "Virtual"
                            ? "Meeting link or platform"
                            : editingEventData.eventType.type === "Hybrid"
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
                        value={editingEventData.registrationDeadline}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
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
                        value={editingEventData.maxParticipants}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
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
                        value={editingEventData.tags}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
                            tags: e.target.value,
                          })
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
                        value={editingEventData.bannerImage}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
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
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-indigo-700"
                        }`}
                      >
                        Hosted By
                      </label>
                      <input
                        type="text"
                        value={editingEventData.hostedBy}
                        onChange={(e) =>
                          setEditingEventData({
                            ...editingEventData,
                            hostedBy: e.target.value,
                          })
                        }
                        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:ring-purple-400"
                            : "bg-white border-indigo-200 text-indigo-900 focus:ring-indigo-500"
                        }`}
                        placeholder="Enter organizer name"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={handleUpdateEvent}
                  className={`flex-1 py-3 rounded-xl font-bold ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Update Event
                </Button>
                <Button
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                    setEditingEventData({
                      title: "",
                      description: "",
                      category: "Technology",
                      eventDate: "",
                      eventStart: "",
                      eventEnd: "",
                      registrationDeadline: "",
                      maxParticipants: "",
                      tags: "",
                      bannerImage: "",
                      hostedBy: "",
                      eventType: {
                        type: "Offline",
                        locationDetails: "",
                      },
                    });
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

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border ${
              theme === "dark"
                ? "bg-slate-900/95 border-white/20"
                : "bg-white/95 border-indigo-200"
            }`}
          >
            <div className="relative">
              {/* Event Banner */}
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <Image
                  src={selectedEvent.banner || "/placeholder.svg"}
                  alt={selectedEvent.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      theme === "dark"
                        ? "bg-purple-900/80 text-purple-300"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {selectedEvent.type}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h2
                  className={`text-3xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {selectedEvent.name}
                </h2>
                <p
                  className={`text-lg mb-6 ${
                    theme === "dark" ? "text-gray-300" : "text-indigo-700"
                  }`}
                >
                  {selectedEvent.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h3
                      className={`text-xl font-bold ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      Event Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar
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
                          {selectedEvent.date
                            ? new Date(selectedEvent.date).toLocaleDateString()
                            : "Date TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock
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
                          {selectedEvent.time || "Time TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin
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
                          {selectedEvent.location || "Location TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users
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
                          {selectedEvent.attendees} /{" "}
                          {selectedEvent.maxParticipants} attendees
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <User
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
                          Hosted by {selectedEvent.organizer}
                        </span>
                      </div>
                      {selectedEvent.organizerHead && (
                        <div className="ml-8">
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-indigo-600"
                            }`}
                          >
                            Contact: {selectedEvent.organizerHead}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3
                      className={`text-xl font-bold ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      Registration Info
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark"
                              ? "text-gray-400"
                              : "text-indigo-600"
                          }`}
                        >
                          Registration Period
                        </span>
                        <p
                          className={`${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          {selectedEvent.registrationStart
                            ? new Date(
                                selectedEvent.registrationStart
                              ).toLocaleDateString()
                            : "TBD"}{" "}
                          to{" "}
                          {selectedEvent.registrationEnd
                            ? new Date(
                                selectedEvent.registrationEnd
                              ).toLocaleDateString()
                            : "TBD"}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark"
                              ? "text-gray-400"
                              : "text-indigo-600"
                          }`}
                        >
                          Registration Fee
                        </span>
                        <p
                          className={`${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          {selectedEvent.fee}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark"
                              ? "text-gray-400"
                              : "text-indigo-600"
                          }`}
                        >
                          Requirements
                        </span>
                        <p
                          className={`${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          {selectedEvent.requirements ||
                            "No specific requirements"}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark"
                              ? "text-gray-400"
                              : "text-indigo-600"
                          }`}
                        >
                          Contact
                        </span>
                        <p
                          className={`${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-indigo-700"
                          }`}
                        >
                          {selectedEvent.contact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div className="mb-6">
                    <h3
                      className={`text-lg font-bold mb-3 ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            theme === "dark"
                              ? "bg-purple-900/50 text-purple-300"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <Button
                    className={`flex-1 py-3 rounded-xl font-bold ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    }`}
                    onClick={() => registerForEvent(selectedEvent.id)}
                  >
                    Register Now
                  </Button>
                  <Button
                    onClick={() => setShowEventDetails(false)}
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
    </div>
  );
}
