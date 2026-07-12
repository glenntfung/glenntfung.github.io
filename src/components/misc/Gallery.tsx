"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { X } from "lucide-react";

// Using real dimensions found from the file system
const photos = [
  { src: "/assets/img/gal/nyc.webp", alt: "New York City", width: 2400, height: 1800 },
  { src: "/assets/img/gal/uchi.webp", alt: "UChicago", width: 2400, height: 1800 },
  { src: "/assets/img/gal/macau.webp", alt: "Macau Street", width: 1800, height: 2400 },
  { src: "/assets/img/gal/nz.webp", alt: "New Zealand", width: 2400, height: 1800 },
  { src: "/assets/img/gal/macao.webp", alt: "Macau City", width: 2302, height: 1535 },
  { src: "/assets/img/gal/chicagonight.webp", alt: "Chicago's Night", width: 2400, height: 1800 },
  { src: "/assets/img/gal/jinanpanyu.webp", alt: "Jinan Panyu", width: 1706, height: 1280 },
  { src: "/assets/img/gal/hk.webp", alt: "Hong Kong", width: 2302, height: 1536 },
  { src: "/assets/img/gal/duke.webp", alt: "Duke Chapel", width: 2400, height: 1800 },
];

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[number] | null>(null);

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-primary flex-shrink-0 font-serif">Gallery</h2>
          <div className="h-[1px] w-full bg-neutral-200 dark:bg-neutral-200" />
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
        {photos.map((photo) => (
          <button
            type="button"
            key={photo.src}
            onClick={() => setSelectedPhoto(photo)}
            aria-label={`Open ${photo.alt} photo`}
            className="relative block w-full break-inside-avoid mb-8 rounded-2xl overflow-hidden cursor-zoom-in group border border-neutral-100/50 dark:border-neutral-200/50 shadow-sm hover:shadow-2xl transition-all duration-700 bg-neutral-50 dark:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
          </button>
        ))}
      </div>

      {/* Custom Lightbox / Image Zoom */}
      <AnimatePresence>
        {selectedPhoto && (
          <Dialog
            static
            open={true}
            onClose={() => setSelectedPhoto(null)}
            className="relative z-[100]"
          >
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/95 dark:bg-neutral-50/98 backdrop-blur-xl"
            />
            <div className="fixed inset-0 flex items-center justify-center p-6 sm:p-20">
              <DialogPanel className="relative max-w-7xl w-full h-full">
                <DialogTitle className="sr-only">{selectedPhoto.alt}</DialogTitle>
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 10 }}
                  transition={{ type: "spring", damping: 30, stiffness: 200 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
                  />

                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute -top-12 sm:top-4 -right-2 sm:right-4 p-3 text-neutral-500 hover:text-primary transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Close photo preview"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </motion.div>
              </DialogPanel>
              </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
