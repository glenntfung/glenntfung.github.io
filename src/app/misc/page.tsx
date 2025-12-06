"use client";

import dynamic from "next/dynamic";
import Gallery from "@/components/misc/Gallery";
import TechStack from "@/components/misc/TechStack";
import Random from "@/components/misc/Random";

const WorldMap = dynamic(() => import("@/components/misc/WorldMap"), { ssr: false });
const GitHubContributions = dynamic(() => import("@/components/misc/GitHubContributions"), { ssr: false });

export default function MiscPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <header className="space-y-2">
        <p className="text-sm text-accent font-semibold">Experiments and more about me</p>
        <h1 className="text-4xl font-serif font-bold text-primary">Misc</h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
          A playground for side projects, travel snapshots, and other bits that don&apos;t fit neatly elsewhere.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorldMap />
        <TechStack />
      </div>

      <GitHubContributions username="glenntfung" />
      <Random />
      <Gallery />
    </div>
  );
}
