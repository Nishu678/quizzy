"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronRight, Clock, CheckCircle, XCircle, Trophy, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
  timeLimit?: number;
}

export default function QuizPlayPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log("Fetching quiz with ID:", params.id);
        const response = await fetch(`/api/quizzes/${params.id}`);
        const data = await response.json();

        console.log("Quiz fetch response:", response.ok, data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to load quiz");
        }

        setQuiz(data.quiz);
        if (data.quiz.timeLimit) {
          setTimeLeft(data.quiz.timeLimit * 60); // Convert to seconds
          setStartTime(Date.now());
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
        setError(error instanceof Error ? error.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQuiz();
    }
  }, [params.id, router]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 0) {
          if (prev <= 1) {
            // Time's up - submit quiz
            handleSubmit();
          }
          return prev - 1;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
    if (timeLeft !== null) {
      setTimeLeft(0);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error Loading Quiz</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              Go back to home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="text-purple-400 hover:text-purple-300"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz not found</h2>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
              passed ? 'bg-gradient-to-br from-emerald-500 to-green-500' : 'bg-gradient-to-br from-red-500 to-orange-500'
            }`}>
              {passed ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <XCircle className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-gray-400 text-lg">
              You scored {score} out of {quiz.questions.length}
            </p>
            <div className={`inline-block px-6 py-3 rounded-full text-2xl font-bold mt-4 ${
              passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {percentage}%
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Question Review</h2>
            {quiz.questions.map((q, index) => {
              const isCorrect = selectedAnswers[index] === q.correctAnswer;
              const wasAnswered = selectedAnswers[index] !== undefined;

              return (
                <div
                  key={index}
                  className={`bg-white/5 border rounded-xl p-6 ${
                    isCorrect ? 'border-emerald-500/30' : wasAnswered ? 'border-red-500/30' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : wasAnswered ? (
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        Q{index + 1}: {q.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options.map((option, optIndex) => {
                          const isCorrectOption = optIndex === q.correctAnswer;
                          const isSelectedOption = selectedAnswers[index] === optIndex;

                          return (
                            <div
                              key={optIndex}
                              className={`px-4 py-2 rounded-lg text-sm ${
                                isCorrectOption
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isSelectedOption
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10'
                              }`}
                            >
                              {option}
                              {isCorrectOption && ' ✓'}
                              {isSelectedOption && !isCorrectOption && ' ✗'}
                            </div>
                          );
                        })}
                      </div>
                      {q.explanation && (
                        <p className="text-sm text-gray-400 mt-3 italic">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/quiz/${quiz._id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </Link>
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 60 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-white/5 text-gray-300 border border-white/10'
              }`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/30">
                {quiz.category}
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                quiz.difficulty === 'Easy'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : quiz.difficulty === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {quiz.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-gray-400">{quiz.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                      : 'bg-white/5 border-white/10 hover:border-purple-500/50 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-purple-500'
                        : 'border-gray-600'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
