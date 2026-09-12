'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SiteConfig } from '@/lib/config';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
}

export default function Navigation({ items, siteTitle }: NavigationProps) {
  const pathname = usePathname();
  const visibleItems = useMemo(() => items.filter(item => !item.hidden), [items]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50">
      {({ open }) => (
        <>
          <div className="border-b border-neutral-200/70 bg-background/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 lg:h-20">
                {/* Logo/Name */}
                <div className="flex-shrink-0">
                  <Link
                    href="/"
                    className="font-display text-2xl font-semibold tracking-tight text-primary transition-colors duration-200 hover:text-playful lg:text-3xl"
                  >
                    {siteTitle}
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:block">
                  <div className="ml-10 flex items-center space-x-6">
                    <div className="flex items-baseline space-x-6">
                      {visibleItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          prefetch={true}
                          className={cn(
                            'relative rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200',
                            isActive(item.href)
                              ? 'bg-accent-soft text-accent-dark dark:text-accent-light'
                              : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary'
                          )}
                        >
                          <span className="relative z-10">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                    <ThemeToggle />
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="lg:hidden flex items-center">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-full p-2 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent">
                    <span className="sr-only">{open ? 'Close main menu' : 'Open main menu'}</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {open && (
            <Disclosure.Panel static className="border-b border-neutral-200/70 bg-background lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {visibleItems.map((item) => (
                  <Disclosure.Button
                    key={item.title}
                    as={Link}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      'block rounded-2xl px-4 py-3 text-base font-semibold transition-colors duration-200',
                      isActive(item.href)
                        ? 'bg-accent-soft text-accent-dark dark:text-accent-light'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary'
                    )}
                  >
                    {item.title}
                  </Disclosure.Button>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-neutral-200 px-3 pt-3">
                  <span className="text-sm font-medium text-neutral-600">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );
}
