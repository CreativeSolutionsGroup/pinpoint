"use client";
import { GetEventLocationInfo } from "@/lib/api/read/GetEventLocationInfo";
import SaveState from "@/lib/api/update/ReactFlowSave";
import { CustomNode } from "@/types/CustomNode";
import { CustomImageNode } from "@components/CustomImageNode";
import EventMapSelect from "@components/EventMapSelect";
import { IconNode } from "@components/IconNode";
import Legend from "@components/Legend";
import { ActiveNodeContext } from "@components/IconNode";
import { createId } from "@paralleldrive/cuid2";
import { Event, EventToLocation, Location } from "@prisma/client";
import {
  applyNodeChanges,
  Controls,
  Edge,
  NodeChange,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ChannelProvider, useChannel } from "ably/react";
import { useCallback, useEffect, useRef, useState } from "react";
import StateButtons from "./stateButtons";

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
  const [nodesLoaded, setNodesLoaded] = useState(false);
  const { fitView } = useReactFlow(); // Get the fitView method from useReactFlow

  useChannel("event-updates", "subscribe", (message) => {
    const { eventId, locationId } = message.data;

    if (eventId !== event.id || locationId !== eventLocation?.locationId) {
      return;
    }

    GetEventLocationInfo(eventId, locationId).then((eventLocationInfo) => {
      if (!eventLocationInfo?.state) return;

      const state = JSON.parse(eventLocationInfo.state);

      setNodes(state.nodes);
    });
  });

  const eventLocation = event.locations.find((l) => l.locationId === location);
  const [eventLocations, setEventLocations] = useState<Array<Location>>(
    event.locations.map((l) => l.location)
  );
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
  }, [redoStack, rfInstance, setNodes, setUndoStack]);

  useEffect(() => {
    if (nodes.length > 0) return;

    const imageURL =
      event.locations.find((loc) => loc.locationId == location)?.location
        .imageURL || event.locations[0].location.imageURL;

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

        setEventLocations(event.locations.map((l) => l.location));
      }, 200);

      // For meaningful changes, update nodes and save state
      setNodes((nds) => {
        const newNodes = applyNodeChanges(changes, nds) as CustomNode[];

        return newNodes;
      });
    },
    [
      isEditable,
      rfInstance,
      eventLocation,
      event.id,
      event.locations,
      undoStack,
    ]
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

  // Add state for tracking the active node
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Handle keyboard shortcuts - only in edit mode
  useEffect(() => {
    if (!isEditable) return;

    const handleKeyDown = async (event: KeyboardEvent) => {
      // Copy
      if (event.key === "c" && (event.ctrlKey || event.metaKey)) {
        if (activeNodeId) {
          const activeNode = rfInstance?.getNode(activeNodeId);
          if (activeNode) {
            try {
              await navigator.clipboard.writeText(JSON.stringify([activeNode]));
              console.log("Copied active node:", activeNode.id);
            } catch (err) {
              console.error("Failed to copy:", err);
            }
          } else {
            console.log("No active node found with ID:", activeNodeId);
          }
        } else {
          console.log("No active node currently set");
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
          console.log("I pasted")

        } catch (err) {/* Default to normal paste operations */}
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, mousePosition, screenToFlowPosition, setNodes, isEditable, rfInstance, activeNodeId]);

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
          color: "#57B9FF",
        },
        draggable: true,
        deletable: true,
        parentId: "map",
        extent: "parent",
        dragging: false,
        zIndex: 0,
        selectable: true,
        selected: false,
        isConnectable: false,
        positionAbsoluteX: 0,
        positionAbsoluteY: 0,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, isEditable]
  );

  // Call fit view after nodes have been loaded
  useEffect(() => {
    if (nodesLoaded) {
      // Use requestAnimationFrame to ensure the nodes are rendered
      requestAnimationFrame(() => {
        fitView({
          includeHiddenNodes: false,
        });
      });
    }
  }, [nodesLoaded, fitView]);

  // Set nodes and mark them as loaded
  useEffect(() => {
    if (nodes.length > 0) {
      setNodesLoaded(true);
    }
  }, [nodes]);

  return (
    <ActiveNodeContext.Provider value={{ activeNodeId, setActiveNodeId }}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <h1 className="fixed left-[50vw] -translate-x-1/2 flex space-x-4 content-center items-center justify-center z-10 bg-white py-2 px-3 mt-3 text-2xl rounded-xl border bg-card text-card-foreground shadow">
          {event.name}
        </h1>
        <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        zoomOnScroll={false}
        panOnScroll={false}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        minZoom={0.1}
        nodesDraggable={isEditable}
        elementsSelectable={isEditable}
        className="touch-none"
      >
        <Controls
          position="bottom-right"
          fitViewOptions={{ minZoom: 0.05 }}
          showInteractive={false}
        />

        {isEditable && <Legend />}
        {isEditable && (
          <StateButtons
            undo={onUndo}
            redo={onRedo}
            event={event}
            eventLocations={eventLocations}
          />
        )}

          <EventMapSelect eventId={event.id} locations={eventLocations} />
        </ReactFlow>
      </div>
    </ActiveNodeContext.Provider>
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
