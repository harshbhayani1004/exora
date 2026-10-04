import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

const shopLinks = [
  { label: "All blooms", href: "/collection" },
  { label: "Crochet flowers", href: "/collection?group=crochet" },
  { label: "Crochet bouquets", href: "/collection?group=crochet" },
  { label: "Pipe cleaner art", href: "/collection?group=pipe-cleaner" },
];

const exploreLinks = [
  { label: "Our story", href: "/about" },
  { label: "How it is made", href: "/about" },
  { label: "Journal", href: "/blog" },
  { label: "Custom requests", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-dark text-white">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[82%] overflow-hidden opacity-25 md:w-[58%]">
        <Image
          src="/og.png"
          alt=""
          fill
          className="scale-125 object-cover object-right"
          sizes="(max-width: 768px) 82vw, 58vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/55 to-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/10 via-transparent to-dark" />
      </div>

      <div className="site-container relative z-10 pt-16 md:pt-24">
        <div className="grid gap-10 border-b border-white/15 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pb-20">
          <div>
            <p className="eyebrow text-butter">Notes from the studio</p>
            <h2 className="display-title mt-5 max-w-4xl text-5xl md:text-7xl lg:text-8xl">
              Keep a little joy
              <span className="block italic text-tan">close by.</span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-md text-sm leading-6 text-white/55">
              New blooms, studio stories, and thoughtful gifting ideas—sent
              occasionally and always with care.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-12 md:grid-cols-4 md:py-16 lg:grid-cols-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <Link href="/" className="font-serif text-3xl font-semibold tracking-[0.16em]">
              EXORA
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">
              Cheerful handmade blooms, crafted slowly in Surat and made to stay
              with you.
            </p>
            <a
              href="#"
              className="mt-7 inline-flex items-center gap-3 text-sm font-semibold text-white/75 transition-colors hover:text-butter"
            >
              <Instagram className="h-4 w-4" /> Follow the studio
            </a>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <p className="eyebrow mb-5 text-white/35">Shop</p>
            <ul className="space-y-3 text-sm font-semibold">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/70 transition-colors hover:text-butter">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow mb-5 text-white/35">Explore</p>
            <ul className="space-y-3 text-sm font-semibold">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/70 transition-colors hover:text-butter">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 border-t border-white/10 pt-8 md:col-span-4 md:grid md:grid-cols-3 md:gap-6 lg:col-span-3 lg:block lg:border-0 lg:pt-0">
            <p className="eyebrow mb-5 text-white/35 md:col-span-3 lg:col-span-1">Visit or write</p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-5 text-sm md:col-span-3 md:grid-cols-3 lg:grid-cols-1">
              <div className="col-span-2 flex gap-3 text-white/65 md:col-span-1">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tan" />
                <span>C-41, Sumeru City Mall<br />Surat, Gujarat</span>
              </div>
              <a href="tel:+917861886462" className="flex items-center gap-3 text-white/65 hover:text-butter">
                <Phone className="h-4 w-4 shrink-0 text-tan" /> +91 78618 86462
              </a>
              <a href="mailto:hello@exora.in" className="flex items-center gap-3 text-white/65 hover:text-butter">
                <Mail className="h-4 w-4 shrink-0 text-tan" /> hello@exora.in
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 border-t border-white/15 py-6 text-[9px] font-bold uppercase tracking-[0.14em] text-white/35 md:text-[10px]">
          <p>© {new Date().getFullYear()} Exora</p>
          <p className="hidden sm:block">Handmade with patience in Surat</p>
          <div className="flex gap-4 md:gap-7">
            <Link href="/admin" className="hover:text-butter transition">Studio Portal</Link>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>

      <p className="relative z-10 translate-y-[0.1em] whitespace-nowrap text-center font-serif text-[21vw] font-semibold leading-[0.68] tracking-[-0.08em] text-white/[0.055]">
        EXORA
      </p>
    </footer>
  );
}
