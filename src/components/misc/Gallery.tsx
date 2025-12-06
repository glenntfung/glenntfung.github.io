"use client";

import Image from "next/image";

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
    <div className="border rounded-lg p-6 bg-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">Gallery</h2>
          <p className="text-sm text-neutral-500">Snapshots from travels and life</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.src} className="relative aspect-video overflow-hidden rounded-lg border bg-neutral-50 dark:bg-neutral-900">
            <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
