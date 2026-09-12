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
 * A labelled run of rows — the site's only structural device.
 *
 * The rule weights come from booktabs: a heavier rule opens the run, hairlines
 * separate the rows, and nothing closes it. Everything that is a list on this
 * site (posts, news, contents) is one of these, so they read as one system.
 */
export default function Section({ title, headingLevel = 2, more, children }: SectionProps) {
    const Heading = headingLevel === 1 ? 'h1' : 'h2';

    return (
        <section>
            <Heading className="label block pb-2.5">{title}</Heading>
            <div className="rows">{children}</div>
            {more && (
                <p className="pt-3.5 text-[0.8125rem]">
                    <Link
                        href={more.href}
                        className="text-link underline-offset-4 hover:underline"
                    >
                        {more.label} →
                    </Link>
                </p>
            )}
        </section>
    );
}
