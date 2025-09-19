"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CustomNode } from "@/types/CustomNode";
import { NextPlan } from "@mui/icons-material";
import ColorMenu from "@components/ColorMenu";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { createId } from "@paralleldrive/cuid2";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { Trash, Clipboard, CopyPlus } from "lucide-react";
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
import { memo } from "react";
import IconRegistry from "./IconRegistry";

export const ActiveNodeContext = createContext<{
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
}>({
  activeNodeId: null,
  setActiveNodeId: () => {},
});

// Memoize the IconNode component to prevent unnecessary re-renders
export const IconNode = memo(function IconNode({
  data,
  id,
}: NodeProps<CustomNode>) {
  const { deleteElements, setNodes, getNode } = useReactFlow();
  const { activeNodeId, setActiveNodeId } = useContext(ActiveNodeContext);
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams<{ mode: string }>();
  const isEditable = params.mode == "edit";

  const timeoutId = useRef<NodeJS.Timeout>();

  // Get the icon component from the icon registry with fallback
  const iconName = data.iconName || 'HelpCircle';
  const IconComponent = IconRegistry[iconName] || null;

  // When popover opens, set this node as active
  useEffect(() => {
    if (isOpen) {
      setActiveNodeId(id);

      // Prevent auto-focus on form elements by removing focus after a brief delay
      setTimeout(() => {
        // If an element is focused, blur it
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 0);
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
      console.log(selectedSize);
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

  const handleRotateClockwise = useCallback(() => {
    const newRotation = (data.rotation + 45) % 360;

    // Update the node data to persist rotation
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, rotation: newRotation } }
          : node
      )
    );
  }, [data.rotation, id, setNodes]);

  const handleRotateCounterClockwise = useCallback(() => {
    const newRotation = (data.rotation - 45) % 360;

    // Update the node data to persist rotation
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              rotation: newRotation,
            },
          };
        }
        return node;
      })
    );
  }, [data.rotation, id, setNodes]);

  return (
    <>
      <Popover onOpenChange={setIsOpen}>
        <PopoverTrigger
          style={{
            borderColor: data.color,
          }}
          className="popover-trigger flex flex-col items-center justify-center cursor-move"
        >
          {(activeNodeId === id || isOpen) && (
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Prevent popover from triggering
                  handleRotateClockwise();
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate(${
                    ((data.size == 1 ? 1.5 : data.size) ?? 3) * 15
                  }px, 0) rotate(90deg)`,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                className="nodrag"
              >
                <NextPlan sx={{ color: "white" }} />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Prevent popover from triggering
                  handleRotateCounterClockwise();
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate(-${
                    ((data.size == 1 ? 1.5 : data.size) ?? 3) * 15
                  }px, 0) scale(-1, 1) rotate(90deg)`,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                className="nodrag"
              >
                <NextPlan sx={{ color: "white" }} />
              </div>
            </>
          )}
          <div
            style={{
              transform: `rotate(${Math.round(data.rotation / 45) * 45}deg)`,
            }}
          >
            <IconComponent
              style={{
                color: data.color,
                width: `${data.size ?? 3}rem`,
                height: `${data.size ?? 3}rem`,
              }}
              className="text-gray-700"
            />
          </div>
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
                <Input value={data.label} onChange={handleLabelChange} />
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
                  <Tooltip title="Copy Node">
                    <IconButton
                      onClick={() => handleCopy()}
                      sx={{ color: "black" }}
                    >
                      <Clipboard />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Duplicate Node">
                    <IconButton
                      onClick={() => handleDup()}
                      sx={{ color: "black" }}
                    >
                      <CopyPlus />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Node">
                    <IconButton onClick={handleDelete} sx={{ color: "red" }}>
                      <Trash />
                    </IconButton>
                  </Tooltip>
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
});
