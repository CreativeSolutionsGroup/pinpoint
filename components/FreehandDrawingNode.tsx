"use client";

import { NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useContext, useState } from "react";
import { useParams } from "next/navigation";
import { ActiveNodeContext } from "./IconNode";
import DrawingSettings from "./DrawingSettings";

export interface FreehandDrawingData {
  label: string;
  path: string; // SVG path data
  color?: string;
  strokeWidth?: number;
  notes?: string;
  rotation: number;
}

export const FreehandDrawingNode = memo(function FreehandDrawingNode({
  data,
  id,
  selected,
}: NodeProps<{ data: FreehandDrawingData }>) {
  const { deleteElements, setNodes } = useReactFlow();
  const { activeNodeId, setActiveNodeId } = useContext(ActiveNodeContext);
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams<{ mode: string }>();
  const isEditable = params.mode === "edit";

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [deleteElements, id]);

  const handleColorChange = useCallback(
    (color: string) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, color } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleStrokeWidthChange = useCallback(
    (strokeWidth: number) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, strokeWidth } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: newValue } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, notes: newValue } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const color = data.color || "#000000";
  const strokeWidth = data.strokeWidth || 2;

  // Calculate bounding box from path data
  const pathPoints = data.path.match(/[\d.]+/g)?.map(Number) || [];
  const xCoords: number[] = [];
  const yCoords: number[] = [];

  for (let i = 0; i < pathPoints.length; i += 2) {
    if (pathPoints[i] !== undefined) xCoords.push(pathPoints[i]);
    if (pathPoints[i + 1] !== undefined) yCoords.push(pathPoints[i + 1]);
  }

  const minX = Math.min(...xCoords, 0);
  const maxX = Math.max(...xCoords, 100);
  const minY = Math.min(...yCoords, 0);
  const maxY = Math.max(...yCoords, 100);

  const width = maxX - minX + strokeWidth * 2;
  const height = maxY - minY + strokeWidth * 2;
  const viewBoxWidth = maxX - minX;
  const viewBoxHeight = maxY - minY;

  return (
    <>
      <div
        className="cursor-move"
        onClick={() => isEditable && setIsOpen(true)}
        style={{
          transform: `rotate(${data.rotation}deg)`,
          border: selected ? "2px dashed #3b82f6" : "2px dashed transparent",
          padding: "2px",
          borderRadius: "4px",
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`}
          style={{ overflow: "visible" }}
        >
          <path
            d={data.path}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {isEditable && (
        <DrawingSettings
          isOpen={isOpen}
          setIsOpen={(open: boolean) => {
            setIsOpen(open);
            if (open) {
              setActiveNodeId(id);
            } else if (activeNodeId === id) {
              setActiveNodeId(null);
            }
          }}
          id={id}
          data={data}
          type="freehand"
          handleLabelChange={handleLabelChange}
          handleNotesChange={handleNotesChange}
          handleColorChange={handleColorChange}
          handleStrokeWidthChange={handleStrokeWidthChange}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
});
