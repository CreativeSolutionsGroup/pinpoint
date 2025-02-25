"use client";

import * as Icons from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { CustomNode } from "@/types/CustomNode";
import ColorMenu from "./ColorMenu";
import { useCallback } from "react";

export function IconNode({ data, id }: NodeProps<CustomNode>) {
  const { deleteElements, setNodes } = useReactFlow();
  // Get the icon component from the Lucide icons
  const IconComponent = Icons[data.iconName as keyof typeof Icons.icons];

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const colorChange = useCallback((colorSelected: string) => {
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
  }, [id, setNodes]);

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <IconComponent
            style={{ color: data.color }}
            className="w-6 h-6 text-gray-700"
          />
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="grid gap-4">
            Place content for the popover here.
            <Button onClick={handleDelete} color="warning">
              Delete
            </Button>
            <ColorMenu x={0} y={0} changeColor={colorChange}  />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
