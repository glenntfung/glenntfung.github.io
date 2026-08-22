import type { SiteConfig } from '@/lib/config';

/**
 * JSON-LD builders. Emitting these lets Google associate the site with a real
 * person (Knowledge Panel, author attribution on posts) rather than treating it
 * as an anonymous page. Everything is derived from content/config.toml so there
 * is one source of truth.
 */

/** Absolute URL for a site-relative path; schema.org wants fully qualified URLs. */
function absolute(config: SiteConfig, path: string): string {
    return new URL(path, config.site.url).toString();
}

/** Profile links Google can use to reconcile identity across the web. */
function sameAs(config: SiteConfig): string[] {
    return [
        config.social.github,
        config.social.linkedin,
        config.social.google_scholar,
        config.social.orcid,
    ].filter((url): url is string => Boolean(url && url.trim()));
}

export function personSchema(config: SiteConfig) {
    const profiles = sameAs(config);

    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${config.site.url}/#person`,
        name: config.author.name,
        url: config.site.url,
        image: absolute(config, config.author.avatar),
        jobTitle: config.author.title,
        description: config.site.description,
        affiliation: {
            '@type': 'Organization',
            name: config.author.institution,
        },
        ...(config.social.email ? { email: `mailto:${config.social.email}` } : {}),
        ...(profiles.length ? { sameAs: profiles } : {}),
    };
}

export interface BlogPostingInput {
    title: string;
    description?: string;
    /** ISO date (YYYY-MM-DD). */
    datePublished?: string;
    /** Site-relative path, e.g. "/blog-vmf/". */
    path: string;
}

export function blogPostingSchema(config: SiteConfig, post: BlogPostingInput) {
    const url = absolute(config, post.path);

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${url}#post`,
        headline: post.title,
        ...(post.description ? { description: post.description } : {}),
        ...(post.datePublished ? { datePublished: post.datePublished } : {}),
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        image: absolute(config, config.site.og_image),
        author: { '@id': `${config.site.url}/#person` },
        publisher: { '@id': `${config.site.url}/#person` },
    };
}
