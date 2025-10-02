import Link from 'next/link';
import { Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Inevitable Ethereum</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/background"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Background
            </Link>
            <Link
              href="/concepts"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Concepts
            </Link>
            <Link
              href="/ethereum"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Ethereum
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <button className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
