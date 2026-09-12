import Image from 'next/image';
import { SiteConfig } from '@/lib/config';

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
}

/**
 * Name and contacts in the first column, portrait in the second.
 *
 * The photograph is 16:9 and runs at its native aspect -- no crop, no
 * object-position -- and the portrait column spans both rows so its top edge
 * starts level with the top of the name. Below `sm` the grid collapses and
 * the three stack: name, portrait, contacts.
 */
export default function Profile({ author, social }: ProfileProps) {
    const links: { href: string; label: string; external?: boolean }[] = [
        ...(social.email ? [{ href: `mailto:${social.email}`, label: 'Email' }] : []),
        ...(social.calendar ? [{ href: social.calendar, label: 'Book a chat', external: true }] : []),
        ...(social.github ? [{ href: social.github, label: 'GitHub', external: true }] : []),
        ...(social.linkedin ? [{ href: social.linkedin, label: 'LinkedIn', external: true }] : []),
    ];

    return (
        <header className="flex flex-col gap-4 sm:grid sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-start sm:gap-x-8 sm:gap-y-4">
            <h1 className="text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.032em] text-ink sm:col-start-1 sm:row-start-1">
                {author.name}
            </h1>

            <Image
                src={author.avatar}
                alt={`Portrait of ${author.name}`}
                width={1408}
                height={793}
                sizes="(max-width: 40rem) 100vw, 18rem"
                priority
                // The backdrop colour, sampled from the photograph, stands in
                // until the image paints.
                className="w-full bg-[#9c9b8f] sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:self-start"
            />

            {/* The rule runs only as wide as this column, stopping at the
                portrait. */}
            <ul className="flex flex-wrap gap-x-5 gap-y-1 border-t border-rule pt-4 text-[0.8125rem] sm:col-start-1 sm:row-start-2">
                {links.map(link => (
                    <li key={link.label}>
                        <a
                            href={link.href}
                            {...(link.external
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                            className="text-muted transition-colors hover:text-link"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </header>
    );
}
