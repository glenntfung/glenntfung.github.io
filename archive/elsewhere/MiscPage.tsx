import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import Gallery from "@/components/misc/Gallery";
import GitHubContributions from "@/components/misc/GitHubContributions";
import Random from "@/components/misc/Random";
import TechStack from "@/components/misc/TechStack";
import WorldMap from "@/components/misc/WorldMap";
import PageMotion from "@/components/ui/PageMotion";

function MiscSection({
  title,
  description,
  open = false,
  children,
}: {
  title: string;
  description: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={open} className="group border-b border-neutral-200/80">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          {/* A real heading rather than role="heading": it keeps the document
              outline correct for crawlers and for AT that ignores ARIA. */}
          <h2 className="font-display text-3xl font-semibold text-primary">
            {title}
          </h2>
          <span className="mt-1 block text-sm text-neutral-600">
            {description}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="pb-10 pt-3">{children}</div>
    </details>
  );
}

export default function MiscPage() {
  return (
    <PageMotion 
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      {/* Page Header */}
      <header className="mb-12 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-playful">Off the clock</p>
        <h1 className="font-display text-5xl font-semibold tracking-tight text-primary sm:text-6xl">Elsewhere</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-600">
          Places I have been, things I enjoy, and a few parts of life that do not fit on a CV.
        </p>
      </header>

      <div className="mt-12 rounded-[2rem] border border-neutral-200/80 bg-surface px-6 sm:px-8">
        <MiscSection
          title="About Me"
          description="Background, languages, and interests."
          open
        >
          <Random showHeading={false} />
        </MiscSection>
        <MiscSection
          title="Life Journey"
          description="Places I have lived, studied, and visited."
          open
        >
          <WorldMap showHeading={false} />
        </MiscSection>
        <MiscSection
          title="Gallery"
          description="Nine photographs from places along the way."
        >
          <Gallery showHeading={false} />
        </MiscSection>
        <MiscSection
          title="Tech & Tools"
          description="Research, data, and engineering tools I use."
        >
          <TechStack showHeading={false} />
        </MiscSection>
        <MiscSection
          title="GitHub Activity"
          description="A snapshot of recent contribution activity."
        >
          <GitHubContributions username="glenntfung" showHeading={false} />
        </MiscSection>
      </div>
    </PageMotion>
  );
}
