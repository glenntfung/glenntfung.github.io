import ReactMarkdown from 'react-markdown';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title = 'About' }: AboutProps) {
    return (
        <section>
            <div className="mb-8 flex items-center gap-5">
                <h2 className="font-display flex-shrink-0 text-4xl font-semibold tracking-tight text-primary">{title}</h2>
                <div className="h-px w-full bg-gradient-to-r from-playful/70 to-transparent" />
            </div>
            <div className="text-lg leading-8 text-neutral-700">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold text-primary mt-8 mb-4 border-b border-neutral-100/50 dark:border-neutral-200/50 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-outside mb-4 space-y-2 ml-6 [&_ul]:mt-4 [&_ul]:mb-0">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-outside mb-4 space-y-2 ml-6 [&_ol]:mt-4 [&_ol]:mb-0">{children}</ol>,
                        li: ({ children }) => <li className="pl-1 mb-2 last:mb-0">{children}</li>,
                        a: ({ href, children }) => (
                            <a
                                href={href}
                                target={href?.startsWith('http') ? '_blank' : undefined}
                                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="text-accent hover:text-accent-dark font-medium underline underline-offset-4 decoration-accent/20 hover:decoration-accent/100 transition-all duration-300"
                            >
                                {children}
                            </a>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent pl-4 italic my-4 text-neutral-600 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-100/50 py-2 pr-4">
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
        </section>
    );
}
