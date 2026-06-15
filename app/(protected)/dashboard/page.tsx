"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, Users, TrendingUp, LogOut, Menu, X, Sparkles, Brain, ChevronRight, Star, Clock, Edit, Trash2 } from "lucide-react";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock data - replace with actual API calls
  const stats = [
    { label: "Total Quizzes", value: "12", icon: BookOpen, color: "from-purple-500/20 to-purple-500/20", iconColor: "text-purple-400", borderColor: "border-purple-500/30" },
    { label: "Total Plays", value: "1,234", icon: Users, color: "from-pink-500/20 to-pink-500/20", iconColor: "text-pink-400", borderColor: "border-pink-500/30" },
    { label: "Avg Rating", value: "4.5", icon: TrendingUp, color: "from-amber-500/20 to-amber-500/20", iconColor: "text-amber-400", borderColor: "border-amber-500/30" },
  ];

  const myQuizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics, ES6+ features, and common patterns",
      category: "Technology",
      difficulty: "Medium",
      questions: 10,
      plays: 156,
      rating: 4.5,
      status: "Published",
      timeLimit: 15,
    },
    {
      id: 2,
      title: "World Capitals",
      description: "Challenge yourself to identify capital cities from around the globe",
      category: "Geography",
      difficulty: "Easy",
      questions: 15,
      plays: 89,
      rating: 4.2,
      status: "Published",
      timeLimit: 20,
    },
    {
      id: 3,
      title: "Science Quiz",
      description: "Explore physics, chemistry, and biology concepts in this comprehensive test",
      category: "Science",
      difficulty: "Hard",
      questions: 20,
      plays: 234,
      rating: 4.8,
      status: "Published",
      timeLimit: 30,
    },
    {
      id: 4,
      title: "Movie Trivia",
      description: "From classic films to modern blockbusters - how well do you know cinema?",
      category: "Entertainment",
      difficulty: "Medium",
      questions: 12,
      plays: 0,
      rating: 0,
      status: "Draft",
      timeLimit: 10,
    },
  ];

  const categories = ["All", "Technology", "Science", "History", "Geography", "Sports", "Entertainment"];

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BookOpen, active: true },
    { href: "/dashboard/create", label: "Create Quiz", icon: Plus, active: false },
    { href: "/dashboard/my-quizzes", label: "My Quizzes", icon: Users, active: false },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
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
            </nav>

            {/* Mobile Menu Button & User */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-400 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  JD
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0a0a1a]/95 backdrop-blur-lg border-t border-white/10">
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    link.active
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#050816] py-12 sm:py-16">
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

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Welcome back, <span className="gradient-text">John!</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
              Create engaging quizzes, track your performance, and challenge the world
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/dashboard/create"
                className="group bg-white text-[#050816] px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 relative overflow-hidden text-sm sm:text-base"
              >
                <span className="button-shimmer absolute inset-0"></span>
                <Sparkles className="w-4 h-4" />
                Create New Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-[#0a0a1a]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
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

      {/* My Quizzes Section */}
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

          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Quizzes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myQuizzes.map((quiz, index) => (
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
                  <span className="text-xs text-gray-500 ml-2">{quiz.questions} questions</span>
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
                Ready to <span className="gradient-text">Create</span>?
              </h2>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Start building your quiz and challenge players worldwide
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
