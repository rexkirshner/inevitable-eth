import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-12">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About section */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">
              Inevitable Ethereum
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              A comprehensive educational resource dedicated to Ethereum, the World Computer.
              Exploring finance history, cryptography, and the future of decentralized systems.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/background"
                  className="text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors"
                >
                  Background & Context
                </Link>
              </li>
              <li>
                <Link
                  href="/concepts"
                  className="text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors"
                >
                  Technical Concepts
                </Link>
              </li>
              <li>
                <Link
                  href="/ethereum"
                  className="text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors"
                >
                  Ethereum
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors"
                >
                  About this project
                </Link>
              </li>
              <li>
                <Link
                  href="/recent"
                  className="text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors"
                >
                  Recent changes
                </Link>
              </li>
              <li>
                <Link
                  href="/random"
                  className="text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors"
                >
                  Random article
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
              Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/rexkirshner/inevitable-eth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors inline-flex items-center gap-1"
                >
                  GitHub
                  <span className="text-[0.6rem]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://inevitableeth.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors inline-flex items-center gap-1"
                >
                  Original site
                  <span className="text-[0.6rem]">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--text-secondary)]">
            <p>
              Content licensed under{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                className="text-[var(--link)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY-SA 4.0
              </a>
            </p>
            <p>
              Built with{' '}
              <a
                href="https://nextjs.org"
                className="text-[var(--link)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js
              </a>
              {', '}
              <a
                href="https://mdxjs.com"
                className="text-[var(--link)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                MDX
              </a>
              {', and '}
              <a
                href="https://tailwindcss.com"
                className="text-[var(--link)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tailwind CSS
              </a>
            </p>
            <p>© {currentYear} Inevitable Ethereum</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
