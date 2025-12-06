"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <div className="text-6xl">🧭</div>
        <h1 className="text-3xl font-serif font-bold text-primary">Page not found</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          The page you are looking for does not exist. Head back home or explore the nav.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white transition-colors">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
