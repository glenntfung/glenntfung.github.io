import { getConfig } from '@/lib/config';
import { getMarkdownContent, getTomlContent, getPageConfig } from '@/lib/content';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import News, { NewsItem } from '@/components/home/News';
import PageMotion from '@/components/ui/PageMotion';

/** A section of content/about.toml, rendered in order under the profile header. */
interface AboutSection {
  id: string;
  type: 'markdown' | 'list';
  title?: string;
  source?: string;
  limit?: number;
}

export default function Home() {
  const config = getConfig();
  const about = getPageConfig<{ sections?: AboutSection[] }>('about');
  const sections = about?.sections ?? [];

  return (
    <PageMotion
      className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="flex flex-col space-y-20 sm:space-y-24">
        {/* Top Profile Section */}
        <section>
          <Profile
            author={config.author}
            social={config.social}
          />
        </section>

        {/* Content Sections */}
        <div className="mx-auto w-full max-w-4xl space-y-20 sm:space-y-24">
          <section id="about" className="scroll-mt-24 space-y-8">
            {sections.map((section) => {
              switch (section.type) {
                case 'markdown':
                  return (
                    <About
                      key={section.id}
                      content={section.source ? getMarkdownContent(section.source) : ''}
                      title={section.title}
                    />
                  );
                case 'list': {
                  const all = section.source
                    ? getTomlContent<{ news: NewsItem[] }>(section.source)?.news ?? []
                    : [];
                  return (
                    <News
                      key={section.id}
                      items={section.limit ? all.slice(0, section.limit) : all}
                      title={section.title}
                      viewAllHref={section.id === 'news' ? '/news' : undefined}
                    />
                  );
                }
                default:
                  return null;
              }
            })}
          </section>
        </div>
      </div>
    </PageMotion>
  );
}
