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
 * The rule is inset to the content column rather than bled to the viewport
 * edge, so it is the same object as every other rule on the site -- the
 * section rules, the row hairlines and the footer all stop at the same two
 * margins. A full-bleed line would draw the eye to the window edges instead
 * of the column the page is actually set in.
 */
export default function Header({ items }: HeaderProps) {
    const pathname = usePathname();
    const visible = items.filter(item => !item.hidden);

    const isCurrent = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <header>
            {/* Padding on the outer element, rule on the inner one, so the
                rule starts and ends exactly where the content rules do. */}
            <div className="mx-auto max-w-[44rem] px-5 sm:px-8">
                <div className="flex h-[3.75rem] items-center justify-between gap-6 border-b border-rule text-[0.8125rem]">
                    <nav className="flex items-center gap-5">
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
