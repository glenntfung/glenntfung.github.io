"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BLOG_POSTS } from "@/data/blogPosts";
import PageMotion from "@/components/ui/PageMotion";

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tagMenuOpen, setTagMenuOpen] = useState(false);

  const tags = useMemo(() => {
    const counts: Record<string, number> = {};
    BLOG_POSTS.forEach((post) => {
      post.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({ name, count }));
  }, []);

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesTag = activeTag ? post.tags.includes(activeTag) : true;
      const text = (post.title + " " + post.summary).toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase().trim());
      return matchesTag && matchesQuery;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [activeTag, query]);

  return (
    <PageMotion 
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-primary">Articles</h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Search and filter posts by tags.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts"
          className="w-full sm:w-2/3 rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-sm bg-background"
        />
        <div className="relative">
          <button
            onClick={() => setTagMenuOpen((o) => !o)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-sm bg-background transition-colors hover:border-accent hover:text-accent"
          >
            {activeTag ? `Tag: ${activeTag}` : "Filter by tag"}
          </button>
          {tagMenuOpen && (
            <div className="absolute z-20 mt-2 w-48 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-background shadow-lg max-h-64 overflow-auto animate-in fade-in zoom-in-95 origin-top">
              <button
                onClick={() => {
                  setActiveTag(null);
                  setTagMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 ${activeTag === null ? "font-semibold" : ""}`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => {
                    setActiveTag(tag.name);
                    setTagMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 ${activeTag === tag.name ? "font-semibold" : ""}`}
                >
                  {tag.name} ({tag.count})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-12">
        {filtered.map((post) => (
          <article key={post.slug} className="group signature-hover">
            <div className="flex items-center justify-between gap-3 mb-2">
              <Link href={`/blog-${post.slug}`} className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">
                {post.title}
              </Link>
              <span className="text-xs text-neutral-500 dark:text-neutral-500 whitespace-nowrap">{post.date}</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-3">{post.summary}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-md text-neutral-800 bg-neutral-100 dark:bg-neutral-200 border border-neutral-200 dark:border-neutral-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-neutral-500">No posts match your filters.</div>
        )}
      </div>
    </PageMotion>
  );
}
