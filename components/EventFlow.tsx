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

  const { screenToFlowPosition } = useReactFlow();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    CustomNode,
    Edge
  > | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as CustomNode[]),
    [setNodes]
  );

  //history management
  // const [undoStack, setUndoStack] = useState<string[]>([]);
  // const [redoStack, setRedoStack] = useState<string[]>([]);

  // const onUndo = useCallback(() => {
  //   if (undoStack.length === 0) return;
    
  //   //save current state to redo stack
  //   const currentState = JSON.stringify(rfInstance?.toObject());
  //   if (currentState) {
  //     setRedoStack((stack) => [...stack, currentState])
  //   }

  //   //pop state from undo stack and restore it
  //   const previousState = undoStack[undoStack.length - 1];
  //   setUndoStack((stack) => stack.slice(0, -1));

  //   if (previousState) {
  //     const { nodes: prevNodes } = JSON.parse(previousState);
  //     setNodes(prevNodes || []);
  //   }
  // }, [undoStack, setNodes, rfInstance]);

  // // Redo function
  // const onRedo = useCallback(() => {
  //   if (redoStack.length === 0) return;

  //   // Save current state to undo stack
  //   const currentState = JSON.stringify(rfInstance?.toObject());
  //   if (currentState) {
  //     setUndoStack((stack) => [...stack, currentState]);
  //   }

  //   // Pop state from redo stack and restore it
  //   const nextState = redoStack[redoStack.length - 1];
  //   setRedoStack((stack) => stack.slice(0, -1));

  //   // Restore the next state
  //   if (nextState) {
  //     const { nodes: nextNodes } = JSON.parse(nextState);
  //     setNodes(nextNodes || []);
  //   }
  // }, [redoStack, setNodes, rfInstance]);

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
        },
        draggable: true,
        deletable: true,
        selected: false,
        parentId: "map",
        extent: "parent",
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
