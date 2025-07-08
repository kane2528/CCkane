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
  MoreVertical,
  X,
  UserPlus,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import axios from "axios"
import Cookies from "js-cookie"
import Navbar from "./components/navbar"

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
  const [followedUsers, setFollowedUsers] = useState(new Set())
  const [showComments, setShowComments] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [videoComments, setVideoComments] = useState({})
  const [isTransitioning, setIsTransitioning] = useState(false)

  const containerRef = useRef(null)
  const videoRefs = useRef({})
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // API Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3006"

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
      const response = await apiClient.get(`/api/video/get-videos?page=${page}`, {
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

  // Touch handlers for swipe navigation
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

  // Keyboard navigation
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
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentVideoIndex, videos, goToNextVideo, goToPreviousVideo])

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
        setVideos((prev) =>
          prev.map((video) => (video.id === videoId ? { ...video, likesCount: video.likesCount + 1 } : video)),
        )
      }
    } catch (err) {
      console.error("Error toggling like:", err)
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
      // You could add a toast notification here
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

      <div
        className="fixed inset-0 bg-black overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        ref={containerRef}
      >
        {/* Video Container */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(-${currentVideoIndex * 100}vh)`,
          }}
        >
          {videos.map((video, index) => (
            <div key={video.id} className="absolute inset-0 w-full h-full" style={{ top: `${index * 100}vh` }}>
              {/* Video Player */}
              <div className="relative w-full h-full bg-black">
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[video.id] = el
                  }}
                  className="w-full h-full object-cover"
                  poster={video.thumbnail}
                  loop
                  playsInline
                  muted={mutedVideos.has(video.id)}
                  onEnded={() => setPlayingVideo(null)}
                  onClick={() => togglePlay(video.id)}
                  preload={Math.abs(index - currentVideoIndex) <= 1 ? "metadata" : "none"}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                </video>

                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className={`transition-all duration-300 pointer-events-auto ${
                      playingVideo === video.id ? "opacity-0 scale-75" : "opacity-100 scale-100"
                    }`}
                    onClick={() => togglePlay(video.id)}
                  >
                    <div className="p-6 rounded-full bg-black/50 backdrop-blur-sm">
                      {playingVideo === video.id ? (
                        <Pause className="w-16 h-16 text-white" />
                      ) : (
                        <Play className="w-16 h-16 text-white ml-2" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Controls */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-sm font-medium">
                          {currentVideoIndex + 1} / {videos.length}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleMute(video.id)}
                      className="p-3 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
                    >
                      {mutedVideos.has(video.id) ? (
                        <VolumeX className="w-6 h-6 text-white" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                  <div className="flex items-end justify-between">
                    {/* Left Content */}
                    <div className="flex-1 mr-4 max-w-[70%]">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <Image
                            src={video.user.profilePic || "/placeholder.svg"}
                            alt={video.user.name}
                            width={50}
                            height={50}
                            className="rounded-full border-2 border-white/30"
                          />
                          {video.user.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-bold text-lg">{video.user.name}</p>
                            <span className="text-gray-300 text-sm">•</span>
                            <span className="text-gray-300 text-sm">{formatTimeAgo(video.createdAt)}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{video.user.username}</p>
                        </div>
                        <Button
                          onClick={() => toggleFollow(video.user.id)}
                          size="sm"
                          className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                            followedUsers.has(video.user.id)
                              ? "bg-gray-600/80 text-white border border-gray-500 hover:bg-gray-700/80"
                              : "bg-white text-black hover:bg-gray-200"
                          }`}
                        >
                          {followedUsers.has(video.user.id) ? (
                            <>
                              <UserCheck className="w-4 h-4 mr-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-1" />
                              Follow
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Video Info */}
                      <div className="mb-4">
                        <h3 className="text-white font-bold text-xl mb-2 leading-tight">{video.title}</h3>
                        <p className="text-gray-200 text-base leading-relaxed line-clamp-3">{video.description}</p>
                      </div>

                      {/* Event Info */}
                      {video.event && (
                        <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-purple-300" />
                            <span className="text-white font-semibold">{video.event.title}</span>
                          </div>
                          <div className="flex items-center gap-4 text-gray-200 text-sm">
                            <span>
                              {new Date(video.event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{video.event.location}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex flex-col items-center gap-6">
                      {/* Like */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => toggleLike(video.id)}
                          className={`p-4 rounded-full backdrop-blur-md transition-all duration-200 ${
                            likedVideos.has(video.id)
                              ? "bg-red-500/30 border-2 border-red-500 scale-110"
                              : "bg-black/40 border-2 border-white/20 hover:bg-black/60"
                          }`}
                        >
                          <Heart
                            className={`w-8 h-8 transition-all duration-200 ${
                              likedVideos.has(video.id) ? "text-red-500 fill-red-500" : "text-white"
                            }`}
                          />
                        </button>
                        <span className="text-white text-sm font-semibold mt-2">{formatCount(video.likesCount)}</span>
                      </div>

                      {/* Comment */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => setShowComments(showComments === video.id ? null : video.id)}
                          className="p-4 rounded-full bg-black/40 backdrop-blur-md border-2 border-white/20 transition-all duration-200 hover:bg-black/60"
                        >
                          <MessageCircle className="w-8 h-8 text-white" />
                        </button>
                        <span className="text-white text-sm font-semibold mt-2">
                          {formatCount(video.commentsCount)}
                        </span>
                      </div>

                      {/* Share */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => shareVideo(video)}
                          className="p-4 rounded-full bg-black/40 backdrop-blur-md border-2 border-white/20 transition-all duration-200 hover:bg-black/60"
                        >
                          <Share2 className="w-8 h-8 text-white" />
                        </button>
                        <span className="text-white text-sm font-semibold mt-2">Share</span>
                      </div>

                      {/* More */}
                      <button className="p-4 rounded-full bg-black/40 backdrop-blur-md border-2 border-white/20 transition-all duration-200 hover:bg-black/60">
                        <MoreVertical className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Modal */}
                {showComments === video.id && (
                  <div className="absolute inset-0 bg-black/95 backdrop-blur-lg z-50 flex flex-col">
                    {/* Comments Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                      <h3 className="text-white font-bold text-xl">Comments ({formatCount(video.commentsCount)})</h3>
                      <button
                        onClick={() => setShowComments(null)}
                        className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {(videoComments[video.id] || []).length === 0 ? (
                        <div className="text-center py-12">
                          <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 text-lg">No comments yet</p>
                          <p className="text-gray-500 text-sm">Be the first to comment!</p>
                        </div>
                      ) : (
                        (videoComments[video.id] || []).map((comment) => (
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
                                addComment(video.id)
                              }
                            }}
                          />
                          <button
                            onClick={() => addComment(video.id)}
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
          ))}
        </div>

        {/* Navigation Indicators */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30">
          <div className="flex flex-col gap-2">
            {videos.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-8 rounded-full transition-all duration-300 ${
                  index === currentVideoIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Swipe Hint */}
        {currentVideoIndex === 0 && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
            <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-white text-sm">Swipe up for more videos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
