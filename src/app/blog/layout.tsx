import type { Metadata } from 'next';
import { getConfig } from '@/lib/config';

export function generateMetadata(): Metadata {
  const config = getConfig();
  const title = 'Articles';
  const description = 'Search and filter posts by tags.';

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
      images: [config.author.avatar],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [config.author.avatar],
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
