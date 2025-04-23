// /components/LegendItem.tsx
import { LucideIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import Draggable, { DraggableEvent } from "react-draggable";

interface LegendItemProps {
  icon: LucideIcon;
  label: string;
  onDrop: (event: DraggableEvent, icon: LucideIcon, label: string) => void;
}

const LegendItem: React.FC<LegendItemProps> = ({
  icon: Icon,
  label,
  onDrop,
}) => {
  // Create a ref to pass to Draggable component
  const nodeRef = useRef<HTMLDivElement>(null!);

  // Track dragging state
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle drag end event from react-draggable
  const handleDragEnd = (event: DraggableEvent) => {
    setIsDragging(false);
    onDrop(event, Icon, label);
  };

  return (
    <div
      className="legend-item-wrapper justify-items-center"
      style={{ position: "relative" }}
    >
      {/* Static copy that stays in place */}
      <div
        className={`static-copy justify-items-center text-center p-1 ${
          isDragging ? "bg-gray-100 rounded-md" : ""
        }`}
      >
        <Icon className="w-6 h-6 mb-1 text-gray-700" />
        <span className="text-xs text-center text-gray-600">{label}</span>
      </div>

      {/* Draggable element with pointer-events */}
      <Draggable
        nodeRef={nodeRef}
        onStart={handleDragStart}
        onStop={handleDragEnd}
        position={{ x: 0, y: 0 }}
        enableUserSelectHack={false}
      >
        <div
          ref={nodeRef}
          className="draggable-node justify-items-center text-center p-1 cursor-grab active:cursor-grabbing"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
            zIndex: 10, // Ensure draggable is above the static copy
          }}
        >
          <Icon className="w-6 h-6 mb-1 text-gray-700 justify-center" />
          <span className="text-xs text-gray-600">{label}</span>
        </div>
      </Draggable>
    </div>
  );
};

export default LegendItem;
