import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="container py-12 md:py-24">
      {/* Hero Section */}
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Inevitable Ethereum
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Ethereum is like religion: you cannot make a logical argument and convince someone to believe,
          you can only give them sacred truths and wait for them to experience enlightenment.
        </p>
        <p className="text-lg text-muted-foreground mb-8">
          In May 2021, I had my epiphany when I heard Hayden Adams explain Uniswap.
          In a single podcast episode, I went from "internet dollars for internet dollars sake" to
          "the next inevitable, obvious step in thousands of years of human innovation."
        </p>
        <p className="text-xl font-semibold mb-12">
          A giant leap forward.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="mx-auto max-w-3xl mb-16">
        <p className="text-muted-foreground mb-4">
          This is a project dedicated to Ethereum, the World Computer. None of us can force the conversion
          moment on another person; it's just not how this works. But some day, every single person is going
          to have their Hayden Adams-moment. This project is for that moment in every new convert's journey.
        </p>
        <p className="text-muted-foreground mb-4">
          Or, more specifically, for the moments right after.
        </p>
        <p className="text-muted-foreground mb-4">
          The goal: create the materials to take your spark of interest and grow it into an all consuming fire.
          To give the builders and other zealots the information they need to understand the whole picture,
          big and small.
        </p>
        <p className="text-muted-foreground mb-4">
          To show you the future that humanity is working towards; that we've been working towards ever since
          we climbed down from the trees and stood upright.
        </p>
        <p className="text-muted-foreground font-semibold">
          To show you that Ethereum is not only a big deal... Ethereum is inevitable.
        </p>
      </div>

      {/* Enter the Wiki */}
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Enter the Wiki</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* First Time Card */}
          <Link
            href="/ethereum/world-computer"
            className="group relative overflow-hidden rounded-lg border p-8 hover:border-foreground/50 transition-colors"
          >
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">First Time? Start Here</h3>
              <p className="text-lg text-foreground/80 group-hover:text-foreground flex items-center justify-center">
                Ethereum: the World Computer
                <ArrowRight className="ml-2 h-5 w-5" />
              </p>
            </div>
          </Link>

          {/* Browse Card */}
          <div className="relative overflow-hidden rounded-lg border p-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Know What You Want?</h3>
              <div className="space-y-2">
                <Link
                  href="/background"
                  className="block text-lg text-foreground/80 hover:text-foreground transition-colors"
                >
                  Background & Context
                </Link>
                <Link
                  href="/concepts"
                  className="block text-lg text-foreground/80 hover:text-foreground transition-colors"
                >
                  Technical Concepts
                </Link>
                <Link
                  href="/ethereum"
                  className="block text-lg text-foreground/80 hover:text-foreground transition-colors"
                >
                  Ethereum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
