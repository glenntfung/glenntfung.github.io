import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { getConfig } from "@/lib/config";
import { personSchema } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  // Only the roman face is preloaded; italic is synthesized by the browser.
  // Shipping the italic variable face too cost ~47 kB on the critical path of
  // every page for the handful of <em> runs that actually use it.
  style: ["normal"],
  // "swap" renders text immediately in the fallback and swaps when Inter
  // arrives. "block" hid all copy for up to 3s. adjustFontFallback (Next's
  // default) size-matches the fallback so the swap barely shifts layout.
  display: "swap",
  variable: "--font-inter",
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
    icons: {
      icon: [
        { url: config.site.favicon, type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    manifest: "/site.webmanifest",
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
      className={`${inter.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Icons, manifest and canonical links come from generateMetadata above;
            duplicating them here emitted every <link> twice. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme-storage');
                const parsed = theme ? JSON.parse(theme) : null;
                const setting = parsed?.state?.theme || 'system';
                const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                const effective = setting === 'dark' ? 'dark' : (setting === 'light' ? 'light' : (prefersDark ? 'dark' : 'light'));
                var root = document.documentElement;
                root.classList.add(effective);
                root.setAttribute('data-theme', effective);
              } catch (e) {
                var root = document.documentElement;
                root.classList.add('light');
                root.setAttribute('data-theme', 'light');
              }
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
      <body className="antialiased flex min-h-screen flex-col">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only fixed top-3 left-3 z-[100] rounded-md bg-background px-4 py-2 text-sm font-semibold text-primary shadow-lg ring-2 ring-accent"
          >
            Skip to main content
          </a>
          <Navigation
            items={config.navigation}
            siteTitle={config.site.title}
            enableOnePageMode={config.features.enable_one_page_mode}
          />
          <main id="main-content" className="flex-1 pt-16 lg:pt-20">
            {children}
          </main>
          <Footer lastUpdated={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
        </ThemeProvider>
      </body>
    </html>
  );
}
