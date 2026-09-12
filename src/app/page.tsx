import { getConfig } from '@/lib/config';
import { getMarkdownContent, getTomlContent, getBlogPosts } from '@/lib/content';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import News, { NewsItem } from '@/components/home/News';
import WritingList from '@/components/home/WritingList';
import Section from '@/components/ui/Section';

const RECENT_POSTS = 3;
const RECENT_NEWS = 3;

/**
 * content/about.toml used to sit between this page and its two content files,
 * declaring a list of typed sections. Of the eight keys it carried, six were
 * never read, and the two that were just named bio.md and news.toml — which
 * this page can name itself.
 */
export default function Home() {
  const config = getConfig();
  const posts = getBlogPosts();
  const news = getTomlContent<{ news: NewsItem[] }>('news.toml')?.news ?? [];

  return (
    <div className="mx-auto flex max-w-[44rem] flex-col gap-12 px-5 pt-12 pb-4 sm:px-8 sm:pt-16">
      <Profile author={config.author} social={config.social} />

      <About content={getMarkdownContent('bio.md')} />

      <WritingList posts={posts.slice(0, RECENT_POSTS)} total={posts.length} />

      {news.length > 0 && (
        <Section title="Lately" more={{ href: '/news', label: 'Everything' }}>
          <News items={news.slice(0, RECENT_NEWS)} />
        </Section>
      )}
    </div>
  );
}
