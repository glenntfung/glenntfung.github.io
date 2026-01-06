"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const photos = [
  { src: "/assets/img/gal/nyc.jpg", alt: "NYC" },
  { src: "/assets/img/gal/uchi.jpg", alt: "UChicago" },
  { src: "/assets/img/gal/nz.jpeg", alt: "New Zealand" },
  { src: "/assets/img/gal/macau.jpeg", alt: "Macau" },
  { src: "/assets/img/gal/macao.jpeg", alt: "Macau city" },
  { src: "/assets/img/gal/chinight.jpg", alt: "China night" },
  { src: "/assets/img/gal/jinanpanyu.jpeg", alt: "Jinan Panyu" },
  { src: "/assets/img/gal/hk.jpeg", alt: "Hong Kong" },
  { src: "/assets/img/gal/duke.jpg", alt: "Duke" },
];

export default function Gallery() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <motion.div 
            key={photo.src} 
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="relative aspect-video overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 group"
          >
            <Image 
              src={photo.src} 
              alt={photo.alt} 
              fill 
              className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]" 
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
