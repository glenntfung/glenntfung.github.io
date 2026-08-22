import { CardPageConfig } from '@/types/page';
import Link from 'next/link';

/**
 * True for hrefs the App Router can actually route to.
 *
 * next/link intercepts the click and attempts an RSC navigation, so pointing it
 * at a static file (or another origin) swallowed the click entirely: the
 * Teaching page's course-materials PDF fetched `<href>.txt?_rsc=...`, 404'd,
 * and never opened. Those need a plain anchor.
 */
function isInternalRoute(href: string): boolean {
    if (!href.startsWith('/')) return false;   // external URL, mailto:, tel:, #anchor
    const path = href.split(/[?#]/)[0];
    return !/\.[a-z0-9]+$/i.test(path);        // no file extension => a real route
}

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    return (
        <div>
            <header className={embedded ? "mb-6 space-y-2" : "mb-12 space-y-3"}>
                <h1 className={`${embedded ? "text-3xl" : "text-5xl"} font-display font-semibold tracking-tight text-primary`}>{config.title}</h1>
                {config.description && (
                    <p className="text-base text-neutral-600 dark:text-neutral-700 max-w-2xl leading-relaxed">
                        {config.description}
                    </p>
                )}
            </header>

            <div className="grid gap-5">
                {config.items.map((item, index) => (
                    <div
                        key={index}
                        className="group rounded-3xl border border-transparent px-5 py-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-200 hover:bg-surface sm:px-7"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h2 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary group-hover:text-accent transition-colors`}>
                                {item.title}
                            </h2>
                            {item.date && (
                                <span className="text-xs text-neutral-500 dark:text-neutral-600 shrink-0">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        
                        {item.subtitle && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-700 font-medium mb-3`}>
                                {item.subtitle}
                            </p>
                        )}
                        
                        {item.content && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-700 dark:text-neutral-700 leading-relaxed max-w-3xl`}>
                                {item.content}
                            </p>
                        )}

                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs font-medium text-neutral-600 dark:text-neutral-600 bg-neutral-100 dark:bg-neutral-100 px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        
                        {item.link && (
                            <div className="mt-4">
                                {isInternalRoute(item.link) ? (
                                    <Link href={item.link} className="inline-flex items-center text-sm font-medium text-accent hover:text-primary transition-colors">
                                        {item.link_text ?? 'Read more'}
                                        <span className="ml-1" aria-hidden="true">→</span>
                                    </Link>
                                ) : (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-accent hover:text-primary transition-colors"
                                    >
                                        {item.link_text ?? 'Read more'}
                                        <span className="ml-1" aria-hidden="true">→</span>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
