import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Lock, User as UserIcon } from "lucide-react";
import logo from "@assets/images/IIT_Logo.png";
import bgImage from "@assets/generated_images/modern_university_campus_abstract_background.png";

export default function CounselorLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const userData = await response.json();

      // Store in localStorage
      localStorage.setItem("counselor_id", userData.id);
      localStorage.setItem("counselor_username", userData.username);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.username}!`,
      });

      setLocation("/counselor");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !firstName || !lastName || !password || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, firstName, lastName, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const userData = await response.json();

      toast({
        title: "Account Created",
        description: "Your account has been created. Please log in.",
      });

      // Switch to login mode
      setIsLogin(true);
      setUsername("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Hero Image */}
      <div className="hidden md:flex md:w-1/2 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-20"></div>
        <img
          src={bgImage}
          alt="Campus Background"
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-1000 scale-105"
        />
        <div className="relative z-30 p-12 flex flex-col justify-end h-full text-white space-y-6">
          <div className="space-y-2">
            <p className="text-white/80 font-medium tracking-wider uppercase text-sm">
              MSU-IIT Guidance Portal
            </p>
            <h1 className="text-5xl font-bold font-display leading-tight">
              Counselor <br />
              <span className="text-yellow-400">Access Portal</span>
            </h1>
          </div>
          <p className="text-lg text-white/90 max-w-md leading-relaxed">
            Manage student cases, schedule appointments, and provide guidance through our comprehensive counselor dashboard.
          </p>
        </div>
      </div>

      {/* Right Side - Login/Register */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background relative">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right-8 duration-700">
          {/* Back Button */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-primary/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight font-display text-primary">
              {isLogin ? "Counselor Login" : "Create Account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Sign in to access your counselor dashboard"
                : "Register a new counselor account"}
            </p>
          </div>

          {/* Form Card */}
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                {/* First Name & Last Name (Register Only) */}
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Email (Register Only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                )}

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Confirm Password (Register Only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Toggle Login/Register */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setUsername("");
                  setEmail("");
                  setFirstName("");
                  setLastName("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="font-semibold text-primary hover:underline transition-colors"
              >
                {isLogin ? "Register here" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
