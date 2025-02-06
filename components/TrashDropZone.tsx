import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

const TrashDropZone = () => {
  const [isOver, setIsOver] = useState(false);
  const { setNodes, getNode } = useReactFlow();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData("application/reactflow");
    if (nodeId) {
      // Check if it's a valid node
      const node = getNode(nodeId);
      if (node) {
        // Remove the node from the nodes array
        setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
      }
    }
    setIsOver(false);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 p-4 rounded-full 
        ${isOver ? "bg-red-100" : "bg-gray-100"} 
        transition-colors duration-200 z-50`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Trash2
        size={32}
        className={`${isOver ? "text-red-500" : "text-gray-500"} 
          transition-colors duration-200`}
      />
    </div>
  );
};

export default TrashDropZone;
