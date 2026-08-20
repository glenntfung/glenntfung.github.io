'use client';

import { useState, useEffect } from 'react';
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
  enableOnePageMode?: boolean;
}

export default function Navigation({ items, siteTitle, enableOnePageMode }: NavigationProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState('');
  const visibleItems = items.filter(item => !item.hidden);

  useEffect(() => {
    if (enableOnePageMode) {
      // Set initial hash on client-side to avoid hydration mismatch
      setActiveHash(window.location.hash);
      const handleHashChange = () => setActiveHash(window.location.hash);
      window.addEventListener('hashchange', handleHashChange);

      // Scroll Spy Logic
      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Update active hash based on intersecting section
            const id = entry.target.id;
            // Only update if we are not currently scrolling to a target (optional refinement, 
            // but for now simple intersection is enough, we might want to debounce or check intersection ratio)
            // We use history.replaceState to update URL without jumping or window.location.hash which might jump
            // But for the nav highlighting, we just need to update local state if we want it to be responsive
            // However, the requirement says "nav bar did not change". 
            // Let's update the activeHash state.
            setActiveHash(id === 'about' ? '' : `#${id}`);
          }
        });
      };

      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Adjust these margins to trigger when section is roughly in view
        threshold: 0
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      // Observe all sections
      visibleItems.forEach(item => {
        if (item.type === 'page') {
          const element = document.getElementById(item.target);
          if (element) observer.observe(element);
        }
      });

      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        observer.disconnect();
      };
    }
  }, [enableOnePageMode, visibleItems]);

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
                      {visibleItems.map((item) => {
                        const isActive = enableOnePageMode
                          ? activeHash === `#${item.target}` || (!activeHash && item.target === 'about')
                          : (item.href === '/'
                            ? pathname === '/'
                            : pathname.startsWith(item.href));

                        const href = enableOnePageMode
                          ? `/#${item.target}`
                          : item.href;

                        return (
                          <Link
                            key={item.title}
                            href={href}
                            prefetch={true}
                            onClick={() => enableOnePageMode && setActiveHash(`#${item.target}`)}
                            className={cn(
                              'relative rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200',
                              isActive
                                ? 'bg-accent-soft text-accent-dark dark:text-accent-light'
                                : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary'
                            )}
                          >
                            <span className="relative z-10">{item.title}</span>
                          </Link>
                        );
                      })}
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
                {visibleItems.map((item) => {
                  const isActive = enableOnePageMode
                    ? (item.href === '/' ? pathname === '/' && !activeHash : activeHash === `#${item.target}`)
                    : (item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href));

                  const href = enableOnePageMode
                    ? (item.href === '/' ? '/' : `/#${item.target}`)
                    : item.href;

                  return (
                    <Disclosure.Button
                      key={item.title}
                      as={Link}
                      href={href}
                      prefetch={true}
                      onClick={() => enableOnePageMode && setActiveHash(item.href === '/' ? '' : `#${item.target}`)}
                      className={cn(
                        'block rounded-2xl px-4 py-3 text-base font-semibold transition-colors duration-200',
                        isActive
                          ? 'bg-accent-soft text-accent-dark dark:text-accent-light'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary'
                      )}
                    >
                      {item.title}
                    </Disclosure.Button>
                  );
                })}
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
