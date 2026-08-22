'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useThemeStore, type Theme } from '@/lib/stores/themeStore';
import { cn } from '@/lib/utils';

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: 'system',
    label: 'System',
    icon: <ComputerDesktopIcon className="h-4 w-4" />,
  },
  {
    value: 'light',
    label: 'Light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-background dark:border-[rgba(148,163,184,0.24)] dark:bg-neutral-100">
        <div className="w-4 h-4 rounded-full bg-neutral-300 animate-pulse" />
      </div>
    );
  }

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const order: Theme[] = ['system', 'light', 'dark'];
          const index = order.indexOf(theme);
          const next = order[(index + 1) % order.length];
          setTheme(next);
        }}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          'border border-neutral-200 bg-background hover:bg-neutral-50',
          'dark:border-[rgba(148,163,184,0.24)] dark:bg-neutral-100 dark:hover:bg-neutral-200',
          'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          'text-neutral-600 hover:text-primary dark:text-neutral-600 dark:hover:text-primary'
        )}
        title={`Current theme: ${currentTheme.label}. Click to cycle theme.`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'system' ? (
            <ComputerDesktopIcon className="h-4 w-4" />
          ) : theme === 'dark' ? (
            <MoonIcon className="h-4 w-4" />
          ) : (
            <SunIcon className="h-4 w-4" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
