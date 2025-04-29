"use client";

import { LucideIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import Draggable, { DraggableEvent } from "react-draggable";

interface LegendItemProps {
  icon: LucideIcon;
  label: string;
  onDrop: (event: DraggableEvent, icon: LucideIcon, label: string) => void;
  isSelected?: boolean;
}

const LegendItem: React.FC<LegendItemProps> = ({
  icon: Icon,
  label,
  onDrop,
  isSelected = false,
}) => {
  // Create a ref to pass to Draggable component
  const nodeRef = useRef<HTMLDivElement>(null!);

  // Track dragging and hovering state
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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
      className="legend-item-wrapper justify-items-center select-none"
      style={{ position: "relative" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Static copy that stays in place */}
      <div
        className={`static-copy justify-items-center text-center p-1 ${
          isSelected
            ? "bg-red-100 rounded-md w-full h-full"
            : isDragging || isHovering
            ? "bg-gray-100 rounded-md w-full h-full"
            : ""
        }`}
      >
        <Icon
          className={`w-6 h-6 mb-1 ${
            isSelected ? "text-red-700" : "text-gray-700"
          }`}
        />
        <span
          className={`text-xs text-center ${
            isSelected ? "text-red-600" : "text-gray-600"
          }`}
        >
          {label}
        </span>
      </div>

      {/* Draggable element with pointer-events */}
      <Draggable
        nodeRef={nodeRef}
        onStart={handleDragStart}
        onStop={handleDragEnd}
        position={{ x: 0, y: 0 }}
        enableUserSelectHack={true}
        disabled={isSelected} // Disable dragging when selected for deletion
      >
        <div
          ref={nodeRef}
          className={`draggable-node justify-items-center text-center p-1 ${
            isSelected ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
          } select-none`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
            zIndex: 10, // Ensure draggable is above the static copy
            userSelect: "none", // Additional explicit styling to prevent selection
          }}
        >
          <Icon
            className={`w-6 h-6 mb-1 ${
              isSelected ? "text-red-700" : "text-gray-700"
            } justify-center`}
          />
          <span
            className={`text-xs ${
              isSelected ? "text-red-600" : "text-gray-600"
            }`}
          >
            {label}
          </span>
        </div>
      </Draggable>
    </div>
  );
};

export default LegendItem;
