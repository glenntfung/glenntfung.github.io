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

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    const rehypePlugins: PluggableList = [
        rehypeRaw as unknown as Pluggable,
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
    const tocTree: { id: string; text: string; children: { id: string; text: string }[] }[] = [];

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
    const showToc = !embedded && tocTree.length > 0 && !config.hideToc;

    return (
        <div className={embedded ? '' : 'max-w-6xl mx-auto'}>
            <div className="flex gap-6">
                {showToc && (
                    <aside className="hidden lg:block w-56 sticky top-28 h-fit max-h-[calc(100vh-8rem)] self-start overflow-y-auto pr-3" aria-label="On this page">
                        <div className="text-sm font-semibold text-primary mb-3">On this page</div>
                        <nav className="space-y-2 text-sm text-neutral-600">
                            {tocTree.map(item => (
                                <a key={item.id} href={`#${item.id}`} className="block hover:text-accent transition-colors">
                                    {item.text}
                                </a>
                            ))}
                            {tocTree.some(item => item.children.length > 0) && (
                                <details className="pt-2">
                                    <summary className="cursor-pointer font-medium text-primary hover:text-accent transition-colors">
                                        Show subsections
                                    </summary>
                                    <div className="mt-3 space-y-3 border-l border-neutral-200 pl-3">
                                        {tocTree.filter(item => item.children.length > 0).map(item => (
                                            <div key={item.id}>
                                                <div className="mb-1 text-xs font-semibold text-primary">{item.text}</div>
                                                <div className="space-y-1">
                                                    {item.children.map(child => (
                                                        <a
                                                            key={child.id}
                                                            href={`#${child.id}`}
                                                            className="block hover:text-accent transition-colors"
                                                        >
                                                            {child.text}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}
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
                                {tocTree.map(item => (
                                    <a key={item.id} href={`#${item.id}`} className="block hover:text-accent transition-colors">
                                        {item.text}
                                    </a>
                                ))}
                            </nav>
                        </details>
                    )}
                    <header className={embedded ? 'mb-6 space-y-2' : 'mb-12 space-y-3'}>
                        <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-bold text-primary`}>{config.title}</h1>
                        {config.description && (
                            <p className="text-base text-neutral-600 max-w-2xl leading-relaxed">
                                {config.description}
                            </p>
                        )}
                    </header>
                    <div className="markdown-body text-neutral-700 leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={rehypePlugins}
                            components={{
                                h1: ({ children }) => <h1 className="text-3xl font-bold text-primary mt-8 mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 id={headingId(children)} className="scroll-mt-28 text-2xl font-bold text-primary mt-8 mb-4 border-b border-neutral-200 pb-2">{children}</h2>,
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
