"use client";

import {
  ReactFlow,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
} from "@xyflow/react";
import Legend from "@/components/Legend";
import IconNode from "@components/IconNode";
import "@xyflow/react/dist/style.css";
import { useState, useCallback, useEffect } from "react";
import { Event } from "@prisma/client";

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

// Define node types
const nodeTypes = {
  iconNode: IconNode,
};

type Node = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    iconName: string;
  };
  draggable: boolean;
  deletable: boolean;
  selected: boolean;
};

function Flow({ event }: { event: Event }) {
  console.log(event);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);

  const { screenToFlowPosition } = useReactFlow();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Copy
      if (event.key === "c" && (event.ctrlKey || event.metaKey)) {
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length === 0) return;

        try {
          await navigator.clipboard.writeText(JSON.stringify(selectedNodes));
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      }

      // Paste
      if (event.key === "v" && (event.ctrlKey || event.metaKey)) {
        try {
          const clipText = await navigator.clipboard.readText();
          const pastedNodes = JSON.parse(clipText);

          if (!Array.isArray(pastedNodes)) return;

          const position = screenToFlowPosition({
            x: mousePosition.x,
            y: mousePosition.y,
          });

          // Calculate offset from first node to paste position
          const firstNode = pastedNodes[0];
          const xOffset = position.x - firstNode.position.x;
          const yOffset = position.y - firstNode.position.y;

          const newNodes = pastedNodes.map((node) => ({
            ...node,
            id: getId(),
            selected: false,
            position: {
              x: node.position.x + xOffset,
              y: node.position.y + yOffset,
            },
          }));

          setNodes((nds) => [...nds, ...newNodes]);
        } catch (err) {
          console.error("Failed to paste:", err);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, mousePosition, screenToFlowPosition, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const jsonData = event.dataTransfer.getData("application/reactflow");

      if (!jsonData) {
        return;
      }

      const { type, iconName, label } = JSON.parse(jsonData);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: {
          label,
          iconName,
        },
        draggable: true,
        deletable: true,
        selected: false,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        className="touch-none"
      >
        <Controls position="bottom-right" />
        <MiniMap position="bottom-left" pannable zoomable />
        <Legend />
      </ReactFlow>
    </div>
  );
}

export default function EventFlow({ event }: { event: Event }) {
  return (
    <ReactFlowProvider>
      <Flow event={event} />
    </ReactFlowProvider>
  );
}
