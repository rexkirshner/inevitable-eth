import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify with safe configuration for markdown-rendered content
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'ul', 'ol', 'li', 'blockquote',
      'code', 'pre', 'em', 'strong', 'del',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'picture', 'source',
      'br', 'hr', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'srcset', 'sizes',
      'id', 'class', 'style', 'type',
      'loading', 'decoding', 'width', 'height',
      'target', 'rel'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}
