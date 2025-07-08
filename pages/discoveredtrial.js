"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  MapPin,
  Send,
  X,
  UserPlus,
  UserCheck,
  ChevronUp,
  ChevronDown,
  ThumbsDown,
} from "lucide-react"
import Image from "next/image"
import axios from "axios"
import Cookies from "js-cookie"
import Navbar from "../components/navbar"

export default function DiscoveryPage() {
  const [theme, setTheme] = useState("dark")
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalVideos, setTotalVideos] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [playingVideo, setPlayingVideo] = useState(null)
  const [mutedVideos, setMutedVideos] = useState(new Set())
  const [likedVideos, setLikedVideos] = useState(new Set())
  const [dislikedVideos, setDislikedVideos] = useState(new Set())
  const [followedUsers, setFollowedUsers] = useState(new Set())
  const [showComments, setShowComments] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [videoComments, setVideoComments] = useState({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const containerRef = useRef(null)
  const videoRefs = useRef({})
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // API Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3006/api"

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return Cookies.get("token")
    }
    return null
  }

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  apiClient.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Fetch videos from API
  const fetchVideos = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const token = getAuthToken()
      const response = await apiClient.get(`/video/get-videos?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        const { videos: videoData, totalPages: pages, totalVideos: total } = response.data

        const transformedVideos = videoData.map((video) => ({
          id: video._id,
          title: video.title || "Untitled Video",
          description: video.description || "",
          videoUrl: video.videoUrl,
          thumbnail: video.thumbnail || "/placeholder.svg?height=400&width=300",
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
          event: video.event
            ? {
                id: video.event._id,
                title: video.event.title || "Untitled Event",
                date: video.event.date || "",
                location: video.event.location || "",
              }
            : null,
          comments:
            video.comments?.map((comment) => ({
              id: comment._id,
              text: comment.text,
              createdAt: comment.createdAt,
              user: {
                id: comment.user?._id || "unknown",
                name: comment.user?.name || "Anonymous",
                profilePic: comment.user?.profilePic || "/placeholder.svg?height=40&width=40",
              },
            })) || [],
          likes:
            video.likes?.map((like) => ({
              id: like._id,
              name: like.name || "User",
              profilePic: like.profilePic || "/placeholder.svg?height=40&width=40",
            })) || [],
          likesCount: video.likes?.length || 0,
          commentsCount: video.comments?.length || 0,
          user: {
            id: `user_${video._id}`,
            name: `Creator ${Math.floor(Math.random() * 1000)}`,
            profilePic: "/placeholder.svg?height=40&width=40",
            username: `@creator${Math.floor(Math.random() * 1000)}`,
            isVerified: Math.random() > 0.5,
          },
        }))

        if (page === 1) {
          setVideos(transformedVideos)
        } else {
          setVideos((prev) => [...prev, ...transformedVideos])
        }

        setTotalPages(pages)
        setTotalVideos(total)
        setCurrentPage(page)

        // Initialize comments state
        const commentsState = {}
        transformedVideos.forEach((video) => {
          commentsState[video.id] = video.comments
        })
        setVideoComments((prev) => ({ ...prev, ...commentsState }))
      }
    } catch (err) {
      console.error("Error fetching videos:", err)
      setError(err.response?.data?.message || "Failed to fetch videos")

      // Fallback mock data
      const mockVideos = [
        {
          id: "1",
          title: "Amazing Event Highlights 🚀",
          description:
            "Check out the best moments from our tech conference! Amazing speakers, incredible networking, and groundbreaking innovations. Don't miss out on next year's event! #TechEvent #Innovation #Conference2024",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          thumbnail: "/placeholder.svg?height=400&width=300",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          event: {
            id: "event1",
            title: "Tech Innovation Summit 2024",
            date: "2024-07-15",
            location: "San Francisco, CA",
          },
          comments: [
            {
              id: "c1",
              text: "This looks amazing! Can't wait for next year 🔥",
              createdAt: new Date().toISOString(),
              user: {
                id: "u1",
                name: "John Doe",
                profilePic: "/placeholder.svg?height=40&width=40",
              },
            },
          ],
          likes: [
            {
              id: "l1",
              name: "Jane Smith",
              profilePic: "/placeholder.svg?height=40&width=40",
            },
          ],
          likesCount: 1247,
          commentsCount: 89,
          user: {
            id: "creator1",
            name: "Event Organizer",
            profilePic: "/placeholder.svg?height=40&width=40",
            username: "@eventorg",
            isVerified: true,
          },
        },
      ]

      setVideos(mockVideos)
      setVideoComments({ 1: mockVideos[0].comments })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos(1)
  }, [])

  // Auto-play current video
  useEffect(() => {
    if (videos.length > 0 && currentVideoIndex < videos.length) {
      const currentVideo = videos[currentVideoIndex]
      const videoElement = videoRefs.current[currentVideo.id]

      if (videoElement) {
        // Pause all other videos
        Object.entries(videoRefs.current).forEach(([id, video]) => {
          if (id !== currentVideo.id && video) {
            video.pause()
          }
        })

        // Play current video
        videoElement.play().catch(console.error)
        setPlayingVideo(currentVideo.id)
      }
    }
  }, [currentVideoIndex, videos])

  // Touch handlers for mobile swipe navigation
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    touchEndY.current = e.changedTouches[0].clientY
    handleSwipe()
  }

  const handleSwipe = () => {
    if (isTransitioning) return

    const swipeDistance = touchStartY.current - touchEndY.current
    const minSwipeDistance = 50

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe up - next video
        goToNextVideo()
      } else {
        // Swipe down - previous video
        goToPreviousVideo()
      }
    }
  }

  // Mouse wheel handler for desktop
  const handleWheel = useCallback(
    (e) => {
      if (isTransitioning) return

      e.preventDefault()

      if (e.deltaY > 0) {
        // Scroll down - next video
        goToNextVideo()
      } else {
        // Scroll up - previous video
        goToPreviousVideo()
      }
    },
    [isTransitioning],
  )

  const goToNextVideo = useCallback(() => {
    if (isTransitioning) return

    if (currentVideoIndex < videos.length - 1) {
      setIsTransitioning(true)
      setCurrentVideoIndex((prev) => prev + 1)
      setTimeout(() => setIsTransitioning(false), 300)
    } else if (currentPage < totalPages) {
      // Load more videos
      fetchVideos(currentPage + 1)
    }
  }, [currentVideoIndex, videos.length, currentPage, totalPages, isTransitioning])

  const goToPreviousVideo = useCallback(() => {
    if (isTransitioning) return

    if (currentVideoIndex > 0) {
      setIsTransitioning(true)
      setCurrentVideoIndex((prev) => prev - 1)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }, [currentVideoIndex, isTransitioning])

  // Keyboard and mouse wheel navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        goToPreviousVideo()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        goToNextVideo()
      } else if (e.key === " ") {
        e.preventDefault()
        if (videos[currentVideoIndex]) {
          togglePlay(videos[currentVideoIndex].id)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("wheel", handleWheel)
    }
  }, [currentVideoIndex, videos, goToNextVideo, goToPreviousVideo, handleWheel])

  // Video controls
  const togglePlay = (videoId) => {
    const video = videoRefs.current[videoId]
    if (video) {
      if (playingVideo === videoId) {
        video.pause()
        setPlayingVideo(null)
      } else {
        video.play()
        setPlayingVideo(videoId)
      }
    }
  }

  const toggleMute = (videoId) => {
    const video = videoRefs.current[videoId]
    if (video) {
      video.muted = !video.muted
      if (video.muted) {
        setMutedVideos((prev) => new Set([...prev, videoId]))
      } else {
        setMutedVideos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(videoId)
          return newSet
        })
      }
    }
  }

  // Engagement actions
  const toggleLike = async (videoId) => {
    try {
      if (likedVideos.has(videoId)) {
        setLikedVideos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(videoId)
          return newSet
        })
        setVideos((prev) =>
          prev.map((video) =>
            video.id === videoId ? { ...video, likesCount: Math.max(0, video.likesCount - 1) } : video,
          ),
        )
      } else {
        setLikedVideos((prev) => new Set([...prev, videoId]))
        setDislikedVideos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(videoId)
          return newSet
        })
        setVideos((prev) =>
          prev.map((video) => (video.id === videoId ? { ...video, likesCount: video.likesCount + 1 } : video)),
        )
      }
    } catch (err) {
      console.error("Error toggling like:", err)
    }
  }

  const toggleDislike = async (videoId) => {
    try {
      if (dislikedVideos.has(videoId)) {
        setDislikedVideos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(videoId)
          return newSet
        })
      } else {
        setDislikedVideos((prev) => new Set([...prev, videoId]))
        setLikedVideos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(videoId)
          return newSet
        })
        setVideos((prev) =>
          prev.map((video) =>
            video.id === videoId ? { ...video, likesCount: Math.max(0, video.likesCount - 1) } : video,
          ),
        )
      }
    } catch (err) {
      console.error("Error toggling dislike:", err)
    }
  }

  const toggleFollow = async (userId) => {
    try {
      if (followedUsers.has(userId)) {
        setFollowedUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      } else {
        setFollowedUsers((prev) => new Set([...prev, userId]))
      }
    } catch (err) {
      console.error("Error toggling follow:", err)
    }
  }

  const addComment = async (videoId) => {
    if (!newComment.trim()) return

    try {
      const newCommentData = {
        id: Date.now().toString(),
        text: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: "current_user",
          name: "You",
          profilePic: "/placeholder.svg?height=40&width=40",
        },
      }

      setVideoComments((prev) => ({
        ...prev,
        [videoId]: [...(prev[videoId] || []), newCommentData],
      }))

      setVideos((prev) =>
        prev.map((video) => (video.id === videoId ? { ...video, commentsCount: video.commentsCount + 1 } : video)),
      )

      setNewComment("")
    } catch (err) {
      console.error("Error adding comment:", err)
    }
  }

  const shareVideo = async (video) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  if (loading && videos.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading videos...</p>
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No videos available</h2>
          <p className="text-gray-400">Check back later for amazing content!</p>
        </div>
      </div>
    )
  }

  const currentVideo = videos[currentVideoIndex]

  return (
    <div className="relative">
      <Navbar theme={theme} onThemeToggle={toggleTheme} />

      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Main Video Container - YouTube Shorts Style */}
        <div className="relative w-full max-w-md mx-auto h-screen flex items-center justify-center">
          {/* Video Player Container */}
          <div
            className="relative w-full h-[85vh] max-h-[800px] bg-black rounded-xl overflow-hidden shadow-2xl"
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
            ref={containerRef}
          >
            {/* Video Player */}
            <div className="relative w-full h-full">
              <video
                ref={(el) => {
                  if (el) videoRefs.current[currentVideo.id] = el
                }}
                className="w-full h-full object-cover cursor-pointer"
                poster={currentVideo.thumbnail}
                loop
                playsInline
                muted={mutedVideos.has(currentVideo.id)}
                onEnded={() => setPlayingVideo(null)}
                onClick={() => togglePlay(currentVideo.id)}
                preload="metadata"
              >
                <source src={currentVideo.videoUrl} type="video/mp4" />
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePlay(currentVideo.id)}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                  >
                    {playingVideo === currentVideo.id ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleMute(currentVideo.id)}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                  >
                    {mutedVideos.has(currentVideo.id) ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
                <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-medium">
                    {currentVideoIndex + 1} / {videos.length}
                  </span>
                </div>
              </div>

              {/* Play/Pause Center Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div
                  className={`transition-all duration-300 pointer-events-auto ${
                    playingVideo === currentVideo.id ? "opacity-0 scale-75" : "opacity-100 scale-100"
                  }`}
                  onClick={() => togglePlay(currentVideo.id)}
                >
                  <div className="p-6 rounded-full bg-black/50 backdrop-blur-sm">
                    <Play className="w-12 h-12 text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Video Information Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                <div className="flex items-end justify-between">
                  {/* Left Content */}
                  <div className="flex-1 mr-4 max-w-[70%]">
                    {/* Video Title */}
                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">{currentVideo.title}</h3>

                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Image
                          src={currentVideo.user.profilePic || "/placeholder.svg"}
                          alt={currentVideo.user.name}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-white/30"
                        />
                        {currentVideo.user.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{currentVideo.user.name}</p>
                        <p className="text-gray-300 text-sm">{formatTimeAgo(currentVideo.createdAt)}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-200 text-sm leading-relaxed line-clamp-2 mb-3">
                      {currentVideo.description}
                    </p>

                    {/* Event Info */}
                    {currentVideo.event && (
                      <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 border border-white/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-purple-300" />
                          <span className="text-white font-medium text-sm">{currentVideo.event.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-200 text-xs">
                          <span>
                            {new Date(currentVideo.event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{currentVideo.event.location}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Actions - YouTube Shorts Style */}
                  <div className="flex flex-col items-center gap-4">
                    {/* Like */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => toggleLike(currentVideo.id)}
                        className={`p-3 rounded-full transition-all duration-200 ${
                          likedVideos.has(currentVideo.id)
                            ? "bg-red-500/20 text-red-500"
                            : "bg-black/40 text-white hover:bg-black/60"
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${likedVideos.has(currentVideo.id) ? "fill-current" : ""}`} />
                      </button>
                      <span className="text-white text-xs font-medium mt-1">
                        {formatCount(currentVideo.likesCount)}
                      </span>
                    </div>

                    {/* Dislike */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => toggleDislike(currentVideo.id)}
                        className={`p-3 rounded-full transition-all duration-200 ${
                          dislikedVideos.has(currentVideo.id)
                            ? "bg-gray-500/20 text-gray-400"
                            : "bg-black/40 text-white hover:bg-black/60"
                        }`}
                      >
                        <ThumbsDown className="w-6 h-6" />
                      </button>
                      <span className="text-white text-xs font-medium mt-1">Dislike</span>
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setShowComments(showComments === currentVideo.id ? null : currentVideo.id)}
                        className="p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all duration-200"
                      >
                        <MessageCircle className="w-6 h-6" />
                      </button>
                      <span className="text-white text-xs font-medium mt-1">
                        {formatCount(currentVideo.commentsCount)}
                      </span>
                    </div>

                    {/* Share */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => shareVideo(currentVideo)}
                        className="p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all duration-200"
                      >
                        <Share2 className="w-6 h-6" />
                      </button>
                      <span className="text-white text-xs font-medium mt-1">Share</span>
                    </div>

                    {/* Follow */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => toggleFollow(currentVideo.user.id)}
                        className={`p-3 rounded-full transition-all duration-200 ${
                          followedUsers.has(currentVideo.user.id)
                            ? "bg-gray-600/80 text-white"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                      >
                        {followedUsers.has(currentVideo.user.id) ? (
                          <UserCheck className="w-6 h-6" />
                        ) : (
                          <UserPlus className="w-6 h-6" />
                        )}
                      </button>
                      <span className="text-white text-xs font-medium mt-1">
                        {followedUsers.has(currentVideo.user.id) ? "Following" : "Follow"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Modal */}
              {showComments === currentVideo.id && (
                <div className="absolute inset-0 bg-black/95 backdrop-blur-lg z-50 flex flex-col">
                  {/* Comments Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                    <h3 className="text-white font-bold text-xl">
                      Comments ({formatCount(currentVideo.commentsCount)})
                    </h3>
                    <button
                      onClick={() => setShowComments(null)}
                      className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {(videoComments[currentVideo.id] || []).length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No comments yet</p>
                        <p className="text-gray-500 text-sm">Be the first to comment!</p>
                      </div>
                    ) : (
                      (videoComments[currentVideo.id] || []).map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <Image
                            src={comment.user.profilePic || "/placeholder.svg"}
                            alt={comment.user.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-white font-semibold">{comment.user.name}</span>
                              <span className="text-gray-400 text-sm">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-200 leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="p-6 border-t border-gray-700/50 bg-black/50">
                    <div className="flex gap-4">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Your profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1 flex gap-3">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 bg-gray-800/50 text-white rounded-full px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600/50"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addComment(currentVideo.id)
                            }
                          }}
                        />
                        <button
                          onClick={() => addComment(currentVideo.id)}
                          disabled={!newComment.trim()}
                          className="p-3 rounded-full bg-purple-600 disabled:bg-gray-600 disabled:opacity-50 transition-all duration-200 hover:bg-purple-700"
                        >
                          <Send className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Arrows */}
        {!isMobile && (
          <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-4">
            <button
              onClick={goToPreviousVideo}
              disabled={currentVideoIndex === 0}
              className="p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <button
              onClick={goToNextVideo}
              disabled={currentVideoIndex === videos.length - 1 && currentPage >= totalPages}
              className="p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Progress Indicators */}
        <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30">
          <div className="flex flex-col gap-2">
            {videos.slice(Math.max(0, currentVideoIndex - 2), currentVideoIndex + 3).map((_, index) => {
              const actualIndex = Math.max(0, currentVideoIndex - 2) + index
              return (
                <div
                  key={actualIndex}
                  className={`w-1 h-6 rounded-full transition-all duration-300 ${
                    actualIndex === currentVideoIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              )
            })}
          </div>
        </div>

        {/* Instructions */}
        {currentVideoIndex === 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-white text-sm">
                {isMobile ? "Swipe up/down" : "Scroll or use arrow keys"} to navigate
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
