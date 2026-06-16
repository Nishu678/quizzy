"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Save, Sparkles, Brain, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";

const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["Technology", "Science", "History", "Geography", "Sports", "Entertainment", "General Knowledge"]),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  timeLimit: z.number().optional(),
  questions: z.array(z.object({
    question: z.string().min(5, "Question must be at least 5 characters"),
    options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options required").max(6, "Maximum 6 options allowed"),
    correctAnswer: z.number().min(0, "Invalid answer").max(5, "Invalid answer"),
    explanation: z.string().optional()
  })).min(1, "At least 1 question required").max(50, "Maximum 50 questions allowed")
});

type QuizFormValues = z.infer<typeof quizSchema>;

const QuizForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const [isGenerating, setIsGenerating] = useState(false);
  const [questionCount, setQuestionCount] = useState(3); // Reduced to avoid rate limits
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "General Knowledge",
      difficulty: "Medium",
      timeLimit: undefined,
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: ""
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const createQuizMutation = useMutation({
    mutationFn: async (data: QuizFormValues) => {
      const response = await axios.post("/api/quizzes", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/");
    }
  });

  const onSubmit = (data: QuizFormValues) => {
    createQuizMutation.mutate(data);
  };

  const addQuestion = () => {
    append({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    });
  };

  const generateQuestions = async () => {
    const title = watch("title");
    const description = watch("description");
    const category = watch("category");
    const difficulty = watch("difficulty");

    // Validate required fields
    if (!title || !description || !category || !difficulty) {
      setError("Please fill in title, description, category, and difficulty first");
      return;
    }

    if (questionCount < 1 || questionCount > 50) {
      setError("Question count must be between 1 and 50");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          questionCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limit with helpful message
        if (response.status === 429 && data.message) {
          throw new Error(data.message);
        }
        throw new Error(data.error || "Failed to generate questions");
      }

      // Clear existing questions and add AI-generated ones
      setValue("questions", []);
      data.questions.forEach((q: any) => {
        append({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || "",
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const questions = watch("questions");

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

            {/* Back Button */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-medium text-gray-300">Create Your Quiz</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Design an <span className="gradient-text">Engaging Quiz</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Create challenging questions and test knowledge on any topic
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Quiz Details Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Quiz Details</h2>
              <p className="text-sm text-gray-400">Basic information about your quiz</p>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-gray-300">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., JavaScript Fundamentals"
                  className={cn(
                    "mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/30 focus-visible:border-purple-500",
                    errors.title && "border-red-500/50 focus-visible:ring-red-500/30"
                  )}
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                <textarea
                  id="description"
                  placeholder="Describe what your quiz covers..."
                  rows={3}
                  className={cn(
                    "w-full mt-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 outline-none transition-all",
                    errors.description && "border-red-500/50 focus-visible:ring-red-500/30"
                  )}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category" className="text-gray-300">Category *</Label>
                  <select
                    id="category"
                    className={cn(
                      "w-full mt-2 px-3 py-2 rounded-lg border border-white/10 bg-[#0a0a1a] text-white focus-visible:ring-2 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 outline-none transition-all",
                      errors.category && "border-red-500/50 focus-visible:ring-red-500/30"
                    )}
                    {...register("category")}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="General Knowledge">General Knowledge</option>
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-400 mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="difficulty" className="text-gray-300">Difficulty *</Label>
                  <select
                    id="difficulty"
                    className={cn(
                      "w-full mt-2 px-3 py-2 rounded-lg border border-white/10 bg-[#0a0a1a] text-white focus-visible:ring-2 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 outline-none transition-all",
                      errors.difficulty && "border-red-500/50 focus-visible:ring-red-500/30"
                    )}
                    {...register("difficulty")}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <p className="text-sm text-red-400 mt-1">{errors.difficulty.message}</p>
                  )}
                </div>
              </div>

              {/* Time Limit */}
              <div>
                <Label htmlFor="timeLimit" className="text-gray-300">Time Limit (minutes, optional)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  placeholder="e.g., 10"
                  className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/30 focus-visible:border-purple-500"
                  {...register("timeLimit", { valueAsNumber: true })}
                />
                <p className="text-sm text-gray-500 mt-1">Leave empty for no time limit</p>
              </div>

              {/* AI Question Generation */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Generate Questions with AI</h3>
                    <p className="text-sm text-gray-400">
                      Let AI create questions based on your quiz details
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="questionCount" className="text-gray-300">
                      Number of Questions
                    </Label>
                    <Input
                      id="questionCount"
                      type="number"
                      min="1"
                      max="50"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
                      className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/30 focus-visible:border-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Between 1 and 50 questions</p>
                  </div>

                  <Button
                    type="button"
                    onClick={generateQuestions}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Generate Questions
                      </>
                    )}
                  </Button>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Questions Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Questions</h2>
                <p className="text-sm text-gray-400">Add questions to your quiz (1-50 questions)</p>
              </div>
              <Button
                type="button"
                onClick={addQuestion}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="space-y-6">
              {fields.map((field, questionIndex) => (
                <div key={field.id} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-white">Question {questionIndex + 1}</h3>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(questionIndex)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div>
                    <Label htmlFor={`questions.${questionIndex}.question`} className="text-gray-300">Question *</Label>
                    <textarea
                      id={`questions.${questionIndex}.question`}
                      placeholder="Enter your question..."
                      rows={2}
                      className={cn(
                        "w-full mt-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 outline-none transition-all",
                        errors.questions?.[questionIndex]?.question && "border-red-500/50 focus-visible:ring-red-500/30"
                      )}
                      {...register(`questions.${questionIndex}.question`)}
                    />
                    {errors.questions?.[questionIndex]?.question && (
                      <p className="text-sm text-red-400 mt-1">
                        {errors.questions[questionIndex]?.question?.message}
                      </p>
                    )}
                  </div>

                  {/* Options */}
                  <div>
                    <Label className="text-gray-300">Options *</Label>
                    <div className="mt-2 space-y-2">
                      {questions[questionIndex]?.options.map((_, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            {...register(`questions.${questionIndex}.correctAnswer`)}
                            value={optionIndex}
                            className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 focus:ring-purple-500 focus:ring-2"
                          />
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            className={cn(
                              "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/30 focus-visible:border-purple-500",
                              errors.questions?.[questionIndex]?.options?.[optionIndex] && "border-red-500/50"
                            )}
                            {...register(`questions.${questionIndex}.options.${optionIndex}`)}
                          />
                          {optionIndex === 0 && (
                            <span className="text-xs text-gray-500">(Correct answer)</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Select the radio button for the correct answer</p>
                  </div>

                  {/* Explanation */}
                  <div>
                    <Label htmlFor={`questions.${questionIndex}.explanation`} className="text-gray-300">Explanation (optional)</Label>
                    <textarea
                      id={`questions.${questionIndex}.explanation`}
                      placeholder="Explain why this is the correct answer..."
                      rows={2}
                      className="w-full mt-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 outline-none transition-all"
                      {...register(`questions.${questionIndex}.explanation`)}
                    />
                  </div>
                </div>
              ))}

              {errors.questions && (
                <p className="text-sm text-red-400">{errors.questions.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/"
              className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20"
              disabled={createQuizMutation.isPending}
            >
              {createQuizMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Quiz
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
