'use client';

import { Controls, MiniMap, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, NodeChange, EdgeChange, Connection, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Image from "next/image";
import { useMemo, useCallback, useState} from "react";
import Legend from "@components/Legend";
import { useEffect } from "react";
import { BorderAllSharp } from "@mui/icons-material";


const imageURL = "/horizontalCampus.png";

const CustomImageNode = () => {
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

  useEffect(() => {
    const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img: HTMLImageElement = document.createElement('img');
        
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        
        img.onerror = (error) => {
          reject(new Error(`Failed to load image: ${error}`));
        };
        
        img.src = src;
      });
    };

    getImageDimensions(imageURL)
      .then(dims => {
        setDimensions(dims);
      })
      .catch(error => console.error('Error loading image dimensions:', error));
  }, []);

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <Image
        src={imageURL}
        alt="Map Image"
        fill
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
};

const initialNodes = [
  { 
    id: "map", 
    type: "customImageNode", 
    data: { label: "Map" }, 
    position: { x: 0, y: 0 }, 
    draggable: true,
  },
  { id: "1", position: { x: 100, y: 50 }, data: { label: "1" }, draggable: true, parentId: "map" },
  { id: "2", position: { x: 100, y: 100 }, data: { label: "2" }, draggable: true, parentId: "map" },
];

const initialEdges = [
  { id: "e1-2", source: "map", target: "1" },
  { id: "e2-3", source: "map", target: "2"},
];

export default function ClientEventFlow() {

// const [nodes, setNodes] = useState(initialNodes); 
// const [edges, setEdges] = useState(initialEdges);

// const onNodesChange = useCallback(
//     (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
//     [setNodes],
// );
// const onEdgesChange = useCallback(
//     (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//     [setEdges],
// );
// const onConnect = useCallback(
//     (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
//     [setEdges],
// );
  const nodeTypes = useMemo(() => ({
    customImageNode: CustomImageNode,
  }), []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={initialNodes}
        edges={initialEdges}
        // onConnect={onConnect}
        // onEdgesChange={onEdgesChange}
        // onNodesChange={onNodesChange}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={true}
        fitView={true}
      >
        <Controls position="bottom-right"/>
        <MiniMap position="bottom-left" pannable zoomable/>
        <Legend />
      </ReactFlow>
    </div>
  );
}
