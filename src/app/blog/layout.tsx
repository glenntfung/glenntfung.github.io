import type { Metadata } from 'next';
import { getConfig } from '@/lib/config';

export function generateMetadata(): Metadata {
  const config = getConfig();
  const title = 'Writing';
  const description = 'Notes on research, methods, and things I wanted to understand better.';

  return {
    title,
    description,
    alternates: {
      canonical: '/blog/',
    },
    openGraph: {
      title,
      description,
      siteName: `${config.author.name}'s Academic Website`,
      url: '/blog/',
      type: 'website',
      images: [config.site.og_image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [config.site.og_image],
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
