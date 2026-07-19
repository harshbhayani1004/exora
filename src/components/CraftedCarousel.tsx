'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '@/lib/storage';

const images = [
  { src: "photo_3_2025-12-11_14-58-13.jpg", alt: "Elegant White Lily arrangement" },
  { src: "photo_6_2025-12-11_14-58-13.jpg", alt: "Passionate Red Rose collection" },
  { src: "photo_7_2025-12-11_14-58-13.jpg", alt: "Sunshine Yellow Dahlia arrangement" }
];

function CraftedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds per slide

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-t-3xl bg-gray-800">
      <AnimatePresence mode="wait">
        <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full will-change-[opacity]"
        >
            <Image
                src={getImageUrl(images[currentIndex].src)}
                alt={images[currentIndex].alt}
                fill
                className="object-cover will-change-transform"
                loading="lazy"
                quality={80}
                sizes="100vw"
            />
        </motion.div>
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(CraftedCarousel);
