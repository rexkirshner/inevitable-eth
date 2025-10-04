import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import GoogleAnalytics from "@/components/analytics/google-analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inevitable Ethereum",
  description: "A comprehensive guide to Ethereum, the World Computer, and the future of decentralized systems.",
  keywords: ["Ethereum", "blockchain", "cryptocurrency", "web3", "DeFi", "smart contracts"],
  openGraph: {
    title: "Inevitable Ethereum",
    description: "A comprehensive guide to Ethereum, the World Computer, and the future of decentralized systems.",
    url: "https://inevitableeth.com",
    siteName: "Inevitable Ethereum",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inevitable Ethereum",
    description: "A comprehensive guide to Ethereum, the World Computer, and the future of decentralized systems.",
    creator: "@logarithmicrex",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Skip to content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--background)] focus:text-[var(--link)] focus:border focus:border-[var(--link)] focus:rounded"
          >
            Skip to main content
          </a>
          <GoogleAnalytics />
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
