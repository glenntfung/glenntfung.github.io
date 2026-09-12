"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPostMeta } from "@/lib/content";
import { formatMonthDay } from "@/lib/utils";

/**
 * The writing index.
 *
 * Posts are grouped by year because a research trajectory is chronological —
 * the grouping carries information a search box does not. Tags filter in
 * place. The search field, tag menu and client-side pagination this replaces
 * were three controls built for eight items that fit on one screen.
 */
export default function BlogIndex({ posts }: { posts: BlogPostMeta[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach(post => post.tags.forEach(tag => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [posts]);

  const visible = activeTag ? posts.filter(post => post.tags.includes(activeTag)) : posts;

  // Posts arrive newest-first, so years come out in order.
  const byYear = useMemo(() => {
    const groups: { year: string; posts: BlogPostMeta[] }[] = [];
    visible.forEach(post => {
      const year = post.date.slice(0, 4);
      const last = groups[groups.length - 1];
      if (last?.year === year) last.posts.push(post);
      else groups.push({ year, posts: [post] });
    });
    return groups;
  }, [visible]);


  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pb-3.5 text-[0.8125rem]">
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          aria-pressed={activeTag === null}
          className={
            activeTag === null
              ? "border-b-[1.5px] border-signal text-ink"
              : "border-b-[1.5px] border-transparent text-muted transition-colors hover:text-ink"
          }
        >
          All {posts.length}
        </button>
        {tags.map(([tag, count]) => (
          <button
            type="button"
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            aria-pressed={activeTag === tag}
            className={
              activeTag === tag
                ? "border-b-[1.5px] border-signal text-ink"
                : "border-b-[1.5px] border-transparent text-muted transition-colors hover:text-ink"
            }
          >
            {tag.toLowerCase()} {count}
          </button>
        ))}
      </div>

      <div className="rows">
        {byYear.map((group, index) => (
          <div key={group.year}>
            <h2
              className={`${index === 0 ? 'pt-3' : 'pt-6'} pb-2 text-[0.75rem] font-semibold tracking-[0.1em] text-muted`}
            >
              {group.year}
            </h2>
            {group.posts.map(post => (
              <Link key={post.slug} href={`${post.href}/`} className="row group">
                <span className="font-medium text-ink transition-colors group-hover:text-link">
                  {post.title}
                </span>
                <time
                  dateTime={post.date}
                  className="whitespace-nowrap text-[0.8125rem] text-muted"
                >
                  {formatMonthDay(post.date)}
                </time>
                <p className="col-span-full max-w-[60ch] text-[0.9375rem] text-muted">
                  {post.summary}
                </p>
                <p className="col-span-full text-[0.75rem] tracking-[0.05em] text-muted">
                  {post.tags.map(tag => tag.toLowerCase()).join(" · ")}
                </p>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
