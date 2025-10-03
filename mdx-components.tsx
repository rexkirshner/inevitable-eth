import type { MDXComponents } from 'mdx/types';
import { Infobox } from '@/components/mdx/infobox';
import { Callout } from '@/components/mdx/callout';
import { Figure } from '@/components/mdx/figure';
import { References } from '@/components/mdx/references';
import { OptimizedImage } from '@/components/content/optimized-image';
import { CodeBlock, InlineCode } from '@/components/mdx/code-block';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Infobox,
    Callout,
    Figure,
    References,
    img: (props) => <OptimizedImage {...props} alt={props.alt || ''} />,
    pre: ({ children, ...props }: any) => {
      // Extract code content and className from children
      const child = children?.props;
      if (child && typeof child.children === 'string') {
        return <CodeBlock className={child.className} {...props}>{child.children}</CodeBlock>;
      }
      return <pre {...props}>{children}</pre>;
    },
    code: ({ children, className, ...props }: any) => {
      // If it's a code block (has className), it's handled by pre
      // This is for inline code only
      if (className) {
        return <code className={className} {...props}>{children}</code>;
      }
      return <InlineCode {...props}>{children}</InlineCode>;
    },
    ...components,
  };
}
