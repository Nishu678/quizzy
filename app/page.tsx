"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Star,
  Clock,
  Award,
  ChevronRight,
  Flame,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Brain,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Menu,
  X,
  History,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const categories = [
  { name: "Technology", icon: "💻", color: "from-blue-500 to-cyan-500" },
  { name: "Science", icon: "🔬", color: "from-purple-500 to-pink-500" },
  { name: "History", icon: "📜", color: "from-amber-500 to-orange-500" },
  { name: "Geography", icon: "🌍", color: "from-emerald-500 to-teal-500" },
  { name: "Sports", icon: "⚽", color: "from-green-500 to-lime-500" },
  { name: "Entertainment", icon: "🎬", color: "from-rose-500 to-red-500" },
];

// Categories for "My Quizzes" filter
const myQuizCategories = [
  "All",
  "Technology",
  "Science",
  "History",
  "Geography",
  "Sports",
  "Entertainment",
];

export default function Home() {
  const { isLoggedIn, user, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMyQuizCategory, setSelectedMyQuizCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation links for logged-in users
  const navLinks = [
    { href: "/", label: "Home", icon: Target, active: true },
    {
      href: "/dashboard/create",
      label: "Create Quiz",
      icon: Plus,
      active: false,
    },
    {
      href: "/dashboard/my-quizzes",
      label: "My Quizzes",
      icon: BookOpen,
      active: false,
    },
    { href: "/history", label: "History", icon: History, active: false },
  ];

  const myQuizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description:
        "Test your knowledge of JavaScript basics, ES6+ features, and common patterns",
      category: "Technology",
      difficulty: "Medium",
      questions: 10,
      plays: 156,
      rating: 4.5,
      status: "Published",
      timeLimit: 15,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "World Capitals",
      description:
        "Challenge yourself to identify capital cities from around the globe",
      category: "Geography",
      difficulty: "Easy",
      questions: 15,
      plays: 89,
      rating: 4.2,
      status: "Published",
      timeLimit: 20,
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      title: "Science Quiz",
      description:
        "Explore physics, chemistry, and biology concepts in this comprehensive test",
      category: "Science",
      difficulty: "Hard",
      questions: 20,
      plays: 234,
      rating: 4.8,
      status: "Published",
      timeLimit: 30,
      createdAt: "2024-02-01",
    },
    {
      id: 4,
      title: "React Hooks Mastery",
      description:
        "Deep dive into useState, useEffect, useContext and custom hooks",
      category: "Technology",
      difficulty: "Hard",
      questions: 12,
      plays: 312,
      rating: 4.9,
      status: "Published",
      timeLimit: 25,
      createdAt: "2024-02-10",
    },
    {
      id: 5,
      title: "Ancient Civilizations",
      description:
        "Journey through Egypt, Greece, Rome, and other ancient empires",
      category: "History",
      difficulty: "Medium",
      questions: 18,
      plays: 178,
      rating: 4.6,
      status: "Published",
      timeLimit: 22,
      createdAt: "2024-02-15",
    },
    {
      id: 6,
      title: "Basketball Legends",
      description:
        "Test your knowledge of NBA history, players, and championships",
      category: "Sports",
      difficulty: "Easy",
      questions: 14,
      plays: 245,
      rating: 4.3,
      status: "Draft",
      timeLimit: 18,
      createdAt: "2024-02-20",
    },
    {
      id: 7,
      title: "Movie Trivia",
      description:
        "From classic films to modern blockbusters - how well do you know cinema?",
      category: "Entertainment",
      difficulty: "Medium",
      questions: 16,
      plays: 421,
      rating: 4.7,
      status: "Published",
      timeLimit: 20,
      createdAt: "2024-02-25",
    },
    {
      id: 8,
      title: "Python Programming",
      description: "Master Python syntax, data structures, and OOP concepts",
      category: "Technology",
      difficulty: "Medium",
      questions: 15,
      plays: 289,
      rating: 4.4,
      status: "Published",
      timeLimit: 20,
      createdAt: "2024-03-01",
    },
  ];

  // Mock data for popular/public quizzes
  const quizzes = [
    {
      _id: "1",
      title: "Web Development Essentials",
      description: "Master HTML, CSS, and JavaScript fundamentals",
      category: "Technology",
      rating: 4.8,
      plays: 2340,
      questions: 20,
      difficulty: "Medium",
      timeLimit: 25,
    },
    {
      _id: "2",
      title: "Space Exploration",
      description: "Journey through the cosmos and test your astronomy knowledge",
      category: "Science",
      rating: 4.6,
      plays: 1890,
      questions: 15,
      difficulty: "Hard",
      timeLimit: 20,
    },
    {
      _id: "3",
      title: "Ancient Civilizations",
      description: "Explore the great empires and cultures of the ancient world",
      category: "History",
      rating: 4.7,
      plays: 1560,
      questions: 18,
      difficulty: "Medium",
      timeLimit: 22,
    },
    {
      _id: "4",
      title: "World Geography Challenge",
      description: "Test your knowledge of countries, capitals, and landmarks",
      category: "Geography",
      rating: 4.5,
      plays: 2100,
      questions: 25,
      difficulty: "Easy",
      timeLimit: 30,
    },
    {
      _id: "5",
      title: "Football Legends",
      description: "How well do you know the greatest players and moments?",
      category: "Sports",
      rating: 4.4,
      plays: 1750,
      questions: 12,
      difficulty: "Easy",
      timeLimit: 15,
    },
    {
      _id: "6",
      title: "TV Show Trivia",
      description: "From sitcoms to dramas - test your television knowledge",
      category: "Entertainment",
      rating: 4.9,
      plays: 2800,
      questions: 20,
      difficulty: "Medium",
      timeLimit: 20,
    },
  ];

  // Filter and sort myQuizzes based on selected category, search query, and sort option
  const filteredMyQuizzes = myQuizzes
    .filter((quiz) => {
      const matchesCategory =
        selectedMyQuizCategory === "All" ||
        quiz.category === selectedMyQuizCategory;
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "rating":
          return b.rating - a.rating;
        case "plays":
          return b.plays - a.plays;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // const fetchQuizzes = async () => {
  //   try {
  //     setLoading(true);
  //     const url =
  //       selectedCategory === "All"
  //         ? "/api/quizzes"
  //         : `/api/quizzes?category=${selectedCategory}`;
  //     const response = await axios.get(url);
  //     setQuizzes(response.data.quizzes || []);
  //   } catch (error) {
  //     console.error("Error fetching quizzes:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchQuizzes();
  // }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                QuizApp
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {isLoggedIn ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        link.active
                          ? "bg-white/10 text-white border border-white/20"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-purple-400 hover:scale-105 transition-all duration-300 text-sm font-medium relative"
                  >
                    Login
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-[#0a0a1a] px-4 py-2 rounded-lg font-medium text-sm hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-400 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Logged In User */}
              {isLoggedIn ? (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </div>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a1a]/95 backdrop-blur-lg border-t border-white/10">
            <nav className="px-4 py-4 space-y-1">
              {isLoggedIn ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        link.active
                          ? "bg-white/10 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#050816]">
        {/* Grid Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 65%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at center, black 65%, transparent 100%)",
          }}
        />

        {/* Purple Glow */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[180px] animate-pulse-glow" />

        {/* Blue Glow */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[150px] animate-pulse-glow" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/80 via-transparent to-[#050816]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
          <div className="text-center">
            {/* Badge */}
            <div className="group inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-5 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xs font-medium text-gray-300 tracking-wide">
                Ultimate Quiz Experience
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4">
              <span className="text-white">Master Your</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-pink-400 bg-clip-text text-transparent animate-shimmer">
                Knowledge
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-400 leading-7 mb-6 sm:mb-8">
              Explore thousands of curated quizzes. Challenge yourself across
              diverse topics and track your journey to mastery.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8 sm:mb-10">
              <Link
                href="/register"
                className="group bg-white text-[#050816] px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 relative overflow-hidden text-sm sm:text-base"
              >
                <span className="button-shimmer absolute inset-0"></span>
                <Flame className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                Start Playing
              </Link>

              <Link
                href={isLoggedIn ? "/dashboard/create" : "/register"}
                className="group bg-white/5 border border-white/10 text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 text-sm sm:text-base"
              >
                {isLoggedIn ? "Create Quiz" : "Create Quiz"}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {/* Categories */}
              <div className="group bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="w-11 h-11 mx-auto rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  68+
                </h3>

                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-400 transition-colors">
                  Categories
                </p>
              </div>

              {/* Sub Topics */}
              <div className="group bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:bg-white/10 hover:border-pink-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="w-11 h-11 mx-auto rounded-xl bg-pink-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Brain className="w-5 h-5 text-pink-400" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">
                  2391+
                </h3>

                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-400 transition-colors">
                  Sub Topics
                </p>
              </div>

              {/* Quizzes */}
              <div className="group bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:bg-white/10 hover:border-yellow-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="w-11 h-11 mx-auto rounded-xl bg-yellow-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                  26,599+
                </h3>

                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-400 transition-colors">
                  Quizzes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Stats Section - Only show if logged in */}
      {/* {isLoggedIn && (
        <section className="py-10 bg-[#0a0a1a]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {userStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/10 hover:scale-105 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} border ${stat.borderColor} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* My Quizzes Section - Only show if logged in */}
      {isLoggedIn && (
        <section className="py-10 bg-[#0a0a1a]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  My <span className="gradient-text">Quizzes</span>
                </h2>
                <p className="text-gray-400 text-sm">
                  Create, manage, and track your quiz performance
                </p>
              </div>
              <Link
                href="/dashboard/create"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20 text-sm"
              >
                <Plus className="w-4 h-4" />
                New Quiz
              </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Category Filter and Sort */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Category Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 flex-1">
                  {myQuizCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedMyQuizCategory(category)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-300 ${
                        selectedMyQuizCategory === category
                          ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30"
                          : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                >
                  <option value="newest" className="bg-[#0a0a1a]">
                    Newest First
                  </option>
                  <option value="oldest" className="bg-[#0a0a1a]">
                    Oldest First
                  </option>
                  <option value="rating" className="bg-[#0a0a1a]">
                    Highest Rated
                  </option>
                  <option value="plays" className="bg-[#0a0a1a]">
                    Most Played
                  </option>
                  <option value="name" className="bg-[#0a0a1a]">
                    Alphabetical
                  </option>
                </select>
              </div>
            </div>

            {/* Quizzes Grid or Empty State */}
            {filteredMyQuizzes.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-16 h-16 mx-auto rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {searchQuery
                    ? "No quizzes found"
                    : "No quizzes in this category"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : `You haven't created any ${selectedMyQuizCategory === "All" ? "" : selectedMyQuizCategory} quizzes yet`}
                </p>
                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Quiz
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyQuizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/30">
                        {quiz.category}
                      </span>
                      <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300">
                          {quiz.rating > 0 ? quiz.rating : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors line-clamp-1">
                      {quiz.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs mb-4">
                      <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        {quiz.plays}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {quiz.timeLimit}m
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          quiz.difficulty === "Easy"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : quiz.difficulty === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          quiz.status === "Published"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {quiz.status}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {quiz.questions} questions
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/edit/${quiz.id}`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Link
                        href={`/quiz/${quiz.id}`}
                        className="inline-flex items-center gap-2 text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors"
                      >
                        {quiz.status === "Published" ? "Play" : "Preview"}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Create Button */}
            <div className="sm:hidden mt-6">
              <Link
                href="/dashboard/create"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20 text-sm"
              >
                <Plus className="w-4 h-4" />
                Create New Quiz
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section - Only show if NOT logged in */}
      {!isLoggedIn && (
        <section className="py-10 bg-[#0a0a1a]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-gray-400 text-center mb-10">
              Explore quizzes across different topics
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`group relative overflow-hidden rounded-xl p-5 text-center transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "ring-2 ring-purple-500 bg-white/10 shadow-lg shadow-purple-500/20 scale-105"
                      : "bg-white/5 hover:bg-white/10 hover:scale-105 hover:-translate-y-1"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative z-10">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <div className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {category.name}
                    </div>
                  </div>
                  {selectedCategory === category.name && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl"></div>
                  )}
                </button>
              ))}
              <button
                onClick={() => setSelectedCategory("All")}
                className={`group relative overflow-hidden rounded-xl p-5 text-center transition-all duration-300 ${
                  selectedCategory === "All"
                    ? "ring-2 ring-purple-500 bg-white/10 shadow-lg shadow-purple-500/20 scale-105"
                    : "bg-white/5 hover:bg-white/10 hover:scale-105 hover:-translate-y-1"
                }`}
              >
                <div className="relative z-10">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    🎯
                  </div>
                  <div className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                    All
                  </div>
                </div>
                {selectedCategory === "All" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl"></div>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Popular Quizzes Section - Only show if NOT logged in */}
      {!isLoggedIn && (
        <section className="py-15 bg-[#0a0a1a]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {selectedCategory === "All" ? (
                    <>
                      Popular <span className="gradient-text">Quizzes</span>
                    </>
                  ) : (
                    <>
                      <span className="gradient-text">{selectedCategory}</span>{" "}
                      Quizzes
                    </>
                  )}
                </h2>
                <p className="text-gray-400 text-sm">
                  {selectedCategory === "All"
                    ? "Most played and highly rated quizzes"
                    : `Top quizzes in ${selectedCategory}`}
                </p>
              </div>
            </div>

            {quizzes.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-16 h-16 mx-auto rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  No quizzes found
                </h3>
                <p className="text-gray-400 mb-6">
                  Be the first to create a quiz in this category!
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Quiz
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, index) => (
                  <Link
                    key={quiz._id}
                    href={`/quiz/${quiz._id}`}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/30">
                        {quiz.category}
                      </span>
                      <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300">
                          {quiz.rating || "N/A"}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-3 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full text-gray-400">
                          <Users className="w-3.5 h-3.5" />
                          {quiz.plays}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {quiz.timeLimit ? `${quiz.timeLimit}m` : "∞"}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          quiz.difficulty === "Easy"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : quiz.difficulty === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">
                        {quiz.questions} questions
                      </span>
                      <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors">
                        Start Quiz
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-15 sm:py-20 bg-[#0a0a1a]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-12 text-center">
            Why Choose <span className="gradient-text">QuizApp</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="group bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">
                Easy to Use
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                Create engaging quizzes in minutes with our intuitive interface.
              </p>
            </div>
            <div className="group bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white group-hover:text-emerald-300 transition-colors">
                Track Progress
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                Monitor your performance and compete with friends on
                leaderboards.
              </p>
            </div>
            <div className="group bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 hover:border-pink-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white group-hover:text-pink-300 transition-colors">
                Earn Rewards
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                Unlock badges and earn points as you master different topics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-15 bg-[#0a0a1a]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden backdrop-blur-sm">
            {/* Background glow effect */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/30 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                {isLoggedIn ? (
                  <>
                    Ready to <span className="gradient-text">Create</span>?
                  </>
                ) : (
                  <>
                    Ready to <span className="gradient-text">Start</span>?
                  </>
                )}
              </h2>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                {isLoggedIn
                  ? "Create engaging quizzes and challenge your friends"
                  : "Join thousands of users learning and having fun with QuizApp"}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard/create"
                    className="group w-full sm:w-auto bg-white text-[#0a0a1a] px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden text-sm"
                  >
                    <span className="button-shimmer absolute inset-0"></span>
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create Quiz
                    </span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="group w-full sm:w-auto bg-white text-[#0a0a1a] px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden text-sm"
                    >
                      <span className="button-shimmer absolute inset-0"></span>
                      <span className="relative z-10">Get Started Free</span>
                    </Link>
                    <Link
                      href="/login"
                      className="group w-full sm:w-auto bg-white/10 border border-white/30 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-white/20 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 text-sm"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#050510] border-t border-white/10 py-15 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px]"></div>
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            {/* Logo and branding */}
            <div className="group flex items-center gap-4">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl shadow-purple-500/30">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors block">
                  QuizApp
                </span>
                <span className="text-xs text-gray-500">Learn, Play, Grow</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex items-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-400">
              <Link
                href="#"
                className="group hover:text-purple-400 hover:scale-105 transition-all duration-300 relative py-1"
              >
                Privacy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="group hover:text-purple-400 hover:scale-105 transition-all duration-300 relative py-1"
              >
                Terms
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="group hover:text-purple-400 hover:scale-105 transition-all duration-300 relative py-1"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 QuizApp. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              Made with
              <span className="inline-block animate-pulse">❤️</span>
              for learners worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
