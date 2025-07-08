"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Heart,
  Bell,
  Sun,
  Moon,
  Plus,
  Bookmark,
  Share2,
  Flag,
  Eye,
  TrendingUp,
  Users,
  MessageCircle,
  Send,
  X,
  Sparkles,
  Activity,
  ChevronUp,
  ChevronDown,
  ThumbsUp,
  Rocket,
  Globe,
  Filter,
  SortAsc,
  ExternalLink,
  Reply,
  ImageIcon,
  Smile,
  AtSign,
  Loader2,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

const Discussions = () => {
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("All Communities");
  const [activeFilter, setActiveFilter] = useState("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showFullPost, setShowFullPost] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [sortBy, setSortBy] = useState("recent");
  const [showQuickReply, setShowQuickReply] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(156);
  const [votedPosts, setVotedPosts] = useState(new Map());
  const [showVoteAnimation, setShowVoteAnimation] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const token = Cookies.get("token");
  const [viewedCommunity, setViewedCommunity] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Enhanced trending topics data
  const trendingTopics = [
    {
      name: "Machine Learning",
      posts: 234,
      trend: "+15%",
      icon: "🤖",
      color: "from-blue-500 to-purple-500",
    },
    {
      name: "Web Development",
      posts: 189,
      trend: "+8%",
      icon: "💻",
      color: "from-green-500 to-teal-500",
    },
    {
      name: "Data Science",
      posts: 156,
      trend: "+12%",
      icon: "📊",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Mobile Apps",
      posts: 134,
      trend: "+6%",
      icon: "📱",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Blockchain",
      posts: 98,
      trend: "+22%",
      icon: "⛓️",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  // Enhanced recent activity data
  const recentActivity = [
    {
      user: "Alex Chen",
      action: "started a discussion",
      topic: "React vs Vue",
      time: "2m ago",
      avatar: "AC",
      type: "discussion",
      votes: 12,
    },
    {
      user: "Sarah Kim",
      action: "replied to",
      topic: "Best coding practices",
      time: "5m ago",
      avatar: "SK",
      type: "reply",
      votes: 8,
    },
    {
      user: "Mike Johnson",
      action: "joined",
      topic: "AI Study Group",
      time: "8m ago",
      avatar: "MJ",
      type: "join",
      votes: 15,
    },
    {
      user: "Emma Wilson",
      action: "upvoted",
      topic: "Campus food recommendations",
      time: "12m ago",
      avatar: "EW",
      type: "vote",
      votes: 23,
    },
  ];

  // Enhanced notifications data
  const notifications = [
    {
      id: 1,
      type: "upvote",
      user: "John Doe",
      message: "upvoted your discussion about React hooks",
      time: "5m ago",
      unread: true,
      avatar: "JD",
    },
    {
      id: 2,
      type: "reply",
      user: "Jane Smith",
      message: "replied to your comment on Python tutorials",
      time: "1h ago",
      unread: true,
      avatar: "JS",
    },
    {
      id: 3,
      type: "follow",
      user: "Alex Johnson",
      message: "started following you",
      time: "2h ago",
      unread: false,
      avatar: "AJ",
    },
    {
      id: 4,
      type: "achievement",
      user: "System",
      message: "You've reached 100 upvotes! 🎉",
      time: "3h ago",
      unread: false,
      avatar: "SY",
    },
  ];

  const tabs = ["All Communities", "Academics", "Social"];
  const filters = [
    "Popular",
    "Latest",
    "My Topics",
    "Trending",
    "Unanswered",
    "Most Voted",
  ];
  const sortOptions = [
    "Recent",
    "Most Liked",
    "Most Commented",
    "Most Viewed",
    "Highest Voted",
    "Controversial",
  ];

  // Initialize data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        toast.error("You need to be logged in to view discussions");
        return;
      }

      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch communities and saved posts in parallel
        const [allRes, userRes, savedRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/all-communities`,
            { headers }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/user-communities`,
            { headers }
          ),
          getSavedPosts(),
        ]);

        setCommunities(allRes.data.communities);
        setUserCommunities(userRes.data.communities);
        setSavedPosts(savedRes);

        // Load initial discussions from first community
        if (allRes.data.communities.length > 0) {
          const firstCommunity = allRes.data.communities[0];
          const postsData = await getCommunityPosts(firstCommunity._id);
          setDiscussions(postsData.posts || []);
          setTotalPosts(postsData.totalPosts || 0);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]);

  // Simulate online users count update
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setOnlineUsers((prev) => prev + Math.floor(Math.random() * 3) - 1);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  // API Functions Implementation
  const getSavedPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/get-saved-posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.savedPosts || [];
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch saved posts"
      );
      return [];
    }
  };

  const getPostComments = async (postId) => {
    if (commentsLoading[postId]) return;

    setCommentsLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/comment/get-comments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedComments = response.data.comments || [];
      setComments((prev) => ({
        ...prev,
        [postId]: fetchedComments,
      }));

      return fetchedComments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error(error.response?.data?.message || "Failed to load comments");
      return [];
    } finally {
      setCommentsLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const savePost = async (postId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/save-post/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Post saved successfully");
      setBookmarkedPosts((prev) => new Set([...prev, postId]));
      setSavedPosts(response.data.savedPosts || []);
      return response.data.savedPosts;
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(error.response?.data?.message || "Failed to save post");
      return null;
    }
  };

  const removeDownvote = async (postId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/remove-downvote/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Downvote removed");

      // Update local state
      setDiscussions((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, downvotes: response.data.downvotes }
            : post
        )
      );

      return response.data.downvotes;
    } catch (error) {
      console.error("Error removing downvote:", error);
      toast.error(error.response?.data?.message || "Failed to remove downvote");
      return null;
    }
  };

  const removeUpvote = async (postId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/remove-upvote/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("UPvote removed");

      // Update local state
      setDiscussions((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, downvotes: response.data.downvotes }
            : post
        )
      );

      return response.data.downvotes;
    } catch (error) {
      console.error("Error removing downvote:", error);
      toast.error(error.response?.data?.message || "Failed to remove upvote");
      return null;
    }
  };

  const downvotePost = async (postId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/downvote-post/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { downvotes, upvotes, message } = response.data;
      toast.success(message);

      // Update local state
      setDiscussions((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, downvotes, upvotes } : post
        )
      );

      return { downvotes, upvotes };
    } catch (error) {
      console.error("Error downvoting post:", error);
      toast.error(error.response?.data?.message || "Failed to downvote post");
      return null;
    }
  };

  const upvotePost = async (postId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/upvote-post/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { upvotes, downvotes, message } = response.data;
      toast.success(message);

      // Update local state
      setDiscussions((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, upvotes, downvotes } : post
        )
      );

      return { upvotes, downvotes };
    } catch (error) {
      console.error("Error upvoting post:", error);
      toast.error(error.response?.data?.message || "Failed to upvote post");
      return null;
    }
  };

  const commentOnPost = async (postId, commentText) => {
    try {
      if (!commentText || commentText.trim().length === 0) {
        toast.error("Comment text cannot be empty");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/comment/add-comment/${postId}`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Comment added successfully");

      // Update local comments state
      const newComment = response.data.comment;
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));

      // Update discussion comment count
      setDiscussions((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: (post.comments || 0) + 1 }
            : post
        )
      );

      return newComment;
    } catch (error) {
      console.error("Error commenting on post:", error);
      toast.error(error.response?.data?.message || "Failed to comment on post");
      return null;
    }
  };

  const getCommunityPosts = async (communityId, page = 1, limit = 10) => {
    try {
      setPostsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/get-community-posts/${communityId}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (page === 1) {
        setCommunityPosts(data.posts || []);
      } else {
        setCommunityPosts((prev) => [...prev, ...(data.posts || [])]);
      }

      setCurrentPage(data.currentPage || page);
      setTotalPosts(data.totalPosts || 0);

      return data;
    } catch (error) {
      console.error("Error fetching community posts:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch community posts"
      );
      return {
        success: false,
        currentPage: page,
        totalPosts: 0,
        posts: [],
      };
    } finally {
      setPostsLoading(false);
    }
  };

  const replyToComment = async (commentId, replyText) => {
    try {
      if (!replyText || replyText.trim().length === 0) {
        toast.error("Reply text cannot be empty");
        return null;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/reply-to-comment/${commentId}`,
        { text: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Reply added successfully");

      // Update local comments state to include the new reply
      const newReply = response.data.reply;
      setComments((prev) => {
        const updatedComments = { ...prev };
        Object.keys(updatedComments).forEach((postId) => {
          updatedComments[postId] = updatedComments[postId].map((comment) =>
            comment._id === commentId
              ? { ...comment, replies: [...(comment.replies || []), newReply] }
              : comment
          );
        });
        return updatedComments;
      });

      return newReply;
    } catch (error) {
      console.error("Error replying to comment:", error);
      toast.error(error.response?.data?.message || "Failed to add reply");
      return null;
    }
  };

  const deleteCommentOnPost = async (commentId, postId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/delete-comment-on-post/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: false,
        }
      );

      toast.success("Comment deleted successfully");

      // Update local comments state
      setComments((prev) => ({
        ...prev,
        [postId]:
          prev[postId]?.filter((comment) => comment._id !== commentId) || [],
      }));

      // Update discussion comment count
      setDiscussions((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: Math.max(0, (post.comments || 0) - 1) }
            : post
        )
      );

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.response?.data?.message || "Failed to delete comment");
      return false;
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

      // Refresh user communities
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/user-communities`,
        { headers }
      );
      setUserCommunities(userRes.data.communities);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join community");
    }
  };

  // Enhanced filter and sort discussions
  const filteredDiscussions = discussions
    .filter((discussion) => {
      const matchesSearch =
        discussion.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesTab =
        activeTab === "All Communities" || discussion.category === activeTab;
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Most Liked":
          return (b.likes || 0) - (a.likes || 0);
        case "Most Commented":
          return (b.comments || 0) - (a.comments || 0);
        case "Most Viewed":
          return (b.views || 0) - (a.views || 0);
        case "Highest Voted":
          return (
            (b.upvotes || 0) -
            (b.downvotes || 0) -
            ((a.upvotes || 0) - (a.downvotes || 0))
          );
        case "Controversial":
          return (
            (b.upvotes || 0) +
            (b.downvotes || 0) -
            ((a.upvotes || 0) + (a.downvotes || 0))
          );
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleBookmark = async (id) => {
    const postId = id;
    if (bookmarkedPosts.has(postId)) {
      setBookmarkedPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      await savePost(postId);
    }
  };

  const toggleLike = (id) => {
    const newLikes = new Set(likedPosts);
    if (newLikes.has(id)) {
      newLikes.delete(id);
    } else {
      newLikes.add(id);
    }
    setLikedPosts(newLikes);
  };

  const toggleFollow = (userId) => {
    const newFollows = new Set(followedUsers);
    if (newFollows.has(userId)) {
      newFollows.delete(userId);
    } else {
      newFollows.add(userId);
    }
    setFollowedUsers(newFollows);
  };

  // Enhanced voting system
  const handleVote = async (discussionId, voteType) => {
    const currentVote = votedPosts.get(discussionId);

    if (currentVote === voteType) {
      // Remove vote
      if (voteType === "up") {
        await removeUpvote(discussionId);
      } else {
        await removeDownvote(discussionId);
      }
      setVotedPosts((prev) => {
        const newMap = new Map(prev);
        newMap.delete(discussionId);
        return newMap;
      });
    } else {
      // Add vote
      if (voteType === "up") {
        await upvotePost(discussionId);
      } else {
        await downvotePost(discussionId);
      }
      setVotedPosts((prev) => new Map(prev.set(discussionId, voteType)));
    }

    setShowVoteAnimation(discussionId + voteType);
    setTimeout(() => setShowVoteAnimation(null), 600);
  };

  const getVoteCount = (discussion, voteType) => {
    const userVote = votedPosts.get(discussion._id);
    let count =
      voteType === "up" ? discussion.upvotes || 0 : discussion.downvotes || 0;
    if (userVote === voteType) {
      count += 1;
    } else if (userVote && userVote !== voteType) {
      if (voteType === "up" && userVote === "down") count += 1;
      if (voteType === "down" && userVote === "up") count += 1;
    }
    return count;
  };

  const handleQuickReply = async (discussionId) => {
    if (replyText.trim()) {
      await commentOnPost(discussionId, replyText);
      setReplyText("");
      setShowQuickReply(null);
    }
  };

  const handleViewFullPost = async (discussion) => {
    setSelectedDiscussion(discussion);
    setShowFullPost(true);
    await getPostComments(discussion._id);
  };

  // const handleAddComment = async (discussionId) => {
  //   if (newComment.trim()) {
  //     try {
  //       const token = localStorage.getItem("token"); // Get token from storage
  //       const response = await axios.post(
  //         `${process.env.NEXT_PUBLIC_SITE_URL}/api/comment/add-comment/${discussionId}`,
  //         { text: newComment },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       console.log("Comment added:", response.data.comment);
  //       setNewComment("");
  //       // Optional: refresh comment list or show success message
  //     } catch (error) {
  //       console.error("Failed to add comment:", error);
  //       // Optional: show error toast or UI message
  //     }
  //   }
  // };

  const handleAddComment = async (discussionId) => {
    if (newComment.trim()) {
      await commentOnPost(discussionId, newComment);
      setNewComment("");
    }
  };
  const handleReplyToComment = async (commentId) => {
    const replyText = replyTexts[commentId];

    if (replyText?.trim()) {
      try {
        const token = localStorage.getItem("token"); // 🔐 Get token from localStorage

        // ✅ Make the API request to reply to the comment
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/comment/reply-to-comment/${commentId}`,
          { text: replyText },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ Reset UI states
        setReplyTexts((prev) => ({ ...prev, [commentId]: "" }));
        setReplyingTo(null);

        // ✅ Optionally update comments state with new reply
        const newReply = response.data.reply;
        setComments((prev) => {
          const parentComment = prev[selectedDiscussion._id].find(
            (c) => c._id === commentId
          );
          if (parentComment) {
            parentComment.replies = [
              ...(parentComment.replies || []),
              newReply,
            ];
          }

          return { ...prev };
        });
      } catch (error) {
        console.error("Failed to reply to comment:", error);
        toast.error("Failed to add reply");
      }
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    toast(
      (t) => (
        <span className="flex items-center gap-3">
          Are you sure?
          <div className="flex gap-2">
            <button
              className="text-red-500 hover:underline"
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingId = toast.loading("Deleting comment...");

                try {
                  const token = localStorage.getItem("token"); // 🔐 Get auth token

                  // ✅ Direct API call to delete the comment
                  const response = await axios.delete(
                    `${process.env.NEXT_PUBLIC_SITE_URL}/api/comment/delete-comment/${commentId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  toast.success("Comment deleted successfully", {
                    id: loadingId,
                  });

                  // ✅ Optional: update local comment list
                  setComments((prev) => ({
                    ...prev,
                    [postId]: prev[postId].filter((c) => c._id !== commentId),
                  }));
                } catch (error) {
                  toast.error("Failed to delete comment", { id: loadingId });
                  console.error("Error deleting comment:", error);
                }
              }}
            >
              Yes
            </button>
            <button
              className="text-gray-500 hover:underline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 10000 }
    );
  };

  const loadMorePosts = async () => {
    if (viewedCommunity && currentPage * 10 < totalPosts) {
      await getCommunityPosts(viewedCommunity._id, currentPage + 1);
    }
  };

  // Enhanced Community Card Component
  const CommunityCard = ({ community }) => {
    const isUserInCommunity = userCommunities.some(
      (userCommunity) => userCommunity._id === community._id
    );

    return (
      <div
        className={`group relative backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden ${
          theme === "dark"
            ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10"
            : "bg-gradient-to-br from-white to-gray-50 border-indigo-200 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50"
        }`}
      >
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
            >
              <span className="text-2xl font-bold text-white">
                {community.name?.charAt(0) || "C"}
              </span>
            </div>
            <div>
              <h3
                className={`font-bold text-xl ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                {community.name}
              </h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-indigo-600"
                }`}
              >
                {community.members?.length || 0} members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span
              className={`text-xs font-medium ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              Active
            </span>
          </div>
        </div>

        <p
          className={`text-sm mb-6 ${
            theme === "dark" ? "text-gray-300" : "text-indigo-700"
          }`}
        >
          {community.description || "No description available"}
        </p>

        {isUserInCommunity ? (
          <button
            className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 transform hover:shadow-xl ${
              theme === "dark"
                ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
            }`}
            onClick={async () => {
              setViewedCommunity(community);
              await getCommunityPosts(community._id);
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              View Community
            </span>
          </button>
        ) : (
          <button
            className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 transform hover:shadow-xl ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            }`}
            onClick={() => handleJoinCommunity(community._id)}
          >
            <span className="flex items-center justify-center gap-2">
              <Rocket className="w-4 h-4" />
              Join Community
            </span>
          </button>
        )}
      </div>
    );
  };

  // Enhanced Discussion Card Component
  const DiscussionCard = ({ discussion }) => {
    const userVote = votedPosts.get(discussion._id);
    const netVotes =
      getVoteCount(discussion, "up") - getVoteCount(discussion, "down");

    return (
      <div
        className={`group backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden relative ${
          theme === "dark"
            ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10"
            : "bg-gradient-to-br from-white to-gray-50 border-indigo-200 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50"
        }`}
      >
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                }`}
              >
                {discussion.postedBy?.name?.charAt(0) || "U"}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4
                  className={`font-bold text-lg ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {discussion.postedBy?.name || "Anonymous"}
                </h4>
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  • {new Date(discussion.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <h3
          className={`text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${
            theme === "dark"
              ? "text-white group-hover:from-purple-400 group-hover:to-yellow-300"
              : "text-indigo-900 group-hover:from-indigo-600 group-hover:to-purple-600"
          } transition-all duration-300`}
        >
          {discussion.title}
        </h3>

        <p
          className={`text-base leading-relaxed mb-6 ${
            theme === "dark" ? "text-gray-300" : "text-indigo-800"
          }`}
        >
          {discussion.content}
        </p>

        {discussion.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {discussion.tags.map((tag, i) => (
              <span
                key={i}
                className={`text-sm px-3 py-1 rounded-full font-medium transition-all duration-300 cursor-pointer hover:scale-105 ${
                  theme === "dark"
                    ? "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50 border border-purple-500/30"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote(discussion._id, "up")}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  userVote === "up"
                    ? theme === "dark"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-green-500 text-white shadow-lg"
                    : theme === "dark"
                    ? "bg-white/10 text-gray-300 hover:bg-green-600/20 hover:text-green-400"
                    : "bg-indigo-100 text-indigo-700 hover:bg-green-100 hover:text-green-600"
                }`}
              >
                <ChevronUp
                  className={`w-5 h-5 transition-transform duration-300 ${
                    userVote === "up" ? "scale-125" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-bold">
                  {getVoteCount(discussion, "up")}
                </span>
              </button>

              <div
                className={`px-3 py-2 rounded-xl font-bold text-lg ${
                  netVotes > 0
                    ? "text-green-400"
                    : netVotes < 0
                    ? "text-red-400"
                    : theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {netVotes > 0 ? `+${netVotes}` : netVotes}
              </div>

              <button
                onClick={() => handleVote(discussion._id, "down")}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  userVote === "down"
                    ? theme === "dark"
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-red-500 text-white shadow-lg"
                    : theme === "dark"
                    ? "bg-white/10 text-gray-300 hover:bg-red-600/20 hover:text-red-400"
                    : "bg-indigo-100 text-indigo-700 hover:bg-red-100 hover:text-red-600"
                }`}
              >
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    userVote === "down" ? "scale-125" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-bold">
                  {getVoteCount(discussion, "down")}
                </span>
              </button>
            </div>

            <button
              onClick={() => toggleLike(discussion._id)}
              className="flex items-center gap-2 group transition-all duration-300 hover:scale-105"
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${
                  likedPosts.has(discussion._id)
                    ? "text-red-500 fill-current"
                    : theme === "dark"
                    ? "text-gray-400 group-hover:text-red-400"
                    : "text-gray-600 group-hover:text-red-500"
                }`}
              />
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                {(discussion.likes || 0) +
                  (likedPosts.has(discussion._id) ? 1 : 0)}
              </span>
            </button>

            <button
              className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300"
              onClick={() => getPostComments(discussion._id)}
            >
              <MessageSquare
                className={`w-5 h-5 ${
                  theme === "dark"
                    ? "text-gray-400 group-hover:text-blue-400"
                    : "text-gray-600 group-hover:text-blue-500"
                } transition-colors duration-200`}
              />
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                {discussion.comments?.length || 0}
              </span>
              {commentsLoading[discussion._id] && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <Eye
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                {discussion.views || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(discussion._id)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                bookmarkedPosts.has(discussion._id)
                  ? theme === "dark"
                    ? "bg-yellow-600 text-white shadow-lg"
                    : "bg-yellow-500 text-white shadow-lg"
                  : theme === "dark"
                  ? "hover:bg-white/10 text-gray-400 hover:text-yellow-400"
                  : "hover:bg-indigo-100 text-indigo-600 hover:text-yellow-600"
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>

            <button
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                theme === "dark"
                  ? "hover:bg-white/10 text-gray-400"
                  : "hover:bg-indigo-100 text-indigo-600"
              }`}
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                theme === "dark"
                  ? "hover:bg-white/10 text-gray-400"
                  : "hover:bg-indigo-100 text-indigo-600"
              }`}
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setShowQuickReply(
                showQuickReply === discussion._id ? null : discussion._id
              )
            }
            className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 transform hover:shadow-xl ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            }`}
          >
            <MessageCircle className="w-4 h-4 mr-2 inline" />
            Quick Reply
          </button>

          <button
            onClick={() => handleViewFullPost(discussion)}
            className={`px-8 py-4 rounded-2xl font-bold border transition-all duration-300 hover:scale-105 transform hover:shadow-xl ${
              theme === "dark"
                ? "border-white/20 hover:bg-white/10 text-white"
                : "border-indigo-200 hover:bg-indigo-50 text-indigo-700"
            }`}
          >
            <ExternalLink className="w-4 h-4 mr-2 inline" />
            View Full Post
          </button>
        </div>

        {showQuickReply === discussion._id && (
          <div
            className={`mt-6 p-6 rounded-2xl border transition-all duration-300 ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <div className="flex gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                }`}
              >
                YU
              </div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className={`w-full p-4 rounded-xl border resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-105 ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                  rows={4}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-indigo-600"
                      }`}
                    >
                      {replyText.length}/500
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuickReply(discussion._id)}
                    disabled={!replyText.trim()}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    }`}
                  >
                    <Send className="w-4 h-4 mr-2 inline" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        {comments[discussion._id] && comments[discussion._id].length > 0 && (
          <div className="mt-6 space-y-4">
            <h4
              className={`font-bold ${
                theme === "dark" ? "text-white" : "text-indigo-900"
              }`}
            >
              Comments ({comments[discussion._id].length})
            </h4>
            {comments[discussion._id].map((comment) => (
              <div
                key={comment._id}
                className={`p-4 rounded-xl border ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-green-500 to-teal-500"
                        : "bg-gradient-to-r from-green-600 to-teal-600"
                    }`}
                  >
                    {comment.user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`font-bold text-sm ${
                          theme === "dark" ? "text-white" : "text-indigo-900"
                        }`}
                      >
                        {comment.user?.name || "Anonymous"}
                      </span>
                      <span
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-indigo-800"
                      }`}
                    >
                      {comment.content || comment.text}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment._id ? null : comment._id
                          )
                        }
                        className={`text-xs font-medium transition-colors ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-600 hover:text-indigo-900"
                        }`}
                      >
                        <Reply className="w-3 h-3 mr-1 inline" />
                        Reply
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteComment(comment._id, discussion._id)
                        }
                        className={`text-xs font-medium transition-colors ${
                          theme === "dark"
                            ? "text-red-400 hover:text-red-300"
                            : "text-red-600 hover:text-red-500"
                        }`}
                      >
                        <Trash2 className="w-3 h-3 mr-1 inline" />
                        Delete
                      </button>
                    </div>

                    {replyingTo === comment._id && (
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <textarea
                            value={replyTexts[comment._id] || ""}
                            onChange={(e) =>
                              setReplyTexts((prev) => ({
                                ...prev,
                                [comment._id]: e.target.value,
                              }))
                            }
                            placeholder="Write a reply..."
                            className={`flex-1 p-2 rounded-lg border text-sm resize-none ${
                              theme === "dark"
                                ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                                : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400"
                            }`}
                            rows={2}
                          />
                          <button
                            onClick={() => handleReplyToComment(comment._id)}
                            disabled={!replyTexts[comment._id]?.trim()}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                              theme === "dark"
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const FullPostModal = ({
    selectedDiscussion,
    showFullPost,
    setShowFullPost,
    theme,
    comments,
    newComment,
    setNewComment,
    handleAddComment,
    discussionComments,
    replyingTo,
    setReplyingTo,
    replyTexts,
    setReplyTexts,
    handleReplyToComment,
    handleDeleteComment,
  }) => {
    if (!selectedDiscussion || !showFullPost) return null;

    const discussionComments = comments[selectedDiscussion._id] || [];

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl ${
            theme === "dark"
              ? "bg-slate-900 border-white/20"
              : "bg-white border-indigo-200"
          }`}
        >
          {/* Header */}
          <div
            className={`sticky top-0 p-6 border-b backdrop-blur-xl ${
              theme === "dark"
                ? "bg-slate-900/80 border-white/20"
                : "bg-white/80 border-indigo-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFullPost(false)}
                  className={`p-2 rounded-xl transition-colors ${
                    theme === "dark"
                      ? "hover:bg-white/10"
                      : "hover:bg-indigo-100"
                  }`}
                >
                  <ArrowLeft
                    className={`w-6 h-6 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  />
                </button>
                <h1
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Full Discussion
                </h1>
              </div>
              <button
                onClick={() => setShowFullPost(false)}
                className={`p-2 rounded-xl transition-colors ${
                  theme === "dark" ? "hover:bg-white/10" : "hover:bg-indigo-100"
                }`}
              >
                <X
                  className={`w-6 h-6 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Post Title */}
            <h2
              className={`text-3xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-indigo-900"
              }`}
            >
              {selectedDiscussion.title}
            </h2>

            {/* Post Content */}
            <div
              className={`prose prose-lg max-w-none mb-8 ${
                theme === "dark"
                  ? "prose-invert text-gray-300"
                  : "text-indigo-800"
              }`}
            >
              <div className="whitespace-pre-wrap">
                {selectedDiscussion.content}
              </div>
            </div>

            {/* Tags */}
            {selectedDiscussion.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedDiscussion.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                      theme === "dark"
                        ? "bg-purple-900/50 text-purple-300 border border-purple-500/30"
                        : "bg-purple-100 text-purple-700 border border-purple-300"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Comments ({discussionComments.length})
                </h3>
              </div>

              {/* Add Comment */}
              <div className="mb-8">
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600"
                    }`}
                  >
                    YU
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      key="main-comment"
                      placeholder="Add a comment..."
                      className={`w-full p-4 rounded-xl border resize-none transition-all duration-300 focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                          : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                      }`}
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4">
                        <button
                          className={`p-2 rounded-lg transition-colors ${
                            theme === "dark"
                              ? "hover:bg-white/10"
                              : "hover:bg-indigo-100"
                          }`}
                        >
                          <ImageIcon
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-indigo-600"
                            }`}
                          />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-colors ${
                            theme === "dark"
                              ? "hover:bg-white/10"
                              : "hover:bg-indigo-100"
                          }`}
                        >
                          <Smile
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-indigo-600"
                            }`}
                          />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-colors ${
                            theme === "dark"
                              ? "hover:bg-white/10"
                              : "hover:bg-indigo-100"
                          }`}
                        >
                          <AtSign
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-indigo-600"
                            }`}
                          />
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddComment(selectedDiscussion._id)}
                        disabled={!newComment.trim()}
                        className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        }`}
                      >
                        <Send className="w-4 h-4 mr-2 inline" />
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {discussionComments.map((comment) => (
                  <div key={comment._id} className="space-y-4">
                    <div
                      className={`p-6 rounded-xl border ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-green-500 to-teal-500"
                              : "bg-gradient-to-r from-green-600 to-teal-600"
                          }`}
                        >
                          {comment.user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`font-bold ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-indigo-900"
                              }`}
                            >
                              {comment.user?.name || "Anonymous"}
                            </span>
                            <span
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {comment.createdAt
                                ? new Date(
                                    comment.createdAt
                                  ).toLocaleDateString()
                                : "Recently"}
                            </span>
                          </div>
                          <p
                            className={`mb-4 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-800"
                            }`}
                          >
                            {comment.content || comment.text}
                          </p>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                setReplyingTo(
                                  replyingTo === comment._id
                                    ? null
                                    : comment._id
                                )
                              }
                              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                theme === "dark"
                                  ? "text-gray-400 hover:text-white"
                                  : "text-gray-600 hover:text-indigo-900"
                              }`}
                            >
                              <Reply className="w-4 h-4" />
                              Reply
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteComment(
                                  comment._id,
                                  selectedDiscussion._id
                                )
                              }
                              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                theme === "dark"
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-red-600 hover:text-red-500"
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>

                          {replyingTo === comment._id && (
                            <div className="mt-4">
                              <div className="flex gap-3">
                                <textarea
                                  value={replyTexts[comment._id] || ""}
                                  key={`reply-${comment._id}`}
                                  onChange={(e) =>
                                    setReplyTexts((prev) => ({
                                      ...prev,
                                      [comment._id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Write a reply..."
                                  className={`flex-1 p-3 rounded-lg border text-sm resize-none ${
                                    theme === "dark"
                                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                                      : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400"
                                  }`}
                                  rows={3}
                                />
                                <button
                                  onClick={() =>
                                    handleReplyToComment(comment._id)
                                  }
                                  disabled={!replyTexts[comment._id]?.trim()}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    theme === "dark"
                                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                  }`}
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-12 mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply._id}
                            className={`p-4 rounded-lg border text-sm ${
                              theme === "dark"
                                ? "bg-white/5 border-white/10 text-gray-300"
                                : "bg-gray-50 border-gray-200 text-indigo-800"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                                  theme === "dark"
                                    ? "bg-gradient-to-r from-green-500 to-teal-500"
                                    : "bg-gradient-to-r from-green-600 to-teal-600"
                                }`}
                              >
                                {reply.user?.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {reply.user?.name || "Anonymous"}
                                </div>
                                <div className="text-xs mt-1 opacity-80">
                                  {new Date(
                                    reply.createdAt
                                  ).toLocaleDateString()}
                                </div>
                                <p className="mt-1">{reply.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CommunityDiscussions = ({ community, onBack }) => {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl ${
              theme === "dark" ? "hover:bg-white/10" : "hover:bg-indigo-100"
            }`}
          >
            <ArrowLeft
              className={`w-6 h-6 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            />
          </button>
          <h2
            className={`text-2xl font-black ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Discussions in {community.name}
          </h2>
          {postsLoading && <Loader2 className="w-6 h-6 animate-spin" />}
        </div>

        <div className="space-y-8">
          {communityPosts.map((discussion) => (
            <DiscussionCard key={discussion._id} discussion={discussion} />
          ))}
        </div>

        {/* Load More Button */}
        {currentPage * 10 < totalPosts && (
          <div className="flex justify-center">
            <button
              onClick={loadMorePosts}
              disabled={postsLoading}
              className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 transform hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              }`}
            >
              {postsLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Load More Posts
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Full Post Modal Component

  // Enhanced Trending Topics Component
  const TrendingTopics = () => (
    <div
      className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
        theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-white border-indigo-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp
          className={`w-6 h-6 ${
            theme === "dark" ? "text-yellow-400" : "text-indigo-600"
          }`}
        />
        <h3
          className={`font-bold text-lg ${
            theme === "dark" ? "text-white" : "text-indigo-900"
          }`}
        >
          Trending Topics
        </h3>
        <Sparkles
          className={`w-4 h-4 ${
            theme === "dark" ? "text-yellow-400" : "text-purple-500"
          }`}
        />
      </div>
      <div className="space-y-4">
        {trendingTopics.map((topic, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
              theme === "dark"
                ? "bg-white/5 hover:bg-white/10"
                : "bg-indigo-50 hover:bg-indigo-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div>
                  <p
                    className={`font-bold ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    {topic.name}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-indigo-600"
                    }`}
                  >
                    {topic.posts} posts
                  </p>
                </div>
              </div>
              <span className="text-green-400 text-sm font-bold bg-green-400/20 px-2 py-1 rounded-full">
                {topic.trend}
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full ${
                theme === "dark" ? "bg-white/10" : "bg-indigo-200"
              }`}
            >
              <div
                className={`h-full rounded-full bg-gradient-to-r ${topic.color}`}
                style={{
                  width: `${Math.min(100, (topic.posts / 250) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Enhanced Recent Activity Component
  const RecentActivity = () => (
    <div
      className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
        theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-white border-indigo-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity
          className={`w-6 h-6 ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        />
        <h3
          className={`font-bold text-lg ${
            theme === "dark" ? "text-white" : "text-indigo-900"
          }`}
        >
          Recent Activity
        </h3>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {recentActivity.map((activity, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
              theme === "dark" ? "hover:bg-white/5" : "hover:bg-indigo-50"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600"
              }`}
            >
              {activity.avatar}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                <span className="font-bold">{activity.user}</span>{" "}
                {activity.action}{" "}
                <span className="font-medium">{activity.topic}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {activity.time}
                </p>
                {activity.type === "vote" && (
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-bold">
                      {activity.votes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Enhanced Online Users Component
  const OnlineUsers = () => (
    <div
      className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
        theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-white border-indigo-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <h3
          className={`font-bold text-lg ${
            theme === "dark" ? "text-white" : "text-indigo-900"
          }`}
        >
          Online Now
        </h3>
        <Globe
          className={`w-4 h-4 ${
            theme === "dark" ? "text-blue-400" : "text-blue-500"
          }`}
        />
      </div>
      <div className="text-center">
        <div
          className={`text-4xl font-black mb-2 ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        >
          {onlineUsers}
        </div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-indigo-600"
          }`}
        >
          Active users
        </p>
        <div className="mt-4 flex justify-center">
          <div
            className={`w-full h-2 rounded-full ${
              theme === "dark" ? "bg-white/10" : "bg-indigo-200"
            }`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-1000"
              style={{ width: `${Math.min(100, (onlineUsers / 200) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"
            : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
        }`}
      >
        <div className="text-center">
          <Loader2
            className={`w-12 h-12 animate-spin mx-auto mb-4 ${
              theme === "dark" ? "text-purple-400" : "text-indigo-600"
            }`}
          />
          <p
            className={`text-lg font-medium ${
              theme === "dark" ? "text-white" : "text-indigo-900"
            }`}
          >
            Loading discussions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      }`}
    >
      {/* Enhanced Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
          theme === "dark"
            ? "bg-black/20 border-white/10"
            : "bg-white/80 border-indigo-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  theme === "dark" ? "hover:bg-white/10" : "hover:bg-indigo-100"
                }`}
              >
                <ArrowLeft
                  className={`w-6 h-6 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                />
              </button>
              <div>
                <h1
                  className={`text-3xl font-black ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Campus Discussions
                </h1>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-indigo-600"
                  }`}
                >
                  Connect, share, and learn together
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === "dark" ? "text-gray-400" : "text-indigo-600"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-105 w-80 ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 relative ${
                    theme === "dark"
                      ? "hover:bg-white/10"
                      : "hover:bg-indigo-100"
                  }`}
                >
                  <Bell
                    className={`w-6 h-6 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {notifications.filter((n) => n.unread).length}
                    </span>
                  </div>
                </button>
                {showNotifications && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-96 backdrop-blur-xl rounded-2xl border shadow-2xl z-50 ${
                      theme === "dark"
                        ? "bg-black/80 border-white/20"
                        : "bg-white/90 border-indigo-200"
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className={`font-bold text-lg ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          Notifications
                        </h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === "dark"
                              ? "hover:bg-white/10"
                              : "hover:bg-indigo-100"
                          }`}
                        >
                          <X
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-indigo-600"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                              notification.unread
                                ? theme === "dark"
                                  ? "bg-purple-900/30 border border-purple-500/30"
                                  : "bg-indigo-100 border border-indigo-300"
                                : theme === "dark"
                                ? "bg-white/5 hover:bg-white/10"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  theme === "dark"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                                }`}
                              >
                                {notification.avatar}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-300"
                                      : "text-indigo-700"
                                  }`}
                                >
                                  <span className="font-bold">
                                    {notification.user}
                                  </span>{" "}
                                  {notification.message}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    theme === "dark"
                                      ? "text-gray-500"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {notification.time}
                                </p>
                              </div>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  theme === "dark" ? "hover:bg-white/10" : "hover:bg-indigo-100"
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-indigo-900" />
                )}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 transform hover:shadow-xl ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                }`}
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Create Post
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <TrendingTopics />
            <RecentActivity />
            <OnlineUsers />
          </div>
          <div className="lg:col-span-3 space-y-8">
            {viewedCommunity ? (
              <CommunityDiscussions
                community={viewedCommunity}
                onBack={() => setViewedCommunity(null)}
              />
            ) : (
              <>
                <div className="space-y-6">
                  <div
                    className={`flex items-center gap-2 p-2 rounded-2xl ${
                      theme === "dark" ? "bg-white/10" : "bg-indigo-100"
                    }`}
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
                          activeTab === tab
                            ? theme === "dark"
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : theme === "dark"
                            ? "text-gray-300 hover:text-white hover:bg-white/10"
                            : "text-indigo-700 hover:text-indigo-900 hover:bg-white/50"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Filter
                        className={`w-5 h-5 ${
                          theme === "dark" ? "text-gray-400" : "text-indigo-600"
                        }`}
                      />
                      <div className="flex items-center gap-2">
                        {filters.map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                              activeFilter === filter
                                ? theme === "dark"
                                  ? "bg-purple-600 text-white"
                                  : "bg-indigo-600 text-white"
                                : theme === "dark"
                                ? "bg-white/10 text-gray-300 hover:bg-white/20"
                                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <SortAsc
                        className={`w-5 h-5 ${
                          theme === "dark" ? "text-gray-400" : "text-indigo-600"
                        }`}
                      />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`px-4 py-2 rounded-xl border font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-105 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20"
                            : "bg-white border-indigo-200 text-indigo-900 focus:border-indigo-500 focus:ring-indigo-500/20"
                        }`}
                      >
                        {sortOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className={
                              theme === "dark" ? "bg-gray-800" : "bg-white"
                            }
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {activeTab !== "My Topics" && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Users
                        className={`w-6 h-6 ${
                          theme === "dark"
                            ? "text-yellow-400"
                            : "text-indigo-600"
                        }`}
                      />
                      <h2
                        className={`text-2xl font-black ${
                          theme === "dark" ? "text-white" : "text-indigo-900"
                        }`}
                      >
                        {activeTab} Communities
                      </h2>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          theme === "dark"
                            ? "bg-purple-600 text-white"
                            : "bg-indigo-600 text-white"
                        }`}
                      >
                        {communities.length}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {communities.map((community) => (
                        <CommunityCard
                          key={community._id}
                          community={community}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Discussions Section */}
                {filteredDiscussions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare
                        className={`w-6 h-6 ${
                          theme === "dark" ? "text-blue-400" : "text-indigo-600"
                        }`}
                      />
                      <h2
                        className={`text-2xl font-black ${
                          theme === "dark" ? "text-white" : "text-indigo-900"
                        }`}
                      >
                        Recent Discussions
                      </h2>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {filteredDiscussions.length}
                      </div>
                    </div>
                    <div className="space-y-8">
                      {filteredDiscussions.map((discussion) => (
                        <DiscussionCard
                          key={discussion._id}
                          discussion={discussion}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Full Post Modal */}
      <FullPostModal />
    </div>
  );
};

export default Discussions;
