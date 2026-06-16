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
import { Eye, EyeOff, Loader2, UserPlus, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
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

type RegisterFormValues = z.infer<typeof registerSchema>;

const passwordRequirements = [
  { label: "8+ chars", test: (v: string) => v.length >= 8 },
  { label: "Uppercase", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Lowercase", test: (v: string) => /[a-z]/.test(v) },
  { label: "Number", test: (v: string) => /\d/.test(v) },
];

const RegisterForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  //   Live watcher that tells you the current value of a form field instantly as it changes, without any delays or complex code.

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const strengthConfig = [
    { color: "bg-red-500", text: "Weak", textColor: "text-red-500" },
    { color: "bg-orange-500", text: "Fair", textColor: "text-orange-500" },
    { color: "bg-yellow-500", text: "Good", textColor: "text-yellow-500" },
    { color: "bg-lime-500", text: "Strong", textColor: "text-lime-500" },
    { color: "bg-green-500", text: "Very Strong", textColor: "text-green-600" },
  ];

  const strength = getPasswordStrength();
  const currentStrength =
    strengthConfig[Math.max(0, Math.min(strength - 1, 4))];

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const response = await axios.post("/api/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      // Set user in auth context
      if (data.user) {
        login(data.user);
        toast.success(`Account created successfully! Welcome, ${data.user.name}!`);
      }
      router.replace("/");
    },
    onError: (error) => {
      console.error("Registration error:", error);
      // Show error message to user
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
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
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Test your knowledge and challenge friends
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pt-6 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Full name
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="John Doe"
                disabled={registerMutation.isPending}
                autoComplete="name"
                className={cn(
                  "h-10 rounded-lg bg-muted/40 border-gray-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500",
                  errors.name &&
                    "border-destructive focus-visible:ring-destructive/20",
                )}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                disabled={registerMutation.isPending}
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
                  disabled={registerMutation.isPending}
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
                  disabled={registerMutation.isPending}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {password && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-all duration-300",
                            i <= strength ? currentStrength.color : "bg-muted",
                          )}
                        />
                      ))}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        currentStrength.textColor,
                      )}
                    >
                      {currentStrength.text}
                    </span>
                  </div>

                  {/* Requirement chips */}
                  <div className="flex gap-1.5 flex-wrap">
                    {passwordRequirements.map(({ label, test }) => {
                      const met = test(password);
                      return (
                        <span
                          key={label}
                          className={cn(
                            "text-[11px] px-2 py-0.5 rounded-full border transition-all duration-200",
                            met
                              ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300"
                              : "bg-muted/50 border-border/50 text-muted-foreground",
                          )}
                        >
                          {met ? "✓ " : ""}
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  disabled={registerMutation.isPending}
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
                  disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
              className="w-full h-10 rounded-lg bg-purple-600 text-white font-medium mt-2 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create account
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          {/* <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-background text-muted-foreground">or continue with</span>
            </div>
          </div> */}

          {/* Social Buttons */}
          {/* <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={registerMutation.isPending}
              className="h-10 rounded-lg border-gray-300 bg-muted/30 hover:bg-muted/60 text-sm font-normal gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={registerMutation.isPending}
              className="h-10 rounded-lg border-gray-300 bg-muted/30 hover:bg-muted/60 text-sm font-normal gap-2"
            >
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div> */}

          {/* Sign in link */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
