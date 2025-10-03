import { marked } from 'marked';

// Configure marked with options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: false, // Don't convert \n to <br>
});

// Custom renderer to add IDs to headings for TOC and optimize images
const renderer = new marked.Renderer();

renderer.heading = ({ tokens, depth }) => {
  const text = tokens.map((token: unknown) => {
    if (token && typeof token === 'object' && 'raw' in token) return (token as { raw: string }).raw;
    if (token && typeof token === 'object' && 'text' in token) return (token as { text: string }).text;
    return '';
  }).join('');
  const id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

renderer.image = ({ href, title, text }) => {
  // Extract filename from src
  const filename = href.split('/').pop() || '';
  const baseName = filename.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');

  // Build picture element with optimized sources
  return `<picture>
    <source
      type="image/avif"
      srcset="
        /images/optimized/${baseName}-mobile.avif 640w,
        /images/optimized/${baseName}-tablet.avif 1024w,
        /images/optimized/${baseName}-desktop.avif 1920w
      "
      sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
    />
    <source
      type="image/webp"
      srcset="
        /images/optimized/${baseName}-mobile.webp 640w,
        /images/optimized/${baseName}-tablet.webp 1024w,
        /images/optimized/${baseName}-desktop.webp 1920w
      "
      sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
    />
    <img
      src="${href}"
      alt="${text || ''}"
      ${title ? `title="${title}"` : ''}
      loading="lazy"
      decoding="async"
      style="max-width: 100%; height: auto;"
    />
  </picture>`;
};

marked.use({ renderer });

export async function renderMarkdown(content: string): Promise<string> {
  const html = await marked.parse(content);
  return html;
}
