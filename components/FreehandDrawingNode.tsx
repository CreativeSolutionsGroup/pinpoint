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

  return (
    <>
      <div
        className="cursor-move"
        onClick={() => isEditable && setIsOpen(true)}
        style={{ transform: `rotate(${data.rotation}deg)` }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
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
        {data.label && (
          <div
            className="text-xs mt-1 text-center"
            style={{ color: color }}
          >
            {data.label}
          </div>
        )}
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
