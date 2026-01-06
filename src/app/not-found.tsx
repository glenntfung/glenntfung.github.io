"use client";

import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-16 bg-neutral-50 dark:bg-black">
      <div className="relative max-w-2xl w-full">
        <div className="relative bg-white dark:bg-neutral-100 shadow-xl border border-neutral-200 dark:border-neutral-800 rounded-lg p-8">
          <div className="flex items-center gap-3 text-accent mb-6">
            <Compass className="h-10 w-10" strokeWidth={1.5} />
            <div className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
              404
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold text-primary">Page not found</h1>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              The page you are looking for doesn&rsquo;t exist. Let&rsquo;s get you back to familiar territory.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                Go home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
