'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { TextPageConfig } from '@/types/page';
import { isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import GithubSlugger from 'github-slugger';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    const slugifyText = (text: string) => new GithubSlugger().slug(text);

    const toc = useMemo(() => {
        const raw = content
            .split('\n')
            .map(line => {
                const match = /^(#{2,3})\s+(.*)/.exec(line.trim());
                if (!match) return null;
                const depth = match[1].length;
                const text = match[2].trim();
                return { depth, text, id: slugifyText(text) };
            })
            .filter((item): item is { depth: number; text: string; id: string } => item !== null);
        const tree: { id: string; text: string; children: { id: string; text: string }[] }[] = [];
        raw.forEach(item => {
            if (item.depth === 2) {
                tree.push({ id: item.id, text: item.text, children: [] });
            } else if (item.depth === 3 && tree.length > 0) {
                tree[tree.length - 1].children.push({ id: item.id, text: item.text });
            }
        });
        return tree;
    }, [content]);

    const extractText = (node: ReactNode): string => {
        if (typeof node === 'string' || typeof node === 'number') return String(node);
        if (Array.isArray(node)) return node.map(extractText).join(' ');
        if (isValidElement(node)) {
            return extractText(node.props.children);
        }
        return '';
    };
    const slugify = (children: ReactNode): string => slugifyText(extractText(children));

    const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
        toc.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
    );
    const [activeId, setActiveId] = useState<string | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!toc.length || typeof window === 'undefined') return;
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = (entry.target as HTMLElement).id;
                    if (!id) return;
                    if (entry.isIntersecting) {
                        setActiveId(id);
                        const parent = toc.find(item => item.id === id) || toc.find(item => item.children.some(c => c.id === id));
                        if (parent) {
                            setExpanded(prev => ({ ...prev, [parent.id]: true }));
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -70% 0px',
                threshold: 0,
            }
        );
        observerRef.current = observer;
        toc.forEach(item => {
            const parentEl = document.getElementById(item.id);
            if (parentEl) observer.observe(parentEl);
            item.children.forEach(child => {
                const childEl = document.getElementById(child.id);
                if (childEl) observer.observe(childEl);
            });
        });
        return () => observer.disconnect();
    }, [toc]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "max-w-6xl mx-auto"}
        >
            <div className="flex gap-6">
                {!embedded && toc.length > 0 && !config.hideToc && (
                    <aside className="hidden lg:block w-56 sticky top-28 h-fit self-start">
                        <div className="text-sm font-semibold text-primary mb-3">On this page</div>
                        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                            {toc.map((item) => {
                                const isOpen = expanded[item.id] ?? false;
                                const isActive = item.id === activeId || item.children.some(c => c.id === activeId);
                                return (
                                    <div key={item.id} className="space-y-1">
                                        <button
                                            onClick={() => setExpanded(prev => ({ ...prev, [item.id]: !isOpen }))}
                                            className="w-full text-left hover:text-accent transition-colors flex items-center justify-between"
                                            aria-expanded={isOpen}
                                        >
                                            <span className={`truncate ${isActive ? "text-accent" : ""}`}>
                                                <a href={`#${item.id}`} className="hover:underline">
                                                    {item.text}
                                                </a>
                                            </span>
                                            <span className="text-xs text-neutral-400">{isOpen ? '−' : '+'}</span>
                                        </button>
                                        {isOpen && item.children.length > 0 && (
                                            <div className="ml-3 space-y-1">
                                                {item.children.map(child => (
                                                    <a
                                                        key={child.id}
                                                        href={`#${child.id}`}
                                                        className={`block hover:text-accent transition-colors ${child.id === activeId ? "text-accent" : ""}`}
                                                    >
                                                        {child.text}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </aside>
                )}

                <div className="flex-1 min-w-0">
                    <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                    {config.description && (
                        <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                            {config.description}
                        </p>
                    )}
                    <div className="markdown-body text-neutral-700 dark:text-neutral-600 leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
                            components={{
                                h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                                h2: ({ children }) => {
                                    const id = slugify(children);
                                    return <h2 id={id} className="scroll-mt-28 text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>;
                                },
                                h3: ({ children }) => {
                                    const id = slugify(children);
                                    return <h3 id={id} className="scroll-mt-28 text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>;
                                },
                                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                a: ({ ...props }) => (
                                    <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent font-medium hover:underline transition-colors"
                                    />
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                        {children}
                                    </blockquote>
                                ),
                                strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                                em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
