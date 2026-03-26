import { Graph } from 'graphlib';

type GraphEdge = { v: string; w: string };

export interface ConnectionEdge {
  from: string;
  to: string;
}

export interface ConnectionEvaluationResult {
  isCorrect: boolean;
  matchedCount: number;
  expectedCount: number;
  missingConnections: ConnectionEdge[];
  extraConnections: ConnectionEdge[];
  scoreRatio: number;
}

function normalizeNode(node: string): string {
  return node.trim().toLowerCase();
}

function normalizeEdge(edge: ConnectionEdge): ConnectionEdge {
  return {
    from: normalizeNode(edge.from),
    to: normalizeNode(edge.to),
  };
}

function buildDirectedGraph(edges: ConnectionEdge[]): Graph {
  const g = new Graph({ directed: true });
  for (const edge of edges) {
    const normalized = normalizeEdge(edge);
    g.setNode(normalized.from);
    g.setNode(normalized.to);
    g.setEdge(normalized.from, normalized.to);
  }
  return g;
}

function edgeKey(edge: ConnectionEdge): string {
  const n = normalizeEdge(edge);
  return `${n.from}->${n.to}`;
}

function toEdgeList(edges: string[]): ConnectionEdge[] {
  return edges.map((item) => {
    const [from, to] = item.split('->');
    return { from, to };
  });
}

export function evaluateConnections(
  expected: ConnectionEdge[],
  submitted: ConnectionEdge[]
): ConnectionEvaluationResult {
  const expectedGraph = buildDirectedGraph(expected);
  const submittedGraph = buildDirectedGraph(submitted);

  const expectedEdges = expectedGraph.edges().map((e: GraphEdge) => `${e.v}->${e.w}`);
  const submittedEdges = submittedGraph.edges().map((e: GraphEdge) => `${e.v}->${e.w}`);

  const expectedSet = new Set(expectedEdges);
  const submittedSet = new Set(submittedEdges);

  const missing = expectedEdges.filter((key: string) => !submittedSet.has(key));
  const extra = submittedEdges.filter((key: string) => !expectedSet.has(key));
  const matchedCount = expectedEdges.filter((key: string) => submittedSet.has(key)).length;
  const expectedCount = expectedEdges.length;

  const scoreRatio = expectedCount === 0 ? 0 : matchedCount / expectedCount;

  return {
    isCorrect: missing.length === 0 && extra.length === 0,
    matchedCount,
    expectedCount,
    missingConnections: toEdgeList(missing),
    extraConnections: toEdgeList(extra),
    scoreRatio,
  };
}

export function mapAnswerToEdges(answerMap: Record<string, string>): ConnectionEdge[] {
  return Object.entries(answerMap)
    .filter(([, value]) => Boolean(value))
    .map(([from, to]) => ({ from, to }));
}

export function normalizeEdgeSet(edges: ConnectionEdge[]): string[] {
  return edges.map(edgeKey).sort();
}
