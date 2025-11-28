import { Metadata } from "next";
import Image from "next/image";
import BlurFade from "@/components/magicui/blur-fade";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos I have taken over the years.",
};

const images = [
  { src: "/assets/img/gal/chinight.jpg", alt: "Chicago, IL", label: "Chicago, IL" },
  { src: "/assets/img/gal/uchi.jpg", alt: "The University of Chicago, IL", label: "The University of Chicago, IL" },
  { src: "/assets/img/gal/duke.jpg", alt: "Duke University, NC", label: "Duke University, NC" },
  { src: "/assets/img/gal/nyc.jpg", alt: "New York City, NY", label: "New York City, NY" },
  { src: "/assets/img/gal/hk.jpeg", alt: "Hong Kong", label: "Hong Kong" },
  { src: "/assets/img/gal/nz.jpeg", alt: "Queenstown, New Zealand", label: "Queenstown, New Zealand" },
  { src: "/assets/img/gal/macao.jpeg", alt: "Macau", label: "Macau" },
  { src: "/assets/img/gal/jinanpanyu.jpeg", alt: "Jinan University, Canton", label: "Jinan University, Canton" },
  { src: "/assets/img/gal/macau.jpeg", alt: "Macau", label: "Macau" },
];

const BLUR_FADE_DELAY = 0.04;

export default function GalleryPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-24">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="mb-16 text-center">
          <h1 className="font-semibold text-4xl mb-3 tracking-tight">Gallery</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Here are some photos I have taken over the years.
          </p>
        </div>
      </BlurFade>

      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        {images.map((image, idx) => (
          <BlurFade key={image.src} delay={BLUR_FADE_DELAY * 2 + idx * 0.05}>
            <div className="relative break-inside-avoid rounded-lg overflow-hidden mb-4 group">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-center text-sm font-medium">{image.label}</p>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
