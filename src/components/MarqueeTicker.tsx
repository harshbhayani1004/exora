// No "use client" needed — zero JS, pure CSS animation
const ITEMS = [
  { type: "text", value: "Timeless Elegance" },
  { type: "dot",  value: "•" },
  { type: "text", value: "Handcrafted Beauty" },
  { type: "dot",  value: "•" },
  { type: "text", value: "Premium Quality" },
  { type: "dot",  value: "•" },
];

export default function MarqueeTicker() {
  return (
    <div className="marquee-outer flex-1 w-full md:w-auto overflow-hidden">
      <div className="marquee-track flex items-center w-max">
        {/* Two identical sets — animation moves exactly -50% = one full set */}
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className={
              item.type === "dot"
                ? "text-4xl md:text-6xl font-serif text-black/10 mx-8 shrink-0 select-none"
                : "text-4xl md:text-6xl font-serif text-white/90 italic mx-8 shrink-0 select-none"
            }
          >
            {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}
