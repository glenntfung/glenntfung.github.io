'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TocItem {
    id: string;
    text: string;
    children: { id: string; text: string }[];
}

/**
 * Table of contents with a scroll spy, so the reader can see where they are in
 * a long post instead of staring at an undifferentiated list of links.
 */
export default function Toc({ items, nested }: { items: TocItem[]; nested: boolean }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const ids = items.flatMap(item => [item.id, ...(nested ? item.children.map(c => c.id) : [])]);
        const headings = ids
            .map(id => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (headings.length === 0) return;

        // Track every heading's viewport position and pick the last one that has
        // scrolled past the top band. Using the entries alone is unreliable:
        // fast scrolling can fire several at once, and headings that leave the
        // viewport upward stop intersecting entirely.
        const pickActive = () => {
            const offset = 120;
            let current: string = headings[0].id;
            for (const heading of headings) {
                if (heading.getBoundingClientRect().top - offset <= 0) current = heading.id;
                else break;
            }
            setActiveId(current);
        };

        pickActive();

        const observer = new IntersectionObserver(pickActive, {
            rootMargin: '-120px 0px -70% 0px',
            threshold: [0, 1],
        });
        headings.forEach(heading => observer.observe(heading));
        window.addEventListener('scroll', pickActive, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', pickActive);
        };
    }, [items, nested]);

    const linkClass = (id: string) =>
        cn(
            'block border-l-2 py-0.5 pl-3 -ml-px transition-colors',
            activeId === id
                ? 'border-accent font-semibold text-accent'
                : 'border-transparent hover:text-accent'
        );

    return (
        <ul className="space-y-2">
            {items.map(item => (
                <li key={item.id}>
                    <a href={`#${item.id}`} className={linkClass(item.id)}>
                        {item.text}
                    </a>
                    {nested && item.children.length > 0 && (
                        <ul className="mt-2 ml-2 space-y-1.5 border-l border-neutral-200 pl-1 text-xs">
                            {item.children.map(child => (
                                <li key={child.id}>
                                    <a href={`#${child.id}`} className={linkClass(child.id)}>
                                        {child.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}
