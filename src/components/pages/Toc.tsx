import Section from '@/components/ui/Section';

export interface TocItem {
    id: string;
    text: string;
    children: { id: string; text: string }[];
}

/**
 * Contents, at the top of the post rather than in a sticky left rail.
 *
 * Headings carry their own numbering where the author used it, so the rows
 * deliberately have no right-hand column -- a second set of numbers beside
 * "1. Geometry and Density" counted the same thing twice.
 *
 * The rail version carried a scroll spy so the reader could see where they
 * were; with the list at the top there is nothing to keep in sync, which makes
 * this a plain server component and removes an IntersectionObserver plus a
 * scroll listener from every post.
 */
export default function Toc({ items, nested }: { items: TocItem[]; nested: boolean }) {
    return (
        <Section title="Contents">
            {items.map(item => (
                <div key={item.id} className="row">
                    <span className="flex flex-col gap-1">
                        <a
                            href={`#${item.id}`}
                            className="text-[0.9375rem] text-body transition-colors hover:text-link"
                        >
                            {item.text}
                        </a>
                        {nested && item.children.length > 0 && (
                            <span className="flex flex-col gap-1 pl-4">
                                {item.children.map(child => (
                                    <a
                                        key={child.id}
                                        href={`#${child.id}`}
                                        className="text-[0.8125rem] text-muted transition-colors hover:text-link"
                                    >
                                        {child.text}
                                    </a>
                                ))}
                            </span>
                        )}
                    </span>
                </div>
            ))}
        </Section>
    );
}
