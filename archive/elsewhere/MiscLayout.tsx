import type { Metadata } from 'next';
import { getConfig } from '@/lib/config';

export function generateMetadata(): Metadata {
  const config = getConfig();
  const title = 'Elsewhere';
  const description = 'Places I have been, things I enjoy, and a few parts of life that do not fit on a CV.';

  return {
    title,
    description,
    alternates: {
      canonical: '/misc/',
    },
    openGraph: {
      title,
      description,
      siteName: `${config.author.name}'s Academic Website`,
      url: '/misc/',
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

export default function MiscLayout({ children }: { children: React.ReactNode }) {
  return children;
}
