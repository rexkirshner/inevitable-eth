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

async function removeCKEditorTag() {
  const contentDir = path.join(process.cwd(), 'content');
  const mdxFiles = getAllMdxFiles(contentDir);

  let fixedCount = 0;

  for (const filePath of mdxFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if file contains the ckeditor tag
    if (content.includes('editor: ckeditor')) {
      // Remove "editor: ckeditor" from tags array
      // Handles both ["editor: ckeditor"] and ["editor: ckeditor", "other-tag"]
      content = content.replace(/,?\s*"editor:\s*ckeditor"\s*,?/g, '');

      // Clean up empty arrays or trailing commas
      content = content.replace(/tags:\s*\[\s*,\s*/g, 'tags: [');
      content = content.replace(/,\s*\]/g, ']');
      content = content.replace(/\[\s*\]/g, '[]');

      fs.writeFileSync(filePath, content, 'utf-8');
      fixedCount++;
      console.log(`✅ Fixed: ${path.relative(contentDir, filePath)}`);
    }
  }

  console.log(`\n✨ Removed "editor: ckeditor" tag from ${fixedCount} files`);
}

removeCKEditorTag().catch(console.error);
