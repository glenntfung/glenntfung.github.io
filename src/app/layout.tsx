import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getConfig } from "@/lib/config";
import { personSchema } from "@/lib/schema";
import { formatDisplayDate } from "@/lib/utils";

// Two roles, one superfamily. Sans carries headings, navigation and every
// label; serif is the reading surface inside posts. Weights are limited to the
// ones actually used -- Plex is not a variable font on Google Fonts, so each
// extra weight is another file on the critical path.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-plex-sans",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-plex-serif",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = getConfig();
  return {
    metadataBase: new URL(config.site.url),
    title: {
      default: config.site.title,
      template: `%s | ${config.site.title}`
    },
    description: config.site.description,
    keywords: [config.author.name, "PhD", "Research", config.author.institution],
    authors: [{ name: config.author.name }],
    creator: config.author.name,
    publisher: config.author.name,
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": [{ url: "/feed.xml", title: `${config.author.name} — Writing` }],
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: config.site.title,
      description: config.site.description,
      siteName: `${config.author.name}'s Academic Website`,
      url: "/",
      images: [
        {
          url: config.site.og_image,
          width: 1200,
          height: 630,
          alt: `${config.author.name} — ${config.author.title}, ${config.author.institution}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.site.title,
      description: config.site.description,
      images: [config.site.og_image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getConfig();

  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexSerif.variable} scroll-smooth`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || t === 'light') document.documentElement.classList.add(t);
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          // Person schema: feeds Google's Knowledge Panel with affiliation and
          // verified profile links. Content is generated from content/config.toml.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema(config)) }}
        />
      </head>
      {/* Column layout so the footer sits at the bottom of short pages instead
          of being pushed past the fold by a min-h-screen <main>. */}
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only fixed top-3 left-3 z-50 bg-paper px-4 py-2 text-sm font-semibold text-ink outline outline-2 outline-link"
        >
          Skip to main content
        </a>
        <Header items={config.navigation} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer lastUpdated={formatDisplayDate(new Date().toISOString().slice(0, 10))} />
      </body>
    </html>
  );
}
