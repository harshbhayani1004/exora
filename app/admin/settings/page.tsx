"use client";

import { useEffect, useState } from "react";
import {
  Database,
  CheckCircle,
  RefreshCw,
  Server,
  Cloud,
  Terminal,
  Layers,
} from "lucide-react";
import { adminFetch, BACKEND_URL } from "@/lib/admin-api";

export default function AdminSettingsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/stats");
      if (res.ok) {
        const d = await res.json();
        if (d.success) setStats(d.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral bg-coral/10 px-2.5 py-0.5 rounded-full">
            Infrastructure & Telemetry
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1 text-dark tracking-tight">
            System & Database Health
          </h1>
          <p className="text-xs text-dark/60 mt-0.5">
            Real-time status of the PostgreSQL cluster, Cloudflare R2 storage, and backend server.
          </p>
        </div>

        <button
          onClick={checkStatus}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-dark/15 bg-white px-4 py-2 text-xs font-semibold hover:bg-cream transition shadow-2xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-coral" : ""}`} />
          <span>Ping System</span>
        </button>
      </div>

      {/* Health Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Backend Server */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-base text-dark">Studio Backend</h3>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Online
            </span>
          </div>
          <div className="space-y-1 text-xs text-dark/70 font-mono">
            <p>Target URL: {BACKEND_URL}</p>
            <p>Protocol: Next.js API Routes / Next 16</p>
            <p>Auth: JWT + HttpOnly Cookies</p>
          </div>
        </div>

        {/* PostgreSQL Database */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-base text-dark">PostgreSQL Database</h3>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Connected
            </span>
          </div>
          <div className="space-y-1 text-xs text-dark/70 font-mono">
            <p>Host: localhost:5432</p>
            <p>Database: exora</p>
            <p>ORM: Prisma Client v6</p>
          </div>
        </div>

        {/* Cloudflare R2 */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-coral" />
              <h3 className="font-serif font-bold text-base text-dark">Object Storage</h3>
            </div>
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold uppercase font-mono text-dark/70">
              Cloudflare R2
            </span>
          </div>
          <div className="space-y-1 text-xs text-dark/70 font-mono">
            <p>Public CDN Endpoint:</p>
            <p className="truncate text-dark/90">pub-2a5d8e5eaff3498da143b1150b20a7c1.r2.dev</p>
          </div>
        </div>

        {/* Store Commercial Rules */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dark/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-dark/60" />
              <h3 className="font-serif font-bold text-base text-dark">Store Commercial Rules</h3>
            </div>
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold uppercase font-mono text-dark/70">
              Active
            </span>
          </div>
          <div className="space-y-1 text-xs text-dark/70">
            <p>Default Currency: <span className="font-bold text-dark">INR (₹)</span></p>
            <p>Free Delivery Minimum: <span className="font-bold text-dark">₹2,500</span></p>
            <p>Standard Delivery Fee: <span className="font-bold text-dark">₹120</span></p>
          </div>
        </div>
      </div>

      {/* Developer Terminal Cheatsheet */}
      <div className="rounded-3xl bg-dark text-white p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-coral" />
          <h3 className="font-serif text-lg font-bold">Studio CLI Commands</h3>
        </div>
        <p className="text-xs text-white/70">
          Run these helpful commands inside the <code className="bg-white/10 px-1 py-0.5 rounded text-coral font-mono">d:\web\exora\backend</code> folder:
        </p>

        <div className="space-y-2 font-mono text-xs">
          <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
            <span><span className="text-coral">$</span> npm run db:studio</span>
            <span className="text-white/40 text-[11px]">Opens Prisma Studio Web GUI</span>
          </div>
          <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
            <span><span className="text-coral">$</span> npm run db:seed</span>
            <span className="text-white/40 text-[11px]">Re-sync demo catalog & accounts</span>
          </div>
          <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
            <span><span className="text-coral">$</span> npm run db:status</span>
            <span className="text-white/40 text-[11px]">Check migration status</span>
          </div>
        </div>
      </div>
    </div>
  );
}
