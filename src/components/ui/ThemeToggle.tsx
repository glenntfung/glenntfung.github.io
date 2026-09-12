'use client';

/**
 * Light/dark toggle. No label, no third "system" position in the UI.
 *
 * With nothing stored, the page follows the operating system -- that is the
 * default, and it needs no class on <html> at all. The first click writes an
 * explicit choice; after that the site honours it.
 *
 * Which glyph shows is decided in CSS by the --sun/--moon tokens, not by React
 * state, so the correct one is painted on the first frame and there is nothing
 * to reconcile at hydration.
 */
export function ThemeToggle() {
    const toggle = () => {
        const root = document.documentElement;
        const isDark =
            root.classList.contains('dark') ||
            (!root.classList.contains('light') &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);

        const next = isDark ? 'light' : 'dark';
        root.classList.remove('light', 'dark');
        root.classList.add(next);
        try {
            localStorage.setItem('theme', next);
        } catch {
            // Private browsing or blocked storage: the choice simply does not persist.
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Switch between light and dark theme"
            className="-m-2 p-2 text-muted transition-colors hover:text-ink"
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="h-[1.0625rem] w-[1.0625rem]"
                style={{ display: 'var(--sun)' }}
            >
                <circle cx="10" cy="10" r="3.6" />
                <path d="M10 1.6v2.1M10 16.3v2.1M18.4 10h-2.1M3.7 10H1.6M15.94 4.06l-1.48 1.48M5.54 14.46l-1.48 1.48M15.94 15.94l-1.48-1.48M5.54 5.54L4.06 4.06" />
            </svg>
            <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[1.0625rem] w-[1.0625rem]"
                style={{ display: 'var(--moon)' }}
            >
                <path d="M17 12.2A7.6 7.6 0 0 1 7.8 3a7.6 7.6 0 1 0 9.2 9.2z" />
            </svg>
        </button>
    );
}
