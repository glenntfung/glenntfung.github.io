interface FooterProps {
    lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
    return (
        <footer className="mt-20">
            <div className="mx-auto max-w-[44rem] px-5 sm:px-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule py-6 text-[0.8125rem] text-muted">
                    <p>Last updated {lastUpdated}</p>
                    <p>
                        <a
                            href="/feed.xml"
                            className="transition-colors hover:text-link"
                        >
                            RSS
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
