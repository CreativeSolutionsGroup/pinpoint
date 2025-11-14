"use client";

import { NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useContext, useState } from "react";
import { useParams } from "next/navigation";
import { ActiveNodeContext } from "./IconNode";
import DrawingSettings from "./DrawingSettings";

export interface TextAnnotationData {
  label: string;
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  backgroundColor?: string;
  notes?: string;
  rotation: number;
}

export const TextAnnotationNode = memo(function TextAnnotationNode({
  data,
  id,
  selected,
}: NodeProps<{ data: TextAnnotationData }>) {
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

  const handleBackgroundColorChange = useCallback(
    (backgroundColor: string) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, backgroundColor } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleFontSizeChange = useCallback(
    (fontSize: number) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, fontSize } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleFontWeightChange = useCallback(
    (fontWeight: "normal" | "bold") => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, fontWeight } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, text: newValue } }
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
  const fontSize = data.fontSize || 16;
  const fontWeight = data.fontWeight || "normal";
  const backgroundColor = data.backgroundColor || "transparent";

  return (
    <>
      <div
        className="cursor-move px-3 py-2 rounded min-w-[100px] max-w-[300px]"
        onClick={() => isEditable && setIsOpen(true)}
        style={{
          transform: `rotate(${data.rotation}deg)`,
          color: color,
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          backgroundColor: backgroundColor,
          border: selected
            ? "2px dashed #3b82f6"
            : backgroundColor === "transparent"
            ? "none"
            : undefined,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.text || "Click to edit text"}
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
          type="text"
          handleLabelChange={handleLabelChange}
          handleNotesChange={handleNotesChange}
          handleTextChange={handleTextChange}
          handleColorChange={handleColorChange}
          handleBackgroundColorChange={handleBackgroundColorChange}
          handleFontSizeChange={handleFontSizeChange}
          handleFontWeightChange={handleFontWeightChange}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
});
