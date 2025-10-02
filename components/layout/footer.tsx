import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">Inevitable Ethereum</h3>
            <p className="text-sm text-muted-foreground">
              A comprehensive guide to Ethereum, the World Computer, and the future of decentralized systems.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/background" className="text-muted-foreground hover:text-foreground">
                  Background & Context
                </Link>
              </li>
              <li>
                <Link href="/concepts" className="text-muted-foreground hover:text-foreground">
                  Technical Concepts
                </Link>
              </li>
              <li>
                <Link href="/ethereum" className="text-muted-foreground hover:text-foreground">
                  Ethereum
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Built with Next.js, MDX, and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
