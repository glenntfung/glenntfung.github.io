import { notFound } from 'next/navigation';
import { getPageConfig, getTomlContent, getBlogPost, getBlogPosts } from '@/lib/content';
import { getConfig } from '@/lib/config';
import News, { NewsItem } from '@/components/home/News';
import { BasePageConfig, TextPageConfig } from '@/types/page';

import { Metadata } from 'next';
// Math (KaTeX) and code (highlight.js) styling, imported at the route level so
// only the routes that render prose pay for it.
import '@/components/pages/prose.css';

export const dynamicParams = false;

const BLOG_PREFIX = 'blog-';

/** Page config for a route slug, plus the markdown body when it is a post. */
function resolvePage(slug: string): { config: BasePageConfig; body?: string } | null {
    if (slug.startsWith(BLOG_PREFIX)) {
        const post = getBlogPost(slug.slice(BLOG_PREFIX.length));
        if (!post) return null;

        const config: TextPageConfig = {
            type: 'text',
            title: post.title,
            description: post.summary,
            toc: post.toc,
            date: post.date,
            tags: post.tags,
        };
        return { config, body: post.body };
    }

    const config = getPageConfig<BasePageConfig>(slug);
    return config ? { config } : null;
}

export function generateStaticParams() {
    const config = getConfig();
    // "about" is the nav entry for "/", and "blog" has its own route file;
    // neither should be emitted here as well.
    const dedicatedRoutes = new Set(['about', 'blog']);
    const navSlugs = config.navigation
        .filter(nav => nav.type === 'page' && !dedicatedRoutes.has(nav.target))
        .map(nav => ({ slug: nav.target }));

    // Posts are discovered from content/blog/*.md rather than listed a second
    // time in config.toml, which used to carry eight hidden nav entries whose
    // only job was to make these routes exist.
    const postSlugs = getBlogPosts().map(post => ({ slug: `${BLOG_PREFIX}${post.slug}` }));

    // Ensure /404 route resolves to the global not-found page during export/dev
    return [...navSlugs, ...postSlugs, { slug: '404' }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    if (slug === '404') {
        return {};
    }
    const page = resolvePage(slug);
    const config = getConfig();

    if (!page) {
        return {};
    }

    const { config: pageConfig } = page;
    const canonicalPath = `/${slug}/`;
    const isPost = slug.startsWith(BLOG_PREFIX);
    const publishedTime = (pageConfig as TextPageConfig).date;

    return {
        title: pageConfig.title,
        description: pageConfig.description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title: pageConfig.title,
            description: pageConfig.description,
            siteName: `${config.author.name}'s Academic Website`,
            url: canonicalPath,
            ...(isPost
                ? { type: 'article' as const, publishedTime, authors: [config.author.name] }
                : { type: 'website' as const }),
            images: [config.site.og_image],
        },
        twitter: {
            card: 'summary_large_image',
            title: pageConfig.title,
            description: pageConfig.description,
            images: [config.site.og_image],
        },
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    if (slug === '404') {
        notFound();
    }
    const page = resolvePage(slug);

    if (!page) {
        notFound();
    }

    const { config: pageConfig, body } = page;

    return (
        <div className="mx-auto flex max-w-[44rem] flex-col px-5 pt-12 pb-4 sm:px-8 sm:pt-16">
            {pageConfig.type === 'text' && slug !== 'news' && (
                <TextPageWrapper config={pageConfig as TextPageConfig} content={body ?? ''} slug={slug} />
            )}
            {(pageConfig.type === 'news' || slug === 'news') && (
                <NewsPage config={pageConfig} />
            )}
        </div>
    );
}

async function TextPageWrapper({ config, content, slug }: { config: TextPageConfig; content: string; slug: string }) {
    const { default: TextPage } = await import('@/components/pages/TextPage');
    return <TextPage config={config} content={content} slug={slug} />;
}


/** /news: a page title and a description, laid out like /blog. */
function NewsPage({ config }: { config: BasePageConfig }) {
    const items = getTomlContent<{ news: NewsItem[] }>('news.toml')?.news ?? [];

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-3">
                <h1 className="page-title">{config.title}</h1>
                {config.description && (
                    <p className="max-w-[60ch] text-[0.9375rem] text-muted">
                        {config.description}
                    </p>
                )}
            </header>
            <div className="rows">
                <News items={items} />
            </div>
        </div>
    );
}
