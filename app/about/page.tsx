import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Scissors } from "lucide-react";
import { getImageUrl } from "@/lib/storage";

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <section className="paper-noise overflow-hidden border-b border-dark/10 py-16 md:py-24">
        <div className="site-container">
          <p className="eyebrow mb-6 text-coral">Our story</p>
          <h1 className="display-title max-w-6xl text-[clamp(4rem,10vw,9rem)]">
            We make flowers
            <span className="block italic text-coral">worth keeping.</span>
          </h1>
          <div className="mt-12 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <p className="max-w-lg text-base leading-7 text-dark/60 md:text-lg">
              EXORA began with a simple thought: the feeling behind a flower should
              last longer than a week. So we traded cut stems for yarn, wire and
              patient hands.
            </p>
            <div className="relative aspect-[16/7] overflow-hidden rounded-[2rem] bg-sage">
              <Image
                src={getImageUrl("photo_2025-12-10_23-57-28.jpg")}
                alt="A close look at Exora's handmade crochet flowers"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 65vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="site-container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative min-h-[600px]">
            <div className="absolute inset-y-0 left-0 right-[15%] overflow-hidden rounded-[2rem]">
              <Image
                src={getImageUrl("photo_2025-12-10_23-57-29.jpg")}
                alt="Colourful yarn flowers made in the Exora studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 50vw"
              />
            </div>
            <div className="absolute bottom-8 right-0 rounded-2xl bg-butter p-6 shadow-xl">
              <Scissors className="mb-5 h-6 w-6" />
              <p className="max-w-[200px] font-serif text-2xl leading-tight">Slow enough to get every petal right.</p>
            </div>
          </div>

          <div className="lg:pl-10">
            <p className="eyebrow mb-4 text-coral">From Surat, with patience</p>
            <h2 className="display-title text-5xl md:text-7xl">Small loops.<br />Big feeling.</h2>
            <div className="mt-8 space-y-5 text-base leading-7 text-dark/62">
              <p>
                Every piece is crocheted by hand in small batches. The curves are
                shaped slowly, the colours are paired by eye, and the finishing
                touches are checked one by one.
              </p>
              <p>
                That means no two blooms are perfectly identical. A tiny variation
                in a petal or leaf is not a flaw—it is the signature of the person
                who made it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark py-20 text-white md:py-28">
        <div className="site-container">
          <div className="mb-12 max-w-3xl">
            <p className="eyebrow mb-4 text-butter">What guides us</p>
            <h2 className="display-title text-5xl md:text-7xl">Good things,<br /><span className="italic text-tan">made thoughtfully.</span></h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { icon: Heart, number: "01", title: "Made to mean more", text: "A handmade gift carries time, attention and a story no factory can repeat." },
              { icon: Leaf, number: "02", title: "Designed to stay", text: "Our blooms ask for no water and create none of the weekly waste of cut flowers." },
              { icon: Scissors, number: "03", title: "Craft before speed", text: "We make in considered batches so every stem receives the finish it deserves." },
            ].map((value) => (
              <article key={value.number} className="rounded-[2rem] border border-white/10 bg-white/5 p-7 md:min-h-[330px] md:p-9">
                <div className="flex items-center justify-between">
                  <value.icon className="h-6 w-6 text-butter" />
                  <span className="font-serif text-2xl text-white/25">{value.number}</span>
                </div>
                <div className="mt-24">
                  <h3 className="font-serif text-3xl">{value.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/55">{value.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="paper-noise py-20 text-center md:py-28">
        <div className="site-container">
          <p className="eyebrow mb-5 text-coral">Ready to meet your bloom?</p>
          <h2 className="display-title mx-auto max-w-4xl text-5xl md:text-8xl">Let a little colour stay awhile.</h2>
          <Link href="/collection" className="btn-primary mt-9">
            Explore the collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
