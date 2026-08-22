import BlogIndex from "@/components/blog/BlogIndex";
import PageMotion from "@/components/ui/PageMotion";
import { getBlogPosts } from "@/lib/content";

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <PageMotion
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      <header className="space-y-3">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-primary">Writing</h1>
        <p className="text-neutral-600 dark:text-neutral-700 max-w-2xl">
          Notes on research, methods, and things I wanted to understand better.
          Search or filter by tag, or{" "}
          <a href="/feed.xml" className="text-accent underline underline-offset-4 hover:text-accent-dark">
            subscribe via RSS
          </a>.
        </p>
      </header>

      <BlogIndex posts={posts} />
    </PageMotion>
  );
}
