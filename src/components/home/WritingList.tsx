import Link from 'next/link';
import Section from '@/components/ui/Section';
import type { BlogPostMeta } from '@/lib/content';
import { formatDisplayDate } from '@/lib/utils';

interface WritingListProps {
    posts: BlogPostMeta[];
    total: number;
}

/**
 * Recent posts, on the homepage. The writing is the site's main asset, so it
 * sits directly under the bio rather than behind a nav click.
 */
export default function WritingList({ posts, total }: WritingListProps) {
    return (
        <Section
            title="Writing"
            more={{ href: '/blog', label: `All ${total} posts` }}
        >
            {posts.map(post => (
                <Link key={post.slug} href={`${post.href}/`} className="row group">
                    <span className="font-medium text-ink transition-colors group-hover:text-link">
                        {post.title}
                    </span>
                    <time
                        dateTime={post.date}
                        className="whitespace-nowrap text-[0.8125rem] text-muted"
                    >
                        {formatDisplayDate(post.date)}
                    </time>
                    <p className="col-span-full max-w-[60ch] text-[0.9375rem] text-muted">
                        {post.summary}
                    </p>
                </Link>
            ))}
        </Section>
    );
}
