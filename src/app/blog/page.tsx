import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import { getMediumPosts } from "@/data/medium-posts";
import { BlogPosts } from "./blog-posts";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

const BLUR_FADE_DELAY = 0.04;

// Function to categorize posts
function categorizePost(post: any) {
  const tags = post.tags || [];
  
  if (tags.some((tag: string) => ['ML', 'Statistics', 'DL'].includes(tag))) {
    return "ml-statistics";
  }
  if (tags.some((tag: string) => ['LaTeX', 'Typesetting'].includes(tag))) {
    return "typesetting";
  }
  if (tags.some((tag: string) => ['Applications'].includes(tag))) {
    return "applications";
  }
  
  return "all";
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const mediumPosts = getMediumPosts();

  // Combine and categorize all posts
  const allPosts = [
    ...posts.map(post => ({
      ...post,
      type: 'local' as const,
      url: `/blog/${post.slug}`,
      isExternal: false,
      publishedAt: post.metadata.publishedAt,
      title: post.metadata.title,
      summary: post.metadata.summary,
      tags: post.metadata.tags
    })),
    ...mediumPosts.map(post => ({
      ...post,
      type: 'medium' as const,
      url: post.url,
      isExternal: true
    }))
  ];

  // Add category to each post
  const postsWithCategory = allPosts.map(post => ({
    ...post,
    category: categorizePost(post)
  }));

  // Sort posts by date
  const sortedPosts = postsWithCategory.sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return (
    <section className="max-w-3xl mx-auto px-4 py-24">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="mb-16 text-center">
          <h1 className="font-semibold text-4xl mb-3 tracking-tight">Blog</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Thoughts on research and life.
          </p>
        </div>
      </BlurFade>

      <BlogPosts posts={sortedPosts} />
    </section>
  );
}