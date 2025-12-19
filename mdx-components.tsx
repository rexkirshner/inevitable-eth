import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { Infobox } from '@/components/mdx/infobox';
import { Callout } from '@/components/mdx/callout';
import { Figure } from '@/components/mdx/figure';
import { References } from '@/components/mdx/references';
import { Collapsible } from '@/components/mdx/collapsible';
import { OptimizedImage } from '@/components/content/optimized-image';
import { CodeBlock, InlineCode } from '@/components/mdx/code-block';

/**
 * Props for the MDX pre element wrapper.
 * Children is typically a code element with className for syntax highlighting.
 */
interface PreProps extends ComponentPropsWithoutRef<'pre'> {
  children?: ReactElement<{ children?: string; className?: string }>;
}

/**
 * Props for the MDX code element.
 * className indicates a code block (e.g., "language-typescript").
 */
interface CodeProps extends ComponentPropsWithoutRef<'code'> {
  children?: React.ReactNode;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Infobox,
    Callout,
    Figure,
    References,
    Collapsible,
    img: (props) => <OptimizedImage {...props} alt={props.alt || ''} />,
    pre: ({ children, ...props }: PreProps) => {
      // Extract code content and className from children
      const child = children?.props;
      if (child && typeof child.children === 'string') {
        return <CodeBlock className={child.className} {...props}>{child.children}</CodeBlock>;
      }
      return <pre {...props}>{children}</pre>;
    },
    code: ({ children, className, ...props }: CodeProps) => {
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
