"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ExternalLink, Search, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";
import BlurFade from "@/components/magicui/blur-fade";

const BLUR_FADE_DELAY = 0.04;

const CATEGORIES = {
  "all": "All Posts",
  "ml-statistics": "ML & Statistics",
  "typesetting": "Typesetting",
  "applications": "Applications"
};

// Tags that are allowed to be displayed and used for categorization
const ALLOWED_TAGS = ['ML', 'Statistics', 'DL', 'LaTeX', 'Typesetting', 'Applications'];

export function BlogPosts({ posts }: { posts: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const title = post.title.toLowerCase();
      const summary = post.summary.toLowerCase();
      const tags = (post.tags || []).map((t: string) => t.toLowerCase()).join(" ");
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        title.includes(searchLower) ||
        summary.includes(searchLower) ||
        tags.includes(searchLower);

      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  return (
    <>
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-border/50 focus:border-border transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="size-4 text-muted-foreground" />
              <select
                className="px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-border/50 focus:border-border transition-all duration-200 appearance-none cursor-pointer w-full sm:w-auto"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <BlurFade
              key={post.slug}
              delay={BLUR_FADE_DELAY * 4 + index * 0.05}
            >
              <Link
                className="group block"
                href={post.url}
                target={post.isExternal ? "_blank" : undefined}
                rel={post.isExternal ? "noopener noreferrer" : undefined}
              >
                <article className="p-8 rounded-2xl border border-border/50 hover:border-border transition-all duration-300 hover:shadow-sm hover:shadow-border/20">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-medium tracking-tight group-hover:text-foreground transition-colors duration-200 flex-1 leading-relaxed">
                          {post.title}
                        </h3>
                        {post.isExternal && (
                          <ExternalLink className="size-4 text-muted-foreground mt-1 ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <time className="text-sm text-muted-foreground font-medium">
                        {formatDate(post.publishedAt)}
                      </time>
                      <div className="flex items-center space-x-2">
                        {post.tags &&
                          post.tags
                            .filter((tag: string) => ALLOWED_TAGS.includes(tag))
                            .slice(0, 2)
                            .map((tag: string) => (
                              <span
                                key={tag}
                                className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                        {post.isExternal && (
                          <span className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground font-medium">
                            Medium
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </BlurFade>
          ))}
        </div>
      </BlurFade>

      {filteredPosts.length === 0 && (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4 flex items-center justify-center">
              <Search className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">
              No blog posts found.
            </p>
          </div>
        </BlurFade>
      )}
    </>
  );
}
