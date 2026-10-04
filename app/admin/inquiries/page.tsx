"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  RefreshCw,
  Check,
  Send,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/inquiries");
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          setInquiries(d.inquiries || []);
          setSubscribers(d.subscribers || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await adminFetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Inquiry marked as ${status}`);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await adminFetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Inquiry deleted");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyEmails = () => {
    if (subscribers.length === 0) return;
    const emails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    showToast("Copied all newsletter emails to clipboard!");
  };

  const unreadCount = inquiries.filter((i) => i.status === "UNREAD").length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-dark px-5 py-3 text-xs font-semibold text-white shadow-2xl border border-white/20 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-coral shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral bg-coral/10 px-2.5 py-0.5 rounded-full">
            Inquiries & Community
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1 text-dark tracking-tight">
            Messages & Subscribers
          </h1>
          <p className="text-xs text-dark/60 mt-0.5">
            Respond to custom flower arrangement requests and manage email newsletter outreach.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-dark/15 bg-white px-4 py-2 text-xs font-semibold hover:bg-cream transition shadow-2xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-coral" : ""}`} />
          <span>Sync Inbox</span>
        </button>
      </div>

      {/* Section 1: Customer Contact Messages */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 space-y-4">
        <div className="flex items-center justify-between border-b border-dark/10 pb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-xl font-bold text-dark">
              Contact Form Inquiries ({inquiries.length})
            </h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-coral text-white px-2 py-0.5 text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-dark/40">
            <RefreshCw className="h-7 w-7 mx-auto animate-spin text-coral mb-2" />
            <p className="font-serif text-sm">Loading studio messages...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-16 text-center text-dark/40">
            <Mail className="h-10 w-10 mx-auto text-dark/20 mb-2" />
            <p className="font-serif text-base font-bold text-dark">No inquiries yet</p>
            <p className="text-xs mt-1">Customer messages from the contact page will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 rounded-2xl border border-dark/10 bg-cream/30 hover:bg-cream/50 transition space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-dark">{inq.name}</span>
                    <span className="text-xs text-dark/50">({inq.email})</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                        inq.status === "UNREAD"
                          ? "bg-coral text-white"
                          : inq.status === "REPLIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-dark/10 text-dark/60"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <span className="text-[10px] text-dark/40 font-mono">
                    {new Date(inq.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-dark mb-1">
                    Subject: {inq.subject || "General Inquiry"}
                  </p>
                  <p className="text-xs text-dark/75 bg-white p-3.5 rounded-xl border border-dark/5 leading-relaxed">
                    {inq.message}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {inq.status === "UNREAD" && (
                    <button
                      onClick={() => handleUpdateStatus(inq.id, "REPLIED")}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition"
                    >
                      <Check className="h-3 w-3" /> Mark Replied
                    </button>
                  )}
                  <a
                    href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || "EXORA Studio Inquiry")}`}
                    className="flex items-center gap-1 text-[11px] font-bold text-coral bg-coral/10 px-3 py-1.5 rounded-xl hover:bg-coral/20 transition"
                  >
                    <Send className="h-3 w-3" /> Reply Email
                  </a>
                  <button
                    onClick={() => handleDeleteInquiry(inq.id)}
                    className="text-[11px] font-bold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-xl hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Newsletter Subscribers */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 space-y-4">
        <div className="flex items-center justify-between border-b border-dark/10 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-dark">
              Newsletter Subscribers ({subscribers.length})
            </h2>
            <p className="text-xs text-dark/50">Audience collected via the footer newsletter form.</p>
          </div>

          {subscribers.length > 0 && (
            <button
              onClick={handleCopyEmails}
              className="flex items-center gap-1.5 text-xs font-bold text-coral hover:underline"
            >
              <Copy className="h-3.5 w-3.5" /> Copy All Emails
            </button>
          )}
        </div>

        {subscribers.length === 0 ? (
          <p className="py-8 text-center text-dark/40 font-serif text-sm">
            No newsletter subscribers yet.
          </p>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
            {subscribers.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-2xl bg-cream/40 border border-dark/5 text-xs flex items-center justify-between hover:bg-cream/60 transition"
              >
                <span className="font-medium text-dark truncate mr-2">{sub.email}</span>
                <span className="text-[10px] text-dark/40 font-mono shrink-0">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
