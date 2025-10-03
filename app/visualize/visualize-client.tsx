'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { ContentMetadata } from '@/lib/content';

interface VisualizeClientProps {
  articles: (ContentMetadata & { category: 'background' | 'concepts' | 'ethereum' })[];
}

// Category colors
const CATEGORY_COLORS = {
  background: '#8B4513', // Brown
  concepts: '#4169E1',   // Royal Blue
  ethereum: '#627EEA',   // Ethereum Purple
  root: '#2F855A',       // Green
};

export default function VisualizeClient({ articles }: VisualizeClientProps) {
  // Transform articles into graph data
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map<string, number>();

    // Create root nodes for each category
    nodes.push({
      id: 'background',
      type: 'default',
      data: { label: 'Background' },
      position: { x: 0, y: 0 },
      style: {
        background: CATEGORY_COLORS.background,
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '12px',
        borderRadius: '8px',
        width: 150,
      },
    });

    nodes.push({
      id: 'concepts',
      type: 'default',
      data: { label: 'Concepts' },
      position: { x: 400, y: 0 },
      style: {
        background: CATEGORY_COLORS.concepts,
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '12px',
        borderRadius: '8px',
        width: 150,
      },
    });

    nodes.push({
      id: 'ethereum',
      type: 'default',
      data: { label: 'Ethereum' },
      position: { x: 800, y: 0 },
      style: {
        background: CATEGORY_COLORS.ethereum,
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '12px',
        borderRadius: '8px',
        width: 150,
      },
    });

    // Group articles by category and parent
    const articlesByCategory = {
      background: articles.filter(a => a.category === 'background'),
      concepts: articles.filter(a => a.category === 'concepts'),
      ethereum: articles.filter(a => a.category === 'ethereum'),
    };

    // Layout articles in radial pattern around category nodes
    Object.entries(articlesByCategory).forEach(([category, categoryArticles], catIndex) => {
      const categoryX = catIndex * 400;
      const categoryY = 0;

      // Get articles without parents (top-level in category)
      const topLevel = categoryArticles.filter(a => !a.frontmatter.parent);
      const withParents = categoryArticles.filter(a => a.frontmatter.parent);

      // Layout top-level articles in a circle around category
      const radius = 200;
      topLevel.forEach((article, index) => {
        const angle = (index / topLevel.length) * 2 * Math.PI;
        const x = categoryX + Math.cos(angle) * radius;
        const y = categoryY + Math.sin(angle) * radius + 200;

        const nodeId = `${category}/${article.slug}`;
        nodes.push({
          id: nodeId,
          type: 'default',
          data: {
            label: article.frontmatter.title,
            url: `/${category}/${article.slug}`,
          },
          position: { x, y },
          style: {
            background: 'white',
            border: `2px solid ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`,
            fontSize: '12px',
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            width: 120,
          },
        });

        nodeMap.set(`${category}:${article.slug}`, nodes.length - 1);

        // Connect to category node
        edges.push({
          id: `${category}-${nodeId}`,
          source: category,
          target: nodeId,
          type: 'smoothstep',
          animated: false,
          style: { stroke: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS], strokeWidth: 1 },
        });
      });

      // Layout child articles around their parents
      withParents.forEach((article) => {
        const parentNodeId = `${category}/${article.frontmatter.parent}`;
        const parentNodeIndex = nodeMap.get(`${category}:${article.frontmatter.parent}`);

        if (parentNodeIndex !== undefined) {
          const parentNode = nodes[parentNodeIndex];

          // Count how many children this parent has
          const siblings = withParents.filter(a => a.frontmatter.parent === article.frontmatter.parent);
          const siblingIndex = siblings.indexOf(article);

          // Position children in a small arc below parent
          const childRadius = 80;
          const arcStart = -Math.PI / 4;
          const arcEnd = Math.PI / 4;
          const angle = arcStart + (siblingIndex / Math.max(siblings.length - 1, 1)) * (arcEnd - arcStart);

          const x = parentNode.position.x + Math.cos(angle) * childRadius;
          const y = parentNode.position.y + Math.sin(angle) * childRadius + 100;

          const nodeId = `${category}/${article.slug}`;
          nodes.push({
            id: nodeId,
            type: 'default',
            data: {
              label: article.frontmatter.title,
              url: `/${category}/${article.slug}`,
            },
            position: { x, y },
            style: {
              background: 'white',
              border: `2px solid ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`,
              fontSize: '11px',
              padding: '6px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: 100,
            },
          });

          nodeMap.set(`${category}:${article.slug}`, nodes.length - 1);

          // Connect to parent
          edges.push({
            id: `${parentNodeId}-${nodeId}`,
            source: parentNodeId,
            target: nodeId,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#94a3b8', strokeWidth: 1 },
          });
        }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [articles]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Handle node click - navigate to article
  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.data.url) {
      window.location.href = node.data.url;
    }
  }, []);

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.id === 'background') return CATEGORY_COLORS.background;
            if (node.id === 'concepts') return CATEGORY_COLORS.concepts;
            if (node.id === 'ethereum') return CATEGORY_COLORS.ethereum;
            return '#e2e8f0';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
          <h1 className="text-xl font-serif font-bold mb-2">Page Visualization</h1>
          <p className="text-sm text-gray-600 mb-3">
            Interactive map of all {articles.length} articles
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: CATEGORY_COLORS.background }}></div>
              <span>Background ({articles.filter(a => a.category === 'background').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: CATEGORY_COLORS.concepts }}></div>
              <span>Concepts ({articles.filter(a => a.category === 'concepts').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: CATEGORY_COLORS.ethereum }}></div>
              <span>Ethereum ({articles.filter(a => a.category === 'ethereum').length})</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Click any node to navigate to that article
          </p>
        </Panel>
      </ReactFlow>
    </div>
  );
}
