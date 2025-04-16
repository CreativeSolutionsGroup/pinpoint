"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChannelProvider, useChannel } from "ably/react";
import { createId } from "@paralleldrive/cuid2";
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  useReactFlow,
  NodeChange,
  applyNodeChanges,
  Edge,
  ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Event, EventToLocation, Location } from "@prisma/client";

// API imports
import { GetEventLocationInfo } from "@/lib/api/read/GetEventLocationInfo";
import SaveState from "@/lib/api/update/ReactFlowSave";

// Component imports
import { ActiveNodeContext, IconNode } from "@components/IconNode";
import { CustomImageNode } from "@components/CustomImageNode";
import Legend from "@components/Legend";
import EventMapSelect from "@components/EventMapSelect";
import StateButtons from "./stateButtons";

// Types
import { CustomNode } from "@/types/CustomNode";

const getId = () => createId();
const clientId = createId();

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

/**
 * Main Flow component that handles the ReactFlow functionality
 */
function Flow({
  event,
  location,
  isEditable,
}: {
  event: EventWithLocation;
  location: string;
  isEditable: boolean;
}) {
  // Refs
  const timeoutId = useRef<NodeJS.Timeout>();

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

  // State
  const [nodesLoaded, setNodesLoaded] = useState(false);
  const eventLocation = event.locations.find((l) => l.locationId === location);
  const eventLocations = useRef<Array<Location>>(
    event.locations.map((l) => l.location)
  ).current;
  const [nodes, setNodes] = useState<CustomNode[]>(
    JSON.parse(eventLocation?.state ?? "{}")?.nodes || []
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    CustomNode,
    Edge
  > | null>(null);

  // History management
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Hooks
  const { fitView, screenToFlowPosition } = useReactFlow();

  // Subscribe to real-time updates
  useChannel("event-updates", "subscribe", (message) => {
    const { eventId, locationId, senderClientId } = message.data;

    if (
      eventId !== event.id ||
      locationId !== eventLocation?.locationId ||
      senderClientId === clientId
    ) {
      return;
    }

    GetEventLocationInfo(eventId, locationId).then((eventLocationInfo) => {
      if (!eventLocationInfo?.state) return;

      const state = JSON.parse(eventLocationInfo.state);
      setNodes(state.nodes);
    });
  });

  /**
   * Initialize nodes if none exist
   */
  useEffect(() => {
    if (nodes.length > 0) return;

    const imageURL =
      event.locations.find((loc) => loc.locationId == location)?.location
        .imageURL || event.locations[0].location.imageURL;

    const initialNodes: CustomNode[] = [
      {
        id: "map",
        type: "customImageNode",
        data: { label: "map", imageURL: imageURL, rotation: 0 },
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

  /**
   * Fit view to nodes once loaded
   */
  useEffect(() => {
    if (nodesLoaded) {
      requestAnimationFrame(() => {
        fitView({
          includeHiddenNodes: false,
        });
      });
    }
  }, [nodesLoaded, fitView]);

  /**
   * Mark nodes as loaded
   */
  useEffect(() => {
    if (nodes.length > 0) {
      setNodesLoaded(true);
    }
  }, [nodes]);

  /**
   * Track mouse position for paste operations (edit mode only)
   */
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

  /**
   * Handle keyboard shortcuts (edit mode only)
   */
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
          console.log("I pasted");
        } catch (err) {
          /* Default to normal paste operations */
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    nodes,
    mousePosition,
    screenToFlowPosition,
    setNodes,
    isEditable,
    rfInstance,
    activeNodeId,
  ]);

  /**
   * Handle node changes and save state
   */
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Don't apply changes in view mode
      if (!isEditable) return;

      setNodes((nds) => applyNodeChanges(changes, nds) as CustomNode[]);

      // Debounce save
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        if (!rfInstance || !eventLocation) return;

        // Keep track of previous state before applying changes
        if (rfInstance) {
          const currentState = JSON.stringify(rfInstance.toObject());
          // Only push to undo stack if we have changes and it's different from the last state
          if (
            changes.length > 0 &&
            (undoStack.length === 0 ||
              currentState !== undoStack[undoStack.length - 1])
          ) {
            setUndoStack((stack) => [...stack, currentState]);
            setRedoStack([]); // Clear redo stack when new changes occur
          }
        }

        // Save state to server
        SaveState(
          event.id,
          eventLocation.locationId,
          JSON.stringify(rfInstance.toObject()),
          clientId
        );
      }, 200);
    },
    [
      isEditable,
      rfInstance,
      eventLocation,
      event.id,
      undoStack,
      setNodes,
      setUndoStack,
      setRedoStack,
    ]
  );

  /**
   * Handle undo action
   */
  const onUndo = useCallback(() => {
    if (undoStack.length <= 1) return; // Need at least 2 states in the stack to undo

    // Get previous state from undo stack (excluding the current state)
    const previousState = undoStack[undoStack.length - 2];

    // Current state to add to redo stack
    const currentState = undoStack[undoStack.length - 1];

    // Update stacks
    setRedoStack((stack) => [...stack, currentState]);
    setUndoStack((stack) => stack.slice(0, -1));

    // Restore the previous state
    if (previousState) {
      const parsedState = JSON.parse(previousState);
      setNodes(parsedState.nodes || []);

      // Save state to server
      eventLocation &&
        rfInstance &&
        SaveState(event.id, eventLocation.locationId, previousState, clientId);
    }
  }, [undoStack, eventLocation, rfInstance, event.id]);

  /**
   * Handle redo action
   */
  const onRedo = useCallback(() => {
    if (redoStack.length === 0) return;

    // Get next state from redo stack
    const nextState = redoStack[redoStack.length - 1];

    // Save current state to undo stack
    if (rfInstance) {
      const currentState = JSON.stringify(rfInstance.toObject());
      setUndoStack((stack) => [...stack, currentState]);
    }

    // Update redo stack
    setRedoStack((stack) => stack.slice(0, -1));

    // Restore the next state
    if (nextState) {
      const parsedState = JSON.parse(nextState);
      setNodes(parsedState.nodes || []);
    }
  }, [redoStack, rfInstance, setNodes, setUndoStack]);

  /**
   * Handle drag over for node placement
   */
  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      // Block drag overs in view mode
      if (isEditable) {
        event.dataTransfer.dropEffect = "move";
      }
    },
    [isEditable]
  );

  /**
   * Handle node drop
   */
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      // Block drag and drops in view mode
      if (!isEditable) return;

      event.preventDefault();

      const jsonData = event.dataTransfer.getData("application/reactflow");
      if (!jsonData) return;

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
          rotation: 0,
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

  const hasInitialNodesLoaded = useRef(false);

  // Call fitView when the map node has loaded
  useEffect(() => {
    if (!hasInitialNodesLoaded.current) {
      const observer = new MutationObserver(() => {
        const mapNode = document.querySelector('[data-id="map"]');
        if (mapNode) {
          fitView();
          hasInitialNodesLoaded.current = true;
          observer.disconnect(); // Stop observing once the node is found
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => observer.disconnect(); // Cleanup observer on unmount
    }
  }, [nodes, fitView]);

  return (
    <ActiveNodeContext.Provider value={{ activeNodeId, setActiveNodeId }}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <h1 className="fixed left-[50vw] -translate-x-1/2 flex space-x-4 content-center items-center justify-center z-10 bg-white py-2 px-3 mt-3 text-2xl rounded-xl border bg-card text-card-foreground shadow">
          {event.name}
        </h1>
        <ReactFlow
          nodes={nodes}
          minZoom={0.1}
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
          <Controls position="bottom-right" showInteractive={false} />

          {/* Hide legend on view only mode */}
          {isEditable && <Legend isGettingStarted={event.isGS} />}
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

/**
 * Event Flow wrapper component with providers
 */
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
