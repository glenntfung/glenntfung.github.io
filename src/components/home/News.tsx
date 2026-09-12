import { formatDisplayDate } from '@/lib/utils';

export interface NewsItem {
    date: string;
    content: string;
}

/**
 * News rows only — no heading and no rule of its own.
 *
 * The homepage wraps these in a Section ("Lately"), and /news puts them under
 * a page title. Keeping the heading out of here is why /news can have a real
 * page title: it used to render its h1 through Section, which meant the page's
 * main heading came out as a 12px uppercase label.
 */
export default function News({ items }: { items: NewsItem[] }) {
    return (
        <>
            {items.map(item => (
                <div key={`${item.date}-${item.content}`} className="row">
                    <p className="text-[0.9375rem]">{item.content}</p>
                    <time
                        dateTime={item.date}
                        className="whitespace-nowrap text-[0.8125rem] text-muted"
                    >
                        {formatDisplayDate(item.date)}
                    </time>
                </div>
            ))}
        </>
    );
}
