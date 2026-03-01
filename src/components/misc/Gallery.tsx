"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

// Using real dimensions found from the file system
const photos = [
  { src: "/assets/img/gal/nyc.jpg", alt: "New York City", width: 4000, height: 3000 },
  { src: "/assets/img/gal/uchi.jpg", alt: "UChicago", width: 4032, height: 3024 },
  { src: "/assets/img/gal/macau.jpeg", alt: "Macau Street", width: 2160, height: 2880 }, // Portrait
  { src: "/assets/img/gal/nz.jpeg", alt: "New Zealand", width: 2880, height: 2160 },
  { src: "/assets/img/gal/macao.jpeg", alt: "Macau City", width: 2302, height: 1535 },
  { src: "/assets/img/gal/chinight.jpg", alt: "China Night", width: 4032, height: 3024 },
  { src: "/assets/img/gal/jinanpanyu.jpeg", alt: "Jinan Panyu", width: 1706, height: 1280 },
  { src: "/assets/img/gal/hk.jpeg", alt: "Hong Kong", width: 2302, height: 1536 },
  { src: "/assets/img/gal/duke.jpg", alt: "Duke Chapel", width: 4032, height: 3024 },
];

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent scroll when lightbox is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedPhoto]);

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-primary flex-shrink-0 font-serif">Gallery</h2>
          <div className="h-[1px] w-full bg-neutral-100 dark:bg-neutral-900" />
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.05, ease: [0.21, 0.45, 0.32, 0.9] }}
            onClick={() => setSelectedPhoto(photo.src)}
            className="relative break-inside-avoid mb-8 rounded-2xl overflow-hidden cursor-zoom-in group border border-neutral-100/50 dark:border-neutral-800/50 shadow-sm hover:shadow-2xl transition-all duration-700 bg-neutral-50 dark:bg-neutral-900"
          >
            {/* The Image */}
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            />

            {/* Editorial Overlay (Film Grain + Soft Focus) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col items-center justify-center p-6 text-center">
               {/* Soft Focus Blur Layer */}
               <div className="absolute inset-0 bg-white/5 dark:bg-black/5 backdrop-blur-[4px]" />
               
               {/* Film Grain Effect (Subtle Noise) */}
               <div className="absolute inset-0 mix-blend-overlay opacity-[0.15] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
               
               <motion.span 
                  className="relative z-10 text-white font-serif italic text-xl tracking-tight drop-shadow-lg"
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                 {photo.alt}
               </motion.span>
               
               <div className="mt-2 w-8 h-[1px] bg-white/40 relative z-10" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Lightbox / Image Zoom */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-20 bg-white/95 dark:bg-neutral-950/98 backdrop-blur-xl cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                    src={selectedPhoto}
                    alt="Zoomed photo"
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
                />
              </div>
              
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 sm:top-4 -right-2 sm:right-4 p-3 text-neutral-500 hover:text-primary transition-colors"
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
