"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Flower2,
  FolderTree,
  Users,
  Mail,
  Database,
  Layers,
  LogOut,
  ExternalLink,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Store,
} from "lucide-react";
import { getCurrentAdmin, adminLogin, adminLogout, type AdminUser } from "@/lib/admin-api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Login form state
  const [email, setEmail] = useState("admin@exora.in");
  const [password, setPassword] = useState("ExoraStudio2026!");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCurrentAdmin().then((u) => {
      setAdmin(u);
      setLoading(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);

    try {
      const data = await adminLogin(email, password);
      setIsSubmitting(false);

      if (!data.success || !data.user) {
        setLoginError(data.error || "Invalid administrator credentials.");
        return;
      }

      if (data.user.role !== "ADMIN") {
        setLoginError("This account does not have Studio Admin privileges.");
        return;
      }

      setAdmin(data.user);
    } catch (err: any) {
      setIsSubmitting(false);
      setLoginError(err.message || "Failed to communicate with Studio Backend.");
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setAdmin(null);
    window.location.reload();
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f0e8] flex flex-col items-center justify-center p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark text-coral animate-spin mb-4 shadow-md">
          ✦
        </div>
        <p className="font-serif text-lg text-dark/70">Connecting to EXORA Studio Backend...</p>
      </div>
    );
  }

  // Not logged in or not admin
  if (!admin || admin.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#f3efe6] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 sm:p-10 shadow-xl border border-dark/10 backdrop-blur">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dark text-white mx-auto mb-4 shadow-md">
            <Sparkles className="h-6 w-6 text-coral" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral text-center">
            Studio Security
          </p>
          <h1 className="font-serif text-3xl font-bold text-center mt-1 text-dark">
            Admin Console
          </h1>
          <p className="text-xs text-dark/60 text-center mt-2 leading-relaxed">
            Enter verified credentials to unlock product catalog, orders, and telemetry.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {loginError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/30 px-4 text-xs font-medium outline-none focus:border-coral focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/30 px-4 text-xs font-medium outline-none focus:border-coral focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-coral transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-coral" /> Authenticating...
                </>
              ) : (
                "Unlock Studio Dashboard"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-dark/10 flex items-center justify-between text-xs text-dark/50">
            <Link href="/" className="hover:text-coral transition flex items-center gap-1 font-semibold">
              ← Return to Store
            </Link>
            <span className="font-mono text-[10px] bg-dark/5 px-2 py-0.5 rounded">
              v1.0 • Backend Direct
            </span>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: Layers, exact: true },
    { label: "Arrangements", href: "/admin/products", icon: Flower2 },
    { label: "Add Arrangement", href: "/admin/products/new", icon: PlusCircle },
    { label: "Orders Hub", href: "/admin/orders", icon: Package },
    { label: "Collections", href: "/admin/categories", icon: FolderTree },
    { label: "Customer Accounts", href: "/admin/customers", icon: Users },
    { label: "Messages & Inquiries", href: "/admin/inquiries", icon: Mail },
    { label: "System & Database", href: "/admin/settings", icon: Database },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral text-white font-serif text-xl font-bold shadow-md">
              ✦
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white block leading-tight">
                EXORA Studio
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">
                Management Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== "/admin");
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-coral text-white shadow-sm font-bold"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-white/50"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Admin Profile */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="rounded-xl bg-white/5 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-white/70 font-mono">PostgreSQL Active</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-[10px] font-bold text-coral hover:underline flex items-center gap-0.5"
            title="Open storefront"
          >
            Store <ExternalLink className="h-2.5 w-2.5" />
          </Link>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{admin.name || "Administrator"}</p>
            <p className="text-[10px] text-white/40 truncate font-mono">{admin.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-red-500/20 hover:text-red-400 transition shrink-0"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-dark flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-dark text-white shrink-0 sticky top-0 h-screen shadow-xl z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-dark/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-dark text-white h-full shadow-2xl z-10 animate-slide-right">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-dark/10 h-16 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden h-10 w-10 rounded-xl border border-dark/15 flex items-center justify-center text-dark/70 hover:bg-cream"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-coral font-mono">
                Studio Suite
              </span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-dark leading-tight">
                {navLinks.find((l) =>
                  l.exact ? pathname === l.href : pathname.startsWith(l.href)
                )?.label || "Studio Admin"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-dark/15 bg-cream/50 px-3 py-1.5 text-xs font-bold text-dark/75 hover:bg-white hover:text-dark transition shadow-2xs"
            >
              <Store className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            <Link
              href="/admin/products/new"
              className="flex items-center gap-1.5 rounded-xl bg-dark text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-coral transition shadow-xs"
            >
              <PlusCircle className="h-3.5 w-3.5 text-coral" />
              <span className="hidden sm:inline">New Bloom</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
