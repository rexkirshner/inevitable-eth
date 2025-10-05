#!/usr/bin/env tsx

/**
 * Auto-Tag Articles Script
 *
 * Analyzes all MDX articles and generates relevant tags based on:
 * - Article title, description, and content
 * - Category context
 * - Domain-specific keywords (Ethereum, crypto, finance, etc.)
 *
 * Run: npx tsx scripts/auto-tag-articles.ts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// Domain-specific keyword mappings
const KEYWORD_TAGS: Record<string, string[]> = {
  // Ethereum & Blockchain
  'ethereum': ['ethereum', 'blockchain'],
  'evm': ['ethereum', 'evm', 'virtual-machine'],
  'smart contract': ['ethereum', 'smart-contracts', 'programming'],
  'proof of stake': ['ethereum', 'proof-of-stake', 'consensus'],
  'proof of work': ['blockchain', 'proof-of-work', 'consensus'],
  'consensus': ['blockchain', 'consensus', 'distributed-systems'],
  'rollup': ['ethereum', 'scaling', 'layer-2'],
  'layer 2': ['ethereum', 'scaling', 'layer-2'],
  'sharding': ['ethereum', 'scaling', 'sharding'],
  'validator': ['ethereum', 'proof-of-stake', 'consensus'],
  'staking': ['ethereum', 'proof-of-stake', 'staking'],
  'gas': ['ethereum', 'transactions', 'economics'],
  'block': ['blockchain', 'data-structures', 'consensus'],

  // Cryptography
  'cryptography': ['cryptography', 'security'],
  'encryption': ['cryptography', 'security', 'privacy'],
  'hash': ['cryptography', 'data-structures', 'security'],
  'merkle': ['cryptography', 'data-structures', 'merkle-trees'],
  'signature': ['cryptography', 'security', 'digital-signatures'],
  'zero knowledge': ['cryptography', 'zero-knowledge', 'privacy'],
  'zkp': ['cryptography', 'zero-knowledge', 'privacy'],
  'bls': ['cryptography', 'signatures', 'elliptic-curves'],
  'elliptic curve': ['cryptography', 'mathematics', 'elliptic-curves'],

  // DeFi & Finance
  'defi': ['ethereum', 'defi', 'finance'],
  'amm': ['ethereum', 'defi', 'market-making'],
  'liquidity': ['finance', 'defi', 'market-making'],
  'swap': ['ethereum', 'defi', 'trading'],
  'lending': ['ethereum', 'defi', 'finance'],
  'derivative': ['finance', 'derivatives', 'trading'],
  'option': ['finance', 'derivatives', 'options'],
  'perpetual': ['finance', 'derivatives', 'perpetuals'],
  'oracle': ['ethereum', 'defi', 'oracles'],
  'arbitrage': ['finance', 'trading', 'arbitrage'],

  // Computer Science
  'algorithm': ['computer-science', 'algorithms'],
  'data structure': ['computer-science', 'data-structures'],
  'virtual machine': ['computer-science', 'virtual-machines'],
  'api': ['computer-science', 'apis', 'programming'],
  'abstraction': ['computer-science', 'abstraction', 'programming'],
  'turing': ['computer-science', 'turing-complete', 'theory'],

  // Finance History
  'crisis': ['finance', 'history', 'economics'],
  'federal reserve': ['finance', 'central-banking', 'economics'],
  'banking': ['finance', 'banking', 'economics'],
  'regulation': ['finance', 'regulation', 'policy'],
  'reserve currency': ['finance', 'economics', 'currency'],

  // Mass Communication
  'printing press': ['history', 'communication', 'technology'],
  'internet': ['technology', 'communication', 'networks'],
  'communication': ['communication', 'technology', 'networks'],
};

// Extract tags from text content
function extractTags(title: string, description: string, content: string, category: string): string[] {
  const tags = new Set<string>();

  // Always add category as a tag
  tags.add(category);

  // Combine all text for analysis
  const fullText = `${title} ${description} ${content}`.toLowerCase();

  // Check for keyword matches
  for (const [keyword, keywordTags] of Object.entries(KEYWORD_TAGS)) {
    if (fullText.includes(keyword.toLowerCase())) {
      keywordTags.forEach(tag => tags.add(tag));
    }
  }

  // Extract key terms from title (convert to kebab-case tags)
  const titleWords = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3); // Only meaningful words

  // Add title-based tags if they're significant
  const significantTerms = ['ethereum', 'blockchain', 'defi', 'rollup', 'layer', 'proof', 'stake',
                             'consensus', 'merkle', 'signature', 'zero', 'knowledge', 'cryptography'];

  titleWords.forEach(word => {
    if (significantTerms.some(term => word.includes(term))) {
      tags.add(word);
    }
  });

  // Limit to 3-6 tags (most relevant)
  const tagArray = Array.from(tags);
  return tagArray.slice(0, 6);
}

// Process a single MDX file
function processFile(filePath: string): void {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Skip if already has tags
  if (frontmatter.tags && frontmatter.tags.length > 0) {
    console.log(`⏭️  Skipping ${path.basename(filePath)} (already has tags)`);
    return;
  }

  // Extract tags
  const tags = extractTags(
    frontmatter.title || '',
    frontmatter.description || '',
    content.slice(0, 2000), // First 2000 chars for performance
    frontmatter.category || ''
  );

  // Update frontmatter
  frontmatter.tags = tags;

  // Write back to file
  const newContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, newContent);

  console.log(`✅ ${path.basename(filePath)}: [${tags.join(', ')}]`);
}

// Main execution
function main() {
  console.log('🏷️  Auto-tagging articles...\n');

  let processed = 0;
  let skipped = 0;

  // Process all categories
  const categories = ['background', 'concepts', 'ethereum'];

  categories.forEach(category => {
    const categoryDir = path.join(CONTENT_DIR, category);
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.mdx'));

    console.log(`\n📁 ${category.toUpperCase()} (${files.length} files)`);
    console.log('─'.repeat(60));

    files.forEach(file => {
      const filePath = path.join(categoryDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter } = matter(fileContent);

      if (frontmatter.tags && frontmatter.tags.length > 0) {
        skipped++;
      } else {
        processFile(filePath);
        processed++;
      }
    });
  });

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Complete! Tagged ${processed} articles (skipped ${skipped} already tagged)`);
}

main();
