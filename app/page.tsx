import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flower2,
  Heart,
  MessageCircle,
  PackageCheck,
  Palette,
  Scissors,
  Star,
} from "lucide-react";
import Hero from "@/components/Hero";
import { PRODUCTS } from "@/lib/products-data";
import { getImageUrl } from "@/lib/storage";

const featured = PRODUCTS.filter((product) => product.images[0]).slice(0, 4);

const processSteps = [
  {
    icon: Palette,
    step: "01",
    title: "Colours find each other",
    text: "Warmth, contrast, and personality are balanced before the first loop.",
  },
  {
    icon: Flower2,
    step: "02",
    title: "Petals take their shape",
    text: "Yarn is crocheted, wired, and gently curved by hand.",
  },
  {
    icon: Scissors,
    step: "03",
    title: "The bouquet comes alive",
    text: "Blooms, leaves, and stems are composed and finished by eye.",
  },
  {
    icon: PackageCheck,
    step: "04",
    title: "Ready for its journey",
    text: "Every piece is checked, protected, and wrapped for gifting.",
  },
];

export default function Home() {
  return (
    <div className="bg-cream">
      <Hero />

      <section className="py-20 md:py-28">
        <div className="site-container">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3 text-coral">Fresh from the studio</p>
              <h2 className="display-title text-5xl md:text-7xl">Pick your happy.</h2>
            </div>
            <Link href="/collection" className="hidden items-center gap-2 text-sm font-bold md:flex">
              See everything <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {featured.map((product, index) => (
              <Link key={product.id} href={`/collection/${product.slug}`} className="group">
                <div
                  className={`image-reveal relative aspect-[3/4] overflow-hidden ${
                    index % 2 ? "rounded-[5rem_5rem_1.5rem_1.5rem]" : "rounded-[1.5rem_1.5rem_5rem_5rem]"
                  }`}
                >
                  <Image
                    src={getImageUrl(product.images[0].src)}
                    alt={product.images[0].alt || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {product.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-butter px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest">
                      Studio pick
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-lg leading-tight md:text-2xl">{product.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-dark/50 md:text-sm">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/collection" className="btn-secondary mt-10 w-full md:hidden">
            See the full collection
          </Link>
        </div>
      </section>

      <section className="border-y border-dark/10 bg-white/35 py-20 md:py-28">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
            <div>
              <p className="eyebrow mb-4 text-coral">Shop by feeling</p>
              <h2 className="display-title text-5xl md:text-7xl">
                There is a bloom for that.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-dark/58">
                A quiet thank-you, a loud celebration, or a corner that needs
                cheering up. Start with the feeling and we will help with the flowers.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "For a celebration",
                  note: "Bright, joyful bouquets",
                  image: "photo_6_2025-12-11_14-58-13.jpg",
                  href: "/collection?group=crochet",
                },
                {
                  title: "For their new home",
                  note: "Warm pieces for shelves",
                  image: "photo_5_2025-12-11_14-58-13.jpg",
                  href: "/collection",
                },
                {
                  title: "For no reason at all",
                  note: "The very best reason",
                  image: "photo_7_2025-12-11_14-58-13.jpg",
                  href: "/collection",
                },
              ].map((item, index) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group relative min-h-[420px] overflow-hidden rounded-[1.5rem] ${
                    index === 1 ? "sm:-translate-y-8" : ""
                  }`}
                >
                  <Image
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">{item.note}</p>
                    <h3 className="mt-2 font-serif text-3xl leading-tight">{item.title}</h3>
                    <ArrowRight className="mt-5 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-dark py-20 text-white md:py-28">
        <div className="site-container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative min-h-[560px]">
            <div className="image-reveal absolute inset-y-0 left-0 right-[12%] overflow-hidden rounded-[2rem] md:right-[18%]">
              <Image
                src={getImageUrl("photo_3_2025-12-11_14-58-13.jpg")}
                alt="Handmade sunflower bouquet"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 52vw"
              />
            </div>
            <div className="absolute bottom-6 right-0 w-[52%] rounded-[1.5rem] bg-coral p-6 text-white shadow-2xl md:p-8">
              <Scissors className="mb-10 h-6 w-6" />
              <p className="font-serif text-2xl leading-tight md:text-3xl">
                Twelve hours of patient hands in every bouquet.
              </p>
            </div>
          </div>

          <div className="lg:pl-10">
            <p className="eyebrow mb-5 text-butter">Slow craft · bright spirit</p>
            <h2 className="display-title text-6xl md:text-8xl">
              Made by hands,
              <span className="block italic text-tan">kept by hearts.</span>
            </h2>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/65 md:text-lg">
              Each bloom begins as a simple spool of yarn. Our makers twist, loop
              and shape it into something full of personality—soft enough for a
              nursery, joyful enough for a celebration, and durable enough for every day.
            </p>
            <Link href="/about" className="mt-9 inline-flex items-center gap-3 border-b border-white/30 pb-2 text-sm font-bold">
              Step inside our studio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#efe9dc] py-20 md:py-28">
        <div className="site-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow mb-5 text-coral">From thread to forever</p>
            <h2 className="display-title text-5xl md:text-8xl">
              Four quiet steps.
              <span className="block italic text-coral">One joyful bloom.</span>
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-dark/58">
              No assembly lines and no shortcuts. Every piece passes through
              thoughtful colour, patient hands, careful composition, and one final
              check before it leaves our studio.
            </p>
          </div>

          <div className="mt-10 lg:hidden">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[8rem_8rem_1.5rem_1.5rem] bg-sage">
              <Image
                src={getImageUrl("photo_3_2025-12-11_14-58-13.jpg")}
                alt="A handmade crochet sunflower bouquet from the Exora studio"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/55 via-transparent to-white/10" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="eyebrow text-butter">Made by real hands</p>
                <p className="mt-2 max-w-xs font-serif text-2xl leading-tight">
                  The tiny differences are what make each flower yours.
                </p>
              </div>
            </div>

            <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 hide-scrollbar">
              {processSteps.map((item) => (
                <article
                  key={item.step}
                  className="min-w-[78vw] snap-center border-y border-dark/15 px-1 py-6 first:border-l-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-coral text-white">
                      <item.icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="font-serif text-3xl text-dark/20">{item.step}</span>
                  </div>
                  <h3 className="mt-7 font-serif text-3xl leading-tight">{item.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-dark/55">{item.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-dark/35">
              Swipe to follow the process →
            </p>
          </div>

          <div className="mt-14 hidden gap-5 lg:grid lg:grid-cols-[0.72fr_1.25fr_0.72fr] lg:items-center">
            <div className="space-y-5">
              {processSteps.slice(0, 2).map((item) => (
                <article
                  key={item.step}
                  className="rounded-[1.5rem] border border-dark/10 bg-white/55 p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="font-serif text-3xl text-dark/18">{item.step}</span>
                  </div>
                  <h3 className="mt-8 font-serif text-2xl leading-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-dark/55">{item.text}</p>
                </article>
              ))}
            </div>

            <div className="relative min-h-[680px] overflow-hidden rounded-[12rem_12rem_2rem_2rem] bg-sage">
              <Image
                src={getImageUrl("photo_3_2025-12-11_14-58-13.jpg")}
                alt="A handmade crochet sunflower bouquet from the Exora studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/55 via-transparent to-white/10" />
              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/25 bg-white/15 p-5 text-white backdrop-blur-md md:left-10 md:right-auto md:max-w-xs md:p-6">
                <p className="eyebrow text-butter">Made by real hands</p>
                <p className="mt-3 font-serif text-2xl leading-tight">
                  The tiny differences are what make each flower yours.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {processSteps.slice(2).map((item) => (
                <article
                  key={item.step}
                  className="rounded-[1.5rem] border border-dark/10 bg-white/55 p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-dark text-white">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="font-serif text-3xl text-dark/18">{item.step}</span>
                  </div>
                  <h3 className="mt-8 font-serif text-2xl leading-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-dark/55">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#efc6bc] py-20 md:py-28">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="relative min-h-[560px]">
            <div className="absolute inset-y-0 left-0 right-[10%] overflow-hidden rounded-[8rem_2rem_2rem_2rem]">
              <Image
                src={getImageUrl("photo_8_2025-12-11_14-58-13.jpg")}
                alt="A custom handmade flower gift set"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 50vw"
              />
            </div>
            <div className="absolute bottom-8 right-0 flex h-28 w-28 items-center justify-center rounded-full bg-butter shadow-xl">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <div className="lg:pl-12">
            <MessageCircle className="h-7 w-7 text-coral" />
            <p className="eyebrow mb-4 mt-8 text-coral">Make it personal</p>
            <h2 className="display-title text-5xl md:text-7xl">
              Their colours.
              <span className="block italic">Their story.</span>
            </h2>
            <p className="mt-7 max-w-lg text-base leading-7 text-dark/60">
              Tell us who it is for, which colours make them happiest, and the
              feeling you want the gift to carry. Our studio can help shape a
              bouquet that belongs only to them.
            </p>
            <Link href="/contact" className="btn-primary mt-8">
              Start a custom request <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-dark/10 bg-white/40 py-20">
        <div className="site-container text-center">
          <div className="mx-auto flex w-fit gap-1 text-coral">
            {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-4 w-4 fill-current" />)}
          </div>
          <blockquote className="mx-auto mt-7 max-w-4xl font-serif text-3xl leading-tight md:text-5xl">
            “It looks even sweeter in person. The tiny details feel so special,
            and my mother still has it on her bedside table.”
          </blockquote>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-dark/45">
            Neha P. · verified customer
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="site-container">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <p className="eyebrow mb-4 text-coral">The Exora journal</p>
              <h2 className="display-title text-5xl md:text-7xl">Ideas that keep blooming.</h2>
            </div>
            <Link href="/blog" className="hidden items-center gap-2 text-sm font-bold md:flex">
              Read all stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "How to style forever flowers in every room",
                category: "Styling",
                image: "photo_2_2025-12-10_23-57-59.jpg",
              },
              {
                title: "Inside the making of a crochet sunflower",
                category: "Studio notes",
                image: "photo_3_2025-12-11_14-58-13.jpg",
              },
              {
                title: "A thoughtful gift guide for people who have everything",
                category: "Gifting",
                image: "photo_8_2025-12-11_14-58-13.jpg",
              },
            ].map((story, index) => (
              <Link key={story.title} href="/blog" className="group">
                <div className={`image-reveal relative aspect-[4/3] overflow-hidden ${
                  index === 1 ? "rounded-[5rem_1.5rem_1.5rem_1.5rem]" : "rounded-[1.5rem]"
                }`}>
                  <Image
                    src={getImageUrl(story.image)}
                    alt={story.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="eyebrow mt-5 text-coral">{story.category}</p>
                <h3 className="mt-2 font-serif text-3xl leading-tight transition-colors group-hover:text-coral">
                  {story.title}
                </h3>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold">
                  Read story <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <Link href="/blog" className="btn-secondary mt-10 w-full md:hidden">
            Read all stories
          </Link>
        </div>
      </section>
    </div>
  );
}
