"use client";

import { NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useContext, useState } from "react";
import { useParams } from "next/navigation";
import { ActiveNodeContext } from "./IconNode";
import DrawingSettings from "./DrawingSettings";

export interface ShapeData {
  label: string;
  shapeType: "rectangle" | "circle" | "arrow";
  color?: string;
  strokeWidth?: number;
  fillColor?: string;
  filled?: boolean;
  width?: number;
  height?: number;
  notes?: string;
  rotation: number;
}

export const ShapeNode = memo(function ShapeNode({
  data,
  id,
}: NodeProps<{ data: ShapeData }>) {
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

  const handleFillColorChange = useCallback(
    (fillColor: string) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, fillColor } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleFilledChange = useCallback(
    (filled: boolean) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, filled } }
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
  const fillColor = data.fillColor || "transparent";
  const filled = data.filled || false;
  const width = data.width || 100;
  const height = data.height || 100;

  const renderShape = () => {
    switch (data.shapeType) {
      case "rectangle":
        return (
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            stroke={color}
            strokeWidth={strokeWidth}
            fill={filled ? fillColor : "transparent"}
            rx="4"
          />
        );
      case "circle":
        return (
          <circle
            cx={width / 2}
            cy={height / 2}
            r={Math.min(width, height) / 2}
            stroke={color}
            strokeWidth={strokeWidth}
            fill={filled ? fillColor : "transparent"}
          />
        );
      case "arrow":
        return (
          <g>
            <line
              x1="10"
              y1={height / 2}
              x2={width - 10}
              y2={height / 2}
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <polygon
              points={`${width - 10},${height / 2 - 10} ${width},${height / 2} ${width - 10},${height / 2 + 10}`}
              fill={color}
            />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="cursor-move"
        onClick={() => isEditable && setIsOpen(true)}
        style={{ transform: `rotate(${data.rotation}deg)` }}
      >
        <svg
          width={width}
          height={height}
          style={{ overflow: "visible" }}
        >
          {renderShape()}
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
          type="shape"
          handleLabelChange={handleLabelChange}
          handleNotesChange={handleNotesChange}
          handleColorChange={handleColorChange}
          handleFillColorChange={handleFillColorChange}
          handleFilledChange={handleFilledChange}
          handleStrokeWidthChange={handleStrokeWidthChange}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
});
