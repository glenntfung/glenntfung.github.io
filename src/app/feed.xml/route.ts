import { getConfig } from '@/lib/config';
import { getBlogPosts } from '@/lib/content';

// Emitted once at build time into out/feed.xml alongside the exported pages.
export const dynamic = 'force-static';

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export function GET(): Response {
    const config = getConfig();
    const posts = getBlogPosts();
    const siteUrl = config.site.url.replace(/\/$/, '');
    const feedUrl = `${siteUrl}/feed.xml`;
    const title = `${config.author.name} — Writing`;
    const description = 'Notes on research, methods, and things I wanted to understand better.';

    const items = posts
        .map(post => {
            const url = `${siteUrl}${post.href}/`;
            // RFC 822 date; dates are authored as plain YYYY-MM-DD, read as UTC.
            const pubDate = new Date(`${post.date}T00:00:00Z`).toUTCString();
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.summary)}</description>
${post.tags.map(tag => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`;
        })
        .join('\n');

    const lastBuildDate = posts.length
        ? new Date(`${posts[0].date}T00:00:00Z`).toUTCString()
        : new Date(0).toUTCString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(`${siteUrl}/blog/`)}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

    return new Response(xml, {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
}
