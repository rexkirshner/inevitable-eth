import fs from 'fs';
import path from 'path';
import TurndownService from 'turndown';
import { FrontmatterSchema } from '../lib/content.schema';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});

// Custom rule for Wiki.js internal links
turndownService.addRule('wikilinks', {
  filter: (node) => {
    return node.nodeName === 'A' && node.getAttribute('href')?.startsWith('/');
  },
  replacement: (content, node) => {
    const href = (node as HTMLElement).getAttribute('href');
    if (!href) return content;

    // Convert /home/concepts/foo -> /concepts/foo
    const cleanedHref = href.replace(/^\/home/, '');
    return `[${content}](${cleanedHref})`;
  }
});

// Custom rule for images
turndownService.addRule('images', {
  filter: 'img',
  replacement: (content, node) => {
    const src = (node as HTMLElement).getAttribute('src');
    const alt = (node as HTMLElement).getAttribute('alt') || '';

    if (!src) return '';

    // Convert image paths
    const imageName = src.replace(/^\//, '');
    return `![${alt}](/images/${imageName})`;
  }
});

// Custom rule for figure elements
turndownService.addRule('figure', {
  filter: 'figure',
  replacement: (content, node) => {
    return '\n' + content + '\n';
  }
});

interface ParsedMetadata {
  title?: string;
  description?: string;
  published?: boolean;
  date?: string;
  tags?: string[];
  editor?: string;
  dateCreated?: string;
}

function parseHtmlComment(html: string): ParsedMetadata {
  const commentMatch = html.match(/<!--([\s\S]*?)-->/);
  if (!commentMatch) return {};

  const commentContent = commentMatch[1];
  const metadata: ParsedMetadata = {};

  const titleMatch = commentContent.match(/title:\s*(.+)/);
  if (titleMatch) metadata.title = titleMatch[1].trim();

  const descMatch = commentContent.match(/description:\s*(.+)/);
  if (descMatch) metadata.description = descMatch[1].trim();

  const publishedMatch = commentContent.match(/published:\s*(.+)/);
  if (publishedMatch) metadata.published = publishedMatch[1].trim() === 'true';

  const dateMatch = commentContent.match(/date:\s*(.+)/);
  if (dateMatch) metadata.date = dateMatch[1].trim();

  const dateCreatedMatch = commentContent.match(/dateCreated:\s*(.+)/);
  if (dateCreatedMatch) metadata.dateCreated = dateCreatedMatch[1].trim();

  const tagsMatch = commentContent.match(/tags:\s*(.+)/);
  if (tagsMatch && tagsMatch[1].trim()) {
    metadata.tags = tagsMatch[1].trim().split(',').map(t => t.trim());
  }

  return metadata;
}

function extractBodyContent(html: string): string {
  // Remove the HTML comment at the beginning
  const withoutComment = html.replace(/<!--[\s\S]*?-->/, '').trim();
  return withoutComment;
}

function inferCategory(filePath: string): string {
  if (filePath.includes('/background/')) return 'background';
  if (filePath.includes('/concepts/')) return 'concepts';
  if (filePath.includes('/ethereum/')) return 'ethereum';
  return 'concepts'; // default
}

function inferDifficulty(tags: string[], content: string): 'intro' | 'intermediate' | 'advanced' {
  const lowerContent = content.toLowerCase();
  const lowerTags = tags.map(t => t.toLowerCase());

  // Check for advanced keywords
  const advancedKeywords = ['zk', 'zkp', 'polynomial', 'cryptography', 'proof', 'commitment', 'verkle', 'eigenlayer', 'danksharding'];
  if (advancedKeywords.some(kw => lowerContent.includes(kw) || lowerTags.some(t => t.includes(kw)))) {
    return 'advanced';
  }

  // Check for intro keywords
  const introKeywords = ['introduction', 'basics', 'overview', 'what is', 'getting started'];
  if (introKeywords.some(kw => lowerContent.includes(kw))) {
    return 'intro';
  }

  return 'intermediate';
}

function calculateReadingTime(markdown: string): number {
  // Remove frontmatter, code blocks, and special characters for accurate word count
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text only
    .replace(/[#*_~]/g, ''); // Remove markdown syntax

  const words = cleaned.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}

function formatDateToYYYYMMDD(isoDate?: string): string | undefined {
  if (!isoDate) return undefined;

  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return undefined;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return undefined;
  }
}

function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function migrateHtmlToMdx(
  sourceDir: string,
  targetDir: string
): Promise<void> {
  console.log('Starting migration from Wiki.js HTML to MDX...');
  console.log(`Source: ${sourceDir}`);
  console.log(`Target: ${targetDir}`);

  // Get all HTML files recursively
  function getHtmlFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getHtmlFiles(fullPath));
      } else if (entry.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const htmlFiles = getHtmlFiles(sourceDir);
  console.log(`Found ${htmlFiles.length} HTML files to migrate`);

  let successCount = 0;
  let errorCount = 0;

  for (const htmlFile of htmlFiles) {
    try {
      const html = fs.readFileSync(htmlFile, 'utf-8');
      const metadata = parseHtmlComment(html);
      const bodyHtml = extractBodyContent(html);
      const markdown = turndownService.turndown(bodyHtml);

      const category = inferCategory(htmlFile);
      const slug = path.basename(htmlFile, '.html');
      const readingTime = calculateReadingTime(markdown);
      const updatedDate = formatDateToYYYYMMDD(metadata.date);

      // Generate description from content if not provided
      const description = metadata.description ||
        markdown
          .replace(/^#+\s+.*$/gm, '') // Remove headings
          .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
          .trim()
          .split('\n')[0] // First paragraph
          .substring(0, 200); // First 200 chars

      // Build frontmatter
      const frontmatter = {
        title: metadata.title || slug,
        description: description || `Learn about ${metadata.title || slug}`,
        category,
        tags: metadata.tags || [],
        difficulty: inferDifficulty(metadata.tags || [], markdown),
        published: metadata.published !== false,
        updated: updatedDate || new Date().toISOString().split('T')[0],
        dateCreated: metadata.dateCreated,
        readingTime,
        toc: true,
        related: [] as string[], // Will be manually curated later
      };

      // Validate frontmatter (use partial schema for migration)
      try {
        FrontmatterSchema.parse(frontmatter);
      } catch (error) {
        console.warn(`⚠ Frontmatter validation warning for ${slug}:`, error);
      }

      // Build MDX content with proper YAML formatting
      const mdxContent = `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
description: "${frontmatter.description.replace(/"/g, '\\"')}"
category: "${frontmatter.category}"
tags: ${JSON.stringify(frontmatter.tags)}
difficulty: "${frontmatter.difficulty}"
updated: "${frontmatter.updated}"
readingTime: ${frontmatter.readingTime}
toc: ${frontmatter.toc}
related: []
---

${markdown}
`;

      // Write to target directory
      const targetPath = path.join(targetDir, category, `${slug}.mdx`);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, mdxContent, 'utf-8');

      successCount++;
      console.log(`✓ Migrated: ${category}/${slug}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Error migrating ${htmlFile}:`, error);
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

// Run if executed directly
if (require.main === module) {
  const sourceDir = process.argv[2] || '/tmp/inevitable-eth-wiki/home';
  const targetDir = process.argv[3] || path.join(process.cwd(), 'content');

  migrateHtmlToMdx(sourceDir, targetDir).catch(console.error);
}
