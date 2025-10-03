#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const conceptsDir = path.join(process.cwd(), 'content/concepts');

// Mapping of articles to their new parent categories
const parentMapping: Record<string, string> = {
  // Finance
  'arbitrage': 'finance',
  'dcf': 'finance',
  'liquidity': 'finance',
  'market-making': 'finance',
  'option': 'finance',
  'perp': 'finance',
  'reserve-currency': 'finance',
  'settlement': 'finance',
  'working-capital': 'finance',

  // Computer Science
  'abstraction': 'computer-science',
  'api': 'computer-science',
  'array': 'computer-science',
  'stack': 'computer-science',
  'turing-complete': 'computer-science',
  'vector': 'computer-science',
  'virtual-machine': 'computer-science',

  // Cryptography
  'bls-signatures': 'cryptography',
  'commitment': 'cryptography',
  'diffie-hellman': 'cryptography',
  'digital-signatures': 'cryptography',
  'elliptic-curve-cryptography': 'cryptography',
  'elliptic-curve-pairings': 'cryptography',
  'hash': 'cryptography',
  'kzg-commitment': 'cryptography',
  'merkle-tree': 'cryptography',
  'pcs-trusted-setup': 'cryptography',
  'polynomial-commitment': 'cryptography',
  'polynomial-encoding': 'cryptography',
  'verkle-tree': 'cryptography',
  'zk-proof': 'cryptography',

  // Blockchain
  'bft': 'blockchain',
  'bridge': 'blockchain',
  'credible-neutrality': 'blockchain',
  'crypto-economics': 'blockchain',
  'gas': 'blockchain',
  'mev': 'blockchain',
  'oracle': 'blockchain',

  // Other (will be under blockchain for now)
  'power-law': 'blockchain',
};

// Articles that should keep their current parent (already have parents)
const keepParent = ['scaling', 'example', 'erasure-code', 'verify', 'open', 'commit'];

function updateFrontmatter(filePath: string, newParent: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let inFrontmatter = false;
  let hasParent = false;
  const updatedLines = lines.map(line => {
    if (line === '---') {
      inFrontmatter = !inFrontmatter;
      return line;
    }

    if (inFrontmatter && line.startsWith('parent:')) {
      hasParent = true;
      return `parent: "${newParent}"`;
    }

    return line;
  });

  // If no parent field exists, add it after category
  if (!hasParent) {
    const categoryIndex = updatedLines.findIndex(line => line.startsWith('category:'));
    if (categoryIndex !== -1) {
      updatedLines.splice(categoryIndex + 1, 0, `parent: "${newParent}"`);
    }
  }

  fs.writeFileSync(filePath, updatedLines.join('\n'));
}

// Update all articles
for (const [slug, parent] of Object.entries(parentMapping)) {
  const filePath = path.join(conceptsDir, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    updateFrontmatter(filePath, parent);
    console.log(`✓ Updated ${slug}.mdx -> parent: "${parent}"`);
  } else {
    console.log(`⚠ File not found: ${slug}.mdx`);
  }
}

console.log('\n✨ Done! Updated parent fields for all concepts articles.');
