import fs from 'fs';
import path from 'path';

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

function extractDescription(content: string): string | null {
  // Remove frontmatter
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n+/m, '');

  // Remove images, links to images, and common markdown artifacts
  let cleaned = contentWithoutFrontmatter
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\*\*\*/g, '') // Remove bold+italic
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italic
    .replace(/`/g, '') // Remove code
    .replace(/^\s*>\s+/gm, '') // Remove blockquotes
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .trim();

  // Find first substantial paragraph (at least 50 characters)
  const paragraphs = cleaned.split(/\n\n+/).filter(p => p.trim().length > 50);

  if (paragraphs.length === 0) {
    return null;
  }

  // Get first paragraph, limit to ~150 chars, break at sentence
  let description = paragraphs[0].replace(/\n/g, ' ').trim();

  if (description.length > 150) {
    // Try to break at sentence
    const sentences = description.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences[0]) {
      description = sentences[0].trim();
      if (description.length > 200) {
        // Still too long, truncate at word
        description = description.substring(0, 147).trim();
        const lastSpace = description.lastIndexOf(' ');
        if (lastSpace > 100) {
          description = description.substring(0, lastSpace) + '...';
        } else {
          description += '...';
        }
      }
    } else {
      // No sentence found, truncate at word
      description = description.substring(0, 147).trim();
      const lastSpace = description.lastIndexOf(' ');
      if (lastSpace > 100) {
        description = description.substring(0, lastSpace) + '...';
      } else {
        description += '...';
      }
    }
  }

  return description;
}

async function fixDescriptions() {
  const contentDir = path.join(process.cwd(), 'content');
  const mdxFiles = getAllMdxFiles(contentDir);

  let fixedCount = 0;
  let noContentCount = 0;

  for (const filePath of mdxFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if file has "published: true" as description
    if (content.includes('description: "published: true"')) {
      const extractedDesc = extractDescription(content);

      if (extractedDesc) {
        // Replace with extracted description
        content = content.replace(
          'description: "published: true"',
          `description: "${extractedDesc.replace(/"/g, '\\"')}"`
        );
        fs.writeFileSync(filePath, content, 'utf-8');
        fixedCount++;
        console.log(`✅ Fixed: ${path.relative(contentDir, filePath)}`);
        console.log(`   → ${extractedDesc.substring(0, 80)}${extractedDesc.length > 80 ? '...' : ''}`);
      } else {
        // No content found, remove description field entirely
        content = content.replace(/description: "published: true"\n/, '');
        fs.writeFileSync(filePath, content, 'utf-8');
        noContentCount++;
        console.log(`⚠️  No content: ${path.relative(contentDir, filePath)} - removed description`);
      }
    }
  }

  console.log(`\n✨ Fixed ${fixedCount} articles with extracted descriptions`);
  console.log(`⚠️  ${noContentCount} articles had no extractable content (description removed)`);
}

fixDescriptions().catch(console.error);
