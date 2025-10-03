import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import { getDefaultOgImage } from '@/lib/og-image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Inevitable Ethereum',
  description: 'Learn about Inevitable Ethereum - an educational resource dedicated to understanding Ethereum, finance history, and cryptography.',
  openGraph: {
    title: 'About Inevitable Ethereum',
    description: 'An educational resource dedicated to understanding Ethereum, finance history, and cryptography',
    images: [{ url: getDefaultOgImage() }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Inevitable Ethereum',
    description: 'An educational resource dedicated to understanding Ethereum, finance history, and cryptography',
    images: [getDefaultOgImage()],
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-8">
      <h1 className="text-3xl font-serif font-normal border-b border-[var(--border)] pb-2 mb-8">
        About Inevitable Ethereum
      </h1>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-serif font-normal mb-4">The Vision</h2>
          <p className="text-[var(--text)] mb-4">
            Ethereum is like religion: you cannot make a logical argument and convince someone to believe,
            you can only give them sacred truths and wait for them to experience enlightenment.
          </p>
          <p className="text-[var(--text)] mb-4">
            In May 2021, I had my epiphany when I heard Hayden Adams explain Uniswap.
            In a single podcast episode, I went from &ldquo;internet dollars for internet dollars sake&rdquo; to
            &ldquo;the next inevitable, obvious step in thousands of years of human innovation.&rdquo;
          </p>
          <p className="text-[var(--text)] font-semibold">
            A giant leap forward.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-normal mb-4">The Mission</h2>
          <p className="text-[var(--text)] mb-4">
            This is a project dedicated to Ethereum, the World Computer. None of us can force the conversion
            moment on another person; it&apos;s just not how this works. But some day, every single person is going
            to have their Hayden Adams-moment. This project is for that moment in every new convert&apos;s journey.
          </p>
          <p className="text-[var(--text)] mb-4">
            Or, more specifically, for the moments right after.
          </p>
          <p className="text-[var(--text)] mb-4">
            The goal: create the materials to take your spark of interest and grow it into an all consuming fire.
            To give the builders and other zealots the information they need to understand the whole picture,
            big and small.
          </p>
          <p className="text-[var(--text)] mb-4">
            To show you the future that humanity is working towards; that we&apos;ve been working towards ever since
            we climbed down from the trees and stood upright.
          </p>
          <p className="text-[var(--text)] font-semibold">
            To show you that Ethereum is not only a big deal... Ethereum is inevitable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-normal mb-4">The Content</h2>
          <p className="text-[var(--text)] mb-4">
            This site contains <strong>141+ educational articles</strong> organized into three main categories:
          </p>
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <Link
              href="/background"
              className="p-4 border border-[var(--border)] bg-[var(--surface)] rounded hover:border-[var(--link)] transition-colors"
            >
              <h3 className="font-semibold text-[var(--link)] mb-2">Background</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Historical context about finance, economics, and mass communication
              </p>
            </Link>

            <Link
              href="/concepts"
              className="p-4 border border-[var(--border)] bg-[var(--surface)] rounded hover:border-[var(--link)] transition-colors"
            >
              <h3 className="font-semibold text-[var(--link)] mb-2">Concepts</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Technical foundations in computer science, cryptography, and blockchain
              </p>
            </Link>

            <Link
              href="/ethereum"
              className="p-4 border border-[var(--border)] bg-[var(--surface)] rounded hover:border-[var(--link)] transition-colors"
            >
              <h3 className="font-semibold text-[var(--link)] mb-2">Ethereum</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Deep dive into Ethereum&apos;s architecture, consensus, and ecosystem
              </p>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-normal mb-4">The Author</h2>
          <p className="text-[var(--text)] mb-4">
            Created by Rex Kirshner (
            <a
              href="https://twitter.com/logarithmicrex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--link)] hover:underline inline-flex items-center gap-1"
            >
              @logarithmicrex
              <ExternalLink className="h-3 w-3" />
            </a>
            ), this project represents years of research, learning, and synthesis of Ethereum knowledge.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-normal mb-4">Open Source</h2>
          <p className="text-[var(--text)] mb-4">
            This site is open source and built with Next.js, TypeScript, and MDX.
            The content is licensed under{' '}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--link)] hover:underline"
            >
              CC BY-SA 4.0
            </a>
            .
          </p>
          <div className="flex gap-4 mt-6">
            <a
              href={process.env.NEXT_PUBLIC_GITHUB_REPO || 'https://github.com/rexkirshner/inevitable-eth'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded hover:border-[var(--link)] transition-colors"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
            <a
              href="https://inevitableeth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded hover:border-[var(--link)] transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              Original Site
            </a>
          </div>
        </section>

        <section className="border-t border-[var(--border)] pt-6 mt-8">
          <h2 className="text-2xl font-serif font-normal mb-4">Get Started</h2>
          <p className="text-[var(--text)] mb-4">
            New to Ethereum? Start with{' '}
            <Link href="/ethereum/world-computer" className="text-[var(--link)] hover:underline font-semibold">
              The World Computer
            </Link>
            {' '}to understand the big picture, then explore from there.
          </p>
          <p className="text-[var(--text)]">
            Looking for something specific? Use the{' '}
            <Link href="/search" className="text-[var(--link)] hover:underline font-semibold">
              search
            </Link>
            {' '}to find exactly what you need.
          </p>
        </section>
      </div>
    </div>
  );
}
