"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CustomNode } from "@/types/CustomNode";
import ColorMenu from "@components/ColorMenu";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import QueueIcon from "@mui/icons-material/Queue";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { createId } from "@paralleldrive/cuid2";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { NodeProps, useReactFlow } from "@xyflow/react";
import * as Icons from "lucide-react";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ResizeMenu from "./ResizeMenu";

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

  const timeoutId = useRef<NodeJS.Timeout>();

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
        const triggerElement = newNodeElement.querySelector(".popover-trigger");
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

      if (timeoutId.current) clearTimeout(timeoutId.current);

      timeoutId.current = setTimeout(() => {
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
      }, 200);
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
      <Popover onOpenChange={setIsOpen}>
        <PopoverTrigger
          style={{ borderColor: data.color }}
          className="popover-trigger flex flex-col items-center justify-center cursor-move"
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
              onChange={handleNotesChange}
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
                        <IconButton
                          onClick={() => handleCopy()}
                          sx={{ color: "black" }}
                        >
                          <ContentPasteIcon />
                        </IconButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <Paper className="p-1">Copy Node</Paper>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          onClick={() => handleDup()}
                          sx={{ color: "black" }}
                        >
                          <QueueIcon />
                        </IconButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <Paper className="p-1">Duplicate Node</Paper>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          onClick={handleDelete}
                          sx={{ color: "red" }}
                        >
                          <Trash2 />
                        </IconButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <Paper className="p-1">Delete Node</Paper>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Box>
              </Box>
            )}
            {isEditable && (
              <ColorMenu
                x={0}
                y={0}
                currentColor={data.color ?? "#000000"}
                changeColor={colorChange}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
