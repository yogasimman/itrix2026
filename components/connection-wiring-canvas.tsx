"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  Background,
  Controls,
  type Connection,
  type Edge,
  type EdgeChange,
  type IsValidConnection,
  Handle,
  MarkerType,
  MiniMap,
  type Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ConnectionMap,
  decodeSourceHandleId,
  decodeTargetHandleId,
  normalizeConnectionMap,
  parseConnectionAnswer,
  sourceHandleId,
  targetHandleId,
} from "@/lib/connection-wiring";

interface ConnectionWiringCanvasProps {
  sourceNodes: string[];
  targetNodes: string[];
  currentAnswer?: string | string[];
  readOnly?: boolean;
  onAnswerChange: (answerJson: string) => void;
}

interface ModuleNodeData extends Record<string, unknown> {
  moduleKey: string;
  label: string;
  pins: string[];
  readOnly: boolean;
}

interface ArduinoNodeData extends Record<string, unknown> {
  pins: string[];
  readOnly: boolean;
}

type WiringNodeData = ModuleNodeData | ArduinoNodeData;

interface ModuleLayout {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const MODULE_LAYOUT: Record<string, ModuleLayout> = {
  pir: { label: "PIR Sensor", x: 80, y: 88, width: 260, height: 180 },
  buzzer: { label: "Buzzer", x: 88, y: 328, width: 220, height: 150 },
  led: { label: "LED", x: 380, y: 96, width: 190, height: 160 },
  servo: { label: "Servo", x: 340, y: 312, width: 260, height: 170 },
};

const ARDUINO_NODE_ID = "arduino-board";

const MODULE_RENDER_ORDER = ["pir", "buzzer", "led", "servo"];

const ARDUINO_BOARD_PIN_POS: Record<string, { x: number; y: number; side: "left" | "right" }> = {
  "arduino.d2": { x: 392, y: 76, side: "right" },
  "arduino.d7": { x: 392, y: 108, side: "right" },
  "arduino.d8": { x: 392, y: 124, side: "right" },
  "arduino.d9": { x: 392, y: 140, side: "right" },
  "arduino.5v": { x: 40, y: 214, side: "left" },
  "arduino.gnd": { x: 40, y: 230, side: "left" },
};

const colorByPin = (pin: string) => {
  const lower = pin.toLowerCase();
  if (lower.includes("gnd") || lower.includes("cathode")) return "#1f2937";
  if (lower.includes("5v") || lower.includes("vcc")) return "#dc2626";
  if (lower.includes("signal") || lower.includes("out") || lower.includes("anode")) return "#2563eb";
  return "#16a34a";
};

const HANDLE_BASE_STYLE = {
  width: 16,
  height: 16,
  border: "2px solid #cbd5e1",
  boxShadow: "0 0 0 1px rgba(15, 23, 42, 0.52)",
};

function moduleFromPin(pin: string): string {
  return pin.includes(".") ? pin.split(".")[0] : "module";
}

function toTitleCase(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function pinLabel(pin: string): string {
  return pin.includes(".") ? toTitleCase(pin.split(".")[1]) : toTitleCase(pin);
}

function groupByModule(sourceNodes: string[]): Map<string, string[]> {
  const grouped = new Map<string, string[]>();
  sourceNodes.forEach((node) => {
    const moduleKey = moduleFromPin(node);
    if (!grouped.has(moduleKey)) grouped.set(moduleKey, []);
    grouped.get(moduleKey)!.push(node);
  });
  return grouped;
}

function buildCanvasNodes(sourceNodes: string[], targetNodes: string[], readOnly: boolean): Array<Node<WiringNodeData>> {
  const grouped = groupByModule(sourceNodes);
  const nodes: Array<Node<WiringNodeData>> = [];
  let fallbackIndex = 0;

  const moduleKeys = Array.from(grouped.keys()).sort((a, b) => {
    const ai = MODULE_RENDER_ORDER.indexOf(a);
    const bi = MODULE_RENDER_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  moduleKeys.forEach((moduleKey) => {
    const known = MODULE_LAYOUT[moduleKey];
    const pins = grouped.get(moduleKey) || [];

    nodes.push({
      id: moduleKey,
      type: "moduleNode",
      position: known
        ? { x: known.x, y: known.y }
        : { x: 80 + (fallbackIndex % 2) * 290, y: 530 + Math.floor(fallbackIndex / 2) * 150 },
      draggable: !readOnly,
      data: {
        moduleKey,
        label: known?.label || toTitleCase(moduleKey),
        pins,
        readOnly,
      },
    });
    fallbackIndex += 1;
  });

  nodes.push({
    id: ARDUINO_NODE_ID,
    type: "arduinoNode",
    position: { x: 760, y: 80 },
    draggable: !readOnly,
    data: {
      pins: targetNodes,
      readOnly,
    },
  });

  return nodes;
}

function mapToEdges(map: ConnectionMap): Edge[] {
  return Object.entries(map).map(([sourcePin, targetPin]) => ({
    id: `${sourcePin}->${targetPin}`,
    source: moduleFromPin(sourcePin),
    target: ARDUINO_NODE_ID,
    sourceHandle: sourceHandleId(sourcePin),
    targetHandle: targetHandleId(targetPin),
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 18,
      height: 18,
      color: colorByPin(sourcePin),
    },
    style: {
      strokeWidth: 3,
      stroke: colorByPin(sourcePin),
    },
  }));
}

function buildMapFromEdges(edges: Edge[]): ConnectionMap {
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

const ModuleNode = memo(({ data }: { data: ModuleNodeData }) => {
  const { moduleKey, label, pins, readOnly } = data;
  const lower = moduleKey.toLowerCase();
  const baseHeight = Math.max(200, 130 + pins.length * 32);

  return (
    <div className="relative rounded-2xl border border-cyan-200/25 bg-slate-950/88 p-3 shadow-lg shadow-cyan-950/20" style={{ width: 270, height: baseHeight }}>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-100/85">{label}</div>
      <div className="rounded-lg border border-white/15 bg-slate-100 p-2">
        {lower === "pir" && <wokwi-pir-motion-sensor style={{ width: "190px", height: "78px" }} />}
        {lower === "buzzer" && <wokwi-buzzer style={{ width: "120px", height: "70px" }} />}
        {lower === "led" && <wokwi-led style={{ width: "90px", height: "64px" }} />}
        {lower === "servo" && <wokwi-servo style={{ width: "170px", height: "84px" }} />}
        {!MODULE_LAYOUT[lower] && <div className="text-xs text-muted-foreground">Custom module</div>}
      </div>

      {pins.map((pin, index) => {
        const top = 122 + index * 30;
        return (
          <div key={pin} className="absolute right-2 flex items-center gap-2" style={{ top }}>
            <span className="rounded-full border border-cyan-200/35 bg-slate-900 px-2 py-[2px] text-[10px] font-semibold text-cyan-100">
              {pinLabel(pin)}
            </span>
            <Handle
              type="source"
              id={sourceHandleId(pin)}
              position={Position.Right}
              isConnectable={!readOnly}
              style={{
                ...HANDLE_BASE_STYLE,
                background: colorByPin(pin),
                top: 7,
              }}
            />
          </div>
        );
      })}
    </div>
  );
});

ModuleNode.displayName = "ModuleNode";

const ArduinoNode = memo(({ data }: { data: ArduinoNodeData }) => {
  const { pins, readOnly } = data;

  const boardPins = pins
    .filter((pin) => ARDUINO_BOARD_PIN_POS[pin.toLowerCase()])
    .map((pin) => ({ pin, ...ARDUINO_BOARD_PIN_POS[pin.toLowerCase()] }));

  const overflowPins = pins.filter((pin) => !ARDUINO_BOARD_PIN_POS[pin.toLowerCase()]);

  return (
    <div className="relative rounded-2xl border border-cyan-200/25 bg-slate-950/88 p-3 shadow-lg shadow-cyan-950/20" style={{ width: 480, height: 500 }}>
      <div className="text-sm font-semibold text-cyan-50">Wokwi Arduino Uno</div>
      <div className="mb-2 text-xs text-cyan-100/70">Drag from module pin and drop directly on Arduino board pin hotspots.</div>
      <div className="relative rounded-lg border border-white/15 bg-[#d9e8f4] p-2" style={{ width: 448, height: 310 }}>
        <wokwi-arduino-uno style={{ width: "430px", height: "290px" }} />

        {boardPins.map(({ pin, x, y, side }) => (
          <div
            key={pin}
            className="absolute"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
            title={pin}
          >
            <Handle
              type="target"
              id={targetHandleId(pin)}
              position={side === "left" ? Position.Left : Position.Right}
              isConnectable={!readOnly}
              style={{
                ...HANDLE_BASE_STYLE,
                background: colorByPin(pin),
                left: side === "left" ? -8 : 8,
                top: 8,
              }}
            />
            <span
              className="absolute whitespace-nowrap rounded-sm bg-slate-900/90 px-1 text-[9px] font-semibold text-cyan-100"
              style={{ top: -14, left: side === "left" ? 10 : -24 }}
            >
              {pinLabel(pin)}
            </span>
          </div>
        ))}
      </div>

      {overflowPins.length > 0 ? (
        <div className="mt-3 rounded-lg border border-white/15 bg-slate-900/45 p-2">
          <div className="text-[11px] font-medium text-cyan-100/80">Additional pins</div>
          <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-cyan-100/75">
            {overflowPins.map((pin) => (
              <span key={pin} className="rounded border border-cyan-200/25 bg-slate-950 px-1 py-[1px]">{pin}</span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
});

ArduinoNode.displayName = "ArduinoNode";

const nodeTypes = {
  moduleNode: ModuleNode,
  arduinoNode: ArduinoNode,
};

export function ConnectionWiringCanvas({
  sourceNodes,
  targetNodes,
  currentAnswer,
  readOnly = false,
  onAnswerChange,
}: ConnectionWiringCanvasProps) {
  const [connectionMap, setConnectionMap] = useState<ConnectionMap>({});
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WiringNodeData>>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);

  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    void import("@wokwi/elements");
  }, []);

  useEffect(() => {
    setNodes(buildCanvasNodes(sourceNodes, targetNodes, readOnly));
  }, [readOnly, setNodes, sourceNodes, targetNodes]);

  useEffect(() => {
    const parsed = parseConnectionAnswer(currentAnswer);
    const normalized = normalizeConnectionMap(parsed, sourceNodes, targetNodes);
    setConnectionMap(normalized);
    setEdges(mapToEdges(normalized));
  }, [currentAnswer, setEdges, sourceNodes, targetNodes]);

  const emitAnswer = useCallback(
    (map: ConnectionMap) => {
      const normalized = normalizeConnectionMap(map, sourceNodes, targetNodes);
      onAnswerChange(JSON.stringify(normalized));
      setConnectionMap(normalized);
    },
    [onAnswerChange, sourceNodes, targetNodes]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (readOnly) return;
      const sourcePin = decodeSourceHandleId(connection.sourceHandle);
      const targetPin = decodeTargetHandleId(connection.targetHandle);
      if (!sourcePin || !targetPin) return;

      setEdges((currentEdges) => {
        const filtered = currentEdges.filter((edge) => {
          const existingSource = decodeSourceHandleId(edge.sourceHandle);
          const existingTarget = decodeTargetHandleId(edge.targetHandle);
          return existingSource !== sourcePin && existingTarget !== targetPin;
        });

        const next = addEdge(
          {
            ...connection,
            id: `${sourcePin}->${targetPin}`,
            type: "smoothstep",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 18,
              height: 18,
              color: colorByPin(sourcePin),
            },
            style: {
              strokeWidth: 3,
              stroke: colorByPin(sourcePin),
            },
          },
          filtered
        );

        emitAnswer(buildMapFromEdges(next));
        return next;
      });
    },
    [emitAnswer, readOnly, setEdges]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      if (readOnly) return;
      setEdges((currentEdges) => {
        const nextEdges = applyEdgeChanges(changes, currentEdges);
        emitAnswer(buildMapFromEdges(nextEdges));
        return nextEdges;
      });
    },
    [emitAnswer, readOnly, setEdges]
  );

  const isValidConnection = useCallback<IsValidConnection>(
    (connection) => {
      const sourcePin = decodeSourceHandleId(connection.sourceHandle);
      const targetPin = decodeTargetHandleId(connection.targetHandle);
      if (!sourcePin || !targetPin) return false;
      return sourceNodes.includes(sourcePin) && targetNodes.includes(targetPin);
    },
    [sourceNodes, targetNodes]
  );

  const connectionCount = useMemo(() => Object.keys(connectionMap).length, [connectionMap]);

  if (!isBrowser) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-cyan-200/20 bg-slate-950/45 p-4">
          <div className="text-sm font-semibold text-cyan-50">Wokwi Components + Arduino Canvas</div>
          <div className="text-xs text-cyan-100/70">Interactive drag-wiring view loads in browser runtime.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-cyan-200/20 bg-slate-950/45 p-2">
        <div className="h-[700px] w-full overflow-hidden rounded-lg border border-cyan-200/20 bg-[radial-gradient(circle_at_20%_15%,rgba(62,232,214,0.12),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(16,181,255,0.12),transparent_38%),linear-gradient(165deg,#071120,#0b1828)]" aria-label="wiring-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            isValidConnection={isValidConnection}
            fitView
            fitViewOptions={{ padding: 0.18 }}
            connectionRadius={30}
            connectOnClick={false}
            nodesDraggable={!readOnly}
            nodesConnectable={!readOnly}
            elementsSelectable={!readOnly}
            deleteKeyCode={readOnly ? null : ["Backspace", "Delete"]}
            proOptions={{ hideAttribution: true }}
          >
            <MiniMap pannable zoomable nodeColor="#1e293b" maskColor="rgba(8, 20, 34, 0.55)" />
            <Controls showInteractive={!readOnly} />
            <Background gap={20} size={1} color="#3f5f77" />
          </ReactFlow>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-cyan-100/70">
        <div>
          Wokwi-style canvas: drag components if needed, then drag wire from a module pin to an Arduino pin.
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={readOnly || connectionCount === 0}
          onClick={() => {
            setConnectionMap({});
            setEdges([]);
            onAnswerChange(JSON.stringify({}));
          }}
        >
          Clear Wires
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px]">
        <Badge variant="secondary" className="bg-cyan-300/20 text-cyan-100">Module Pins</Badge>
        <Badge variant="outline" className="border-cyan-200/30 text-cyan-100">Arduino Uno Pins</Badge>
        <Badge variant="outline" className="border-cyan-200/30 text-cyan-100">Connections: {connectionCount}</Badge>
      </div>
    </div>
  );
}
