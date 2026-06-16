"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Brain, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const loginSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/\d/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type loginFormValues = z.infer<typeof loginSchema>;

const passwordRequirements = [
  { label: "8+ chars", test: (v: string) => v.length >= 8 },
  { label: "Uppercase", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Lowercase", test: (v: string) => /[a-z]/.test(v) },
  { label: "Number", test: (v: string) => /\d/.test(v) },
];

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: loginFormValues) => {
      const response = await axios.post("/api/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Set user in auth context
      if (data.user) {
        login(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
      }
      router.replace("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
      // Show error message to user
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    },
  });

  const onSubmit = (data: loginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-125 max-w-md shadow-sm border border-gray-300 rounded-2xl">
        <CardHeader className="text-center space-y-3 pb-0 pt-8 px-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-1 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground group-hover:text-purple-300 transition-colors">
              QuizApp
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pt-6 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john@example.com"
                disabled={loginMutation.isPending}
                autoComplete="email"
                className={cn(
                  "h-10 rounded-lg bg-muted/40 border-gray-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500",
                  errors.email &&
                    "border-destructive focus-visible:ring-destructive/20",
                )}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  disabled={loginMutation.isPending}
                  autoComplete="new-password"
                  className={cn(
                    "h-10 rounded-lg bg-muted/40 border-gray-300 pr-10 focus-visible:ring-purple-500/30 focus-visible:border-purple-500",
                    errors.password &&
                      "border-destructive focus-visible:ring-destructive/20",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  disabled={loginMutation.isPending}
                  autoComplete="new-password"
                  className={cn(
                    "h-10 rounded-lg bg-muted/40 border-gray-300 pr-10 focus-visible:ring-purple-500/30 focus-visible:border-purple-500",
                    errors.confirmPassword &&
                      "border-destructive focus-visible:ring-destructive/20",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={loginMutation.isPending}
              className="w-full h-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium mt-2 transition-colors"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logining...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
