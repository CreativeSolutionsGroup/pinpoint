"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CustomNode } from "@/types/CustomNode";
import ColorMenu from "@components/ColorMenu";
import { Box, IconButton, Paper } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import * as Icons from "lucide-react";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import ResizeMenu from "./ResizeMenu";
import { Trash2 } from "lucide-react";
import QueueIcon from '@mui/icons-material/Queue';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { createId } from "@paralleldrive/cuid2";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

export function IconNode({ data, id }: NodeProps<CustomNode>) {
  const { deleteElements, setNodes, getNode } = useReactFlow();

  const params = useParams<{ mode: string }>();

  const isEditable = params.mode == "edit";

  // Get the icon component from the Lucide icons
  const IconComponent = Icons[data.iconName as keyof typeof Icons.icons];

  const handleCopy = () => {
    const node = getNode(id);
    navigator.clipboard.writeText(JSON.stringify([node]));
  };
 
  const handleDup = () => {
    const node = getNode(id);
    if (!node) return;

    const xOffset = (node?.position?.x ?? 0) + 50;
    const yOffset = (node?.position?.y ?? 0) - 50;
    
    const newNode = {
      ...node,
      id: createId(),
      position: {
      x: xOffset,
      y: yOffset,
      },
      selected: false,
    };

    setNodes((nds) => [...nds, newNode]);
  };

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
            <Textarea
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
                <Box>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton onClick={() => handleCopy()} sx={{ color: "black" }}>
                          <ContentPasteIcon />
                        </IconButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <Paper className="p-1">
                          Copy Node
                        </Paper>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton onClick={() => handleDup()} sx={{ color: "black" }}>
                          <QueueIcon />
                        </IconButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <Paper className="p-1">
                          Duplicate Node
                        </Paper>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <IconButton onClick={handleDelete} sx={{ color: "red" }}>
                    <Trash2 />
                  </IconButton>
                </Box>
              </Box>
            )}
            {isEditable && <ColorMenu x={0} y={0} changeColor={colorChange} />}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
