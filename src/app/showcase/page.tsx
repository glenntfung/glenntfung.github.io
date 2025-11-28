import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BlurFade from "@/components/magicui/blur-fade";

export const metadata: Metadata = {
  title: "Misc",
  description: "Something more than research.",
};

const BLUR_FADE_DELAY = 0.04;

export default function ShowcasePage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-24">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="mb-16 text-center">
          <h1 className="font-semibold text-4xl mb-3 tracking-tight">Misc</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Something more than research.
          </p>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 gap-6">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <Link href="/gallery" className="group block">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
              <div className="flex flex-col space-y-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                   <Image
                    src="/assets/img/gal/hk.jpeg"
                    alt="Photography Gallery"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1 p-2">
                  <h3 className="font-semibold tracking-tight text-xl">Photography Gallery</h3>
                  <p className="text-muted-foreground">Photos I have taken over the years.</p>
                </div>
              </div>
            </div>
          </Link>
        </BlurFade>
      </div>
    </section>
  );
}
