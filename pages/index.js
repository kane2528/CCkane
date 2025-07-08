import { useState, useEffect, useRef } from "react";
import {
  Search,
  MessageSquare,
  Bell,
  Star,
  ArrowRight,
  CheckCircle,
  Gift,
  Sparkles,
  Rocket,
  Heart,
  Sun,
  Moon,
  Quote,
  Users,
  GraduationCap,
  Calendar,
  Filter,
  MapPin,
  Code,
  Mic,
  Notebook,
  GroupIcon as TeamIcon,
  Cpu,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Send,
  Bot,
  X,
  Minimize2,
  Maximize2,
  HelpCircle,
  Mail,
  Award,
  Globe,
  Crown,
  TrendingUp,
  Network,
  DollarSign,
  Plane,
  BookOpen,
  Target,
  Phone,
  User,
  LocateIcon as LocationIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ImageCarousel from "./components/ImageCarousel";
import Navbar from "./components/navbar";

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [showOffer, setShowOffer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDiscussionIndex, setCurrentDiscussionIndex] = useState(0);

  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: "Hi! I'm Campus Assistant 🤖 How can I help you today?",
      timestamp: new Date(),
      suggestions: [
        "Find Events",
        "Join Community",
        "Get Started",
        "Learn More",
      ],
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState("");

  // Campus Ambassador states
  const [showAmbassadorModal, setShowAmbassadorModal] = useState(false);
  const [ambassadorForm, setAmbassadorForm] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    course: "",
    year: "",
    skills: [],
    experience: "",
    motivation: "",
    agreeToTerms: false,
  });

  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const studentActivities = [
    "🚀 Aayushi from NIT just joined 'AI Builders Hackathon' - 2 minutes ago",
    "🎯 Rohan from IITB registered for 'Code Sprint' - 5 minutes ago",
    "🧠 Mehak from BITS is attending 'Neural Networks Talk' - 10 minutes ago",
    "👩‍💻 Anjali from VIT joined 'Frontend Fiesta' - 15 minutes ago",
    "📱 Aryan from IIITD is in 'Mobile Dev Bootcamp' - 20 minutes ago",
  ];

  // Enhanced member discussions data
  const memberDiscussions = [
    {
      id: 1,
      user: "Priya Sharma",
      university: "IIT Delhi",
      avatar: "PS",
      message:
        "Just finished an amazing hackathon! Looking for teammates for the next one. Anyone interested in AI/ML projects?",
      likes: 24,
      replies: 8,
      time: "2 hours ago",
      topic: "Hackathon",
    },
    {
      id: 2,
      user: "Arjun Patel",
      university: "BITS Pilani",
      avatar: "AP",
      message:
        "Organizing a tech talk on blockchain next week. We have 50+ registrations already! Who's excited?",
      likes: 31,
      replies: 12,
      time: "4 hours ago",
      topic: "Tech Talk",
    },
    {
      id: 3,
      user: "Sneha Reddy",
      university: "NIT Trichy",
      avatar: "SR",
      message:
        "Our coding bootcamp was a huge success! 200+ students learned React and Node.js. Planning another one soon.",
      likes: 45,
      replies: 15,
      time: "6 hours ago",
      topic: "Workshop",
    },
    {
      id: 4,
      user: "Rahul Kumar",
      university: "IIIT Hyderabad",
      avatar: "RK",
      message:
        "Looking for a design partner for our startup idea. We're building an EdTech platform. DM if interested!",
      likes: 18,
      replies: 6,
      time: "8 hours ago",
      topic: "Collaboration",
    },
    {
      id: 5,
      user: "Ananya Singh",
      university: "VIT Chennai",
      avatar: "AS",
      message:
        "Just got selected for Google Summer of Code! Thanks to everyone who helped me prepare. Happy to share tips!",
      likes: 67,
      replies: 23,
      time: "10 hours ago",
      topic: "Achievement",
    },
  ];

  // Campus Ambassador benefits
  const ambassadorBenefits = [
    {
      icon: Crown,
      title: "Recognition & Status",
      description:
        "Get official recognition as a Campus Ambassador with exclusive badges and certificates",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Network,
      title: "Exclusive Network",
      description:
        "Connect with ambassadors from top colleges and industry professionals",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Career Opportunities",
      description:
        "Priority access to internships, job opportunities, and startup collaborations",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: BookOpen,
      title: "Skill Development",
      description:
        "Free access to premium courses, workshops, and mentorship programs",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: DollarSign,
      title: "Monthly Stipend",
      description:
        "Earn ₹5,000-15,000 monthly based on your performance and activities",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      icon: Plane,
      title: "Travel & Events",
      description:
        "Sponsored trips to conferences, hackathons, and exclusive ambassador meetups",
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  // Available skills for selection
  const availableSkills = [
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "Data Science",
    "UI/UX Design",
    "Digital Marketing",
    "Content Creation",
    "Event Management",
    "Public Speaking",
    "Leadership",
    "Community Building",
    "Social Media",
    "Photography",
    "Video Editing",
  ];

  // Chatbot responses
  const chatbotResponses = {
    "find events": {
      message:
        "Great! I can help you find events. What type of events are you interested in?",
      suggestions: [
        "Hackathons",
        "Workshops",
        "Tech Talks",
        "Competitions",
        "All Events",
      ],
    },
    hackathons: {
      message:
        "Awesome! Here are some upcoming hackathons:\n\n🚀 Annual Hackathon - IIT Delhi (Oct 15-17)\n🤖 AI & Robotics Challenge - IIT Bombay (Jan 20-22)\n\nWould you like me to help you register or find teammates?",
      suggestions: ["Register for Event", "Find Teammates", "View More Events"],
    },
    workshops: {
      message:
        "Perfect! Here are some popular workshops:\n\n💻 Coding Bootcamp - NIT Trichy (Dec 10-12)\n🎨 Design Thinking Jam - NID Ahmedabad (Feb 7)\n\nInterested in any of these?",
      suggestions: [
        "Join Workshop",
        "Get Notifications",
        "Browse All Workshops",
      ],
    },
    "tech talks": {
      message:
        "Excellent choice! Here are upcoming tech talks:\n\n🎤 Tech Speaker Series - BITS Pilani (Nov 5)\n🔮 Future of Tech Panel - IIIT Hyderabad (Mar 15)\n\nWant to attend?",
      suggestions: ["Reserve Seat", "Set Reminder", "View Speaker Details"],
    },
    "join community": {
      message: "Welcome to our community! 🎉 Here's how you can get started:",
      suggestions: [
        "Create Profile",
        "Join Discussions",
        "Find Study Groups",
        "Connect with Peers",
      ],
    },
    "get started": {
      message:
        "Let's get you started! Here's what you can do:\n\n1️⃣ Create your profile\n2️⃣ Explore events\n3️⃣ Join discussions\n4️⃣ Connect with students\n\nWhat would you like to do first?",
      suggestions: [
        "Create Profile",
        "Explore Events",
        "Join Discussions",
        "Learn More",
      ],
    },
    "learn more": {
      message:
        "CampusConnect helps students discover events, find teammates, and build communities. We use AI to match you with relevant opportunities!\n\nWhat interests you most?",
      suggestions: [
        "AI Matching",
        "Team Formation",
        "Event Discovery",
        "Community Features",
      ],
    },
    default: {
      message:
        "I'm here to help! You can ask me about:\n\n• Finding events and opportunities\n• Joining our community\n• Getting started with CampusConnect\n• Learning about our features\n\nWhat would you like to know?",
      suggestions: [
        "Find Events",
        "Join Community",
        "Get Started",
        "Learn More",
      ],
    },
  };

  // FAQ data
  const faqData = [
    {
      question: "How do I find events relevant to my interests?",
      answer:
        "Our AI-powered recommendation system learns from your profile and activity to suggest events that match your skills and interests. You can also use our advanced search filters.",
    },
    {
      question: "Is CampusConnect free to use?",
      answer:
        "Yes! CampusConnect is completely free for students. We believe in making opportunities accessible to everyone.",
    },
    {
      question: "How can I find teammates for hackathons?",
      answer:
        "Use our Team Formation feature! It matches you with students who have complementary skills. Just specify what you're looking for and we'll help you connect.",
    },
    {
      question: "Can I organize my own events?",
      answer:
        "Event organizers can create and promote their events on our platform. We provide tools for registration, communication, and management.",
    },
  ];

  // Success metrics
  const successMetrics = [
    {
      icon: Users,
      value: "50K+",
      label: "Active Students",
      color: "text-blue-400",
    },
    {
      icon: Calendar,
      value: "2K+",
      label: "Events Hosted",
      color: "text-green-400",
    },
    {
      icon: Award,
      value: "95%",
      label: "Success Rate",
      color: "text-yellow-400",
    },
    { icon: Globe, value: "200+", label: "Colleges", color: "text-purple-400" },
  ];

  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 4,
    minutes: 8,
    seconds: 46,
  });

  const seatsLeft = 27;

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    setIsVisible(true);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Enhanced countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDiscussionIndex((prev) =>
        prev === memberDiscussions.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [memberDiscussions.length]);

  // Chatbot functions
  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newUserMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: userInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = getBotResponse(userInput.toLowerCase());
      const newBotMessage = {
        id: chatMessages.length + 2,
        type: "bot",
        message: botResponse.message,
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
      };
      setChatMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (input) => {
    for (const [key, response] of Object.entries(chatbotResponses)) {
      if (input.includes(key)) {
        return response;
      }
    }
    return chatbotResponses.default;
  };

  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate newsletter signup
      setTimeout(() => {
        setShowNewsletter(false);
        setEmail("");
        // Could add a success message here
      }, 1000);
    }
  };

  // Ambassador form handlers
  const handleAmbassadorFormChange = (field, value) => {
    setAmbassadorForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillToggle = (skill) => {
    setAmbassadorForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleAmbassadorSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Ambassador application submitted:", ambassadorForm);
    setShowAmbassadorModal(false);
    // Reset form
    setAmbassadorForm({
      name: "",
      email: "",
      phone: "",
      university: "",
      course: "",
      year: "",
      skills: [],
      experience: "",
      motivation: "",
      agreeToTerms: false,
    });
  };

  const features = [
    {
      icon: Search,
      title: "AI-Powered Discovery",
      description:
        "Smart recommendations that learn your interests and connect you with perfect events, opportunities, and communities.",
      gradient: "from-indigo-500 to-purple-500",
      highlight: "Machine Learning Powered",
      delay: "0.1s",
    },
    {
      icon: TeamIcon,
      title: "Team Formation",
      description:
        "Find teammates with complementary skills for hackathons and projects using our intelligent matching system.",
      gradient: "from-purple-500 to-pink-500",
      highlight: "Skill-Based Matching",
      delay: "0.2s",
    },
    {
      icon: Calendar,
      title: "Event Calendar",
      description:
        "Never miss important campus events with integrated reminders and seamless calendar synchronization.",
      gradient: "from-blue-500 to-teal-500",
      highlight: "Google Calendar Sync",
      delay: "0.3s",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Intelligent notification system that learns your preferences and delivers personalized updates at the perfect time.",
      gradient: "from-purple-400 to-indigo-400",
      highlight: "AI-Driven Insights",
      delay: "0.4s",
    },
  ];

  const upcomingEvents = [
    {
      title: "Annual Hackathon",
      date: "Oct 15-17, 2023",
      type: "Hackathon",
      icon: <Code className="w-5 h-5" />,
      university: "IIT Delhi",
      participants: "500+",
      delay: "0.1s",
      tags: ["hackathon", "coding", "competition", "ai", "ml"],
    },
    {
      title: "Tech Speaker Series",
      date: "Nov 5, 2023",
      type: "Lecture",
      icon: <Mic className="w-5 h-5" />,
      university: "BITS Pilani",
      participants: "200+",
      delay: "0.2s",
      tags: ["tech", "speaker", "lecture", "blockchain", "web3"],
    },
    {
      title: "Coding Bootcamp",
      date: "Dec 10-12, 2023",
      type: "Workshop",
      icon: <Notebook className="w-5 h-5" />,
      university: "NIT Trichy",
      participants: "150+",
      delay: "0.3s",
      tags: ["coding", "bootcamp", "react", "nodejs", "workshop"],
    },
    {
      title: "AI & Robotics Challenge",
      date: "Jan 20-22, 2024",
      type: "Competition",
      icon: <Cpu className="w-5 h-5" />,
      university: "IIT Bombay",
      participants: "300+",
      delay: "0.4s",
      tags: ["ai", "robotics", "competition", "machine learning"],
    },
    {
      title: "Design Thinking Jam",
      date: "Feb 7, 2024",
      type: "Workshop",
      icon: <PenTool className="w-5 h-5" />,
      university: "NID Ahmedabad",
      participants: "100+",
      delay: "0.5s",
      tags: ["design", "thinking", "workshop", "ui", "ux"],
    },
    {
      title: "Future of Tech Panel",
      date: "Mar 15, 2024",
      type: "Talk",
      icon: <Users className="w-5 h-5" />,
      university: "IIIT Hyderabad",
      participants: "250+",
      delay: "0.6s",
      tags: ["tech", "panel", "future", "innovation", "startup"],
    },
  ];

  const testimonials = [
    {
      name: "Ananya Sharma",
      university: "IIT Delhi",
      course: "Computer Science",
      review:
        "Found my perfect hackathon team in just 2 days! We won the Smart India Hackathon thanks to CampusConnect's amazing matching system.",
      rating: 5,
      avatar: "AS",
      delay: "0.1s",
    },
    {
      name: "Rohan Verma",
      university: "BITS Pilani",
      course: "Electronics Engineering",
      review:
        "The event discovery saved me hours. I attended 3x more workshops this semester and my network has grown exponentially!",
      rating: 5,
      avatar: "RV",
      delay: "0.2s",
    },
    {
      name: "Priya Nair",
      university: "NIT Trichy",
      course: "Information Technology",
      review:
        "I've joined 3 new student clubs thanks to the discovery system. The community features are absolutely amazing!",
      rating: 5,
      avatar: "PN",
      delay: "0.3s",
    },
  ];

  const stats = [
    { value: "3,200+", label: "Students Joined", icon: Users },
    { value: "120+", label: "Events Hosted", icon: Calendar },
    { value: "45+", label: "Campuses", icon: GraduationCap },
  ];

  const howItWorksSteps = [
    {
      icon: "/profile.svg",
      title: "Create Profile",
      description:
        "Sign up as student or organizer in 30 seconds with skill verification",
      step: "1",
    },
    {
      icon: "/explore.svg",
      title: "Explore & Discover",
      description:
        "Find events or students by skills, interests, and location preferences",
      step: "2",
    },
    {
      icon: "/Collaborate.svg",
      title: "Connect & Collaborate",
      description:
        "Message and collaborate instantly with built-in project management tools",
      step: "3",
    },
  ];

  const searchFeatures = [
    {
      icon: <Filter className="w-5 h-5" />,
      text: "Filter by event type (Hackathons, Talks, Workshops, Competitions)",
    },
    {
      icon: <Code className="w-5 h-5" />,
      text: "Search by skills (Web Dev, AI, Design, Data Science, Mobile)",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      text: "Location-based recommendations with distance preferences",
    },
  ];

  // Filter events based on search query
  const filteredEvents = upcomingEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const nextDiscussion = () => {
    setCurrentDiscussionIndex((prev) =>
      prev === memberDiscussions.length - 1 ? 0 : prev + 1
    );
  };

  const prevDiscussion = () => {
    setCurrentDiscussionIndex((prev) =>
      prev === 0 ? memberDiscussions.length - 1 : prev - 1
    );
  };

  // Component definitions (keeping existing ones and adding new ones)
  const AnimatedCounter = ({ value, label, icon: Icon }) => (
    <div
      className={`group ${
        theme === "dark"
          ? "bg-white/10 hover:bg-white/15 hover:shadow-purple-500/20"
          : "bg-indigo-50 hover:bg-indigo-100 hover:shadow-indigo-500/20"
      } backdrop-blur-xl rounded-2xl p-6 border ${
        theme === "dark" ? "border-white/20" : "border-indigo-200"
      } transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
    >
      <div className="flex items-center justify-center mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-500 to-yellow-400"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
          } group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div
        className={`text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300 text-center ${
          theme === "dark"
            ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-300"
            : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
        }`}
      >
        {value}
      </div>
      <div
        className={`font-medium text-center ${
          theme === "dark" ? "text-gray-300" : "text-indigo-700"
        }`}
      >
        {label}
      </div>
    </div>
  );

  const FeatureCard = ({ feature, index }) => {
    const Icon = feature.icon;
    return (
      <div
        className={`group relative ${
          theme === "dark"
            ? "bg-white/5 hover:bg-white/10"
            : "bg-yellow-50 hover:bg-yellow-100"
        } backdrop-blur-xl rounded-3xl p-8 border ${
          theme === "dark" ? "border-white/10" : "border-yellow-200"
        } transform hover:-translate-y-4 hover:shadow-2xl transition-all duration-500`}
        style={{ animationDelay: feature.delay }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10   rounded-3xl`}
        ></div>
        <div
          className={`relative w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6   shadow-lg`}
        >
          <Icon className="w-10 h-10 text-white" />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
          ></div>
        </div>
        <h3
          className={`text-2xl font-bold mb-4   ${
            theme === "dark"
              ? "text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-yellow-300"
              : "text-indigo-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600"
          }`}
        >
          {feature.title}
        </h3>
        <p
          className={`leading-relaxed mb-6   ${
            theme === "dark"
              ? "text-gray-300 group-hover:text-gray-200"
              : "text-indigo-700 group-hover:text-indigo-800"
          }`}
        >
          {feature.description}
        </p>
        <div
          className={`inline-flex items-center gap-2 bg-gradient-to-r ${
            feature.gradient
          } bg-opacity-20 backdrop-blur-sm border ${
            theme === "dark" ? "border-white/20" : "border-indigo-200"
          } rounded-full px-4 py-2 group-hover:scale-105 transition-transform duration-300`}
        >
          <CheckCircle
            className={`w-4 h-4 ${
              theme === "dark" ? "text-yellow-400" : "text-indigo-600"
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-white" : "text-indigo-800"
            }`}
          >
            {feature.highlight}
          </span>
        </div>
      </div>
    );
  };

  const TestimonialCard = ({ testimonial, index }) => (
    <div
      className={`group relative backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
        theme === "dark"
          ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
          : "bg-yellow-50/80 hover:bg-yellow-100/80 border-yellow-200 hover:border-yellow-300"
      }`}
      style={{ animationDelay: testimonial.delay }}
    >
      <div className="absolute -top-4 -left-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
          } shadow-lg`}
        >
          <Quote className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-1 mb-6 mt-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 fill-current ${
              theme === "dark" ? "text-yellow-400" : "text-yellow-500"
            } animate-pulse`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <blockquote
        className={`text-lg leading-relaxed mb-8 ${
          theme === "dark"
            ? "text-gray-300 group-hover:text-white"
            : "text-indigo-800 group-hover:text-indigo-900"
        }  `}
      >
        {`"${testimonial.review}"`}
      </blockquote>
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
          } shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {testimonial.avatar}
        </div>
        <div className="flex-1">
          <div
            className={`font-bold text-lg ${
              theme === "dark" ? "text-white" : "text-indigo-900"
            }`}
          >
            {testimonial.name}
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap
              className={`w-4 h-4 ${
                theme === "dark" ? "text-yellow-400" : "text-indigo-600"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-yellow-300" : "text-indigo-700"
              }`}
            >
              {testimonial.course}
            </span>
          </div>
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-indigo-600"
            }`}
          >
            {testimonial.university}
          </div>
        </div>
      </div>
      <div
        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-r from-indigo-500 to-purple-500"
            : "bg-gradient-to-r from-indigo-400 to-purple-400"
        }`}
      ></div>
    </div>
  );

  const EventCard = ({ event }) => (
    <div
      className={`group relative backdrop-blur-xl rounded-3xl p-8 border transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ${
        theme === "dark"
          ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
          : "bg-yellow-50/80 hover:bg-yellow-100/80 border-yellow-200 hover:border-yellow-300"
      }`}
      style={{ animationDelay: event.delay }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`p-3 rounded-xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
          } group-hover:scale-110 transition-transform duration-300`}
        >
          {event.icon}
        </div>
        <span
          className={`font-bold px-3 py-1 rounded-full text-sm ${
            theme === "dark"
              ? "bg-purple-900/50 text-purple-300"
              : "bg-indigo-100 text-purple-700"
          }`}
        >
          {event.type}
        </span>
      </div>
      <h3
        className={`text-2xl font-bold mb-3   ${
          theme === "dark"
            ? "text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-yellow-300"
            : "text-indigo-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600"
        }`}
      >
        {event.title}
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap
          className={`w-4 h-4 ${
            theme === "dark" ? "text-yellow-400" : "text-indigo-600"
          }`}
        />
        <span
          className={`font-medium ${
            theme === "dark" ? "text-gray-300" : "text-indigo-700"
          }`}
        >
          {event.university}
        </span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {event.date}
        </span>
        <span
          className={`text-sm font-bold ${
            theme === "dark" ? "text-yellow-400" : "text-indigo-600"
          }`}
        >
          {event.participants} participants
        </span>
      </div>
      <button
        className={`w-full py-3 rounded-xl font-bold   transform hover:scale-105 ${
          theme === "dark"
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
        }`}
      >
        View Details
      </button>
      <div
        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-r from-purple-500 to-indigo-500"
            : "bg-gradient-to-r from-indigo-400 to-purple-400"
        }`}
      ></div>
    </div>
  );

  const HowItWorksCard = ({ step, index }) => {
    return (
      <div
        className={`group relative rounded-3xl p-8 border hover:shadow-2xl   ${
          theme === "dark"
            ? "bg-gradient-to-br from-yellow-600 via-yellow-500 to-orange-400 border-yellow-300"
            : "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white border-yellow-200"
        }`}
      >
        <div className="absolute -top-4 -right-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
              theme === "dark"
                ? "bg-gradient-to-r from-green-400 to-teal-500 text-white"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            } shadow-lg`}
          >
            {step.step}
          </div>
        </div>
        <div
          className={`w-40 h-40 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6  `}
        >
          <Image
            src={step.icon || "/placeholder.svg"}
            alt={step.title}
            width={320}
            height={320}
            className="rounded-xl"
          />
        </div>
        <h3
          className={`text-2xl font-bold mb-4 text-center   ${
            theme === "dark"
              ? "text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600"
              : "text-indigo-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600"
          }`}
        >
          {step.title}
        </h3>
        <p
          className={`text-center leading-relaxed   ${
            theme === "dark"
              ? "text-black group-hover:text-gray-200"
              : "text-indigo-700 group-hover:text-indigo-800"
          }`}
        >
          {step.description}
        </p>
        <div
          className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5   ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500"
              : "bg-gradient-to-r from-indigo-400 to-purple-400"
          }`}
        ></div>
      </div>
    );
  };

  const DiscussionCard = ({ discussion }) => (
    <div
      className={`backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 ${
        theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-yellow-50/80 border-yellow-200"
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
          } shadow-lg`}
        >
          {discussion.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={`font-bold ${
                theme === "dark" ? "text-white" : "text-indigo-900"
              }`}
            >
              {discussion.user}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                theme === "dark"
                  ? "bg-purple-900/50 text-purple-300"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {discussion.topic}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap
              className={`w-4 h-4 ${
                theme === "dark" ? "text-yellow-400" : "text-indigo-600"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-indigo-600"
              }`}
            >
              {discussion.university}
            </span>
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-500" : "text-gray-500"
              }`}
            >
              • {discussion.time}
            </span>
          </div>
        </div>
      </div>
      <p
        className={`mb-4 leading-relaxed ${
          theme === "dark" ? "text-gray-300" : "text-indigo-800"
        }`}
      >
        {discussion.message}
      </p>
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 group">
          <Heart
            className={`w-5 h-5 ${
              theme === "dark"
                ? "text-gray-400 group-hover:text-red-400"
                : "text-gray-600 group-hover:text-red-500"
            } transition-colors duration-200`}
          />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {discussion.likes}
          </span>
        </button>
        <button className="flex items-center gap-2 group">
          <MessageSquare
            className={`w-5 h-5 ${
              theme === "dark"
                ? "text-gray-400 group-hover:text-blue-400"
                : "text-gray-600 group-hover:text-blue-500"
            } transition-colors duration-200`}
          />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {discussion.replies}
          </span>
        </button>
      </div>
    </div>
  );

  // New FAQ Component
  const FAQSection = () => (
    <section
      className={`py-24 ${theme === "dark" ? "bg-white/5" : "bg-indigo-50/50"}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-black mb-6 ${
              theme === "dark" ? "text-white" : "text-indigo-900"
            }`}
          >
            Frequently Asked{" "}
            <span
              className={`text-transparent bg-clip-text ${
                theme === "dark"
                  ? "bg-gradient-to-r from-yellow-400 to-purple-400"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600"
              }`}
            >
              Questions
            </span>
          </h2>
          <p
            className={`text-xl ${
              theme === "dark" ? "text-gray-300" : "text-indigo-700"
            }`}
          >
            Everything you need to know about CampusConnect
          </p>
        </div>

        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border p-6   hover:shadow-lg ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <HelpCircle
                  className={`w-6 h-6 mt-1 flex-shrink-0 ${
                    theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                  }`}
                />
                <div>
                  <h3
                    className={`text-lg font-bold mb-3 ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <p
                    className={`leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Success Metrics Component
  const SuccessMetrics = () => (
    <section
      className={`py-16 ${
        theme === "dark"
          ? "bg-gradient-to-r from-slate-900 to-slate-800"
          : "bg-gradient-to-r from-indigo-100 to-purple-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {successMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-white/10" : "bg-white/80"
                  } backdrop-blur-xl`}
                >
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                </div>
                <div
                  className={`text-3xl font-black mb-2 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {metric.value}
                </div>
                <div
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-indigo-700"
                  }`}
                >
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  // Campus Ambassador Benefit Card Component
  const AmbassadorBenefitCard = ({ benefit }) => {
    const Icon = benefit.icon;
    return (
      <div
        className={`group relative backdrop-blur-xl rounded-3xl p-6 border transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ${
          theme === "dark"
            ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
            : "bg-white/80 hover:bg-white border-indigo-200 hover:border-indigo-300"
        }`}
      >
        <div
          className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6   shadow-lg`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3
          className={`text-xl font-bold mb-3   ${
            theme === "dark"
              ? "text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-yellow-300"
              : "text-indigo-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600"
          }`}
        >
          {benefit.title}
        </h3>
        <p
          className={`text-sm leading-relaxed   ${
            theme === "dark"
              ? "text-gray-300 group-hover:text-gray-200"
              : "text-indigo-700 group-hover:text-indigo-800"
          }`}
        >
          {benefit.description}
        </p>
        <div
          className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5   bg-gradient-to-r ${benefit.gradient}`}
        ></div>
      </div>
    );
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
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl border   hover:scale-110 ${
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

      {/* Newsletter Popup */}
      {showNewsletter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div
            className={`rounded-3xl max-w-md w-full p-8 relative shadow-2xl ${
              theme === "dark"
                ? "bg-slate-800 text-white"
                : "bg-white text-indigo-900"
            }`}
          >
            <button
              onClick={() => setShowNewsletter(false)}
              className="absolute top-4 right-4 text-xl font-bold opacity-70 hover:opacity-100"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <Mail
                className={`w-16 h-16 mx-auto mb-4 ${
                  theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                }`}
              />
              <h3 className="text-2xl font-black mb-2">Stay Updated!</h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Get the latest events and opportunities delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2   focus:outline-none focus:ring-4 ${
                  theme === "dark"
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
                required
              />
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold   transform hover:scale-105 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                }`}
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Campus Ambassador Application Modal */}
      {showAmbassadorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div
            className={`rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl ${
              theme === "dark"
                ? "bg-slate-800 text-white"
                : "bg-white text-indigo-900"
            }`}
          >
            <button
              onClick={() => setShowAmbassadorModal(false)}
              className="absolute top-4 right-4 text-xl font-bold opacity-70 hover:opacity-100"
            >
              ✕
            </button>
            <div className="text-center mb-8">
              <Crown
                className={`w-16 h-16 mx-auto mb-4 ${
                  theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                }`}
              />
              <h3 className="text-3xl font-black mb-2">
                Become a Campus Ambassador
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Join our elite team of student leaders and make a difference on
                your campus
              </p>
            </div>

            <form onSubmit={handleAmbassadorSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-bold mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={ambassadorForm.name}
                    onChange={(e) =>
                      handleAmbassadorFormChange("name", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2   focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                        : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-bold mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={ambassadorForm.email}
                    onChange={(e) =>
                      handleAmbassadorFormChange("email", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2   focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                        : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-bold mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={ambassadorForm.phone}
                    onChange={(e) =>
                      handleAmbassadorFormChange("phone", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2   focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                        : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-bold mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    University/College *
                  </label>
                  <input
                    type="text"
                    value={ambassadorForm.university}
                    onChange={(e) =>
                      handleAmbassadorFormChange("university", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2   focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                        : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-bold mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Course/Major *
                  </label>
                  <input
                    type="text"
                    value={ambassadorForm.course}
                    onChange={(e) =>
                      handleAmbassadorFormChange("course", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2   focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                        : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-bold mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-indigo-700"
                    }`}
                  >
                    Current Year *
                  </label>
                  <select
                    value={ambassadorForm.year}
                    onChange={(e) =>
                      handleAmbassadorFormChange("year", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2   focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20"
                        : "bg-white border-indigo-200 text-indigo-900 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-bold mb-3 ${
                    theme === "dark" ? "text-gray-300" : "text-indigo-700"
                  }`}
                >
                  Skills & Interests (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        ambassadorForm.skills.includes(skill)
                          ? theme === "dark"
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : theme === "dark"
                          ? "bg-white/10 text-gray-300 hover:bg-white/20"
                          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-bold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-indigo-700"
                  }`}
                >
                  Previous Experience (Leadership, Events, etc.)
                </label>
                <textarea
                  value={ambassadorForm.experience}
                  onChange={(e) =>
                    handleAmbassadorFormChange("experience", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2   focus:outline-none focus:ring-4 resize-none ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                  placeholder="Tell us about your leadership experience, events organized, clubs joined, etc."
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-bold mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-indigo-700"
                  }`}
                >
                  Why do you want to become a Campus Ambassador? *
                </label>
                <textarea
                  value={ambassadorForm.motivation}
                  onChange={(e) =>
                    handleAmbassadorFormChange("motivation", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2   focus:outline-none focus:ring-4 resize-none ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                  placeholder="Share your motivation and how you plan to contribute to the CampusConnect community..."
                  required
                />
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-indigo-50 border-indigo-200"
                }`}
              >
                <h4
                  className={`font-bold mb-3 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Requirements Checklist:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }
                    >
                      Currently enrolled in college/university
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }
                    >
                      Active on social media platforms
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }
                    >
                      Passionate about building communities
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-indigo-700"
                      }
                    >
                      Available for 10-15 hours per week
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={ambassadorForm.agreeToTerms}
                  onChange={(e) =>
                    handleAmbassadorFormChange("agreeToTerms", e.target.checked)
                  }
                  className="w-5 h-5 rounded"
                  required
                />
                <label
                  htmlFor="agreeToTerms"
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-indigo-700"
                  }`}
                >
                  I agree to the terms and conditions and commit to fulfilling
                  the ambassador responsibilities *
                </label>
              </div>

              <button
                type="submit"
                disabled={!ambassadorForm.agreeToTerms}
                className={`w-full py-4 rounded-xl font-bold   transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                }`}
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className={`group p-4 rounded-full shadow-2xl   hover:scale-110 ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            <Bot className="w-8 h-8 text-white group-hover:animate-bounce" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </button>
        ) : (
          <div
            className={`w-96 h-[500px] rounded-3xl shadow-2xl border   ${
              theme === "dark"
                ? "bg-slate-800 border-white/20"
                : "bg-white border-indigo-200"
            } ${isMinimized ? "h-16" : "h-[500px]"}`}
          >
            {/* Chat Header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                theme === "dark" ? "border-white/20" : "border-indigo-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    className={`font-bold ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Campus Assistant
                  </h3>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    ● Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "hover:bg-white/10"
                      : "hover:bg-indigo-100"
                  }`}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "hover:bg-white/10"
                      : "hover:bg-indigo-100"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 p-4 h-80 overflow-y-auto space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-2xl ${
                          message.type === "user"
                            ? theme === "dark"
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                            : theme === "dark"
                            ? "bg-white/10 text-white"
                            : "bg-indigo-50 text-indigo-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">
                          {message.message}
                        </p>
                        {message.suggestions && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                                  theme === "dark"
                                    ? "bg-white/20 hover:bg-white/30 text-white"
                                    : "bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                                }`}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div
                        className={`p-3 rounded-2xl ${
                          theme === "dark" ? "bg-white/10" : "bg-indigo-50"
                        }`}
                      >
                        <div className="flex space-x-1">
                          <div
                            className={`w-2 h-2 rounded-full animate-bounce ${
                              theme === "dark" ? "bg-white" : "bg-indigo-600"
                            }`}
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className={`w-2 h-2 rounded-full animate-bounce ${
                              theme === "dark" ? "bg-white" : "bg-indigo-600"
                            }`}
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className={`w-2 h-2 rounded-full animate-bounce ${
                              theme === "dark" ? "bg-white" : "bg-indigo-600"
                            }`}
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div
                  className={`p-4 border-t ${
                    theme === "dark" ? "border-white/20" : "border-indigo-200"
                  }`}
                >
                  <div className="flex gap-2">
                    <input
                      ref={chatInputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type your message..."
                      className={`flex-1 px-4 py-2 rounded-xl border   focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                          : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                      }`}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!userInput.trim()}
                      className={`p-2 rounded-xl   hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      }`}
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

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

      <div className="relative z-10">
        <Navbar/>
        {/* Enhanced Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div
                  className={`inline-flex items-center gap-3 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  } ${
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
                    Early Access Now Open
                  </span>
                  <Sparkles
                    className={`w-6 h-6 animate-spin-slow ${
                      theme === "dark" ? "text-yellow-400" : "text-purple-500"
                    }`}
                  />
                </div>

                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight transition-all duration-1000 delay-200 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  } ${theme === "dark" ? "text-white" : "text-indigo-900"}`}
                >
                  Connect with Students & Organizers for{" "}
                  <span
                    className={`text-transparent bg-clip-text animate-gradient-flow ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-400 via-yellow-300 to-indigo-400"
                        : "bg-gradient-to-r from-indigo-600 via-purple-600 to-yellow-500"
                    }`}
                  >
                    Events, Hackathons
                  </span>{" "}
                  and More!
                </h1>

                <p
                  className={`text-xl mb-8 max-w-2xl transition-all duration-1000 delay-400 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  } ${theme === "dark" ? "text-gray-300" : "text-indigo-700"}`}
                >
                  Find collaborators, speakers, or teams for your next college
                  event in seconds with our AI-powered matching system.
                </p>

                <div
                  className={`flex flex-wrap gap-4 transition-all duration-1000 delay-600 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <button
                    className={`group px-8 py-4 rounded-2xl font-bold   transform hover:scale-105 shadow-xl ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      Find Students
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1  " />
                    </span>
                  </button>
                  <button
                    className={`group px-8 py-4 rounded-2xl font-bold border   transform hover:scale-105 ${
                      theme === "dark"
                        ? "border-white/20 hover:bg-white/10 text-white"
                        : "border-indigo-200 hover:bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    Host Event
                  </button>
                  <Link href="/discussion">
                    <button
                      className={`group px-8 py-4 rounded-2xl font-bold border   transform hover:scale-105 ${
                        theme === "dark"
                          ? "border-purple-400/50 hover:bg-purple-400/10 text-purple-400"
                          : "border-purple-200 hover:bg-purple-50 text-purple-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Join Discussions
                      </span>
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowNewsletter(true)}
                    className={`group px-8 py-4 rounded-2xl font-bold border   transform hover:scale-105 ${
                      theme === "dark"
                        ? "border-yellow-400/50 hover:bg-yellow-400/10 text-yellow-400"
                        : "border-yellow-200 hover:bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Get Updates
                    </span>
                  </button>
                </div>
              </div>

              <div className="lg:w-1/2 mt-12 lg:mt-0">
                <div
                  className={`rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 delay-800 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  } ${
                    theme === "dark"
                      ? "ring-1 ring-white/10"
                      : "ring-1 ring-indigo-200"
                  }`}
                >
                  <Image
                    src="/campuspic.jpg"
                    alt="Campus Life"
                    width={700}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full overflow-hidden mt-6">
            <div className="flex animate-scroll-loop whitespace-nowrap">
              {[...studentActivities, ...studentActivities].map(
                (activity, index) => (
                  <div
                    key={index}
                    className={`min-w-max px-6 py-3 mx-2 rounded-2xl text-sm font-bold shadow-md ${
                      theme === "dark"
                        ? "bg-purple-900 text-purple-200"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {activity}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        {/* <SuccessMetrics /> */}
        <ImageCarousel />
        <section
          className={`py-24 backdrop-blur-sm border-y ${
            theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-indigo-50/50 border-indigo-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2
                className={`text-4xl md:text-5xl font-black mb-6 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                How{" "}
                <span
                  className={`text-transparent bg-clip-text animate-gradient-flow ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-400 via-yellow-300 to-indigo-400"
                      : "bg-gradient-to-r from-indigo-600 via-purple-600 to-yellow-500"
                  }`}
                >
                  CampusConnect
                </span>{" "}
                Works
              </h2>
              <p
                className={`text-xl max-w-2xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Get started in just 3 simple steps and transform your campus
                experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, index) => (
                <HowItWorksCard key={index} step={step} index={index} />
              ))}
            </div>
          </div>
        </section>
        <div className="mt-20"></div>

        {/* How It Works Section */}

        {/* Search Bar Section */}
        <section
          className={`py-16 ${
            theme === "dark" ? "bg-white/5" : "bg-indigo-50/50"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl md:text-4xl font-black mb-4 ${
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
                  Latest Events
                </span>
              </h2>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Search through hundreds of upcoming events and opportunities
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 ${
                    theme === "dark" ? "text-gray-400" : "text-indigo-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search events by name, type, university, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-14 pr-6 py-4 rounded-2xl text-lg font-medium border-2   focus:outline-none focus:ring-4 ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, i) => (
                  <EventCard key={i} event={event} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
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
                    Try adjusting your search terms or browse all events
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Community Discussions Carousel */}
        <section
          className={`py-24 ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 to-slate-950"
              : "bg-gradient-to-br from-yellow-50 to-indigo-50"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <MessageSquare
                  className={`w-8 h-8 ${
                    theme === "dark" ? "text-purple-400" : "text-indigo-600"
                  }`}
                />
                <h2
                  className={`text-4xl md:text-5xl font-black ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Community{" "}
                  <span
                    className={`text-transparent bg-clip-text ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-yellow-400 to-purple-400"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600"
                    }`}
                  >
                    Discussions
                  </span>
                </h2>
                <Sparkles
                  className={`w-8 h-8 ${
                    theme === "dark" ? "text-yellow-400" : "text-purple-600"
                  }`}
                />
              </div>
              <p
                className={`text-xl max-w-2xl mx-auto mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                See what students are talking about, sharing, and collaborating
                on across campuses
              </p>
              <Link href="/discussion">
                <button
                  className={`px-6 py-3 rounded-xl font-bold   hover:scale-105 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mr-2 inline" />
                  Explore All Discussions
                </button>
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentDiscussionIndex * 100}%)`,
                  }}
                >
                  {memberDiscussions.map((discussion, index) => (
                    <div
                      key={discussion.id}
                      className="w-full flex-shrink-0 px-4"
                    >
                      <DiscussionCard discussion={discussion} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevDiscussion}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full backdrop-blur-xl border   hover:scale-110 ${
                  theme === "dark"
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    : "bg-white/80 border-indigo-200 text-indigo-600 hover:bg-white"
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextDiscussion}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full backdrop-blur-xl border   hover:scale-110 ${
                  theme === "dark"
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    : "bg-white/80 border-indigo-200 text-indigo-600 hover:bg-white"
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="flex justify-center gap-2 mt-8">
                {memberDiscussions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDiscussionIndex(index)}
                    className={`w-3 h-3 rounded-full   ${
                      index === currentDiscussionIndex
                        ? theme === "dark"
                          ? "bg-purple-400 scale-125"
                          : "bg-indigo-600 scale-125"
                        : theme === "dark"
                        ? "bg-white/30 hover:bg-white/50"
                        : "bg-indigo-300 hover:bg-indigo-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section
          className={`py-24 backdrop-blur-sm border-y ${
            theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-indigo-50/50 border-indigo-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2
                className={`text-4xl md:text-6xl font-black mb-8 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                <span className="block">Powerful Features for</span>
                <span
                  className={`block text-transparent bg-clip-text animate-gradient-flow ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-400 via-yellow-300 to-indigo-400"
                      : "bg-gradient-to-r from-indigo-600 via-purple-600 to-yellow-500"
                  }`}
                >
                  Modern Students
                </span>
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Everything you need to excel in your academic and professional
                journey, all in one platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section
          className={`py-24 border-t ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 to-slate-950 border-white/10"
              : "bg-gradient-to-br from-yellow-50 to-indigo-50 border-indigo-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Users
                  className={`w-8 h-8 ${
                    theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                  }`}
                />
                <h2
                  className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-indigo-400 via-purple-400 to-yellow-300"
                      : "bg-gradient-to-r from-indigo-600 via-purple-600 to-yellow-500"
                  }`}
                >
                  What Students Say
                </h2>
                <Sparkles
                  className={`w-8 h-8 ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
              <p
                className={`text-lg max-w-2xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Real success stories from students who transformed their campus
                experience with CampusConnect.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <div
                className={`inline-flex items-center gap-6 backdrop-blur-xl rounded-2xl px-8 py-4 border ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-yellow-50/80 border-yellow-200"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-2xl font-black ${
                      theme === "dark" ? "text-yellow-400" : "text-indigo-600"
                    }`}
                  >
                    4.9/5
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-indigo-600"
                    }`}
                  >
                    Average Rating
                  </div>
                </div>
                <div
                  className={`w-px h-12 ${
                    theme === "dark" ? "bg-white/20" : "bg-indigo-200"
                  }`}
                ></div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-black ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    500+
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-indigo-600"
                    }`}
                  >
                    Beta Testers
                  </div>
                </div>
                <div
                  className={`w-px h-12 ${
                    theme === "dark" ? "bg-white/20" : "bg-indigo-200"
                  }`}
                ></div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-black ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  >
                    98%
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-indigo-600"
                    }`}
                  >
                    Would Recommend
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* Live Activity Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-black mb-6 ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                Join Our{" "}
                <span
                  className={`text-transparent bg-clip-text ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-400 to-yellow-300"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  Growing Community
                </span>
              </h2>
              <p
                className={`text-xl max-w-2xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Students from top campuses across India are already connecting
                and collaborating
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {stats.map((stat, i) => (
                <AnimatedCounter
                  key={i}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Countdown Timer Section */}
        <button
          onClick={() => setShowOffer(true)}
          className={`fixed bottom-6 left-6 z-50 py-4 px-6 rounded-full shadow-xl text-sm font-black flex items-center gap-4   hover:scale-105 ${
            theme === "dark"
              ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          }`}
        >
          <div className="flex items-center gap-1 font-bold">
            <Gift className="w-4 h-4" />
            Early Bird Offer
          </div>
          <span className="text-sm font-bold">•</span>
          <div className="text-xs font-bold">
            ⏳ {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
            {timeLeft.seconds}s
          </div>
          <span className="text-sm font-bold">•</span>
          <div className="text-xs font-bold">{seatsLeft} seats left</div>
        </button>

        {showOffer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center px-4">
            <div
              className={`rounded-3xl max-w-md w-full p-6 relative z-50 shadow-2xl ${
                theme === "dark"
                  ? "bg-gradient-to-br from-indigo-200 to-purple-200 text-indigo-900"
                  : "bg-white text-indigo-900"
              }`}
            >
              <button
                onClick={() => setShowOffer(false)}
                className="absolute top-3 right-3 text-xl font-bold"
              >
                ✕
              </button>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black">🎁 Early Bird Offer</h3>
                <p className="text-sm font-medium">
                  <span className="line-through text-gray-500">₹2,500</span> →{" "}
                  <span className="font-bold text-lg text-green-600">₹250</span>{" "}
                  for 4 years
                </p>
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl px-4 py-6 text-center shadow-md   ${
                        theme === "dark"
                          ? "bg-gradient-to-br from-white/10 to-white/5 text-black"
                          : "bg-gradient-to-br from-yellow-100 to-indigo-50 text-indigo-900"
                      }`}
                    >
                      <div className={`text-3xl font-extrabold tracking-wide`}>
                        {item.value.toString().padStart(2, "0")}
                      </div>
                      <div className="text-sm font-semibold uppercase tracking-wide opacity-80">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-sm font-semibold mb-1">
                    <span>Seats Remaining</span>
                    <span>{seatsLeft}/100</span>
                  </div>
                  <div className="h-3 rounded-full bg-indigo-100 dark:bg-white/20 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500   rounded-full"
                      style={{ width: `${100 - seatsLeft}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-2 text-red-500 font-medium">
                    ⏳ Hurry! Only {seatsLeft} seats left
                  </p>
                </div>
                <button
                  className={`mt-6 w-full py-4 rounded-xl font-black text-white transition-transform hover:scale-105 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-indigo-500 to-yellow-400"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  Secure Your Spot Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
