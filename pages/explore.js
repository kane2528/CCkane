"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Sun, Moon, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function WatchReelsPage() {
  const [theme, setTheme] = useState("dark");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoading = useRef(false);

  // Track mouse for aesthetic cursor
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch videos
  useEffect(() => {
  const fetchVideos = async () => {
    if (isLoading.current || !hasMore) return;
    isLoading.current = true;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/video/get-videos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideos((prev) => [...prev, ...res.data.videos]);
      setHasMore(page < res.data.totalPages);
    } catch (err) {
      console.error("Failed to load videos:", err.message);
    } finally {
      isLoading.current = false;
    }
  };

  fetchVideos();
}, [page]);


  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom && hasMore) setPage((prev) => prev + 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div
      className={`relative min-h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth ${
        theme === "dark"
          ? "bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900"
          : "bg-gradient-to-b from-yellow-50 via-indigo-100 to-purple-50"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl border ${
          theme === "dark"
            ? "bg-white/10 border-white/20 text-yellow-300"
            : "bg-indigo-100 border-indigo-200 text-indigo-600"
        }`}
      >
        {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {/* Mouse follower */}
      <div
        className={`fixed w-8 h-8 rounded-full pointer-events-none z-40 mix-blend-screen transition-all duration-100 ease-out ${
          theme === "dark"
            ? "bg-gradient-to-r from-indigo-500 to-yellow-300 opacity-30"
            : "bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"
        }`}
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
        }}
      />

      {/* Video Reels */}
      {videos.map((video, i) => (
        <div
          key={video._id || i}
          className="snap-start h-screen flex items-center justify-center px-4"
        >
          <div className="w-full h-full max-w-md mx-auto flex flex-col items-center justify-center gap-4">
            <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-black">
              <video
                className="w-full h-full object-cover"
                src={video.videoUrl}
                controls
                autoPlay
                muted
                loop
              />
            </div>
            <h2
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-indigo-900"
              }`}
            >
              {video.title || "Untitled Reel"}
            </h2>
          </div>
        </div>
      ))}

      {/* Back button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 font-medium transition hover:underline ${
            theme === "dark"
              ? "text-purple-400 hover:text-purple-300"
              : "text-indigo-600 hover:text-indigo-800"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
