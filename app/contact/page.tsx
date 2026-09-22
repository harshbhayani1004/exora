"use client";

import { useState } from "react";
import { Check, Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <section className="paper-noise border-b border-dark/10 py-16 md:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5 text-coral">Say hello</p>
            <h1 className="display-title text-[clamp(4rem,10vw,8.5rem)]">
              Let&apos;s make
              <span className="block italic text-coral">something joyful.</span>
            </h1>
          </div>
          <p className="max-w-lg text-base leading-7 text-dark/60 md:text-lg">
            Need help choosing a gift, want a custom colour, or simply have a
            question? Our small studio team would love to hear from you.
          </p>
        </div>
      </section>

      <section className="site-container py-16 md:py-24">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2rem] bg-dark p-7 text-white md:p-10">
            <p className="eyebrow text-butter">Studio details</p>
            <div className="mt-12 space-y-8">
              {[
                { icon: Mail, label: "Email", value: "hello@exora.in", href: "mailto:hello@exora.in" },
                { icon: Phone, label: "Call", value: "+91 78618 86462", href: "tel:+917861886462" },
                { icon: MapPin, label: "Visit", value: "C-41, Sumeru City Mall, Surat", href: undefined },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 border-b border-white/10 pb-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <item.icon className="h-4 w-4 text-tan" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="mt-1 block font-serif text-xl hover:text-tan">{item.value}</a>
                    ) : (
                      <p className="mt-1 font-serif text-xl">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-sage p-5 text-dark">
              <p className="text-sm font-bold">Studio hours</p>
              <p className="mt-2 text-sm leading-6 text-dark/60">Monday–Friday, 10am–7pm<br />Saturday, 11am–5pm</p>
            </div>
          </aside>

          <div className="soft-card p-7 md:p-10 lg:p-14">
            {submitted ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="display-title mt-7 text-5xl">Message received.</h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-dark/55">
                  Thank you for reaching out. A member of our studio will reply within one business day.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <p className="eyebrow text-coral">Send a note</p>
                  <h2 className="mt-3 font-serif text-4xl">What can we help with?</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" value={formState.name} placeholder="Jane Smith" onChange={(name) => setFormState({ ...formState, name })} />
                  <Field label="Email address" type="email" value={formState.email} placeholder="jane@example.com" onChange={(email) => setFormState({ ...formState, email })} />
                </div>
                <Field label="Subject" value={formState.subject} placeholder="A custom bouquet" onChange={(subject) => setFormState({ ...formState, subject })} />
                <label className="block">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-dark/45">Your message</span>
                  <textarea
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(event) => setFormState({ ...formState, message: event.target.value })}
                    placeholder="Tell us what you have in mind..."
                    className="w-full rounded-2xl border border-dark/15 bg-white/55 px-4 py-3 text-sm outline-none transition-colors placeholder:text-dark/30 focus:border-coral"
                  />
                </label>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto disabled:opacity-50">
                  {isSubmitting ? "Sending..." : "Send message"} <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-dark/45">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-dark/15 bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-dark/30 focus:border-coral"
      />
    </label>
  );
}
