import Image from 'next/image';
import {
    ArrowRightIcon,
    CalendarDaysIcon,
    DocumentTextIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { Github, Linkedin } from 'lucide-react';
import { SiteConfig } from '@/lib/config';

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
}

export default function Profile({ author, social }: ProfileProps) {
    const firstName = author.name.split(' ')[0];

    return (
        <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-neutral-200/80 bg-surface px-6 py-10 shadow-[0_24px_70px_rgba(49,65,91,0.08)] sm:px-10 sm:py-14 lg:px-14">
            <div
                aria-hidden="true"
                className="absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-playful-soft/70 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -bottom-44 -left-28 -z-10 h-80 w-80 rounded-full bg-accent-soft/80 blur-3xl"
            />

            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
                <div className="text-center lg:text-left">
                    <h1 className="font-display text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-primary sm:text-6xl">
                        Hi, I&apos;m {firstName}.
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-neutral-600 lg:mx-0">
                        {author.intro ?? `${author.title} at ${author.institution}.`}
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                        {social.calendar && (
                            <a
                                href={social.calendar}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            >
                                <CalendarDaysIcon className="h-4 w-4" />
                                Book a chat
                                <ArrowRightIcon className="h-4 w-4" />
                            </a>
                        )}
                        <a
                            href="/CV.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-background px-5 py-3 text-sm font-semibold text-primary transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        >
                            <DocumentTextIcon className="h-4 w-4" />
                            CV
                        </a>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-neutral-600 lg:justify-start">
                        {social.email && (
                            <a className="profile-link" href={`mailto:${social.email}`}>
                                <EnvelopeIcon className="h-4 w-4" />
                                Email me
                            </a>
                        )}
                        {social.github && (
                            <a className="profile-link" href={social.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                                GitHub
                            </a>
                        )}
                        {social.linkedin && (
                            <a className="profile-link" href={social.linkedin} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                            </a>
                        )}
                    </div>
                </div>

                <div className="mx-auto w-full max-w-[14rem] sm:max-w-[17rem] lg:max-w-none">
                    <div className="portrait-frame group relative aspect-[4/5]">
                        <div
                            aria-hidden="true"
                            className="absolute -inset-3 rounded-[2.15rem] bg-accent-soft transition-transform duration-500 group-hover:scale-[1.015]"
                        />
                        <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] border-4 border-surface shadow-xl">
                            <Image
                                src={author.avatar}
                                alt={`Portrait of ${author.name}`}
                                fill
                                sizes="(max-width: 1024px) 272px, 288px"
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
