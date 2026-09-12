import ReactMarkdown from 'react-markdown';

interface AboutProps {
    content: string;
}

/** The bio. Plain prose under the hero — it needs no heading of its own. */
export default function About({ content }: AboutProps) {
    return (
        <div className="max-w-[60ch] text-body">
            <ReactMarkdown
                components={{
                    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-link underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-link"
                        >
                            {children}
                        </a>
                    ),
                    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
