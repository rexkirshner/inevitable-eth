import fs from 'fs';
import path from 'path';

interface ParentMapping {
  category: string;
  slug: string;
  parent: string | null;
}

function getAllMdxFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllMdxFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

async function addParentToFrontmatter() {
  // Load parent mappings
  const mappingsPath = path.join(process.cwd(), 'scripts', 'parent-mappings.json');
  const mappings: ParentMapping[] = JSON.parse(fs.readFileSync(mappingsPath, 'utf-8'));

  // Create lookup map
  const parentMap = new Map<string, string | null>();
  for (const mapping of mappings) {
    const key = `${mapping.category}/${mapping.slug}`;
    parentMap.set(key, mapping.parent);
  }

  const contentDir = path.join(process.cwd(), 'content');
  const mdxFiles = getAllMdxFiles(contentDir);

  let updatedCount = 0;
  let addedCount = 0;

  for (const filePath of mdxFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Extract category and slug from file path
    const relativePath = path.relative(contentDir, filePath);
    const [category, filenameWithExt] = relativePath.split(path.sep);
    const slug = filenameWithExt.replace('.mdx', '');

    // Look up parent
    const key = `${category}/${slug}`;
    const parent = parentMap.get(key);

    // Skip if no parent mapping found or parent is null
    if (parent === undefined || parent === null) {
      continue;
    }

    // Check if frontmatter already has parent field
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.log(`⚠️  No frontmatter found in ${relativePath}`);
      continue;
    }

    const frontmatter = frontmatterMatch[1];

    // Check if parent already exists
    if (frontmatter.includes('parent:')) {
      // Update existing parent
      content = content.replace(
        /parent:\s*"[^"]*"/,
        `parent: "${parent}"`
      );
      updatedCount++;
      console.log(`✏️  Updated: ${relativePath} → parent: "${parent}"`);
    } else {
      // Add parent field after category
      content = content.replace(
        /category:\s*"([^"]*)"/,
        `category: "$1"\nparent: "${parent}"`
      );
      addedCount++;
      console.log(`✅ Added: ${relativePath} → parent: "${parent}"`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  console.log(`\n✨ Added parent field to ${addedCount} articles`);
  console.log(`✏️  Updated parent field in ${updatedCount} articles`);
  console.log(`📝 Total: ${addedCount + updatedCount} articles modified\n`);
}

addParentToFrontmatter().catch(console.error);
