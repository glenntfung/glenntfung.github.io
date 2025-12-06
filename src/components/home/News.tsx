'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
    viewAllHref?: string;
}

export default function News({ items, title = 'News', viewAllHref }: NewsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                {viewAllHref && (
                    <Link href={viewAllHref} className="text-sm text-accent hover:underline">
                        View all
                    </Link>
                )}
            </div>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 mt-1 w-24 flex-shrink-0 whitespace-nowrap text-left">{item.date}</span>
                        <p className="text-sm text-neutral-700">{item.content}</p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
