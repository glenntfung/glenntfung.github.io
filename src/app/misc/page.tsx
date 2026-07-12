import Gallery from "@/components/misc/Gallery";
import GitHubContributions from "@/components/misc/GitHubContributions";
import Random from "@/components/misc/Random";
import TechStack from "@/components/misc/TechStack";
import WorldMap from "@/components/misc/WorldMap";
import PageMotion from "@/components/ui/PageMotion";

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

      {/* Sections with Balanced Spacing */}
      <div className="flex flex-col mt-16">
        {/* Tech Stack Section */}
        <section className="scroll-mt-32 mb-48">
          <TechStack />
        </section>

        {/* GitHub Activity Section */}
        <section className="scroll-mt-32 mb-48">
          <GitHubContributions username="glenntfung" />
        </section>

        {/* Random Thoughts Section */}
        <section className="scroll-mt-32 mb-48">
          <Random />
        </section>

        {/* World Map Section */}
        <section className="scroll-mt-32 mb-48">
          <WorldMap />
        </section>

        {/* Gallery Section */}
        <section className="scroll-mt-32 pb-24">
          <Gallery />
        </section>
      </div>
    </PageMotion>
  );
}
