import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { getImageUrl } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Stories from the Exora studio: handmade flower styling, gifting ideas, care notes, and the people behind every bloom.",
};

const stories = [
  {
    title: "How to style forever flowers in every room",
    excerpt:
      "Small colour shifts, unexpected vessels, and simple placement ideas that make handmade blooms feel at home.",
    category: "Styling",
    date: "July 12, 2026",
    readTime: "5 min read",
    image: "photo_2_2025-12-10_23-57-59.jpg",
    featured: true,
  },
  {
    title: "Inside the making of a crochet sunflower",
    excerpt:
      "From the first loop to the final wired leaf, follow the patient process behind one of our happiest flowers.",
    category: "Studio notes",
    date: "July 4, 2026",
    readTime: "7 min read",
    image: "photo_3_2025-12-11_14-58-13.jpg",
  },
  {
    title: "A thoughtful gift guide for people who have everything",
    excerpt:
      "Personal, lasting, and full of character: six handmade ideas for birthdays, housewarmings, and quiet thank-yous.",
    category: "Gifting",
    date: "June 24, 2026",
    readTime: "6 min read",
    image: "photo_8_2025-12-11_14-58-13.jpg",
  },
  {
    title: "Why slow-made objects feel different",
    excerpt:
      "The tiny variations in handmade work are not imperfections. They are evidence of time, attention, and a real person.",
    category: "Our values",
    date: "June 15, 2026",
    readTime: "4 min read",
    image: "photo_2025-12-10_23-57-28.jpg",
  },
  {
    title: "Colour notes: coral, butter and garden green",
    excerpt:
      "A closer look at the warm palette shaping our newest studio collection and how to use it at home.",
    category: "Colour",
    date: "June 7, 2026",
    readTime: "3 min read",
    image: "photo_6_2025-12-11_14-58-13.jpg",
  },
  {
    title: "Care notes for blooms that never wilt",
    excerpt:
      "Crochet flowers are wonderfully low-maintenance. Here is all you need to keep their yarn petals bright and fresh.",
    category: "Care",
    date: "May 28, 2026",
    readTime: "4 min read",
    image: "photo_7_2025-12-11_14-58-13.jpg",
  },
];

export default function BlogPage() {
  const [featured, ...articles] = stories;

  return (
    <div className="min-h-screen bg-cream">
      <section className="paper-noise border-b border-dark/10 py-16 md:py-24">
        <div className="site-container">
          <div className="flex items-center gap-2 text-coral">
            <Sparkles className="h-4 w-4" />
            <p className="eyebrow">The Exora journal</p>
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h1 className="display-title text-[clamp(4rem,10vw,9rem)]">
              Ideas that
              <span className="block italic text-coral">keep blooming.</span>
            </h1>
            <p className="max-w-lg text-base leading-7 text-dark/60 md:text-lg">
              Studio stories, thoughtful gifting, colour inspiration, and simple
              ways to live with handmade flowers every day.
            </p>
          </div>
        </div>
      </section>

      <section className="site-container py-14 md:py-20">
        <article className="grid overflow-hidden rounded-[2rem] bg-dark text-white lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[430px] lg:min-h-[620px]">
            <Image
              src={getImageUrl(featured.image)}
              alt={featured.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </div>
          <div className="flex flex-col justify-between p-7 md:p-12">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-butter px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-dark">
                Featured · {featured.category}
              </span>
              <span className="flex items-center gap-2 text-xs text-white/45">
                <Clock className="h-3.5 w-3.5" /> {featured.readTime}
              </span>
            </div>
            <div className="mt-20">
              <p className="text-xs font-semibold uppercase tracking-wider text-tan">{featured.date}</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">{featured.title}</h2>
              <p className="mt-6 max-w-lg text-sm leading-7 text-white/60">{featured.excerpt}</p>
              <Link href="#" className="mt-8 inline-flex items-center gap-3 border-b border-white/25 pb-2 text-sm font-bold">
                Read the story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="site-container pb-20 md:pb-28">
        <div className="mb-10 flex items-end justify-between gap-5 border-b border-dark/10 pb-5">
          <div>
            <p className="eyebrow text-coral">Latest stories</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">From our studio to your home</h2>
          </div>
          <p className="hidden text-sm text-dark/45 md:block">{articles.length} articles</p>
        </div>

        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((story, index) => (
            <article key={story.title} className="group">
              <Link href="#" className="block">
                <div className={`image-reveal relative aspect-[4/3] overflow-hidden ${
                  index % 2 ? "rounded-[5rem_1.5rem_1.5rem_1.5rem]" : "rounded-[1.5rem]"
                }`}>
                  <Image
                    src={getImageUrl(story.image)}
                    alt={story.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="mt-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-dark/40">
                  <span className="text-coral">{story.category}</span>
                  <span>·</span>
                  <span>{story.readTime}</span>
                </div>
                <h3 className="mt-3 font-serif text-3xl leading-tight transition-colors group-hover:text-coral">
                  {story.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-dark/55">{story.excerpt}</p>
                <p className="mt-5 text-xs font-semibold text-dark/35">{story.date}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-coral py-16 text-white md:py-20">
        <div className="site-container flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-butter">Stay in the loop</p>
            <h2 className="display-title mt-4 max-w-4xl text-5xl md:text-7xl">
              Fresh stories, thoughtful colour.
            </h2>
          </div>
          <Link href="/contact" className="btn-secondary shrink-0 border-white/35 text-white hover:text-dark">
            Write to the studio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
