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
    <details open={open} className="group border-b border-neutral-200">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span
            role="heading"
            aria-level={2}
            className="block text-2xl font-bold text-primary"
          >
            {title}
          </span>
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
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Page Header */}
      <header className="mb-12 space-y-3">
        <h1 className="text-4xl font-bold text-primary">Miscellaneous</h1>
        <p className="text-neutral-600 dark:text-neutral-700 max-w-2xl leading-relaxed">
          A collection of miscellaneous projects, visualizations, and galleries.
        </p>
      </header>

      <div className="mt-12 border-t border-neutral-200">
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
