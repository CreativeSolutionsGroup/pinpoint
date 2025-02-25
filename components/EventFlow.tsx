"use client";
import SaveState from "@/lib/api/save/ReactFlowSave";
import { CustomNode } from "@/types/CustomNode";
import { CustomImageNode } from "@components/CustomImageNode";
import EventMapSelect from "@components/EventMapSelect";
import { IconNode } from "@components/IconNode";
import Legend from "@components/Legend";
import { Button } from "@mui/material";
import { createId } from "@paralleldrive/cuid2";
import { Event, EventToLocation, Location } from "@prisma/client";
import {
  applyNodeChanges,
  Controls,
  Edge,
  MiniMap,
  NodeChange,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import NavButtons from "./navButtons";
import { ChannelProvider, useChannel } from "ably/react";
import { GetEventLocationInfo } from "@/lib/api/save/GetEventLocationInfo";

const getId = () => createId();

// Define node types
const nodeTypes = {
  iconNode: IconNode,
  customImageNode: CustomImageNode,
};

interface EventWithLocation extends Event {
  locations: (EventToLocation & {
    location: Location;
  })[];
}

function Flow({
  event,
  location,
  isEditable,
}: {
  event: EventWithLocation;
  location: string;
  isEditable: boolean;
}) {
  const timeoutId = useRef<NodeJS.Timeout>();

  useChannel("event-updates", "subscribe", (message) => {
    const { eventId, locationId } = message.data;

    if (eventId !== event.id || locationId !== eventLocation?.locationId)
      return;

    GetEventLocationInfo(eventId, locationId).then((eventLocationInfo) => {
      if (!eventLocationInfo?.state) return;

      const state = JSON.parse(eventLocationInfo.state);

      setNodes(state.nodes);
    });
  });

  const eventLocation = event.locations.find((l) => l.locationId === location);
  const [nodes, setNodes] = useState<CustomNode[]>(
    JSON.parse(eventLocation?.state ?? "{}")?.nodes || []
  );

  const { screenToFlowPosition } = useReactFlow();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    CustomNode,
    Edge
  > | null>(null);

  //history management
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const onUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    // Save current state to redo stack
    if (rfInstance) {
      const currentState = JSON.stringify(rfInstance.toObject());
      setRedoStack((stack) => [...stack, currentState]);
    }

    // Get and remove last state from undo stack
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));

    // Restore the previous state
    if (previousState) {
      const parsedState = JSON.parse(previousState);
      setNodes(parsedState.nodes || []);
    }
    console.log("Undo stack", undoStack);
  }, [undoStack, rfInstance]);

  // Redo function
  const onRedo = useCallback(() => {
    if (redoStack.length === 0) return;

    // Save current state to undo stack
    if (rfInstance) {
      const currentState = JSON.stringify(rfInstance.toObject());
      setUndoStack((stack) => [...stack, currentState]);
    }

    // Get and remove last state from redo stack
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack((stack) => stack.slice(0, -1));

    // Restore the next state
    if (nextState) {
      const parsedState = JSON.parse(nextState);
      setNodes(parsedState.nodes || []);
    }
    console.log("Redo stack", redoStack);
  }, [redoStack, rfInstance, setNodes, setUndoStack]);

  useEffect(() => {
    if (nodes.length > 0) return;

    const imageURL = `/maps/${
      event.locations.find((loc) => loc.locationId == location)?.location
        .imageURL || event.locations[0].location.imageURL
    }`;

    const initialNodes: CustomNode[] = [
      {
        id: "map",
        type: "customImageNode",
        data: { label: "map", imageURL: imageURL },
        position: { x: 0, y: 0, z: -1 },
        draggable: false,
        deletable: false,
        dragging: false,
        zIndex: 0,
        selectable: false,
        selected: false,
        isConnectable: false,
        positionAbsoluteX: 0,
        positionAbsoluteY: 0,
      },
    ];

    setNodes(initialNodes);
  }, [location, event.locations, nodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      isEditable &&
        setNodes((nds) => applyNodeChanges(changes, nds) as CustomNode[]);
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        rfInstance &&
          eventLocation &&
          SaveState(
            event.id,
            eventLocation.locationId,
            JSON.stringify(rfInstance.toObject())
          );

        if (rfInstance) {
          const currentState = JSON.stringify(rfInstance.toObject());
          if (currentState !== undoStack[undoStack.length - 1]) {
            setUndoStack((stack) => [...stack, currentState]);
            setRedoStack([]); // Clear redo stack when new changes occur
          }
        }
      }, 500);

      console.log("Node changes", undoStack);

      // For meaningful changes, update nodes and save state
      setNodes((nds) => {
        const newNodes = applyNodeChanges(changes, nds) as CustomNode[];

        return newNodes;
      });
    },
    [rfInstance, undoStack, eventLocation, event.id, isEditable]
  );

  // Update mouse position - only in edit mode
  useEffect(() => {
    if (!isEditable) return;

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isEditable]);

  // Handle keyboard shortcuts - only in edit mode
  useEffect(() => {
    if (!isEditable) return;

    const handleKeyDown = async (event: KeyboardEvent) => {
      // Copy
      if (event.key === "c" && (event.ctrlKey || event.metaKey)) {
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length === 0) return;

        try {
          await navigator.clipboard.writeText(JSON.stringify(selectedNodes));
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      }

      // Paste
      if (event.key === "v" && (event.ctrlKey || event.metaKey)) {
        try {
          const clipText = await navigator.clipboard.readText();
          const pastedNodes = JSON.parse(clipText);

          if (!Array.isArray(pastedNodes)) return;

          const position = screenToFlowPosition({
            x: mousePosition.x,
            y: mousePosition.y,
          });

          // Calculate offset from first node to paste position
          const firstNode = pastedNodes[0];
          const xOffset = position.x - firstNode.position.x;
          const yOffset = position.y - firstNode.position.y;

          const newNodes = pastedNodes.map((node) => ({
            ...node,
            id: getId(),
            selected: false,
            position: {
              x: node.position.x + xOffset,
              y: node.position.y + yOffset,
            },
          }));

          setNodes((nds) => [...nds, ...newNodes]);
        } catch (err) {
          console.error("Failed to paste:", err);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, mousePosition, screenToFlowPosition, setNodes, isEditable]);

  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      // block drag overs on view mode
      if (isEditable) {
        event.dataTransfer.dropEffect = "move";
      }
    },
    [isEditable]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      // block drag and drops on view mode
      if (!isEditable) return;

      event.preventDefault();

      const jsonData = event.dataTransfer.getData("application/reactflow");

      if (!jsonData) {
        return;
      }

      const { type, iconName, label } = JSON.parse(jsonData);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CustomNode = {
        id: getId(),
        type,
        position,
        data: {
          label,
          iconName,
          color: "white",
        },
        draggable: true,
        deletable: true,
        parentId: "map",
        extent: "parent",
        dragging: false,
        zIndex: 0,
        selectable: false,
        selected: false,
        isConnectable: false,
        positionAbsoluteX: 0,
        positionAbsoluteY: 0,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, isEditable]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        zoomOnScroll={false}
        panOnScroll={false}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        nodesDraggable={isEditable}
        elementsSelectable={isEditable}
        className="touch-none"
      >
        <Controls position="bottom-right" />
        <MiniMap position="bottom-left" pannable zoomable />

        {/* Hide legend on view only mode */}
        {isEditable && <Legend />}
        <EventMapSelect
          eventId={event.id}
          locations={event.locations.map((l) => l.location)}
        />
        <NavButtons />
      </ReactFlow>

      {/* Hide save button in view mode */}
      {isEditable && (
        <Button
          onClick={() =>
            rfInstance &&
            eventLocation &&
            SaveState(
              event.id,

              eventLocation.locationId,

              JSON.stringify(rfInstance.toObject())
            )
          }
          style={{ position: "fixed", top: "4rem", right: 16 }}
          variant="contained"
        >
          Save
        </Button>
      )}
      <Button
        onClick={onUndo}
        style={{ position: "fixed", top: "7rem", right: 16 }}
        variant="contained"
      >
        Undo
      </Button>
      <Button
        onClick={onRedo}
        style={{ position: "fixed", top: "10rem", right: 16 }}
        variant="contained"
      >
        Redo
      </Button>
    </div>
  );
}

export default function EventFlow({
  event,
  location,
  isEditable,
}: {
  event: EventWithLocation;
  location: string;
  isEditable: boolean;
}) {
  return (
    <ReactFlowProvider>
      <ChannelProvider channelName="event-updates">
        <Flow event={event} location={location} isEditable={isEditable} />
      </ChannelProvider>
    </ReactFlowProvider>
  );
}