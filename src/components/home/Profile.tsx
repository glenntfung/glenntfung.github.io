import Image from 'next/image';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { SiteConfig } from '@/lib/config';

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
}

/**
 * Headshot, name, one line of title, then the ways to reach me.
 *
 * The headshot is a circle cut from the 16:9 studio photograph rather than a
 * second, cropped copy of it. The image is drawn at 190% of the circle and
 * shifted to frame head and shoulders; the offsets are percentages of the
 * circle, so the crop holds at both sizes.
 *
 * The addresses are written out as "name [at] host [dot] edu" and are not
 * mailto: links, so the page never carries them in harvestable form. The
 * calendar link lives in the bio, which already offers it.
 */
export default function Profile({ author, social }: ProfileProps) {
    const emails = [social.work_email, social.email].filter(
        (address): address is string => Boolean(address)
    );
    const profiles: { href: string; label: string; icon: ReactNode }[] = [
        ...(social.github ? [{ href: social.github, label: 'GitHub', icon: <GitHubIcon /> }] : []),
        ...(social.linkedin ? [{ href: social.linkedin, label: 'LinkedIn', icon: <LinkedInIcon /> }] : []),
    ];

    return (
        <header>
            {/* The backdrop colour, sampled from the photograph, stands in
                until the image paints. */}
            <div className="relative size-28 overflow-hidden rounded-full bg-[#9c9b8f] sm:size-38">
                <Image
                    src={author.avatar}
                    alt={`Portrait of ${author.name}`}
                    width={1408}
                    height={793}
                    priority
                    className="absolute top-[-2.7%] left-[-67.5%] w-[190%] max-w-none"
                />
            </div>

            <h1 className="mt-[1.375rem] text-[2.75rem] font-semibold leading-none tracking-[-0.035em] text-ink sm:mt-7 sm:text-[4.25rem]">
                {author.name}
            </h1>

            <p className="mt-3.5 max-w-[32ch] text-[1.1875rem] leading-[1.4] text-balance sm:mt-4 sm:text-[1.5rem]">
                {author.headline ?? `${author.title}, ${author.institution}`}
            </p>

            <div className="mt-[1.375rem] flex flex-col gap-3 sm:mt-7 sm:gap-3.5">
                {emails.length > 0 && (
                    // 13px on phones is what keeps the longer address on one
                    // line at 375px.
                    <ul className="flex flex-col gap-1 text-[0.8125rem] sm:text-[0.9375rem]">
                        {/* Keyed by position: a React key is written into the
                            page's flight data, so the address would leak. */}
                        {emails.map((address, index) => (
                            <li key={index} className="flex items-center gap-2.5">
                                <MailIcon />
                                <span>
                                    <SpelledOutAddress address={address} />
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {profiles.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                        {profiles.map(profile => (
                            <li key={profile.label}>
                                <a
                                    href={profile.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-2 text-[0.875rem] leading-none text-ink transition-colors hover:border-rule-strong"
                                >
                                    {profile.icon}
                                    {profile.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </header>
    );
}

/** "a.b@c.d.edu" as "a.b [at] c [dot] d [dot] edu", with the tokens muted. */
function SpelledOutAddress({ address }: { address: string }) {
    const [local, domain = ''] = address.split('@');

    return (
        <>
            {local} <span className="text-muted">[at]</span>{' '}
            {domain.split('.').map((label, index) => (
                <Fragment key={label + index}>
                    {index > 0 && <> <span className="text-muted">[dot]</span> </>}
                    {label}
                </Fragment>
            ))}
        </>
    );
}

// Glyphs are Lucide's (ISC licence), drawn on its 24px grid.
const iconProps = {
    'aria-hidden': true,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

function MailIcon() {
    return (
        <svg {...iconProps} className="size-[0.9375rem] shrink-0 text-muted">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg {...iconProps} className="size-[0.9375rem] shrink-0 opacity-75">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg {...iconProps} className="size-[0.9375rem] shrink-0 opacity-75">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    );
}
