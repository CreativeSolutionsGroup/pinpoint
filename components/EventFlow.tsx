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
  XYPosition,
  Panel,
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
import { DraggableEvent } from "react-draggable";
import { LucideIcon } from "lucide-react";

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
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

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
  /* const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    CustomNode,
    Edge
  > | null>(null); */

  const rfInstance = useReactFlow();

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

  const onNodeCreate = useCallback(
    (type: string, iconName: string, label: string, position: XYPosition) => {
      // Exit early if not in edit mode
      if (!isEditable) return;

      console.log(
        `Creating node: ${type}, ${iconName}, ${label} at ${JSON.stringify(
          position
        )}`
      );

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
    [setNodes, isEditable]
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

  const onDrop = useCallback(
    (event: DraggableEvent, icon: LucideIcon, label: string) => {
      if (!reactFlowWrapper.current) return;

      // Get bounds of react flow wrapper
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      // Drop position
      let clientX = 0;
      let clientY = 0;

      if (event instanceof MouseEvent) {
        // MouseEvent = browser drop
        clientX = (event as MouseEvent).clientX;
        clientY = (event as MouseEvent).clientY;
      } else if (event instanceof TouchEvent) {
        // TouchEvent = mobile drop
        clientX = (event as TouchEvent).changedTouches[0].clientX;
        clientY = (event as TouchEvent).changedTouches[0].clientY;
      }

      // Make sure coords are valid
      if (isNaN(clientX) || isNaN(clientY)) {
        console.error("Invalid coordinates:", { clientX, clientY });
        return;
      }
      // Calculate the drop position in the flow
      // First get the raw position where the cursor is
      const rawPosition = screenToFlowPosition({
        x: clientX - reactFlowBounds.left,
        y: clientY - reactFlowBounds.top,
      });

      // Get the node dimensions from CSS to center it on cursor
      // The CustomNode has a width of 100px as defined in CustomNode.tsx
      const nodeWidth = 100;
      // Estimate height based on padding in CustomNode.tsx (10px top + 10px bottom)
      const nodeHeight = 40;

      // Calculate the position with offset to center the node on cursor
      const position = {
        x: rawPosition.x - nodeWidth / 2,
        y: rawPosition.y - nodeHeight / 2,
      };

      // Ensure position values are valid numbers
      if (isNaN(position.x) || isNaN(position.y)) {
        console.error("Invalid position:", position);
        return;
      }

      console.log("Drop position:", position, "Icon:", icon.displayName);

      // Create a new node
      const newNode: CustomNode = {
        id: getId(),
        type: "iconNode",
        position,
        data: {
          label,
          iconName: icon.displayName,
          color: "#57B9FF",
        },
        dragging: false,
        zIndex: 0,
        selectable: true,
        deletable: true,
        selected: false,
        draggable: true,
        isConnectable: true,
        positionAbsoluteX: position.x,
        positionAbsoluteY: position.y,
      };

      // Add the new node to the flow
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <ActiveNodeContext.Provider value={{ activeNodeId, setActiveNodeId }}>
      <div style={{ width: "100vw", height: "100vh" }} ref={reactFlowWrapper}>
        <h1 className="fixed left-[50vw] -translate-x-1/2 flex space-x-4 content-center items-center justify-center z-10 bg-white py-2 px-3 mt-3 text-2xl rounded-xl border bg-card text-card-foreground shadow">
          {event.name}
        </h1>
        <ReactFlow
          nodes={nodes}
          minZoom={0.1}
          onNodesChange={onNodesChange}
          //onNodeClick={(_, node) => setActiveNodeId(node.id)} // Fix the onNodeClick handler
          zoomOnScroll={false}
          panOnScroll={false}
          nodeTypes={nodeTypes}
          nodesDraggable={isEditable}
          elementsSelectable={isEditable}
          className="touch-none"
        >
          <Controls position="bottom-right" showInteractive={false} />

          {/* Hide legend on view only mode */}
          {isEditable && (
            <Panel position="top-left">
              <Legend onDrop={onDrop} isGettingStarted={event.isGS} />
            </Panel>
          )}
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
