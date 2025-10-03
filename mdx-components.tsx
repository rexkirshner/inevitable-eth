import type { MDXComponents } from 'mdx/types';
import { Infobox } from '@/components/mdx/infobox';
import { Callout } from '@/components/mdx/callout';
import { Figure } from '@/components/mdx/figure';
import { References } from '@/components/mdx/references';
import { OptimizedImage } from '@/components/content/optimized-image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Infobox,
    Callout,
    Figure,
    References,
    img: (props) => <OptimizedImage {...props} alt={props.alt || ''} />,
    ...components,
  };
}
