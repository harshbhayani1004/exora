"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-butter">
        <Check className="h-4 w-4" /> You are on our studio list. Thank you!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex items-center border-b border-white/35 pb-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-butter text-dark transition-transform hover:-translate-y-1 disabled:opacity-50"
        aria-label="Join newsletter"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
