'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    BookOpenIcon,
    ClipboardDocumentIcon,
    CheckIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
    // null = idle. The button previously gave no signal at all, and a rejected
    // clipboard write (permissions, insecure context) failed silently.
    const [copyState, setCopyState] = useState<{ id: string; status: 'copied' | 'error' } | null>(null);
    const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (copyTimer.current) clearTimeout(copyTimer.current);
    }, []);

    const copyBibtex = async (id: string, bibtex: string) => {
        if (copyTimer.current) clearTimeout(copyTimer.current);
        try {
            await navigator.clipboard.writeText(bibtex);
            setCopyState({ id, status: 'copied' });
        } catch {
            setCopyState({ id, status: 'error' });
        }
        copyTimer.current = setTimeout(() => setCopyState(null), 2000);
    };

    // Extract unique years and types for filters
    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map(p => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    // Filter publications
    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.authors.some(author => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;

            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    return (
        <div>
            <header className={embedded ? "mb-6 space-y-2" : "mb-12 space-y-3"}>
                <h1 className={`${embedded ? "text-2xl" : "text-5xl"} font-display font-semibold tracking-tight text-primary`}>{config.title}</h1>
                {config.description && (
                    <p className="text-base text-neutral-600 max-w-2xl leading-relaxed">
                        {config.description}
                    </p>
                )}
            </header>

            {/* Search and Filter Controls */}
            <div className="mb-12 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search publications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-neutral-200 bg-card focus:ring-1 focus:ring-accent focus:border-transparent transition-all duration-200 text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center justify-center px-4 py-2 rounded-md border transition-all duration-200 text-sm font-medium",
                            showFilters
                                ? "bg-accent text-white border-accent"
                                : "bg-card border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent"
                        )}
                    >
                        <FunnelIcon className="h-4 w-4 mr-2" />
                        Filters
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-6 bg-card rounded-md border border-neutral-200 flex flex-wrap gap-10">
                                {/* Year Filter */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center">
                                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5" /> Year
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedYear('all')}
                                            className={cn(
                                                "px-3 py-1 text-xs rounded-md transition-colors border",
                                                selectedYear === 'all'
                                                    ? "bg-accent text-white border-accent"
                                                    : "bg-card border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent"
                                            )}
                                        >
                                            All
                                        </button>
                                        {years.map(year => (
                                            <button
                                                key={year}
                                                onClick={() => setSelectedYear(year)}
                                                className={cn(
                                                    "px-3 py-1 text-xs rounded-md transition-colors border",
                                                    selectedYear === year
                                                        ? "bg-accent text-white border-accent"
                                                        : "bg-card border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent"
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Type Filter */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center">
                                        <BookOpenIcon className="h-3.5 w-3.5 mr-1.5" /> Type
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedType('all')}
                                            className={cn(
                                                "px-3 py-1 text-xs rounded-md transition-colors border",
                                                selectedType === 'all'
                                                    ? "bg-accent text-white border-accent"
                                                    : "bg-card border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent"
                                            )}
                                        >
                                            All
                                        </button>
                                        {types.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={cn(
                                                    "px-3 py-1 text-xs rounded-md capitalize transition-colors border",
                                                    selectedType === type
                                                        ? "bg-accent text-white border-accent"
                                                        : "bg-card border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent"
                                                )}
                                            >
                                                {type.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Publications Grid */}
            <div className="space-y-12">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        No publications found matching your criteria.
                    </div>
                ) : (
                    filteredPublications.map((pub) => (
                        <div
                            key={pub.id}
                            className="group signature-hover border-b border-neutral-100 dark:border-neutral-200 pb-12 last:border-0 last:pb-0"
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                {pub.preview && (
                                    <div className="w-full md:w-48 flex-shrink-0">
                                        <div className="aspect-video md:aspect-[4/3] relative rounded-md overflow-hidden bg-card border border-neutral-200">
                                            <Image
                                                src={`/papers/${pub.preview}`}
                                                alt={pub.title}
                                                fill
                                                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <h2 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary mb-2 leading-tight group-hover:text-accent transition-colors`}>
                                        {pub.title}
                                    </h2>
                                    <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-700 dark:text-neutral-700 mb-2`}>
                                        {pub.authors.map((author, idx) => (
                                            <span key={idx}>
                                                <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                                    {author.name}
                                                </span>
                                                {author.isCorresponding && (
                                                    <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-600'}`}>†</sup>
                                                )}
                                                {idx < pub.authors.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-600 mb-4">
                                        {pub.journal || pub.conference} {pub.year}
                                    </p>

                                    {pub.description && (
                                        <p className="text-base text-neutral-700 dark:text-neutral-700 mb-6 leading-relaxed">
                                            {pub.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-3 mt-auto">
                                        {pub.doi && (
                                            <a
                                                href={`https://doi.org/${pub.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-medium text-accent hover:text-primary transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent"
                                            >
                                                DOI
                                            </a>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-medium text-accent hover:text-primary transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent"
                                            >
                                                Code
                                            </a>
                                        )}
                                        {pub.abstract && (
                                            <button
                                                onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                className={cn(
                                                    "inline-flex items-center text-sm font-medium transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent",
                                                    expandedAbstractId === pub.id ? "text-primary" : "text-accent hover:text-primary"
                                                )}
                                            >
                                                Abstract
                                            </button>
                                        )}
                                        {pub.bibtex && (
                                            <button
                                                onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                                className={cn(
                                                    "inline-flex items-center text-sm font-medium transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent",
                                                    expandedBibtexId === pub.id ? "text-primary" : "text-accent hover:text-primary"
                                                )}
                                            >
                                                BibTeX
                                            </button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {expandedAbstractId === pub.id && pub.abstract ? (
                                            <motion.div
                                                key="abstract"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <div className="bg-card rounded-lg p-4 border border-neutral-200">
                                                    <p className="text-sm text-neutral-600 leading-relaxed">
                                                        {pub.abstract}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                        {expandedBibtexId === pub.id && pub.bibtex ? (
                                            <motion.div
                                                key="bibtex"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <div className="relative bg-card rounded-lg p-4 border border-neutral-200">
                                                    <pre className="text-xs text-neutral-600 overflow-x-auto whitespace-pre-wrap">
                                                        {pub.bibtex}
                                                    </pre>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyBibtex(pub.id, pub.bibtex || '')}
                                                        className={cn(
                                                            "absolute top-2 right-2 inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-card px-2 py-1.5 text-xs shadow-sm transition-colors",
                                                            copyState?.id === pub.id && copyState.status === 'copied'
                                                                ? "text-accent"
                                                                : copyState?.id === pub.id
                                                                    ? "text-error"
                                                                    : "text-neutral-500 hover:text-accent"
                                                        )}
                                                        title={copyState?.id === pub.id && copyState.status === 'error'
                                                            ? 'Copy failed — select the text and copy manually'
                                                            : 'Copy BibTeX to clipboard'}
                                                    >
                                                        {copyState?.id === pub.id && copyState.status === 'copied' ? (
                                                            <><CheckIcon className="h-4 w-4" aria-hidden="true" />Copied</>
                                                        ) : copyState?.id === pub.id ? (
                                                            <><ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />Copy failed</>
                                                        ) : (
                                                            <><ClipboardDocumentIcon className="h-4 w-4" aria-hidden="true" />Copy</>
                                                        )}
                                                    </button>
                                                    {/* Announce the outcome to screen readers, which get no visual cue. */}
                                                    <span role="status" aria-live="polite" className="sr-only">
                                                        {copyState?.id === pub.id
                                                            ? copyState.status === 'copied' ? 'BibTeX copied to clipboard' : 'Copying failed'
                                                            : ''}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
