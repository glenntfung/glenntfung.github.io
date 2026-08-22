import Link from 'next/link';
import { formatDisplayDate } from '@/lib/utils';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
    viewAllHref?: string;
    /** 1 when this is the page's main heading (the /news page), 2 when it is a
     *  section of a larger page (the homepage "Lately" block). */
    headingLevel?: 1 | 2;
}

export default function News({ items, title = 'News', viewAllHref, headingLevel = 2 }: NewsProps) {
    const Heading = headingLevel === 1 ? 'h1' : 'h2';
    return (
        <section>
            <div className="mb-8 flex items-center gap-5">
                <Heading className="font-display flex-shrink-0 text-4xl font-semibold tracking-tight text-primary">{title}</Heading>
                <div className="h-px w-full bg-gradient-to-r from-accent/70 to-transparent" />
                {viewAllHref && (
                    <Link href={viewAllHref} className="whitespace-nowrap text-sm font-semibold text-accent hover:underline">
                        The archive →
                    </Link>
                )}
            </div>
            <div className="divide-y divide-neutral-200/80 rounded-3xl border border-neutral-200/80 bg-surface px-5 sm:px-7">
                {items.map((item) => (
                    <div key={`${item.date}-${item.content}`} className="group grid gap-2 py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-baseline sm:gap-5">
                        <time dateTime={item.date} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-playful sm:text-right">
                            {formatDisplayDate(item.date)}
                        </time>
                        <p className="text-base leading-relaxed text-neutral-700 transition-colors group-hover:text-primary">
                            {item.content}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
