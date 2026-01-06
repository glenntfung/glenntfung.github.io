'use client';

import { motion } from 'framer-motion';
import { CardPageConfig } from '@/types/page';
import Link from 'next/link';

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            <div className="grid gap-12">
                {config.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index, ease: "easeOut" }}
                        className="group signature-hover"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary group-hover:text-accent transition-colors`}>
                                {item.title}
                            </h3>
                            {item.date && (
                                <span className="text-xs text-neutral-500 dark:text-neutral-500 shrink-0">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        
                        {item.subtitle && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>
                                {item.subtitle}
                            </p>
                        )}
                        
                        {item.content && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-700 dark:text-neutral-700 leading-relaxed max-w-3xl`}>
                                {item.content}
                            </p>
                        )}

                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        
                        {item.link && (
                            <div className="mt-4">
                                <Link href={item.link} className="inline-flex items-center text-sm font-medium text-accent hover:text-primary transition-colors">
                                    {item.link_text ?? 'Read more'} 
                                    <span className="ml-1">→</span>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
