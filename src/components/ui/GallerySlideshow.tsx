"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GallerySlideshowProps {
  images: string[];
  title: string;
  category?: string;
}

export function GallerySlideshow({ images, title, category }: GallerySlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds transition
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer aspect-video w-full h-full">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={title}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
          className="w-full h-full object-cover absolute inset-0"
        />
      </AnimatePresence>
      
      {/* Teks judul, dibuat pb-1.5 di mobile agar lebih ke bawah */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end px-3 pb-2 pt-6 md:p-5">
        {category && (
          <span className="text-[10px] md:text-xs font-semibold text-white/70 mb-0.5 uppercase tracking-wider">
            {category}
          </span>
        )}
        <h4 className="text-white font-semibold text-xs md:text-sm leading-tight line-clamp-2">{title}</h4>
      </div>

    </div>
  );
}
