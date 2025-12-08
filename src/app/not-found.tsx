"use client";

import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-16 bg-gradient-to-b from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
      <div className="relative max-w-2xl w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/15 to-primary/5 blur-3xl rounded-full" aria-hidden />
        <div className="relative glass-card shadow-xl border border-white/40 dark:border-white/10">
          <div className="flex items-center gap-3 text-accent">
            <Compass className="h-10 w-10" strokeWidth={1.5} />
            <div className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
              404
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <h1 className="text-3xl font-serif font-bold text-primary">Page not found</h1>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              The page you are looking for doesn&rsquo;t exist. Let&rsquo;s get you back to familiar territory.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                Go home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
