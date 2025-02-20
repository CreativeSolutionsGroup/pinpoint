"use client";

import * as Icons from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Box, Button } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { CustomNode } from "@/types/CustomNode";
import ColorMenu from "./ColorMenu";
import { useCallback, useState } from "react";
import ResizeMenu from "./ResizeMenu";
// import { Box } from "@mui/system";

export function IconNode({ data, id }: NodeProps<CustomNode>) {
  console.log("IconNode", data, id);
  const { deleteElements, setNodes } = useReactFlow();
  const [currentSize, setCurrentSize] = useState(data.size ?? 2);
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
    (size: number) => {
      setCurrentSize(size);
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                size: size,
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
              width: `${currentSize}rem`,
              height: `${currentSize}rem`,
            }}
            className="text-gray-700"
          />
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="grid gap-4">
            Place content for the popover here.
            <Box className="flex place-content-between">
              <ResizeMenu onResize={handleResize} currentSize={currentSize} />
              <Button onClick={handleDelete} color="warning">
                Delete
              </Button>
            </Box>
            <ColorMenu x={0} y={0} changeColor={colorChange} />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );

  /* return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-2 shadow-sm">
      <div className="flex flex-col items-center gap-1">
        {IconComponent && <IconComponent className="w-6 h-6 text-gray-700" />}
        <span className="text-xs text-gray-600">{data.label}</span>
      </div>
    </div>
  ); */
}
