import BlogIndex from "@/components/blog/BlogIndex";
import { getBlogPosts } from "@/lib/content";

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="mx-auto flex max-w-[44rem] flex-col gap-8 px-5 pt-12 pb-4 sm:px-8 sm:pt-16">
      <header className="flex flex-col gap-3">
        <h1 className="page-title">
          Writing
        </h1>
        <p className="max-w-[60ch] text-[0.9375rem] text-muted">
          Notes on research, methods, and things I wanted to understand better.
        </p>
      </header>

      <BlogIndex posts={posts} />
    </div>
  );
}
