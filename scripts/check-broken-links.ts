import fs from 'fs';
import path from 'path';
import { getAllContent } from '../lib/content';

interface BrokenLink {
  file: string;
  link: string;
  line?: number;
}

const brokenLinks: BrokenLink[] = [];
const validSlugs = new Set<string>();
const contentDir = path.join(process.cwd(), 'content');

// Build a set of valid article paths
function buildValidSlugs() {
  const articles = getAllContent();

  articles.forEach(article => {
    validSlugs.add(`/${article.category}/${article.slug}`);
  });

  // Add other valid routes
  validSlugs.add('/');
  validSlugs.add('/about');
  validSlugs.add('/search');
  validSlugs.add('/random');
  validSlugs.add('/background');
  validSlugs.add('/concepts');
  validSlugs.add('/ethereum');
}

// Extract internal links from markdown content
function extractInternalLinks(content: string): string[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    // Only check internal links (relative paths starting with /)
    if (url.startsWith('/') && !url.startsWith('//')) {
      // Remove anchors and query strings
      const cleanUrl = url.split('#')[0].split('?')[0];
      if (cleanUrl) {
        links.push(cleanUrl);
      }
    }
  }

  return links;
}

// Check links in a single file
function checkFileLinks(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(contentDir, filePath);
  const links = extractInternalLinks(content);

  links.forEach(link => {
    if (!validSlugs.has(link)) {
      brokenLinks.push({
        file: relativePath,
        link: link,
      });
    }
  });
}

// Recursively check all MDX files
function checkDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      checkDirectory(fullPath);
    } else if (entry.name.endsWith('.mdx')) {
      checkFileLinks(fullPath);
    }
  });
}

// Main execution
console.log('🔍 Checking for broken internal links...\n');

buildValidSlugs();
console.log(`✓ Found ${validSlugs.size} valid routes\n`);

checkDirectory(contentDir);

if (brokenLinks.length === 0) {
  console.log('✅ No broken links found!\n');
  process.exit(0);
} else {
  console.log(`❌ Found ${brokenLinks.length} broken links:\n`);

  brokenLinks.forEach(({ file, link }) => {
    console.log(`  ${file}`);
    console.log(`    → ${link}\n`);
  });

  process.exit(1);
}
