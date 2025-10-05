import { Metadata } from 'next';
import { ArticleRequestForm } from '@/components/community/article-request-form';
import { Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Request an Article - Inevitable Ethereum',
  description: 'Request new articles on Ethereum, cryptography, finance history, and more. Help shape the content of Inevitable Ethereum.',
  openGraph: {
    title: 'Request an Article - Inevitable Ethereum',
    description: 'Request new articles on Ethereum, cryptography, finance history, and more.',
  },
};

export default function RequestArticlePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[var(--surface)] rounded-full">
              <Lightbulb className="w-8 h-8 text-[var(--link)]" />
            </div>
          </div>
          <h1
            className="text-4xl font-normal mb-4"
            style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}
          >
            Request an Article
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Have an idea for an article that would help you or others understand Ethereum better?
            We'd love to hear it! Your request will be reviewed and prioritized based on community interest.
          </p>
        </div>

        {/* Form */}
        <ArticleRequestForm />

        {/* FAQ Section */}
        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <h2
            className="text-2xl font-normal mb-6"
            style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">
                What makes a good article request?
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                The best requests are specific, explain why the topic is important, and describe who would benefit from it.
                Include any relevant context or resources that might help the author.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">
                How long does it take for an article to be written?
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                It varies based on topic complexity and current workload. High-priority, well-defined requests with strong
                community support are typically addressed first. You can track progress in the GitHub issue.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">
                Can I write the article myself?
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Absolutely! If you'd like to contribute an article, you can submit a pull request on GitHub.
                Check the contributing guidelines in the repository for more information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">
                How do I vote on existing requests?
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                All article requests are tracked as GitHub issues with the "article-request" label.
                You can browse existing requests and add a 👍 reaction to vote for the ones you'd like to see prioritized.
              </p>
            </div>
          </div>
        </div>

        {/* View Existing Requests */}
        <div className="mt-12 text-center">
          <a
            href={`${process.env.NEXT_PUBLIC_GITHUB_REPO || 'https://github.com/rexkirshner/inevitable-eth'}/issues?q=is%3Aissue+is%3Aopen+label%3Aarticle-request`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border)] rounded-md hover:bg-[var(--surface)] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View Existing Requests
          </a>
        </div>
      </main>
    </div>
  );
}
