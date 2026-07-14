import Link from 'next/link';

const newsDateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
});

function formatNewsDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    return newsDateFormatter.format(new Date(Date.UTC(year, month - 1, day)));
}

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
    viewAllHref?: string;
}

export default function News({ items, title = 'News', viewAllHref }: NewsProps) {
    return (
        <section>
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-primary flex-shrink-0">{title}</h2>
                <div className="h-[1px] w-full bg-neutral-200 dark:bg-neutral-200" />
                {viewAllHref && (
                    <Link href={viewAllHref} className="text-sm text-accent hover:underline whitespace-nowrap">
                        View all
                    </Link>
                )}
            </div>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={`${item.date}-${item.content}`} className="grid grid-cols-[7rem_minmax(0,1fr)] items-baseline gap-4 group item-hover py-1">
                        <time dateTime={item.date} className="text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-500 whitespace-nowrap">
                            {formatNewsDate(item.date)}
                        </time>
                        <p className="text-base text-neutral-700 dark:text-neutral-700 leading-relaxed transition-colors">
                            {item.content}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
