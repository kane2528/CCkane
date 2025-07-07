"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Heart,
  MoreHorizontal,
  Bell,
  GraduationCap,
  Code,
  Palette,
  BookOpen,
  Trophy,
  Coffee,
  Sun,
  Moon,
  Phone,
  Mail,
  Plus,
  Bookmark,
  Share2,
  Flag,
  Eye,
  TrendingUp,
  Clock,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Pin,
  Calendar,
  MapPin,
  MessageCircle,
  Send,
  X,
  Sparkles,
  Activity,
  ChevronUp,
  ChevronDown,
  Award,
  ThumbsUp,
  Verified,
  Crown,
  Shield,
  Rocket,
  Globe,
  Filter,
  SortAsc,
  ExternalLink,
  Reply,
  Edit,
  Delete,
  CheckIcon as Report,
  Copy,
  Link,
  ImageIcon,
  Paperclip,
  Smile,
  AtSign,
  Hash,
  ChevronRight,
  ArrowUp,
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
  const token = Cookies.get("token");

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

  // Enhanced community data with voting stats
  // const communities = [
  //   {
  //     id: 1,
  //     name: "Computer Science",
  //     members: "1,234 Members",
  //     status: "Active",
  //     latest: "Project ideas for Hackathon...",
  //     contact: "cs.dept@campus.edu",
  //     phone: "+1 (123) 456-7890",
  //     icon: Code,
  //     color: "from-blue-500 to-purple-500",
  //     category: "Academics",
  //     description: "Discuss programming, algorithms, and CS concepts",
  //     moderators: 5,
  //     weeklyPosts: 45,
  //     badges: ["Verified", "Popular"],
  //     totalVotes: 1250,
  //     avgRating: 4.8,
  //   },
  //   {
  //     id: 2,
  //     name: "Campus Events",
  //     members: "3,456 Members",
  //     status: "Active",
  //     latest: "Upcoming tech fest registration...",
  //     contact: "events@campus.edu",
  //     phone: "+1 (234) 567-8901",
  //     icon: Calendar,
  //     color: "from-green-500 to-teal-500",
  //     category: "Social",
  //     description: "Stay updated with campus events and activities",
  //     moderators: 8,
  //     weeklyPosts: 67,
  //     badges: ["Official", "Trending"],
  //     totalVotes: 2100,
  //     avgRating: 4.9,
  //   },
  //   {
  //     id: 3,
  //     name: "Student Life",
  //     members: "2,100 Members",
  //     status: "Active",
  //     latest: "Best study spots on campus...",
  //     contact: "studentlife@campus.edu",
  //     phone: "+1 (345) 678-9012",
  //     icon: Coffee,
  //     color: "from-orange-500 to-red-500",
  //     category: "Social",
  //     description: "Share experiences about campus life",
  //     moderators: 3,
  //     weeklyPosts: 32,
  //     badges: ["Community Choice"],
  //     totalVotes: 890,
  //     avgRating: 4.6,
  //   },
  //   {
  //     id: 4,
  //     name: "Sports Hub",
  //     members: "876 Members",
  //     status: "Active",
  //     latest: "Game schedule for this week...",
  //     contact: "sports@campus.edu",
  //     phone: "+1 (456) 789-0123",
  //     icon: Trophy,
  //     color: "from-purple-500 to-pink-500",
  //     category: "Social",
  //     description: "Sports discussions and team formations",
  //     moderators: 4,
  //     weeklyPosts: 28,
  //     badges: ["Active"],
  //     totalVotes: 650,
  //     avgRating: 4.4,
  //   },
  //   {
  //     id: 5,
  //     name: "Design Club",
  //     members: "654 Members",
  //     status: "Active",
  //     latest: "UI/UX workshop this Friday...",
  //     contact: "design@campus.edu",
  //     phone: "+1 (567) 890-1234",
  //     icon: Palette,
  //     color: "from-pink-500 to-rose-500",
  //     category: "Academics",
  //     description: "Creative design discussions and critiques",
  //     moderators: 2,
  //     weeklyPosts: 19,
  //     badges: ["Creative"],
  //     totalVotes: 420,
  //     avgRating: 4.7,
  //   },
  //   {
  //     id: 6,
  //     name: "Study Groups",
  //     members: "1,987 Members",
  //     status: "Active",
  //     latest: "Calculus study group forming...",
  //     contact: "study@campus.edu",
  //     phone: "+1 (678) 901-2345",
  //     icon: BookOpen,
  //     color: "from-indigo-500 to-blue-500",
  //     category: "Academics",
  //     description: "Form study groups and share resources",
  //     moderators: 6,
  //     weeklyPosts: 41,
  //     badges: ["Helpful", "Popular"],
  //     totalVotes: 1100,
  //     avgRating: 4.8,
  //   },
  // ];

  // Enhanced discussions data with full content
  const discussions = [
    {
      id: 1,
      user: {
        name: "Jane Doe",
        avatar: "JD",
        university: "MIT",
        course: "Computer Science",
        reputation: 1250,
        badges: ["Top Contributor", "Helpful", "Verified"],
        isOnline: true,
        joinDate: "2023",
        level: "Expert",
        totalVotes: 450,
      },
      title: "Seeking study group for Calculus I",
      content:
        "Looking for motivated students to form a study group for Calculus I. We can meet twice a week and help each other with problem sets and exam prep. I have experience tutoring and can help explain difficult concepts.",
      fullContent: `Looking for motivated students to form a study group for Calculus I. We can meet twice a week and help each other with problem sets and exam prep. I have experience tutoring and can help explain difficult concepts.

## What we'll cover:
- Limits and continuity
- Derivatives and applications
- Integration techniques
- Fundamental theorem of calculus
- Real-world applications

## Meeting details:
- **When**: Tuesdays and Thursdays, 6-8 PM
- **Where**: Library Study Room 3 (or online if needed)
- **Duration**: Throughout the semester
- **Group size**: 4-6 students max

## What I bring:
- 3+ years of tutoring experience
- Strong foundation in calculus (A+ in Calc I, II, III)
- Patience and different teaching approaches
- Study materials and practice problems

## What I'm looking for:
- Committed students who won't skip sessions
- Willingness to help each other
- Basic algebra skills
- Positive attitude towards learning

## Study methodology:
1. **Review**: Go over lecture material from the week
2. **Practice**: Work through homework problems together
3. **Teach**: Take turns explaining concepts to each other
4. **Test prep**: Create and solve practice exams

Feel free to reach out if you're interested! We can start as early as next week. Also open to adjusting the schedule if needed.

**Bonus**: I have access to past exams and additional resources from the professor.`,
      timestamp: "2 hours ago",
      comments: 15,
      likes: 28,
      replies: 5,
      views: 156,
      upvotes: 42,
      downvotes: 3,
      tags: ["Study Group", "Mathematics", "Calculus"],
      contact: "janedoe@campus.edu",
      phone: "+1 (987) 654-3210",
      status: "open",
      isPinned: false,
      isBookmarked: false,
      category: "Academics",
      location: "Library Study Room 3",
      urgency: "medium",
      difficulty: "Intermediate",
      quality: "High",
      attachments: [
        { name: "calculus_syllabus.pdf", size: "2.3 MB", type: "pdf" },
        { name: "study_schedule.xlsx", size: "45 KB", type: "excel" },
      ],
    },
    {
      id: 2,
      user: {
        name: "John Smith",
        avatar: "JS",
        university: "Stanford",
        course: "Engineering",
        reputation: 890,
        badges: ["Local Expert", "Helper"],
        isOnline: false,
        joinDate: "2022",
        level: "Advanced",
        totalVotes: 320,
      },
      title: "Best places to eat near campus?",
      content:
        "New to campus and looking for good food recommendations. Preferably budget-friendly options that are walking distance from the main campus. Any hidden gems you'd recommend?",
      fullContent: `New to campus and looking for good food recommendations. Preferably budget-friendly options that are walking distance from the main campus. Any hidden gems you'd recommend?

## What I'm looking for:
- **Budget**: Under $15 per meal
- **Distance**: Within 10-minute walk from main campus
- **Cuisine**: Open to anything, but love Asian and Mediterranean food
- **Atmosphere**: Good for studying or hanging out with friends

## Dietary preferences:
- Vegetarian-friendly options preferred
- Not too spicy (mild to medium is fine)
- Good portion sizes

## Current favorites:
1. **Campus Café** - Great coffee and sandwiches, but gets crowded
2. **Pizza Corner** - Decent pizza, but limited vegetarian options

## Questions:
- Any places that offer student discounts?
- Best spots for late-night food (after 10 PM)?
- Places that deliver to dorms?
- Good breakfast spots before 8 AM classes?

I've been eating at the dining hall mostly, but want to explore more options. Also interested in grocery stores nearby for cooking in the dorm kitchen.

Thanks in advance for any recommendations! Happy to share my findings once I try new places.`,
      timestamp: "1 day ago",
      comments: 42,
      likes: 65,
      replies: 10,
      views: 234,
      upvotes: 89,
      downvotes: 12,
      tags: ["Food", "Campus Life", "Recommendations"],
      contact: "johnsmith@campus.edu",
      phone: "+1 (876) 543-2109",
      status: "solved",
      isPinned: true,
      isBookmarked: false,
      category: "Social",
      location: "Main Campus",
      urgency: "low",
      difficulty: "Beginner",
      quality: "High",
      attachments: [],
    },
    {
      id: 3,
      user: {
        name: "Sarah Wilson",
        avatar: "SW",
        university: "Harvard",
        course: "Business",
        reputation: 2100,
        badges: ["Team Leader", "Innovator", "Mentor", "Verified"],
        isOnline: true,
        joinDate: "2021",
        level: "Expert",
        totalVotes: 680,
      },
      title: "Hackathon team formation - Need developers!",
      content:
        "Organizing a team for the upcoming Smart City Hackathon. Looking for 2-3 developers with experience in React, Node.js, and mobile development. We have a solid business plan and design ready.",
      fullContent: `Organizing a team for the upcoming Smart City Hackathon. Looking for 2-3 developers with experience in React, Node.js, and mobile development. We have a solid business plan and design ready.

## About the Hackathon:
- **Event**: Smart City Solutions Hackathon 2024
- **Date**: March 15-17, 2024
- **Location**: Innovation Hub, Downtown
- **Prize**: $50,000 total prize pool
- **Theme**: Sustainable urban development

## Our Project Idea:
**"EcoCommute"** - A comprehensive platform that optimizes urban transportation by:
- Real-time traffic analysis using AI
- Carbon footprint tracking for different transport modes
- Gamified rewards for eco-friendly choices
- Integration with public transport APIs
- Community carpooling features

## What we have:
✅ **Business Plan**: Complete market analysis and revenue model  
✅ **UI/UX Design**: Figma prototypes for web and mobile  
✅ **Market Research**: Surveys from 500+ potential users  
✅ **Team Lead**: Experienced in project management  
✅ **Pitch Deck**: Ready for final presentation  

## What we need:
🔍 **Frontend Developer** (React/React Native)
- Experience with responsive design
- Knowledge of state management (Redux/Context)
- Mobile development experience preferred

🔍 **Backend Developer** (Node.js/Express)
- API development and database design
- Experience with real-time data processing
- Knowledge of cloud services (AWS/GCP)

🔍 **Full-Stack Developer** (Bonus)
- Can work on both frontend and backend
- DevOps knowledge is a plus

## Why join our team:
- **Experienced leadership**: I've led 3 successful hackathon teams
- **Strong foundation**: We're not starting from scratch
- **Networking**: Connect with industry mentors and judges
- **Learning**: Gain experience with cutting-edge technologies
- **Impact**: Build something that could actually help cities

## Time commitment:
- **Pre-hackathon**: 2-3 hours/week for planning (next 3 weeks)
- **Hackathon weekend**: Full commitment (48 hours)
- **Post-hackathon**: Optional continued development

## Team culture:
- Collaborative and inclusive environment
- Open to all skill levels (but some experience preferred)
- Focus on learning and having fun
- No toxic behavior tolerated

Interested? Send me a message with:
1. Your experience level
2. Preferred tech stack
3. Previous hackathon experience (if any)
4. Why you're interested in this project

Let's build something amazing together! 🚀`,
      timestamp: "3 hours ago",
      comments: 23,
      likes: 45,
      replies: 8,
      views: 189,
      upvotes: 67,
      downvotes: 5,
      tags: ["Hackathon", "Team Formation", "Development"],
      contact: "sarahwilson@campus.edu",
      phone: "+1 (765) 432-1098",
      status: "urgent",
      isPinned: false,
      isBookmarked: false,
      category: "Academics",
      location: "Innovation Lab",
      urgency: "high",
      difficulty: "Advanced",
      quality: "Excellent",
      attachments: [
        { name: "project_proposal.pdf", size: "5.2 MB", type: "pdf" },
        { name: "ui_mockups.fig", size: "12.8 MB", type: "figma" },
        { name: "market_research.xlsx", size: "890 KB", type: "excel" },
      ],
    },
  ];

  // Sample comments data
  const sampleComments = {
    1: [
      {
        id: 1,
        user: { name: "Alex Chen", avatar: "AC", level: "Advanced" },
        content:
          "This sounds great! I'm interested in joining. I struggled with calculus last semester.",
        timestamp: "1 hour ago",
        upvotes: 5,
        downvotes: 0,
        replies: [
          {
            id: 11,
            user: { name: "Jane Doe", avatar: "JD", level: "Expert" },
            content:
              "Perfect! Send me an email and we can discuss the details.",
            timestamp: "45 minutes ago",
            upvotes: 2,
            downvotes: 0,
          },
        ],
      },
      {
        id: 2,
        user: { name: "Maria Garcia", avatar: "MG", level: "Beginner" },
        content: "What's the expected time commitment per week?",
        timestamp: "30 minutes ago",
        upvotes: 3,
        downvotes: 0,
        replies: [],
      },
    ],
    2: [
      {
        id: 3,
        user: { name: "David Kim", avatar: "DK", level: "Expert" },
        content:
          "Try Panda Express near the library! Great orange chicken and student discounts.",
        timestamp: "12 hours ago",
        upvotes: 15,
        downvotes: 1,
        replies: [],
      },
    ],
    3: [
      {
        id: 4,
        user: { name: "Emma Thompson", avatar: "ET", level: "Advanced" },
        content:
          "I'm a React developer with 2 years experience. This project sounds amazing!",
        timestamp: "2 hours ago",
        upvotes: 8,
        downvotes: 0,
        replies: [],
      },
    ],
  };

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

  // Initialize comments
  useEffect(() => {
    setComments(sampleComments);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log("useeffect called");

      // Check token
      console.log("Token:", token);
      if (!token) {
        toast.error("You need to be logged in to view communities");
        console.warn("No token found, aborting fetch");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        console.log("Fetching with headers:", headers);

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

        console.log("Fetched data:", { all: allRes.data, user: userRes.data });

        setCommunities(allRes.data.communities);
        setUserCommunities(userRes.data.communities);
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Failed to load communities");
      }
    };

    fetchData();
  }, []);

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

  // Simulate online users count update
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter communities based on active tab
  // const filteredCommunities = communities.filter((community) => {
  //   if (activeTab === "All Communities") return true;
  //   return community.category === activeTab;
  // });

  // Enhanced filter and sort discussions
  const filteredDiscussions = discussions
    .filter((discussion) => {
      const matchesSearch =
        discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTab =
        activeTab === "All Communities" || discussion.category === activeTab;

      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Most Liked":
          return b.likes - a.likes;
        case "Most Commented":
          return b.comments - a.comments;
        case "Most Viewed":
          return b.views - a.views;
        case "Highest Voted":
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        case "Controversial":
          return b.upvotes + b.downvotes - (a.upvotes + a.downvotes);
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleBookmark = (id) => {
    const newBookmarks = new Set(bookmarkedPosts);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
    } else {
      newBookmarks.add(id);
    }
    setBookmarkedPosts(newBookmarks);
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
  const handleVote = (discussionId, voteType) => {
    const currentVote = votedPosts.get(discussionId);
    const newVotedPosts = new Map(votedPosts);

    if (currentVote === voteType) {
      newVotedPosts.delete(discussionId);
    } else {
      newVotedPosts.set(discussionId, voteType);
    }

    setVotedPosts(newVotedPosts);
    setShowVoteAnimation(discussionId + voteType);
    setTimeout(() => setShowVoteAnimation(null), 600);
  };

  const getVoteCount = (discussion, voteType) => {
    const userVote = votedPosts.get(discussion.id);
    let count = voteType === "up" ? discussion.upvotes : discussion.downvotes;

    if (userVote === voteType) {
      count += 1;
    } else if (userVote && userVote !== voteType) {
      if (voteType === "up" && userVote === "down") count += 1;
      if (voteType === "down" && userVote === "up") count += 1;
    }

    return count;
  };

  const handleQuickReply = (discussionId) => {
    if (replyText.trim()) {
      console.log(`Reply to ${discussionId}: ${replyText}`);
      setReplyText("");
      setShowQuickReply(null);
    }
  };

  const handleViewFullPost = (discussion) => {
    setSelectedDiscussion(discussion);
    setShowFullPost(true);
  };

  const handleAddComment = (discussionId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: { name: "You", avatar: "YU", level: "Student" },
        content: newComment,
        timestamp: "Just now",
        upvotes: 0,
        downvotes: 0,
        replies: [],
      };

      setComments((prev) => ({
        ...prev,
        [discussionId]: [...(prev[discussionId] || []), comment],
      }));
      setNewComment("");
    }
  };

  // Enhanced Community Card Component
  const CommunityCard = ({ community }) => {
    // const Icon = community.icon;
    // Fix members display: show count if array, else fallback to string
    const membersDisplay =
      Array.isArray(community.members)
        ? `${community.members.length} Members`
        : community.members || "0 Members";
    return (
      <div
        className={`group relative backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden ${
          theme === "dark"
            ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10"
            : "bg-gradient-to-br from-white to-gray-50 border-indigo-200 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50"
        }`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r ${community.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        ></div>

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${community.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
            >
              {/* <Icon className="w-8 h-8 text-white" /> */}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={`font-bold text-xl ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {community.name}
                </h3>
                {/* {community.badges.includes("Verified") && (
                  <Verified className="w-5 h-5 text-blue-500" />
                )}
                {community.badges.includes("Official") && (
                  <Shield className="w-5 h-5 text-green-500" />
                )} */}
              </div>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-indigo-600"
                }`}
              >
                {membersDisplay}
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
              {community.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(community.avgRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span
              className={`text-sm font-bold ml-1 ${
                theme === "dark" ? "text-yellow-400" : "text-yellow-600"
              }`}
            >
              {community.avgRating}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp
              className={`w-4 h-4 ${
                theme === "dark" ? "text-green-400" : "text-green-500"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-indigo-600"
              }`}
            >
              {community.totalVotes}
            </span>
          </div>
        </div>

        <p
          className={`text-sm mb-6 ${
            theme === "dark" ? "text-gray-300" : "text-indigo-700"
          }`}
        >
          {community.description}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div
              className={`text-lg font-black ${
                theme === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
            >
              {community.moderators}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-indigo-600"
              }`}
            >
              Moderators
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-lg font-black ${
                theme === "dark" ? "text-green-400" : "text-green-500"
              }`}
            >
              {community.weeklyPosts}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-indigo-600"
              }`}
            >
              Posts/Week
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-lg font-black ${
                theme === "dark" ? "text-purple-400" : "text-purple-500"
              }`}
            >
              {Math.floor(community.totalVotes / 100)}k
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-indigo-600"
              }`}
            >
              Total Votes
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {/* {community.badges.map((badge, i) => (
            <span
              key={i}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                badge === "Verified"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : badge === "Official"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : badge === "Trending"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : theme === "dark"
                  ? "bg-yellow-900/30 text-yellow-300 border border-yellow-500/30"
                  : "bg-yellow-100 text-yellow-700 border border-yellow-300"
              }`}
            >
              {badge}
            </span>
          ))} */}
        </div>

        <div className="mb-6">
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-300" : "text-indigo-700"
            }`}
          >
            Latest: {community.latest}
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <Mail
              className={`w-4 h-4 ${
                theme === "dark" ? "text-yellow-400" : "text-indigo-600"
              }`}
            />
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-indigo-600"
              }`}
            >
              {community.admin?.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone
              className={`w-4 h-4 ${
                theme === "dark" ? "text-yellow-400" : "text-indigo-600"
              }`}
            />
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-indigo-600"
              }`}
            >
              {community.phone}
            </span>
          </div>
        </div>

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
      </div>
    );
  };

  // Enhanced Discussion Card Component with Voting
  const DiscussionCard = ({ discussion }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "solved":
          return "text-green-400 bg-green-900/20 border-green-500/30";
        case "urgent":
          return "text-red-400 bg-red-900/20 border-red-500/30";
        case "open":
          return "text-blue-400 bg-blue-900/20 border-blue-500/30";
        default:
          return "text-gray-400 bg-gray-900/20 border-gray-500/30";
      }
    };

    const getUrgencyIcon = (urgency) => {
      switch (urgency) {
        case "high":
          return <AlertCircle className="w-4 h-4 text-red-400" />;
        case "medium":
          return <Clock className="w-4 h-4 text-yellow-400" />;
        default:
          return <CheckCircle className="w-4 h-4 text-green-400" />;
      }
    };

    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case "Beginner":
          return "bg-green-500/20 text-green-400 border-green-500/30";
        case "Intermediate":
          return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        case "Advanced":
          return "bg-red-500/20 text-red-400 border-red-500/30";
        default:
          return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      }
    };

    const getQualityIcon = (quality) => {
      switch (quality) {
        case "Excellent":
          return <Crown className="w-4 h-4 text-yellow-400" />;
        case "High":
          return <Award className="w-4 h-4 text-blue-400" />;
        default:
          return <Star className="w-4 h-4 text-gray-400" />;
      }
    };

    const userVote = votedPosts.get(discussion.id);
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
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
            discussion.quality === "Excellent"
              ? "bg-gradient-to-r from-yellow-400 to-orange-400"
              : discussion.quality === "High"
              ? "bg-gradient-to-r from-blue-400 to-purple-400"
              : "bg-gradient-to-r from-gray-400 to-gray-500"
          }`}
        ></div>

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                } ${
                  discussion.user.level === "Master"
                    ? "ring-4 ring-yellow-400"
                    : discussion.user.level === "Expert"
                    ? "ring-2 ring-blue-400"
                    : ""
                }`}
              >
                {discussion.user.avatar}
              </div>
              {discussion.user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              )}
              {discussion.user.level === "Master" && (
                <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4
                  className={`font-bold text-lg ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {discussion.user.name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-yellow-300" : "text-yellow-600"
                    }`}
                  >
                    {discussion.user.reputation}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    discussion.user.level === "Master"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : discussion.user.level === "Expert"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                >
                  {discussion.user.level}
                </span>
                <button
                  onClick={() => toggleFollow(discussion.user.name)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${
                    followedUsers.has(discussion.user.name)
                      ? theme === "dark"
                        ? "bg-purple-600 text-white"
                        : "bg-indigo-600 text-white"
                      : theme === "dark"
                      ? "bg-white/10 text-gray-300 hover:bg-white/20"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`}
                >
                  {followedUsers.has(discussion.user.name)
                    ? "Following"
                    : "Follow"}
                </button>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap
                    className={`w-4 h-4 ${
                      theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-yellow-300" : "text-indigo-700"
                    }`}
                  >
                    {discussion.user.course} at {discussion.user.university}
                  </span>
                </div>
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  • {discussion.timestamp}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {discussion.user.badges.map((badge, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2 py-1 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                      badge === "Verified"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : badge === "Top Contributor"
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : badge === "Mentor"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : theme === "dark"
                        ? "bg-indigo-900/50 text-indigo-300 border border-indigo-500/30"
                        : "bg-indigo-100 text-indigo-700 border border-indigo-300"
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {discussion.isPinned && (
              <Pin
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                }`}
              />
            )}
            {getQualityIcon(discussion.quality)}
            <button
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-white/10" : "hover:bg-indigo-100"
              }`}
            >
              <MoreHorizontal
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-gray-400" : "text-indigo-600"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(
              discussion.status
            )}`}
          >
            {discussion.status.toUpperCase()}
          </span>
          <div className="flex items-center gap-1">
            {getUrgencyIcon(discussion.urgency)}
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {discussion.urgency} priority
            </span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium border ${getDifficultyColor(
              discussion.difficulty
            )}`}
          >
            {discussion.difficulty}
          </span>
          {discussion.location && (
            <div className="flex items-center gap-1">
              <MapPin
                className={`w-4 h-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {discussion.location}
              </span>
            </div>
          )}
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

        {discussion.attachments && discussion.attachments.length > 0 && (
          <div className="mb-6">
            <h4
              className={`text-sm font-bold mb-3 ${
                theme === "dark" ? "text-gray-300" : "text-indigo-700"
              }`}
            >
              Attachments:
            </h4>
            <div className="flex flex-wrap gap-2">
              {discussion.attachments.map((attachment, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10"
                      : "bg-indigo-50 border-indigo-200"
                  }`}
                >
                  <Paperclip
                    className={`w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-indigo-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    {attachment.name}
                  </span>
                  <span
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    ({attachment.size})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`flex items-center gap-6 mb-6 p-4 rounded-xl ${
            theme === "dark" ? "bg-black/20" : "bg-indigo-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Mail
              className={`w-4 h-4 ${
                theme === "dark" ? "text-yellow-400" : "text-indigo-600"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-indigo-700"
              }`}
            >
              {discussion.contact}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone
              className={`w-4 h-4 ${
                theme === "dark" ? "text-yellow-400" : "text-indigo-600"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-indigo-700"
              }`}
            >
              {discussion.phone}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote(discussion.id, "up")}
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
                {showVoteAnimation === discussion.id + "up" && (
                  <div className="absolute animate-ping">
                    <ChevronUp className="w-5 h-5 text-green-400" />
                  </div>
                )}
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
                onClick={() => handleVote(discussion.id, "down")}
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
                {showVoteAnimation === discussion.id + "down" && (
                  <div className="absolute animate-ping">
                    <ChevronDown className="w-5 h-5 text-red-400" />
                  </div>
                )}
              </button>
            </div>

            <button
              onClick={() => toggleLike(discussion.id)}
              className="flex items-center gap-2 group transition-all duration-300 hover:scale-105"
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${
                  likedPosts.has(discussion.id)
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
                {discussion.likes + (likedPosts.has(discussion.id) ? 1 : 0)}
              </span>
            </button>

            <button className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
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
                {discussion.comments}
              </span>
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
                {discussion.views}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(discussion.id)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                bookmarkedPosts.has(discussion.id)
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
                showQuickReply === discussion.id ? null : discussion.id
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

        {showQuickReply === discussion.id && (
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
                    onClick={() => handleQuickReply(discussion.id)}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
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
      </div>
    );
  };

  // Full Post Modal Component
  const FullPostModal = () => {
    if (!selectedDiscussion || !showFullPost) return null;

    const discussionComments = comments[selectedDiscussion.id] || [];

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
            {/* User Info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  } ${
                    selectedDiscussion.user.level === "Master"
                      ? "ring-4 ring-yellow-400"
                      : selectedDiscussion.user.level === "Expert"
                      ? "ring-2 ring-blue-400"
                      : ""
                  }`}
                >
                  {selectedDiscussion.user.avatar}
                </div>
                {selectedDiscussion.user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3
                    className={`text-xl font-bold ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    {selectedDiscussion.user.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-600"
                      }`}
                    >
                      {selectedDiscussion.user.reputation}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedDiscussion.user.level === "Master"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : selectedDiscussion.user.level === "Expert"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}
                  >
                    {selectedDiscussion.user.level}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-yellow-300" : "text-indigo-700"
                      }`}
                    >
                      {selectedDiscussion.user.course} at{" "}
                      {selectedDiscussion.user.university}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    • {selectedDiscussion.timestamp}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedDiscussion.user.badges.map((badge, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        badge === "Verified"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : badge === "Top Contributor"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : badge === "Mentor"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : theme === "dark"
                          ? "bg-indigo-900/50 text-indigo-300 border border-indigo-500/30"
                          : "bg-indigo-100 text-indigo-700 border border-indigo-300"
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

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
                {selectedDiscussion.fullContent}
              </div>
            </div>

            {/* Tags */}
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

            {/* Attachments */}
            {selectedDiscussion.attachments &&
              selectedDiscussion.attachments.length > 0 && (
                <div className="mb-8">
                  <h4
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Attachments
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDiscussion.attachments.map((attachment, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                          theme === "dark"
                            ? "bg-white/5 border-white/10 hover:bg-white/10"
                            : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                        }`}
                      >
                        <Paperclip
                          className={`w-5 h-5 ${
                            theme === "dark"
                              ? "text-gray-400"
                              : "text-indigo-600"
                          }`}
                        />
                        <div className="flex-1">
                          <div
                            className={`font-medium ${
                              theme === "dark"
                                ? "text-white"
                                : "text-indigo-900"
                            }`}
                          >
                            {attachment.name}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {attachment.size}
                          </div>
                        </div>
                        <ExternalLink
                          className={`w-4 h-4 ${
                            theme === "dark"
                              ? "text-gray-400"
                              : "text-indigo-600"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Contact Info */}
            <div
              className={`p-6 rounded-xl mb-8 ${
                theme === "dark" ? "bg-white/5" : "bg-indigo-50"
              }`}
            >
              <h4
                className={`text-lg font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail
                    className={`w-5 h-5 ${
                      theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                    }`}
                  />
                  <span
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    {selectedDiscussion.contact}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone
                    className={`w-5 h-5 ${
                      theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                    }`}
                  />
                  <span
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    {selectedDiscussion.phone}
                  </span>
                </div>
              </div>
            </div>

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
                        onClick={() => handleAddComment(selectedDiscussion.id)}
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
                  <div key={comment.id} className="space-y-4">
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
                          {comment.user.avatar}
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
                              {comment.user.name}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                comment.user.level === "Expert"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : comment.user.level === "Advanced"
                                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                  : "bg-green-500/20 text-green-400 border border-green-500/30"
                              }`}
                            >
                              {comment.user.level}
                            </span>
                            <span
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {comment.timestamp}
                            </span>
                          </div>
                          <p
                            className={`mb-4 ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-indigo-800"
                            }`}
                          >
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 group">
                              <ChevronUp
                                className={`w-4 h-4 ${
                                  theme === "dark"
                                    ? "text-gray-400 group-hover:text-green-400"
                                    : "text-gray-600 group-hover:text-green-500"
                                } transition-colors duration-200`}
                              />
                              <span
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {comment.upvotes}
                              </span>
                            </button>
                            <button className="flex items-center gap-2 group">
                              <ChevronDown
                                className={`w-4 h-4 ${
                                  theme === "dark"
                                    ? "text-gray-400 group-hover:text-red-400"
                                    : "text-gray-600 group-hover:text-red-500"
                                } transition-colors duration-200`}
                              />
                              <span
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {comment.downvotes}
                              </span>
                            </button>
                            <button
                              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                theme === "dark"
                                  ? "text-gray-400 hover:text-white"
                                  : "text-gray-600 hover:text-indigo-900"
                              }`}
                            >
                              <Reply className="w-4 h-4" />
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 space-y-4">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`p-4 rounded-xl border ${
                              theme === "dark"
                                ? "bg-white/5 border-white/10"
                                : "bg-indigo-50 border-indigo-200"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                                  theme === "dark"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                                }`}
                              >
                                {reply.user.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`font-bold text-sm ${
                                      theme === "dark"
                                        ? "text-white"
                                        : "text-indigo-900"
                                    }`}
                                  >
                                    {reply.user.name}
                                  </span>
                                  <span
                                    className={`text-xs ${
                                      theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {reply.timestamp}
                                  </span>
                                </div>
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-300"
                                      : "text-indigo-800"
                                  }`}
                                >
                                  {reply.content}
                                </p>
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
                      theme === "dark" ? "text-yellow-400" : "text-indigo-600"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {communities.map((community) => (
                    <CommunityCard key={community._id || community.id} community={community} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare
                  className={`w-6 h-6 ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
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
                      ? "bg-green-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {filteredDiscussions.length}
                </div>
              </div>
              <div className="space-y-8">
                {filteredDiscussions.map((discussion) => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Full Post Modal */}
      <FullPostModal />
    </div>
  );
};

export default Discussions;