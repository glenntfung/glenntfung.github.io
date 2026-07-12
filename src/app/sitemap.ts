import type { MetadataRoute } from 'next';
import { getConfig } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getConfig();
  const paths = Array.from(new Set(['/', ...config.navigation.map(item => item.href)]));

  return paths.map(path => ({
    url: new URL(path, config.site.url).toString(),
  }));
}
