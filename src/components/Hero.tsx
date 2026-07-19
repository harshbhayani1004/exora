import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[calc(100svh-104px)] min-h-[640px] overflow-hidden bg-dark text-white">
      <Image
        src="/images/hero.png"
        alt="Colourful handmade crochet flower bouquet"
        fill
        priority
        quality={92}
        sizes="100vw"
        className="object-cover object-[68%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/60 to-dark/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/75 via-transparent to-dark/15" />

      <div className="site-container relative z-10 flex h-full flex-col justify-between py-7 md:py-10">
        <div className="flex items-start justify-between gap-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-butter" />
            Handmade joy, made to stay
          </div>

          <div className="hidden max-w-[210px] rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
              Fresh from the studio
            </p>
            <p className="mt-3 font-serif text-2xl leading-tight">
              Sixteen new ways to say it with flowers.
            </p>
            <ArrowDownRight className="ml-auto mt-5 h-5 w-5 text-butter" />
          </div>
        </div>

        <div className="grid items-end gap-7 pb-2 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-butter">
              Crochet flowers · Made in Surat
            </p>
            <h1 className="display-title max-w-5xl text-[clamp(4rem,10vw,9rem)]">
              Flowers that
              <span className="block italic text-tan">never leave.</span>
            </h1>
          </div>

          <div className="max-w-xl lg:pb-2">
            <p className="text-sm leading-6 text-white/72 md:text-lg md:leading-8">
              Playful crochet bouquets, shaped one petal at a time. No wilting,
              no waste—just colour, character, and a keepsake made to stay.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/collection"
                className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-butter px-6 text-xs font-bold uppercase tracking-[0.13em] text-dark transition-transform hover:-translate-y-1"
              >
                Shop the blooms <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 text-xs font-bold uppercase tracking-[0.13em] text-white backdrop-blur-md transition-colors hover:bg-white hover:text-dark"
              >
                Meet the makers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
