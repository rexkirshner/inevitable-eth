import Link from 'next/link';
import Image from 'next/image';
import { getAllContent } from '@/lib/content';
import { getDefaultOgImage } from '@/lib/og-image';
import { BookOpen, Lightbulb, Blocks } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inevitable Ethereum - Educational Resource for the World Computer',
  description: 'An educational resource dedicated to Ethereum, finance history, and cryptography. Learn about the World Computer and its inevitable future.',
  openGraph: {
    title: 'Inevitable Ethereum',
    description: 'An educational resource dedicated to Ethereum, the World Computer',
    images: [{ url: getDefaultOgImage() }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inevitable Ethereum',
    description: 'An educational resource dedicated to Ethereum, the World Computer',
    images: [getDefaultOgImage()],
  },
};

export default function Home() {
  const backgroundArticles = getAllContent('background').slice(0, 5);
  const conceptsArticles = getAllContent('concepts').slice(0, 5);
  const ethereumArticles = getAllContent('ethereum').slice(0, 5);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      {/* Hero banner image */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <Image
          src="/images/inevitable-eth-banner.png"
          alt="Inevitable Ethereum - The World Computer"
          width={1200}
          height={400}
          priority
          className="w-full h-auto"
        />
      </div>

      {/* Wikipedia-style welcome banner */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-serif font-normal mb-2">
          Welcome to <span className="italic">Inevitable Ethereum</span>
        </h1>
        <p className="text-[var(--text-secondary)]">
          An educational resource dedicated to Ethereum, the World Computer
        </p>
      </div>

      {/* Main page grid - Wikipedia style */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Featured article */}
          <section className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="text-xl font-serif font-normal border-b border-[var(--border)] pb-2 mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Featured article
            </h2>
            <div className="space-y-2">
              <Link
                href="/ethereum/world-computer"
                className="text-lg font-semibold text-[var(--link)] hover:underline"
              >
                Ethereum: The World Computer
              </Link>
              <p className="text-sm text-[var(--text)]">
                Ethereum is the World Computer - a globally shared computing platform built on trustless trust.
                From the coordination miracle of humanity to the future of decentralized systems. Learn about the
                EVM, blockchain, network, and the inevitable path forward.
              </p>
              <Link
                href="/ethereum/world-computer"
                className="text-sm text-[var(--link)] hover:underline inline-block"
              >
                Read more →
              </Link>
            </div>
          </section>

          {/* Background section */}
          <section className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="text-xl font-serif font-normal border-b border-[var(--border)] pb-2 mb-3">
              Background & Context
            </h2>
            <ul className="space-y-1">
              {backgroundArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/background/${article.slug}`}
                    className="text-[var(--link)] hover:underline"
                  >
                    {article.frontmatter.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/background"
              className="text-sm text-[var(--link)] hover:underline inline-block mt-2"
            >
              View all →
            </Link>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Concepts section */}
          <section className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="text-xl font-serif font-normal border-b border-[var(--border)] pb-2 mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Technical Concepts
            </h2>
            <ul className="space-y-1">
              {conceptsArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/concepts/${article.slug}`}
                    className="text-[var(--link)] hover:underline"
                  >
                    {article.frontmatter.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/concepts"
              className="text-sm text-[var(--link)] hover:underline inline-block mt-2"
            >
              View all →
            </Link>
          </section>

          {/* Ethereum section */}
          <section className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="text-xl font-serif font-normal border-b border-[var(--border)] pb-2 mb-3 flex items-center gap-2">
              <Blocks className="h-5 w-5" />
              Ethereum
            </h2>
            <ul className="space-y-1">
              {ethereumArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/ethereum/${article.slug}`}
                    className="text-[var(--link)] hover:underline"
                  >
                    {article.frontmatter.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/ethereum"
              className="text-sm text-[var(--link)] hover:underline inline-block mt-2"
            >
              View all →
            </Link>
          </section>
        </div>
      </div>

      {/* About section */}
      <div className="mt-8 border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-xl font-serif font-normal border-b border-[var(--border)] pb-2 mb-4">
          About Inevitable Ethereum
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="mb-3 text-[var(--text)]">
              Ethereum is like religion: you cannot make a logical argument and convince someone to believe,
              you can only give them sacred truths and wait for them to experience enlightenment.
            </p>
            <p className="text-[var(--text)]">
              This is a project dedicated to Ethereum, the World Computer. None of us can force the conversion
              moment on another person; it&apos;s just not how this works. But some day, every single person is going
              to have their moment of clarity.
            </p>
          </div>
          <div>
            <p className="mb-3 text-[var(--text)]">
              The goal: create the materials to take your spark of interest and grow it into an all consuming fire.
              To give the builders and other zealots the information they need to understand the whole picture,
              big and small.
            </p>
            <p className="font-semibold text-[var(--text)]">
              To show you that Ethereum is not only a big deal... Ethereum is inevitable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
