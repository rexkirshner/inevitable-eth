import { marked } from 'marked';

// Configure marked with options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: false, // Don't convert \n to <br>
});

// Custom renderer to add IDs to headings for TOC
const renderer = new marked.Renderer();
const originalHeading = renderer.heading.bind(renderer);

renderer.heading = ({ tokens, depth }) => {
  const text = tokens.map((token: any) => token.raw || token.text).join('');
  const id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.use({ renderer });

export async function renderMarkdown(content: string): Promise<string> {
  const html = await marked.parse(content);
  return html;
}
