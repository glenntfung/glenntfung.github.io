interface FooterProps {
  lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200/70 bg-surface/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-neutral-500">
            Last updated: {lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="flex items-center text-xs text-neutral-500">
            <a href="https://github.com/xyjoey/PRISM" target="_blank" rel="noopener noreferrer">
              Built with PRISM
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
