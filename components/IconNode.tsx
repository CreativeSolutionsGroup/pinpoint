"use client";

import { CustomNode } from "@/types/CustomNode";
import { createId } from "@paralleldrive/cuid2";
import { NodeProps, useReactFlow, Handle, Position } from "@xyflow/react";
import * as Icons from "lucide-react";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { memo } from "react";
import MobileIconSettings from "./MobileIconSettings";
import IconSettings from "./IconSettings";

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

  // Get the icon component from the Lucide icons
  const IconComponent = Icons[data.iconName as keyof typeof Icons.icons];

  // Prevent auto-focus flash when opening
  useEffect(() => {
    if (isOpen && document.activeElement instanceof HTMLElement) {
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 0);
    }
  }, [isOpen]);

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

  // Track orientation for mobile dialog layout adjustments
  const [isLandscape, setIsLandscape] = useState(false);

  // If user is on mobile, make the node settings a dialog instead of a popover
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);

  // Update orientation state when on mobile
  useEffect(() => {
    if (!isMobile) return;
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsLandscape(window.innerWidth > window.innerHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);
  if (!isMobile) {
    return (
      <>
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: '#555',
            width: 8,
            height: 8,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        />
        <Handle
          type="source"
          position={Position.Top}
          style={{
            background: '#555',
            width: 8,
            height: 8,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        />
        <IconSettings
          isOpen={isOpen}
          setIsOpen={(open: boolean) => {
            setIsOpen(open);
            if (open) {
              setActiveNodeId(id);
            } else if (activeNodeId === id) {
              setActiveNodeId(null);
            }
          }}
          isEditable={isEditable}
          activeNodeId={activeNodeId}
          id={id}
          data={data}
          IconComponent={IconComponent}
          handleLabelChange={handleLabelChange}
          handleNotesChange={handleNotesChange}
          handleResize={handleResize}
          handleCopy={handleCopy}
          handleDup={handleDup}
          handleDelete={handleDelete}
          colorChange={colorChange}
          handleRotateClockwise={handleRotateClockwise}
          handleRotateCounterClockwise={handleRotateCounterClockwise}
          setActiveNodeId={setActiveNodeId}
        />
      </>
    );
  } else {
    return (
      <>
        <MobileIconSettings
          isOpen={isOpen}
          setIsOpen={(open: boolean) => {
            setIsOpen(open);
            if (open) {
              setActiveNodeId(id);
            } else if (activeNodeId === id) {
              setActiveNodeId(null);
            }
          }}
          isLandscape={isLandscape}
          isEditable={isEditable}
          activeNodeId={activeNodeId}
          id={id}
          data={data}
          IconComponent={IconComponent}
          handleLabelChange={handleLabelChange}
          handleNotesChange={handleNotesChange}
          handleResize={handleResize}
          handleCopy={handleCopy}
          handleDup={handleDup}
          handleDelete={handleDelete}
          colorChange={colorChange}
          handleRotateClockwise={handleRotateClockwise}
          handleRotateCounterClockwise={handleRotateCounterClockwise}
        />
      </>
    );
  }
});