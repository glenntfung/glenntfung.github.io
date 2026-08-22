import { notFound } from 'next/navigation';
import { getPageConfig, getMarkdownContent, getBibtexContent, getTomlContent } from '@/lib/content';
import { getConfig } from '@/lib/config';
import { parseBibTeX } from '@/lib/bibtexParser';
import News, { NewsItem } from '@/components/home/News';
import PageMotion from '@/components/ui/PageMotion';
import {
    BasePageConfig,
    PublicationPageConfig,
    TextPageConfig,
    CardPageConfig
} from '@/types/page';

import { Metadata } from 'next';
// Math (KaTeX) and code (highlight.js) styling, imported at the route level.
// Next derives a route's CSS from its module graph, so importing this inside
// TextPage also pushed ~4.8 kB gzipped onto "/", which merely references
// TextPage for one-page mode and never renders it. See src/app/page.tsx.
import '@/components/pages/prose.css';

export const dynamicParams = false;

export function generateStaticParams() {
    const config = getConfig();
    const dedicatedRoutes = new Set(['about', 'blog', 'misc']);
    const navSlugs = config.navigation
        .filter(nav => nav.type === 'page' && !dedicatedRoutes.has(nav.target)) // handled by dedicated routes
        .map(nav => ({
            slug: nav.target,
        }));

    // Ensure /404 route resolves to the global not-found page during export/dev
    return [...navSlugs, { slug: '404' }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    if (slug === '404') {
        return {};
    }
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;
    const config = getConfig();

    if (!pageConfig) {
        return {};
    }

    const canonicalPath = `/${slug}/`;
    const isPost = slug.startsWith('blog-');
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
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;

    if (!pageConfig) {
        notFound();
    }

    return (
        <PageMotion className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="space-y-16">
                {pageConfig.type === 'publication' && (
                    <PublicationPage config={pageConfig as PublicationPageConfig} />
                )}
                {pageConfig.type === 'text' && slug !== 'news' && (
                    <TextPageWrapper config={pageConfig as TextPageConfig} slug={slug} />
                )}
                {pageConfig.type === 'card' && (
                    <CardPageWrapper config={pageConfig as CardPageConfig} />
                )}
                {(pageConfig.type === 'news' || slug === 'news') && (
                    <NewsPage config={pageConfig} />
                )}
            </div>
        </PageMotion>
    );
}

async function PublicationPage({ config }: { config: PublicationPageConfig }) {
    const { default: PublicationsList } = await import('@/components/publications/PublicationsList');
    const bibtex = getBibtexContent(config.source);
    const publications = parseBibTeX(bibtex);
    return <PublicationsList config={config} publications={publications} />;
}

async function TextPageWrapper({ config, slug }: { config: TextPageConfig; slug: string }) {
    const { default: TextPage } = await import('@/components/pages/TextPage');
    const content = getMarkdownContent(config.source);
    return <TextPage config={config} content={content} slug={slug} />;
}

async function CardPageWrapper({ config }: { config: CardPageConfig }) {
    const { default: CardPage } = await import('@/components/pages/CardPage');
    return <CardPage config={config} />;
}

function NewsPage({ config }: { config: BasePageConfig }) {
    const newsData = getTomlContent<{ news: NewsItem[] }>('news.toml');
    const items = newsData?.news || [];
    return <News items={items} title={config.title} headingLevel={1} />;
}
