"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CustomNode } from "@/types/CustomNode";
import { Button } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import * as Icons from "lucide-react";
import { useCallback } from "react";
import ColorMenu from "./ColorMenu";
import { useUserRole } from "./getUserRole";


export function IconNode({ data, id }: NodeProps<CustomNode>) {
  const { deleteElements, setNodes } = useReactFlow();
  // Get the icon component from the Lucide icons
  const IconComponent = Icons[data.iconName as keyof typeof Icons.icons];

  // Make the text field only editable if the user is the correct role
  const role = useUserRole();
  const isDisabled = role === "ADMIN" || role === "EDITOR" ? true : false;

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
            Notes:
            <Textarea disabled={isDisabled} />
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
