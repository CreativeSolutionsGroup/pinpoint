"use client";
import { CustomImageNode } from "@components/CustomImageNode";
import IconNode from "@components/IconNode";
import Legend from "@components/Legend";
import {
  applyNodeChanges,
  Controls,
  Edge,
  MiniMap,
  NodeChange,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import { Event } from "@prisma/client";
import { CustomNode } from "@/types/CustomNode";
import NavButtons from "./navButtons";
import { Button } from "@mui/material";
import SaveState from "@/lib/api/save/ReactFlowSave";
import { createId } from "@paralleldrive/cuid2";
import ColorMenu from "./ColorMenu"; 

const getId = () => createId();

// Define node types
const nodeTypes = {
  iconNode: IconNode,
  customImageNode: CustomImageNode,
};

const initialNode: CustomNode = {
  id: "map",
  type: "customImageNode",
  data: { label: "map" },
  position: { x: 0, y: 0, z: -1 },
  draggable: false,
  deletable: false,
};

function Flow({ event }: { event: Event }) {
  // console.log(event);

  const [nodes, setNodes] = useState<CustomNode[]>(
    JSON.parse(event.state ? event.state : "{}")?.nodes || [initialNode]
  );

  const [menuVisible, setMenuVisible] = useState(false);

  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null); // tracking most recent icon

  const { screenToFlowPosition } = useReactFlow();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    CustomNode,
    Edge
  > | null>(null);

  const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as CustomNode[]),
    [setNodes]
  );

  // Color the most recently placed icon, if it hasn't been colored yet
  function changeColor(colorSelected: string) {
    if (!currentNodeId) return;

    setNodes((nds) => 
      nds.map((node) => 
        node.id === currentNodeId 
          ? { ...node, data: { ...node.data, color: colorSelected }} 
          : node
      )
    );
    setMenuVisible(false);
    setCurrentNodeId(null);
  }

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

      const newNode: CustomNode = {
        id: getId(),
        type,
        position,
        data: {
          label,
          iconName,
          color: "white",
        },
        draggable: true,
        deletable: true,
        selected: false,
        parentId: "map",
        extent: "parent",
      };

      setNodes((nds) => [...nds, newNode]);

      // prepare to color the new icon
      setCurrentNodeId(newNode.id); // Track new node ID
      setMenuVisible(true);

      setDropPosition({ x: event.clientX, y: event.clientY });
    }, [screenToFlowPosition, setNodes]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        zoomOnScroll={false}
        panOnScroll={false}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        className="touch-none"
      >
        <Controls position="bottom-right" />
        <MiniMap position="bottom-left" pannable zoomable />
        <Legend />
        <NavButtons />
        
      </ReactFlow>
      <Button
        onClick={() =>
          rfInstance &&
          SaveState(event.id, JSON.stringify(rfInstance.toObject()))
        }
        style={{ position: "fixed", top: "4rem", right: 16 }}
        variant="contained"
      >
        Save
      </Button>

      {menuVisible ? <ColorMenu x={dropPosition.x} y={dropPosition.y} changeColor={changeColor} /> : null }
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
