import type { Edge } from "@xyflow/react";

export type ConnectionMap = Record<string, string>;

export const sourceHandleId = (pin: string): string => `source:${encodeURIComponent(pin)}`;

export const targetHandleId = (pin: string): string => `target:${encodeURIComponent(pin)}`;

export function decodeSourceHandleId(handleId?: string | null): string | null {
  if (!handleId || !handleId.startsWith("source:")) return null;
  return decodeURIComponent(handleId.replace("source:", ""));
}

export function decodeTargetHandleId(handleId?: string | null): string | null {
  if (!handleId || !handleId.startsWith("target:")) return null;
  return decodeURIComponent(handleId.replace("target:", ""));
}

export function parseConnectionAnswer(answer: string | string[] | undefined): ConnectionMap {
  if (typeof answer !== "string") return {};
  try {
    const parsed = JSON.parse(answer);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as ConnectionMap;
  } catch {
    return {};
  }
}

export function normalizeConnectionMap(
  map: ConnectionMap,
  sourceNodes: string[],
  targetNodes: string[]
): ConnectionMap {
  const allowedSources = new Set(sourceNodes);
  const allowedTargets = new Set(targetNodes);
  const normalized: ConnectionMap = {};

  Object.entries(map).forEach(([source, target]) => {
    if (allowedSources.has(source) && allowedTargets.has(target)) {
      normalized[source] = target;
    }
  });

  return normalized;
}

export function connectionMapToEdges(map: ConnectionMap): Edge[] {
  return Object.entries(map).map(([source, target]) => ({
    id: `${source}->${target}`,
    source: "sensor",
    target: "arduino",
    sourceHandle: sourceHandleId(source),
    targetHandle: targetHandleId(target),
    animated: true,
    style: { strokeWidth: 3 },
  }));
}

export function edgesToConnectionMap(edges: Edge[]): ConnectionMap {
  const map: ConnectionMap = {};
  edges.forEach((edge) => {
    const sourcePin = decodeSourceHandleId(edge.sourceHandle);
    const targetPin = decodeTargetHandleId(edge.targetHandle);
    if (sourcePin && targetPin) {
      map[sourcePin] = targetPin;
    }
  });
  return map;
}
