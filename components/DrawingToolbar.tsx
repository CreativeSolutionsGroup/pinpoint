"use client";

import { Button } from "@/components/ui/button";
import {
  Pencil,
  Square,
  Circle,
  ArrowRight,
  Type,
  MousePointer,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type DrawingTool = "select" | "freehand" | "rectangle" | "circle" | "arrow" | "text";

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  isEditable: boolean;
}

export default function DrawingToolbar({
  activeTool,
  onToolChange,
  isEditable,
}: DrawingToolbarProps) {
  if (!isEditable) return null;

  const tools: { id: DrawingTool; icon: React.ReactNode; label: string }[] = [
    { id: "select", icon: <MousePointer className="w-4 h-4" />, label: "Select" },
    { id: "freehand", icon: <Pencil className="w-4 h-4" />, label: "Freehand Draw" },
    { id: "rectangle", icon: <Square className="w-4 h-4" />, label: "Rectangle" },
    { id: "circle", icon: <Circle className="w-4 h-4" />, label: "Circle" },
    { id: "arrow", icon: <ArrowRight className="w-4 h-4" />, label: "Arrow" },
    { id: "text", icon: <Type className="w-4 h-4" />, label: "Text" },
  ];

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-1">
      <TooltipProvider>
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === tool.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onToolChange(tool.id)}
                className="w-10 h-10 p-0"
              >
                {tool.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
