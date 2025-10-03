import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const OPTIMIZED_DIR = path.join(IMAGES_DIR, 'optimized');
const MANIFEST_PATH = path.join(IMAGES_DIR, 'manifest.json');

const SIZES = ['mobile', 'tablet', 'desktop'];
const FORMATS = ['webp', 'avif'];

interface ValidationIssue {
  type: 'missing-original' | 'missing-variant' | 'missing-from-manifest' | 'not-referenced';
  file: string;
  detail: string;
}

const issues: ValidationIssue[] = [];
const referencedImages = new Set<string>();

function getAllMdxFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath));
    } else if (item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractImageReferences(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const images: string[] = [];

  // Match markdown images: ![alt](/images/filename.ext)
  const mdRegex = /!\[.*?\]\(\/images\/([^)]+)\)/g;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    images.push(match[1]);
  }

  // Match HTML img tags: <img src="/images/filename.ext" />
  const htmlRegex = /<img[^>]*src=["']\/images\/([^"']+)["']/g;
  while ((match = htmlRegex.exec(content)) !== null) {
    images.push(match[1]);
  }

  // Match hero images in frontmatter
  const heroRegex = /hero:\s*["']?\/images\/([^"'\s]+)["']?/g;
  while ((match = heroRegex.exec(content)) !== null) {
    images.push(match[1]);
  }

  return images;
}

function checkImageVariants(imageName: string) {
  const ext = path.extname(imageName);
  const baseName = path.basename(imageName, ext);

  // Check if original exists
  const originalPath = path.join(IMAGES_DIR, imageName);
  if (!fs.existsSync(originalPath)) {
    issues.push({
      type: 'missing-original',
      file: imageName,
      detail: `Original image not found at: ${originalPath}`,
    });
    return;
  }

  // Check if all variants exist
  for (const size of SIZES) {
    for (const format of FORMATS) {
      const variantPath = path.join(OPTIMIZED_DIR, `${baseName}-${size}.${format}`);
      if (!fs.existsSync(variantPath)) {
        issues.push({
          type: 'missing-variant',
          file: imageName,
          detail: `Missing ${size} ${format.toUpperCase()} variant`,
        });
      }
    }
  }

  // Check if in manifest
  if (fs.existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    if (!manifest[imageName]) {
      issues.push({
        type: 'missing-from-manifest',
        file: imageName,
        detail: 'Not found in manifest.json',
      });
    }
  }
}

function checkUnreferencedImages() {
  if (!fs.existsSync(IMAGES_DIR)) return;

  const allImages = fs.readdirSync(IMAGES_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
  });

  for (const image of allImages) {
    if (!referencedImages.has(image)) {
      issues.push({
        type: 'not-referenced',
        file: image,
        detail: 'Image exists but is not referenced in any MDX file',
      });
    }
  }
}

function main() {
  console.log('🔍 Starting image validation...\n');

  // Get all MDX files
  const mdxFiles = getAllMdxFiles(CONTENT_DIR);
  console.log(`Found ${mdxFiles.length} MDX files\n`);

  // Extract and validate image references
  for (const mdxFile of mdxFiles) {
    const images = extractImageReferences(mdxFile);
    const relativePath = path.relative(CONTENT_DIR, mdxFile);

    if (images.length > 0) {
      console.log(`📄 ${relativePath}: ${images.length} image(s)`);
      for (const image of images) {
        referencedImages.add(image);
        checkImageVariants(image);
      }
    }
  }

  console.log(`\n📊 Total unique images referenced: ${referencedImages.size}\n`);

  // Check for unreferenced images
  checkUnreferencedImages();

  // Report results
  if (issues.length === 0) {
    console.log('✅ All images validated successfully! No issues found.\n');
    return;
  }

  console.log(`⚠️  Found ${issues.length} issue(s):\n`);

  // Group issues by type
  const grouped = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {} as Record<string, ValidationIssue[]>);

  for (const [type, typeIssues] of Object.entries(grouped)) {
    const label = {
      'missing-original': '❌ Missing Original Images',
      'missing-variant': '⚠️  Missing Optimized Variants',
      'missing-from-manifest': '📝 Missing from Manifest',
      'not-referenced': '🗑️  Unreferenced Images',
    }[type] || type;

    console.log(`\n${label} (${typeIssues.length}):`);
    for (const issue of typeIssues) {
      console.log(`  • ${issue.file}: ${issue.detail}`);
    }
  }

  console.log('\n💡 To fix missing variants, run: npm run optimize-images\n');

  // Exit with error code if critical issues found
  const criticalIssues = issues.filter(i =>
    i.type === 'missing-original' || i.type === 'missing-variant'
  );
  if (criticalIssues.length > 0) {
    process.exit(1);
  }
}

main();
