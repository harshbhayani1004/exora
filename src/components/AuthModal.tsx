"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Mail, Lock, User, ArrowRight } from "lucide-react";
import {
  loginUser,
  registerUser,
  signInWithGoogle,
  resetPassword,
} from "@/lib/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await signInWithGoogle();

      if (!result.success) {
        setError(result.error || "Google sign in failed");
        setIsLoading(false);
      }
      // Note: User will be redirected to Google, then back to the site
    } catch (err) {
      console.error("Google auth error:", err);
      setError("Google authentication failed");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        // Handle password reset
        const result = await resetPassword(formData.email);
        if (result.success) {
          setSuccessMessage("Password reset email sent! Check your inbox.");
        } else {
          setError(result.error || "Failed to send reset email");
        }
      } else {
        // Handle login/register
        let result;

        if (isLogin) {
          // Login existing user
          result = await loginUser(formData.email, formData.password);
        } else {
          // Register new user
          if (!formData.name.trim()) {
            setError("Please enter your name");
            setIsLoading(false);
            return;
          }
          result = await registerUser(
            formData.email,
            formData.password,
            formData.name
          );
        }

        if (result.success && result.user) {
          // Store user in localStorage
          localStorage.setItem("user", JSON.stringify(result.user));

          onSuccess?.();
          onClose();

          // Refresh page to update UI with logged-in user
          window.location.reload();
        } else {
          setError(result.error || "Authentication failed");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/70 animate-fade-in-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-cream rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-auto animate-modal-in will-change-transform transform-gpu border border-white/30">
        
        {/* Left Side - Image */}
        <div className="relative hidden md:block w-5/12 bg-gray-100">
           {/* Use a simple div placeholder first or optimize image loading */}
           <div className="absolute inset-0 bg-gray-200" />
           <Image 
             src="/images/hero.png" // Using the hero image as it fits the brand
             alt="Login Background"
             fill
             className="object-cover"
             loading="eager" 
             quality={60}
             priority={false}
             sizes="(max-width: 768px) 100vw, 400px"
           />
           <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white z-10">
              <h3 className="font-serif text-4xl mb-2 italic">Welcome to Exora</h3>
              <p className="text-white/90 text-sm font-light leading-relaxed">
                Come for the colour. Stay for the tiny details.
              </p>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 flex flex-col relative overflow-y-auto md:overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all z-20"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center w-full">
            
            {/* Headers */}
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-4xl font-serif font-semibold text-dark mb-1">
                {isForgotPassword
                  ? "Reset Password"
                  : isLogin
                  ? "Welcome Back"
                  : "Create Account"}
              </h2>
              <p className="text-gray-500 text-sm">
                {isForgotPassword
                  ? "Enter your email for a link"
                  : isLogin
                  ? "Enter details to sign in"
                  : "Enter details to start"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                   <span>⚠️</span> {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                   <span>✓</span> {successMessage}
                </div>
              )}

              {!isForgotPassword && !isLogin && (
                <div className="group">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-tan transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-tan focus:ring-2 focus:ring-tan/10 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-tan transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-tan focus:ring-2 focus:ring-tan/10 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                    placeholder="Email Address"
                  />
                </div>
              </div>

          {!isForgotPassword && (
            <div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-tan transition-colors" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-tan focus:ring-2 focus:ring-tan/10 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                  placeholder="Password"
                  minLength={6}
                />
              </div>
            </div>
          )}

          {isLogin && !isForgotPassword && (
            <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="text-[10px] font-semibold text-gray-500 hover:text-tan transition-colors uppercase tracking-wider"
                  >
                    Forgot Password?
                  </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-dark text-white py-3.5 rounded-full font-bold tracking-wider uppercase text-xs hover:bg-coral hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {isForgotPassword
                    ? "Reset"
                    : isLogin
                    ? "Sign In"
                    : "Create Account"}
                    {!isLoading && <ArrowRight className="w-3 h-3" />}
                </>
            )}
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-gray-400 font-medium tracking-wider">Or</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all shadow-sm group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

        </form>

        <div className="mt-6 text-center bg-gray-50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-4 border-t border-gray-100">
            <p className="text-gray-500 text-xs">
              {isForgotPassword ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsLogin(true);
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="font-bold text-dark hover:text-tan transition-colors inline-flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" /> Back to Sign In
                </button>
              ) : isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setIsForgotPassword(false);
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="font-bold text-dark hover:text-tan transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setIsForgotPassword(false);
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="font-bold text-dark hover:text-tan transition-colors"
                  >
                    Log In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
