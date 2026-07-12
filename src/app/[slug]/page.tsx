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
    const openGraphType = slug.startsWith('blog-') ? 'article' : 'website';

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
            type: openGraphType,
            images: [config.author.avatar],
        },
        twitter: {
            card: 'summary',
            title: pageConfig.title,
            description: pageConfig.description,
            images: [config.author.avatar],
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
                    <TextPageWrapper config={pageConfig as TextPageConfig} />
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

async function TextPageWrapper({ config }: { config: TextPageConfig }) {
    const { default: TextPage } = await import('@/components/pages/TextPage');
    const content = getMarkdownContent(config.source);
    return <TextPage config={config} content={content} />;
}

async function CardPageWrapper({ config }: { config: CardPageConfig }) {
    const { default: CardPage } = await import('@/components/pages/CardPage');
    return <CardPage config={config} />;
}

function NewsPage({ config }: { config: BasePageConfig }) {
    const newsData = getTomlContent<{ news: NewsItem[] }>('news.toml');
    const items = newsData?.news || [];
    return <News items={items} title={config.title} />;
}
