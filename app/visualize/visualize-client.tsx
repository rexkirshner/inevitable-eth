'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { ContentMetadata } from '@/lib/content';

interface VisualizeClientProps {
  articles: (ContentMetadata & { category: 'background' | 'concepts' | 'ethereum' })[];
}

interface TreeNode {
  name: string;
  url?: string;
  children?: TreeNode[];
}

export default function VisualizeClient({ articles }: VisualizeClientProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Build hierarchical tree structure
    const buildTree = (): TreeNode => {
      const root: TreeNode = {
        name: 'Inevitable Ethereum',
        children: [],
      };

      // Group by category
      const categories = ['background', 'concepts', 'ethereum'] as const;

      categories.forEach(category => {
        const categoryArticles = articles.filter(a => a.category === category);
        const categoryNode: TreeNode = {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          children: [],
        };

        // Build parent-child relationships
        const nodeMap = new Map<string, TreeNode>();

        // First pass: create all nodes
        categoryArticles.forEach(article => {
          const node: TreeNode = {
            name: article.frontmatter.title,
            url: `/${category}/${article.slug}`,
            children: [],
          };
          nodeMap.set(article.slug, node);
        });

        // Second pass: build hierarchy
        categoryArticles.forEach(article => {
          const node = nodeMap.get(article.slug)!;
          if (article.frontmatter.parent) {
            const parent = nodeMap.get(article.frontmatter.parent);
            if (parent) {
              parent.children!.push(node);
            } else {
              categoryNode.children!.push(node);
            }
          } else {
            categoryNode.children!.push(node);
          }
        });

        root.children!.push(categoryNode);
      });

      return root;
    };

    const treeData = buildTree();

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    const radius = Math.min(width, height) / 2 - 120;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create radial tree layout
    const tree = d3.tree<TreeNode>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    const root = d3.hierarchy(treeData);
    tree(root);

    // Draw links (connections between nodes)
    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('stroke-width', d => {
        // Thicker lines closer to root
        return Math.max(1, 4 - d.source.depth);
      })
      .attr('d', d3.linkRadial<any, d3.HierarchyPointNode<TreeNode>>()
        .angle(d => d.x)
        .radius(d => d.y));

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', d => {
        const angle = d.x;
        const r = d.y;
        return `rotate(${(angle * 180 / Math.PI - 90)}) translate(${r},0)`;
      });

    // Add clickable circles for leaf nodes
    node.filter(d => d.data.url)
      .append('circle')
      .attr('r', 4)
      .attr('fill', '#333')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (d.data.url) {
          window.location.href = d.data.url;
        }
      });

    // Add text labels
    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.x < Math.PI ? 6 : -6)
      .attr('text-anchor', d => d.x < Math.PI ? 'start' : 'end')
      .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
      .text(d => d.data.name)
      .style('font-size', d => {
        // Larger font for higher levels
        if (d.depth === 0) return '16px';
        if (d.depth === 1) return '14px';
        if (d.depth === 2) return '12px';
        return '10px';
      })
      .style('font-weight', d => d.depth <= 1 ? 'bold' : 'normal')
      .style('fill', '#333')
      .style('cursor', d => d.data.url ? 'pointer' : 'default')
      .on('click', (event, d) => {
        if (d.data.url) {
          window.location.href = d.data.url;
        }
      });

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        svg.attr('transform', `translate(${width / 2},${height / 2}) ${event.transform}`);
      });

    d3.select(svgRef.current).call(zoom as any);

  }, [articles]);

  return (
    <div className="w-full h-screen bg-white">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
