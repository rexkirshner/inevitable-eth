#!/usr/bin/env npx tsx
/**
 * Image Alt Text Validation Script
 *
 * Scans all MDX files in content/ directory and reports images with empty alt text.
 * Empty alt text is an accessibility and SEO issue.
 *
 * Usage: npx tsx scripts/check-image-alt.ts
 *
 * Exit codes:
 *   0 - All images have alt text
 *   1 - Found images with empty alt text
 */

import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

interface ImageIssue {
  file: string;
  line: number;
  image: string;
}

/**
 * Recursively get all MDX files in a directory
 */
function getMdxFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Check a single file for images with empty alt text
 */
function checkFile(filePath: string): ImageIssue[] {
  const issues: ImageIssue[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relativePath = path.relative(process.cwd(), filePath);

  // Regex to match markdown images: ![alt](src)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  lines.forEach((line, index) => {
    let match;
    while ((match = imageRegex.exec(line)) !== null) {
      const altText = match[1].trim();
      const imageSrc = match[2];

      if (altText === '') {
        issues.push({
          file: relativePath,
          line: index + 1,
          image: imageSrc,
        });
      }
    }
    // Reset regex lastIndex for next line
    imageRegex.lastIndex = 0;
  });

  return issues;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Checking image alt text in MDX files...\n');

  const mdxFiles = getMdxFiles(CONTENT_DIR);
  console.log(`Found ${mdxFiles.length} MDX files to check\n`);

  const allIssues: ImageIssue[] = [];

  for (const file of mdxFiles) {
    const issues = checkFile(file);
    allIssues.push(...issues);
  }

  if (allIssues.length === 0) {
    console.log('✅ All images have alt text!\n');
    process.exit(0);
  }

  console.log(`⚠️  Found ${allIssues.length} image(s) with empty alt text:\n`);

  // Group by file for cleaner output
  const byFile = new Map<string, ImageIssue[]>();
  for (const issue of allIssues) {
    const existing = byFile.get(issue.file) || [];
    existing.push(issue);
    byFile.set(issue.file, existing);
  }

  for (const [file, issues] of byFile) {
    console.log(`📄 ${file}`);
    for (const issue of issues) {
      console.log(`   Line ${issue.line}: ${issue.image}`);
    }
    console.log('');
  }

  console.log('---');
  console.log(`Total: ${allIssues.length} images missing alt text in ${byFile.size} files`);
  console.log('\nTo fix: Add descriptive alt text to each image');
  console.log('Example: ![Description of image](/images/example.png)\n');

  process.exit(1);
}

main();
