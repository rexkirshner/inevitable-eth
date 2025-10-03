'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { ContentMetadata } from '@/lib/content';
import { Network, GitBranch, Circle } from 'lucide-react';

interface VisualizeClientProps {
  articles: (ContentMetadata & { category: 'background' | 'concepts' | 'ethereum' })[];
}

interface TreeNode {
  name: string;
  url?: string;
  children?: TreeNode[];
}

type VisualizationMode = 'hierarchical-tree' | 'hierarchical-radial' | 'relational-radial';

export default function VisualizeClient({ articles }: VisualizeClientProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<VisualizationMode>('hierarchical-radial');

  // Build hierarchical tree structure
  const buildTree = (): TreeNode => {
    const root: TreeNode = {
      name: 'Inevitable Ethereum',
      children: [],
    };

    const categories = ['background', 'concepts', 'ethereum'] as const;

    categories.forEach(category => {
      const categoryArticles = articles.filter(a => a.category === category);
      const categoryNode: TreeNode = {
        name: category.charAt(0).toUpperCase() + category.slice(1),
        children: [],
      };

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

  useEffect(() => {
    if (!svgRef.current) return;

    const treeData = buildTree();
    d3.select(svgRef.current).selectAll('*').remove();

    const width = window.innerWidth;
    const height = window.innerHeight - 80; // Account for tabs

    if (mode === 'hierarchical-tree') {
      // Traditional vertical tree layout
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(40,40)`);

      const tree = d3.tree<TreeNode>()
        .size([width - 80, height - 80]);

      const root = d3.hierarchy(treeData);
      tree(root);

      // Links
      svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('d', d3.linkVertical<any, d3.HierarchyPointNode<TreeNode>>()
          .x(d => d.x)
          .y(d => d.y));

      // Nodes
      const node = svg.append('g')
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => `translate(${d.x},${d.y})`);

      node.filter(d => d.data.url)
        .append('circle')
        .attr('r', 4)
        .attr('fill', '#333')
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          if (d.data.url) window.location.href = d.data.url;
        });

      node.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => d.children ? -6 : 6)
        .attr('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name)
        .style('font-size', d => d.depth <= 1 ? '14px' : '11px')
        .style('font-weight', d => d.depth <= 1 ? 'bold' : 'normal')
        .style('fill', '#333')
        .style('cursor', d => d.data.url ? 'pointer' : 'default')
        .on('click', (event, d) => {
          if (d.data.url) window.location.href = d.data.url;
        });

    } else if (mode === 'hierarchical-radial') {
      // Radial tree layout
      const radius = Math.min(width, height) / 2 - 120;
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const tree = d3.tree<TreeNode>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

      const root = d3.hierarchy(treeData);
      tree(root);

      // Links
      svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('stroke-width', d => Math.max(1, 4 - d.source.depth))
        .attr('d', d3.linkRadial<any, d3.HierarchyPointNode<TreeNode>>()
          .angle(d => d.x)
          .radius(d => d.y));

      // Nodes
      const node = svg.append('g')
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => {
          const angle = d.x;
          const r = d.y;
          return `rotate(${(angle * 180 / Math.PI - 90)}) translate(${r},0)`;
        });

      node.filter(d => d.data.url)
        .append('circle')
        .attr('r', 4)
        .attr('fill', '#333')
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          if (d.data.url) window.location.href = d.data.url;
        });

      node.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => d.x < Math.PI ? 6 : -6)
        .attr('text-anchor', d => d.x < Math.PI ? 'start' : 'end')
        .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
        .text(d => d.data.name)
        .style('font-size', d => {
          if (d.depth === 0) return '16px';
          if (d.depth === 1) return '14px';
          if (d.depth === 2) return '12px';
          return '10px';
        })
        .style('font-weight', d => d.depth <= 1 ? 'bold' : 'normal')
        .style('fill', '#333')
        .style('cursor', d => d.data.url ? 'pointer' : 'default')
        .on('click', (event, d) => {
          if (d.data.url) window.location.href = d.data.url;
        });

      // Zoom
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 3])
        .on('zoom', (event) => {
          svg.attr('transform', `translate(${width / 2},${height / 2}) ${event.transform}`);
        });
      d3.select(svgRef.current).call(zoom as any);

    } else if (mode === 'relational-radial') {
      // Force-directed graph with radial constraint
      const radius = Math.min(width, height) / 2 - 120;
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      // Flatten tree to nodes and links
      const nodes: any[] = [];
      const links: any[] = [];
      const root = d3.hierarchy(treeData);

      root.descendants().forEach(d => {
        nodes.push({
          id: d.data.name,
          name: d.data.name,
          url: d.data.url,
          depth: d.depth,
        });
      });

      root.links().forEach(d => {
        links.push({
          source: d.source.data.name,
          target: d.target.data.name,
        });
      });

      // Force simulation
      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('radial', d3.forceRadial((d: any) => d.depth * 100, 0, 0))
        .force('collision', d3.forceCollide().radius(20));

      // Links
      const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', 1.5);

      // Nodes
      const node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .style('cursor', (d: any) => d.url ? 'pointer' : 'default')
        .on('click', (event, d: any) => {
          if (d.url) window.location.href = d.url;
        });

      node.append('circle')
        .attr('r', 5)
        .attr('fill', (d: any) => d.depth === 0 ? '#000' : d.depth === 1 ? '#666' : '#999');

      node.append('text')
        .text((d: any) => d.name)
        .attr('x', 8)
        .attr('y', '0.31em')
        .style('font-size', (d: any) => d.depth <= 1 ? '12px' : '10px')
        .style('font-weight', (d: any) => d.depth <= 1 ? 'bold' : 'normal')
        .style('fill', '#333');

      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
      });

      // Drag behavior
      node.call(d3.drag<any, any>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));
    }
  }, [articles, mode]);

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* Tabs */}
      <div className="flex justify-center gap-0 p-4 bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => setMode('hierarchical-tree')}
          className={`flex items-center gap-2 px-6 py-3 transition-colors ${
            mode === 'hierarchical-tree'
              ? 'bg-white border-2 border-gray-300 text-gray-900 font-medium rounded-l-lg'
              : 'bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 rounded-l-lg'
          }`}
        >
          <GitBranch className="w-5 h-5" />
          Hierarchical Tree
        </button>
        <button
          onClick={() => setMode('hierarchical-radial')}
          className={`flex items-center gap-2 px-6 py-3 transition-colors border-t border-b ${
            mode === 'hierarchical-radial'
              ? 'bg-white border-2 border-gray-300 text-gray-900 font-medium'
              : 'bg-gray-100 border-l-0 border-r border-gray-300 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Circle className="w-5 h-5" />
          Hierarchical Radial
        </button>
        <button
          onClick={() => setMode('relational-radial')}
          className={`flex items-center gap-2 px-6 py-3 transition-colors ${
            mode === 'relational-radial'
              ? 'bg-blue-100 border-2 border-blue-300 text-blue-900 font-medium rounded-r-lg'
              : 'bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 rounded-r-lg'
          }`}
        >
          <Network className="w-5 h-5" />
          Relational Radial
        </button>
      </div>

      {/* Visualization */}
      <div className="flex-1">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
}
