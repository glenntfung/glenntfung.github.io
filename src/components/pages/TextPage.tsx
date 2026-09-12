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
        <article className="flex flex-col gap-10">
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

            <header className="flex flex-col gap-3">
                <h1 className="page-title">
                    {config.title}
                </h1>
                {config.description && (
                    <p className="max-w-[60ch] text-[0.9375rem] text-muted">
                        {config.description}
                    </p>
                )}
                {(config.date || config.tags?.length) && (
                    <p className="flex flex-wrap gap-x-4 text-[0.8125rem] text-muted">
                        {config.date && (
                            <time dateTime={config.date}>{formatDisplayDate(config.date)}</time>
                        )}
                        {config.tags?.length ? (
                            <span>{config.tags.map(tag => tag.toLowerCase()).join(' · ')}</span>
                        ) : null}
                    </p>
                )}
            </header>

            {showToc && <Toc items={tocTree} nested={showNestedToc} />}

            {/* The reading surface: serif at 19px, capped near 64 characters. */}
            <div className="prose-body">
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={rehypePlugins}
                    components={{
                        h1: ({ children }) => <h1>{children}</h1>,
                        h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
                        h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
                        a: ({ href, children }) => (
                            <a
                                href={href}
                                target={href?.startsWith('http') ? '_blank' : undefined}
                                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                                {children}
                            </a>
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </article>
    );
}
