"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CartButton from "./CartButton";
import UserAvatar from "./UserAvatar";

const AuthModal = dynamic(() => import("./AuthModal"), {
  ssr: false,
  loading: () => null,
});

const links = [
  { label: "Shop", href: "/collection" },
  { label: "Our story", href: "/about" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-dark px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-xs">
        Free shipping across India on orders over ₹2,500
      </div>
      <header className="sticky top-0 z-50 border-b border-dark/10 bg-[#f6f2e9]/90 backdrop-blur-xl">
        <nav className="site-container flex h-[72px] items-center justify-between">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-dark/15 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <Link href="/" className="group flex items-center gap-3" aria-label="Exora home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral text-sm text-white transition-transform group-hover:rotate-12">
              ✦
            </span>
            <span className="font-serif text-2xl font-semibold tracking-[0.16em]">EXORA</span>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-semibold transition-colors hover:text-coral ${
                    active ? "text-coral" : "text-dark/75"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-coral" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <UserAvatar onLoginClick={() => setShowAuthModal(true)} />
            <CartButton />
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-dark/40"
              aria-label="Close menu"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[86%] max-w-sm flex-col bg-cream p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-dark/10 pb-5">
                <span className="font-serif text-2xl font-semibold tracking-[0.14em]">EXORA</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-dark/15"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-2">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-dark/10 py-5 font-serif text-3xl"
                >
                  Home <ArrowUpRight className="h-5 w-5 text-coral" />
                </Link>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between border-b border-dark/10 py-5 font-serif text-3xl"
                  >
                    {link.label} <ArrowUpRight className="h-5 w-5 text-coral" />
                  </Link>
                ))}
              </div>
              <p className="text-xs leading-relaxed text-dark/55">
                Handmade in Surat, India.<br />Made to brighten your everyday.
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
