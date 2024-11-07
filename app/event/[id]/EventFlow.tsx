"use client";
import { CustomImageNode, CustomNode } from "@components/CustomImageNode";
import IconNode from "@components/IconNode";
import Legend from "@components/Legend";
import {
  applyNodeChanges,
  Controls,
  MiniMap,
  NodeChange,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

// Define node types
const nodeTypes = {
  iconNode: IconNode,
  customImageNode: CustomImageNode,
};

const initialNodes: CustomNode[] = [
  {
    id: "map",
    type: "customImageNode",
    data: { label: "map" },
    position: { x: 0, y: 0, z: -1 },
    draggable: true,
  },
];

function Flow({ event }) {
  const [nodes, setNodes] = useState(initialNodes);
  // const [nodes, setNodes] = useNodesState([]);

  const { screenToFlowPosition } = useReactFlow();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as CustomNode[]),
    [setNodes]
  );

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (event) => {
      // Copy
      if (event.key === "c" && (event.ctrlKey || event.metaKey)) {
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length === 0) return;

        try {
          const nodesToCopy = selectedNodes.map(
            ({ id, selected, ...rest }) => rest
          );
          await navigator.clipboard.writeText(JSON.stringify(nodesToCopy));
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

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const jsonData = event.dataTransfer.getData("application/reactflow");

      if (!jsonData) {
        return;
      }

      const { iconName, label } = JSON.parse(jsonData);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: "iconNode",
        position,
        data: {
          label,
          iconName,
        },
        draggable: true,
        deletable: true,
        parentId: "map",
        extent: "parent",
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition]
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
        nodeTypes={nodeTypes}
        fitView={true}
        className="touch-none"
      >
        <Controls position="bottom-right" />
        <MiniMap position="bottom-left" pannable zoomable />
        <Legend />
      </ReactFlow>
    </div>
  );
}

// export default function ClientEventFlow() {
//   //const [nodes, setNodes] = useState(initialNodes);

//   // const onNodesChange = useCallback(
//   //   (changes: NodeChange[]) =>
//   //     setNodes((nds) => applyNodeChanges(changes, nds) as CustomNode[]),
//   //   [setNodes]
//   // );

//   // const nodeTypes = useMemo(
//   //   () => ({
//   //     customImageNode: CustomImageNode,
//   //   }),
//   //   []
//   // );

//   return (
//     <div
//       style={{
//         width: "100vw",
//         height: "100vh",
//       }}
//     >
//       <ReactFlow
//         nodeTypes={nodeTypes}
//         nodes={nodes}
//         onNodesChange={onNodesChange}
//         zoomOnScroll={false}
//         panOnScroll={false}
//         panOnDrag={true}
//         fitView={true}
//       >
//         {/* <Controls position="bottom-right" />
//         <MiniMap position="bottom-left" pannable zoomable />
//         <Legend /> */}
//       </ReactFlow>
//     </div>
//   );
// }

export default function EventFlow({ event }) {
  return (
    <ReactFlowProvider>
      <Flow event={event} />
    </ReactFlowProvider>
  );
}
