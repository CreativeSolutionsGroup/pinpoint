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
import { createContext, useContext, useCallback, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ResizeMenu from "./ResizeMenu";
import { Trash2 } from "lucide-react";
import QueueIcon from '@mui/icons-material/Queue';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { createId } from "@paralleldrive/cuid2";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

export const ActiveNodeContext = createContext<{
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
}>({
  activeNodeId: null,
  setActiveNodeId: () => {},
});

export function IconNode({ data, id }: NodeProps<CustomNode>) {
  const { deleteElements, setNodes, getNode } = useReactFlow();
  const { setActiveNodeId } = useContext(ActiveNodeContext);
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams<{ mode: string }>();

  const isEditable = params.mode == "edit";

  // Get the icon component from the Lucide icons
  const IconComponent = Icons[data.iconName as keyof typeof Icons.icons];

  // When popover opens, set this node as active
  useEffect(() => {
    if (isOpen) {
      setActiveNodeId(id);
    }
  }, [isOpen, id, setActiveNodeId]);
  
  const handleCopy = useCallback(() => {
    try {
      const node = getNode(id);
      if (node) {
        navigator.clipboard.writeText(JSON.stringify([node]));
        console.log("Copied node:", node);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [id, getNode]);
 
  const handleDup = () => {
    const node = getNode(id);
    if (!node) return;

    const xOffset = (node?.position?.x ?? 0) + 20;
    const yOffset = (node?.position?.y ?? 0) - 20;
    
    const newNodeId = createId();
    const newNode = {
      ...node,
      id: newNodeId,
      position: {
      x: xOffset,
      y: yOffset,
      },
      selected: false,
    };

    setNodes((nds) => [...nds, newNode]);

    // Set the card menu to be over the new node
    setIsOpen(false);
    setActiveNodeId(newNodeId);

    setTimeout(() => {
      const newNodeElement = document.querySelector(`[data-id="${newNodeId}"]`);
      console.log("New node element:", newNodeElement, newNodeId);
      if (newNodeElement) {
        const triggerElement = newNodeElement.querySelector('.popover-trigger');
        console.log("Trigger element:", triggerElement);
        
        if (triggerElement) {
          (triggerElement as HTMLElement).click();
          console.log("Clicked on new node:", newNodeId);
        }
      }
    }, 50);

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
      <Popover onOpenChange={setIsOpen}>
        <PopoverTrigger className="popover-trigger">
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
              autoFocus={false}
              tabIndex={-1}
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
