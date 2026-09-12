import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { isValidElement } from 'react';
import type { ReactNode } from 'react';
import type { Pluggable, PluggableList } from 'unified';
import GithubSlugger from 'github-slugger';
import { TextPageConfig } from '@/types/page';
import Toc, { type TocItem } from '@/components/pages/Toc';
import { getConfig } from '@/lib/config';
import { blogPostingSchema } from '@/lib/schema';
import { formatDisplayDate } from '@/lib/utils';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    /** Route slug, e.g. "blog-vmf". Enables per-post structured data. */
    slug?: string;
}

export default function TextPage({ config, content, slug }: TextPageProps) {
    const rehypePlugins: PluggableList = [
        rehypeRaw as unknown as Pluggable,
        // Keep KaTeX's default htmlAndMathml output. MathML-only is far smaller,
        // but Chrome's MathML Core implements only mathvariant="normal", so
        // \mathbb, \mathbf and \boldsymbol silently render as plain letters --
        // measured 33 dropped variants in the vMF post alone. The MathML half of
        // the default output is also what screen readers read; output:'html'
        // would shrink the markup but make every equation inaccessible.
        rehypeKatex as unknown as Pluggable,
        rehypeHighlight as unknown as Pluggable
    ];
    const tocSlugger = new GithubSlugger();
    const renderSlugger = new GithubSlugger();
    const toc = content
        .split('\n')
        .map(line => {
            const match = /^(#{2,3})\s+(.*)/.exec(line.trim());
            if (!match) return null;
            const depth = match[1].length;
            const text = match[2].trim();
            return { depth, text, id: tocSlugger.slug(text) };
        })
        .filter((item): item is { depth: number; text: string; id: string } => item !== null);
    const tocTree: TocItem[] = [];

    toc.forEach(item => {
        if (item.depth === 2) {
            tocTree.push({ id: item.id, text: item.text, children: [] });
        } else if (item.depth === 3 && tocTree.length > 0) {
            tocTree[tocTree.length - 1].children.push({ id: item.id, text: item.text });
        }
    });

    const extractText = (node: ReactNode): string => {
        if (typeof node === 'string' || typeof node === 'number') return String(node);
        if (Array.isArray(node)) return node.map(extractText).join(' ');
        if (isValidElement<{ children?: ReactNode }>(node)) {
            return extractText(node.props.children ?? '');
        }
        return '';
    };

    const headingId = (children: ReactNode): string => renderSlugger.slug(extractText(children));
    const showToc = tocTree.length > 0 && config.toc !== 'none';
    const showNestedToc = config.toc === 'nested';
    const isPost = Boolean(slug?.startsWith('blog-'));
    const siteConfig = getConfig();

    return (
        <div className="max-w-6xl mx-auto">
            {isPost && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(
                            blogPostingSchema(siteConfig, {
                                title: config.title,
                                description: config.description,
                                datePublished: config.date,
                                path: `/${slug}/`,
                            })
                        ),
                    }}
                />
            )}
            <div className="flex gap-6">
                {showToc && (
                    <aside className="hidden lg:block w-56 sticky top-28 h-fit max-h-[calc(100vh-8rem)] self-start overflow-y-auto pr-3" aria-label="On this page">
                        <div className="text-sm font-semibold text-primary mb-3">On this page</div>
                        <nav className="space-y-2 text-sm text-neutral-600">
                            <Toc items={tocTree} nested={showNestedToc} />
                        </nav>
                    </aside>
                )}

                <div className="flex-1 min-w-0">
                    {showToc && (
                        <details className="lg:hidden mb-8 rounded-md border border-neutral-200 bg-card px-4 py-3">
                            <summary className="cursor-pointer text-sm font-semibold text-primary">
                                On this page
                            </summary>
                            <nav className="mt-3 space-y-2 border-t border-neutral-200 pt-3 text-sm text-neutral-600" aria-label="On this page">
                                <Toc items={tocTree} nested={showNestedToc} />
                            </nav>
                        </details>
                    )}
                    <header className="mb-12 space-y-3">
                        <h1 className="text-5xl font-display font-semibold tracking-tight text-primary">{config.title}</h1>
                        {config.description && (
                            <p className="text-base text-neutral-600 max-w-2xl leading-relaxed">
                                {config.description}
                            </p>
                        )}
                        {(config.date || config.tags?.length) && (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1 text-sm text-neutral-600">
                                {config.date && (
                                    <time dateTime={config.date}>{formatDisplayDate(config.date)}</time>
                                )}
                                {config.date && config.tags?.length ? (
                                    <span aria-hidden="true" className="text-neutral-500">·</span>
                                ) : null}
                                {config.tags?.map(tag => (
                                    <span
                                        key={tag}
                                        className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs text-neutral-800"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>
                    <div className="markdown-body text-neutral-700 leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={rehypePlugins}
                            components={{
                                h1: ({ children }) => <h1 className="font-display text-4xl font-semibold text-primary mt-8 mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 id={headingId(children)} className="scroll-mt-28 font-display text-3xl font-semibold text-primary mt-10 mb-4 border-b border-neutral-200 pb-2">{children}</h2>,
                                h3: ({ children }) => <h3 id={headingId(children)} className="scroll-mt-28 text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-outside mb-4 space-y-2 ml-6 [&_ul]:mt-4 [&_ul]:mb-0">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-outside mb-4 space-y-2 ml-6 [&_ol]:mt-4 [&_ol]:mb-0">{children}</ol>,
                                li: ({ children }) => <li className="pl-1 mb-2 last:mb-0">{children}</li>,
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target={href?.startsWith('http') ? '_blank' : undefined}
                                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="text-accent font-medium hover:underline transition-colors"
                                    >
                                        {children}
                                    </a>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600">
                                        {children}
                                    </blockquote>
                                ),
                                strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                                em: ({ children }) => <em className="italic text-neutral-600">{children}</em>,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
