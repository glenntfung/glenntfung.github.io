'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    EnvelopeIcon,
    AcademicCapIcon,
    MapPinIcon,
    CalendarDaysIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinSolidIcon } from '@heroicons/react/24/solid';
import { Github, Linkedin, Pin } from 'lucide-react';
import { SiteConfig } from '@/lib/config';

// Custom ORCID icon component
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
}

export default function Profile({ author, social }: ProfileProps) {

    const [showAddress, setShowAddress] = useState(false);
    const [isAddressPinned, setIsAddressPinned] = useState(false);

    const socialLinks = [
        ...(social.email ? [{
            name: 'Personal Email',
            href: `mailto:${social.email}`,
            icon: EnvelopeIcon,
            isEmail: true,
            displayText: social.email,
        }] : []),
        ...(social.email_work ? [{
            name: 'Work Email',
            href: `mailto:${social.email_work}`,
            icon: EnvelopeIcon,
            isEmail: true,
            displayText: social.email_work,
        }] : []),
        ...(social.calendar ? [{
            name: 'Book a Chat',
            href: social.calendar,
            icon: CalendarDaysIcon,
        }] : []),
        ...(social.location || social.location_details ? [{
            name: 'Location',
            href: social.location_url || '#',
            icon: MapPinIcon,
            isLocation: true,
        }] : []),
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: AcademicCapIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: Linkedin,
        }] : []),
        {
            name: 'CV',
            href: '/CV.pdf',
            icon: DocumentTextIcon,
        },
    ];

    const boxClass = "flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-all duration-200 group";

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
        >
            {/* Header Content: Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-24 mb-10">
                {/* Profile Image */}
                <div className="w-48 h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.02] shrink-0">
                    <Image
                        src={author.avatar}
                        alt={author.name}
                        width={192}
                        height={224}
                        className="w-full h-full object-cover object-[32%_center]"
                        priority
                    />
                </div>

                {/* Name and Title */}
                <div className="text-center sm:text-left pt-2">
                    <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">
                        {author.name}
                    </h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                        {author.title}
                    </p>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                        {author.institution}
                    </p>

                    {/* Emails below position - Box style with Icon and Text */}
                    <div className="flex flex-col gap-3">
                        {socialLinks.filter(link => link.isEmail).map((link) => {
                            const IconComponent = link.icon;
                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={boxClass}
                                >
                                    <IconComponent className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                    <span className="text-sm font-medium underline underline-offset-4 decoration-transparent group-hover:decoration-accent">
                                        {link.displayText}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Contact Links (Centered Icons + Text) */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 relative items-center border-b border-neutral-100 dark:border-neutral-900 pb-8">
                {socialLinks.filter(link => !link.isEmail).map((link) => {
                    const IconComponent = link.icon;
                    if (link.isLocation) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => !isAddressPinned && setShowAddress(true)}
                                    onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                    onClick={() => {
                                        setIsAddressPinned(!isAddressPinned);
                                        setShowAddress(!isAddressPinned);
                                    }}
                                    className={`${boxClass} ${isAddressPinned ? 'text-accent' : ''}`}
                                    aria-label={link.name}
                                >
                                    {isAddressPinned ? (
                                        <MapPinSolidIcon className="h-4 w-4" />
                                    ) : (
                                        <MapPinIcon className="h-4 w-4" />
                                    )}
                                    <span className="text-sm font-medium underline underline-offset-4 decoration-transparent group-hover:decoration-accent">{link.name}</span>
                                </button>

                                {/* Address tooltip */}
                                <AnimatePresence>
                                    {(showAddress || isAddressPinned) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                            animate={{ opacity: 1, y: -10, scale: 1 }}
                                            exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-900 text-white px-4 py-3 rounded-md text-sm font-medium shadow-xl max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap z-20"
                                            onMouseEnter={() => !isAddressPinned && setShowAddress(true)}
                                            onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                        >
                                            <div className="text-center">
                                                <div className="flex items-center justify-center space-x-2 mb-1">
                                                    <p className="font-semibold">Work Address</p>
                                                    {!isAddressPinned && (
                                                        <div className="flex items-center space-x-0.5 text-xs text-neutral-400 opacity-60">
                                                            <Pin className="h-2.5 w-2.5" />
                                                            <span className="hidden sm:inline">Click</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {social.location_details?.map((line, i) => (
                                                    <p key={i} className="break-words">{line}</p>
                                                ))}
                                                <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                                                    {social.location_url && (
                                                        <a
                                                            href={social.location_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full sm:w-auto"
                                                        >
                                                            <MapPinIcon className="h-4 w-4" />
                                                            <span>Google Map</span>
                                                        </a>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    const href = link.href || '#';
                    return (
                        <div key={link.name} className="relative">
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={boxClass}
                                aria-label={link.name}
                            >
                                <IconComponent className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                <span className="text-sm font-medium underline underline-offset-4 decoration-transparent group-hover:decoration-accent">{link.name}</span>
                            </a>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}