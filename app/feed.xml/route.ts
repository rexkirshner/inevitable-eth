import { getAllContent } from '@/lib/content';

export const dynamic = 'force-static';

// Revalidate every hour (3600 seconds) to reduce file reads
export const revalidate = 3600;

export async function GET() {
  const allArticles = getAllContent();

  // Sort by updated date, most recent first
  const sortedArticles = allArticles.sort((a, b) => {
    return new Date(b.frontmatter.updated).getTime() - new Date(a.frontmatter.updated).getTime();
  });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Inevitable Ethereum</title>
    <link>https://inevitableeth.com</link>
    <description>Educational resources about Ethereum, finance history, and cryptography</description>
    <language>en-us</language>
    <atom:link href="https://inevitableeth.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${sortedArticles.map(article => `
    <item>
      <title>${escapeXml(article.frontmatter.title)}</title>
      <link>https://inevitableeth.com/${article.category}/${article.slug}</link>
      <guid>https://inevitableeth.com/${article.category}/${article.slug}</guid>
      <description>${escapeXml(article.frontmatter.description || article.frontmatter.title)}</description>
      <pubDate>${new Date(article.frontmatter.updated).toUTCString()}</pubDate>
      <category>${article.category}</category>
      ${article.frontmatter.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
