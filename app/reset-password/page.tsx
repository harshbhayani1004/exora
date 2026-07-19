"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { updatePassword } from "@/lib/auth";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const params = new URLSearchParams(hash.slice(1));
    if (
      params.get("access_token") &&
      params.get("type") === "recovery" &&
      params.get("token_type") === "bearer"
    ) {
      setHasValidToken(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setError("This reset link is invalid. Please request a new one.");
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!hasValidToken) {
      setError("This reset link has expired or is invalid.");
      return;
    }
    if (password.length < 6) {
      setError("Your password needs at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updatePassword(password);
      if (result.success) {
        setSuccess(true);
        window.setTimeout(() => router.push("/"), 3000);
      } else {
        setError(result.error || "We could not update your password.");
      }
    } catch {
      setError("We could not update your password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="paper-noise flex min-h-[75vh] items-center justify-center bg-cream px-4 py-16">
      <div className="soft-card w-full max-w-lg p-7 md:p-10">
        {success ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h1 className="display-title mt-7 text-5xl">You&apos;re all set.</h1>
            <p className="mt-4 text-sm leading-6 text-dark/55">
              Your password has been updated. We will take you back home in a moment.
            </p>
          </div>
        ) : (
          <>
            <p className="eyebrow text-coral">Account recovery</p>
            <h1 className="display-title mt-4 text-5xl">Choose a new password.</h1>
            <p className="mt-4 text-sm leading-6 text-dark/55">
              Make it memorable, secure, and at least six characters long.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && <p className="rounded-2xl bg-[#f7d8d0] px-4 py-3 text-sm text-[#8a3525]">{error}</p>}
              <PasswordField
                label="New password"
                value={password}
                show={showPassword}
                onShow={() => setShowPassword(!showPassword)}
                onChange={setPassword}
              />
              <PasswordField
                label="Confirm password"
                value={confirmPassword}
                show={showConfirmPassword}
                onShow={() => setShowConfirmPassword(!showConfirmPassword)}
                onChange={setConfirmPassword}
              />
              <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
                {isLoading ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  show,
  onShow,
  onChange,
}: {
  label: string;
  value: string;
  show: boolean;
  onShow: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-dark/45">{label}</span>
      <span className="relative block">
        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark/35" />
        <input
          type={show ? "text" : "password"}
          required
          minLength={6}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-14 w-full rounded-full border border-dark/15 bg-white/55 pl-11 pr-12 text-sm outline-none focus:border-coral"
        />
        <button
          type="button"
          onClick={onShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/35 hover:text-dark"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh] bg-cream" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
