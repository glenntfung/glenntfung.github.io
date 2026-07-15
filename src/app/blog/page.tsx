"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BLOG_POSTS } from "@/data/blogPosts";
import PageMotion from "@/components/ui/PageMotion";

const POSTS_PER_PAGE = 10;

export default function BlogPage() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tagMenuOpen, setTagMenuOpen] = useState(false);
  const [requestedPage, setRequestedPage] = useState(1);

  useEffect(() => {
    const syncPageFromUrl = () => {
      const page = Number(new URLSearchParams(window.location.search).get("page"));
      setRequestedPage(Number.isInteger(page) && page > 0 ? page : 1);
    };

    syncPageFromUrl();
    window.addEventListener("popstate", syncPageFromUrl);
    return () => window.removeEventListener("popstate", syncPageFromUrl);
  }, []);

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

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, Math.max(totalPages, 1))
    : 1;
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const goToPage = (page: number) => {
    setRequestedPage(page);
    window.history.pushState(null, "", page === 1 ? pathname : `${pathname}?page=${page}`);
  };

  return (
    <PageMotion 
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-primary">Articles</h1>
        <p className="text-neutral-600 dark:text-neutral-700 max-w-2xl">
          Search and filter posts by tags.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label htmlFor="blog-search" className="sr-only">Search posts</label>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (currentPage !== 1) goToPage(1);
          }}
          placeholder="Search posts"
          className="w-full sm:w-2/3 rounded-lg border border-neutral-200 dark:border-neutral-200 px-3 py-2 text-sm bg-background"
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => setTagMenuOpen((o) => !o)}
            aria-expanded={tagMenuOpen}
            aria-controls="blog-tag-filter"
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-200 text-sm bg-background transition-colors hover:border-accent hover:text-accent"
          >
            {activeTag ? `Tag: ${activeTag}` : "Filter by tag"}
          </button>
          {tagMenuOpen && (
            <div id="blog-tag-filter" className="absolute z-20 mt-2 w-48 rounded-lg border border-neutral-200 dark:border-neutral-200 bg-background shadow-lg max-h-64 overflow-auto animate-in fade-in zoom-in-95 origin-top">
              <button
                type="button"
                aria-pressed={activeTag === null}
                onClick={() => {
                  setActiveTag(null);
                  setTagMenuOpen(false);
                  if (currentPage !== 1) goToPage(1);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 ${activeTag === null ? "font-semibold" : ""}`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag.name}
                  aria-pressed={activeTag === tag.name}
                  onClick={() => {
                    setActiveTag(tag.name);
                    setTagMenuOpen(false);
                    if (currentPage !== 1) goToPage(1);
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
        {paginated.map((post) => (
          <article key={post.slug} className="group signature-hover">
            <div className="flex items-center justify-between gap-3 mb-2">
              <Link href={`/blog-${post.slug}`} className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">
                {post.title}
              </Link>
              <time dateTime={post.date} className="text-xs text-neutral-500 dark:text-neutral-600 whitespace-nowrap">{post.date}</time>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-700 mb-3">{post.summary}</p>
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
          <div role="status" className="text-sm text-neutral-500">No posts match your filters.</div>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-200 text-sm transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => goToPage(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`h-10 w-10 rounded-lg border text-sm transition-colors ${currentPage === page ? "border-accent text-accent" : "border-neutral-200 dark:border-neutral-200 hover:border-accent hover:text-accent"}`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-200 text-sm transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </PageMotion>
  );
}
