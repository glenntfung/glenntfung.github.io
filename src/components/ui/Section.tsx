import Link from 'next/link';
import type { ReactNode } from 'react';

interface SectionProps {
    title: string;
    /** 1 when this is the page's main heading, 2 when it is a block on a larger page. */
    headingLevel?: 1 | 2;
    more?: { href: string; label: string };
    children: ReactNode;
}

/**
 * A headed run of rows — the site's only structural device.
 *
 * A sentence-case heading, with the "see all" link on the same line so it
 * reads as part of the heading instead of trailing after the list. Everything
 * that is a list on this site (posts, news, contents) is one of these, so they
 * read as one system.
 */
export default function Section({ title, headingLevel = 2, more, children }: SectionProps) {
    const Heading = headingLevel === 1 ? 'h1' : 'h2';

    return (
        <section>
            <div className="flex items-baseline justify-between gap-4 pb-1.5">
                <Heading className="text-[1.125rem] font-semibold tracking-[-0.01em] text-ink">
                    {title}
                </Heading>
                {more && (
                    <Link
                        href={more.href}
                        className="whitespace-nowrap text-[0.875rem] text-link underline-offset-4 hover:underline"
                    >
                        {more.label} →
                    </Link>
                )}
            </div>
            {children}
        </section>
    );
}
