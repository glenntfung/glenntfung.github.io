import type { MetadataRoute } from 'next';
import { getConfig } from '@/lib/config';
import { getBlogPosts } from '@/lib/content';

export const dynamic = 'force-static';

/**
 * next.config.ts sets `trailingSlash: true`, so every canonical page lives at
 * `/path/`. Emitting `/path` here meant 12 of 13 sitemap entries 301'd on
 * GitHub Pages and disagreed with the `alternates.canonical` we declare.
 */
function withTrailingSlash(path: string): string {
    if (path === '/') return path;
    return path.endsWith('/') ? path : `${path}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const config = getConfig();
    const posts = getBlogPosts();

    const navPaths = config.navigation
        .filter(item => item.type === 'page')
        .map(item => item.href);

    const postPaths = new Map(posts.map(post => [post.href, post.date]));

    const paths = Array.from(new Set(['/', ...navPaths, ...postPaths.keys()]));

    return paths.map(path => {
        const lastModified = postPaths.get(path);
        return {
            url: new URL(withTrailingSlash(path), config.site.url).toString(),
            ...(lastModified ? { lastModified: new Date(`${lastModified}T00:00:00Z`) } : {}),
        };
    });
}
