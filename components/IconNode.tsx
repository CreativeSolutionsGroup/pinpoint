"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CustomNode } from "@/types/CustomNode";
import ColorMenu from "@components/ColorMenu";
import { Box, Button, Typography } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import * as Icons from "lucide-react";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import ResizeMenu from "./ResizeMenu";
import { Trash2 } from "lucide-react";

export function IconNode({ data, id }: NodeProps<CustomNode>) {
  const { deleteElements, setNodes } = useReactFlow();

  const params = useParams<{ mode: string }>();

  const isEditable = params.mode == "edit";

  // Get the icon component from the Lucide icons
  const IconComponent = Icons[data.iconName as keyof typeof Icons.icons];

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const colorChange = useCallback(
    (colorSelected: string) => {
      // Update the node data and trigger a re-render
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                color: colorSelected,
              },
            };
          }
          return node;
        })
      );
    },
    [id, setNodes]
  );

  const handleResize = useCallback(
    (selectedSize: number) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                size: selectedSize,
              },
            };
          }
          return node;
        })
      );
    },

    [id, setNodes]
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                notes: newValue,
              },
            };
          }
          return node;
        })
      );
    },
    [id, setNodes]
  );

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newValue,
              },
            };
          }
          return node;
        })
      );
    },
    [id, setNodes]
  );
  return (
    <>
      <Popover>
        <PopoverTrigger
          style={{ borderColor: data.color }}
          className="flex flex-col items-center justify-center cursor-move"
        >
          <IconComponent
            style={{
              color: data.color,
              width: `${data.size ?? 3}rem`,
              height: `${data.size ?? 3}rem`,
            }}
            className="text-gray-700"
          />
          <Typography
            style={{
              color: data.color,
              width: "100%",
              fontSize: `${(data.size ?? 3) / 3}rem`,
              lineHeight: `${(data.size ?? 3) / 3}rem`,
              textWrap: "wrap",
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              maxWidth: `${(data.size ?? 3) * 3}rem`,
            }}
            className="text-center text-wrap"
          >
            {data.label}
          </Typography>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="grid gap-4">
            {isEditable && (
              <div className="justify-center">
                <Input placeholder={data.label} onChange={handleLabelChange} />
              </div>
            )}
            <Textarea
              placeholder="Add notes"
              defaultValue={data.notes}
              onBlur={handleNotesChange}
              disabled={!isEditable}
            />
            {isEditable && (
              <Box className="flex place-content-between">
                <ResizeMenu
                  onResize={handleResize}
                  currentSize={data.size ?? 2}
                />
                <Button onClick={handleDelete} sx={{ color: "red" }}>
                  <Trash2 />
                </Button>
              </Box>
            )}
            {isEditable && <ColorMenu x={0} y={0} currentColor={data.color ?? "#000000"} changeColor={colorChange} />}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
