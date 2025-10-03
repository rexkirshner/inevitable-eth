import fs from 'fs';
import path from 'path';

// Path to the backup repo
const BACKUP_DIR = '/private/tmp/inevitable-eth-wiki/home';

interface ParentMapping {
  category: string;
  slug: string;
  parent: string | null;
}

function extractParentRelationships(): ParentMapping[] {
  const mappings: ParentMapping[] = [];
  const categories = ['background', 'concepts', 'ethereum'];

  for (const category of categories) {
    const categoryPath = path.join(BACKUP_DIR, category);

    if (!fs.existsSync(categoryPath)) continue;

    // Recursively scan for HTML files
    scanDirectory(categoryPath, category, mappings);
  }

  return mappings;
}

function scanDirectory(dir: string, category: string, mappings: ParentMapping[], parent: string | null = null) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Directory name is the parent slug
      const parentSlug = entry.name;
      scanDirectory(fullPath, category, mappings, parentSlug);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // Extract slug from filename
      const slug = entry.name.replace('.html', '');

      mappings.push({
        category,
        slug,
        parent,
      });
    }
  }
}

// Run extraction
const mappings = extractParentRelationships();

// Group by category for better readability
const byCategory = {
  background: mappings.filter(m => m.category === 'background'),
  concepts: mappings.filter(m => m.category === 'concepts'),
  ethereum: mappings.filter(m => m.category === 'ethereum'),
};

// Output results
console.log('\n=== PARENT-CHILD RELATIONSHIPS ===\n');

for (const [category, items] of Object.entries(byCategory)) {
  console.log(`\n${category.toUpperCase()}:`);

  // Show parent articles
  const parents = items.filter(item => item.parent === null);
  console.log(`\n  Top-level articles (${parents.length}):`);
  parents.forEach(p => console.log(`    - ${p.slug}`));

  // Show child articles grouped by parent
  const children = items.filter(item => item.parent !== null);
  const byParent = children.reduce((acc, child) => {
    if (!acc[child.parent!]) acc[child.parent!] = [];
    acc[child.parent!].push(child.slug);
    return acc;
  }, {} as Record<string, string[]>);

  if (Object.keys(byParent).length > 0) {
    console.log(`\n  Child articles (${children.length}):`);
    for (const [parent, kids] of Object.entries(byParent)) {
      console.log(`    ${parent}:`);
      kids.forEach(kid => console.log(`      - ${kid}`));
    }
  }
}

// Save to JSON for next script
const outputPath = path.join(process.cwd(), 'scripts', 'parent-mappings.json');
fs.writeFileSync(outputPath, JSON.stringify(mappings, null, 2), 'utf-8');
console.log(`\n✅ Saved ${mappings.length} mappings to ${outputPath}\n`);
