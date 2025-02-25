import { NodeProps } from "@xyflow/react";

export interface CustomNode extends NodeProps {
  data: {
    label: string;
    iconName?: string;
    imageURL?: string;
    color?: string;
    size?: number;
    notes?: string;
  };
  position: { x: number; y: number; z?: number };
  extent?: "parent";
}
