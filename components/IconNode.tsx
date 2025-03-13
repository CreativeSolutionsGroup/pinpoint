"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CustomNode } from "@/types/CustomNode";
import ColorMenu from "@components/ColorMenu";
import { Box, Button } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import * as Icons from "lucide-react";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import ResizeMenu from "./ResizeMenu";

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

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <IconComponent
            style={{
              color: data.color,
              width: `${data.size ?? 2}rem`,
              height: `${data.size ?? 2}rem`,
            }}
            className="text-gray-700"
          />
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="grid gap-4">
            Notes:
            <Textarea
              defaultValue={data.notes}
              onBlur={handleNotesChange}
              disabled={!isEditable}
            />
            {isEditable && <Box className="flex place-content-between">
              <ResizeMenu
                onResize={handleResize}
                currentSize={data.size ?? 2}
              />
              <Button onClick={handleDelete} color="warning">
                Delete
              </Button>
            </Box>}
            {isEditable && <ColorMenu x={0} y={0} changeColor={colorChange} />}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
