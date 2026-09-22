"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LogOut, Package, ShieldCheck } from "lucide-react";
import { logout } from "@/lib/auth";

interface UserAvatarProps {
  onLoginClick: () => void;
}

export default function UserAvatar({ onLoginClick }: UserAvatarProps) {
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setShowMenu(false);
    window.location.href = "/";
  };

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="flex h-10 items-center gap-2 rounded-full border border-dark/15 px-3 text-xs font-bold uppercase tracking-wider transition-colors hover:border-dark hover:bg-white"
        aria-label="Sign in"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Sign in</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-dark font-serif font-bold text-white"
        aria-label="Open user menu"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>
      {showMenu && (
        <>
          <button className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} aria-label="Close user menu" />
          <div className="absolute right-0 z-40 mt-3 w-60 rounded-2xl border border-dark/10 bg-white p-2 shadow-xl">
            <div className="border-b border-dark/10 px-3 py-3">
              <p className="font-serif text-lg font-semibold">{user.name}</p>
              <p className="truncate text-xs text-dark/55">{user.email}</p>
            </div>
            <div className="py-1 border-b border-dark/10">
              <Link
                href="/account/orders"
                onClick={() => setShowMenu(false)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-cream"
              >
                <Package className="h-4 w-4 text-dark/60" /> My Orders
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setShowMenu(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-coral hover:bg-coral/10"
                >
                  <ShieldCheck className="h-4 w-4 text-coral" /> Studio Admin
                </Link>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
