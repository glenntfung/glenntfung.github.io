'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SiteConfig } from '@/lib/config';

interface HeaderProps {
    items: SiteConfig['navigation'];
}

/**
 * Destinations on the left, theme toggle on the right.
 *
 * No rule under it: the header sits on the page column, so the first item
 * starts on the same edge as everything below, and that alignment is enough
 * to hold the top of the page together.
 */
export default function Header({ items }: HeaderProps) {
    const pathname = usePathname();
    const visible = items.filter(item => !item.hidden);

    const isCurrent = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <header>
            <div className="mx-auto max-w-column px-5 sm:px-8">
                <div className="flex h-16 items-center justify-between gap-6 text-[0.9375rem]">
                    <nav className="flex items-center gap-6">
                        {visible.map(item => {
                            const current = isCurrent(item.href);
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    aria-current={current ? 'page' : undefined}
                                    className={
                                        current
                                            ? 'text-ink'
                                            : 'text-muted transition-colors hover:text-ink'
                                    }
                                >
                                    {/* The current page is marked with a point estimate
                                        rather than a pill — the site's one flourish. */}
                                    {current && (
                                        <span
                                            aria-hidden="true"
                                            className="mr-[0.4375rem] inline-block h-[0.3125rem] w-[0.3125rem] translate-y-[-0.1em] bg-signal"
                                        />
                                    )}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
