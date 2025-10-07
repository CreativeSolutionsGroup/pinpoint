import { Edge } from "@xyflow/react";

export interface CustomEdge extends Edge {
  data?: {
    label?: string;
    notes?: string;
    color?: string;
    width?: number; // wire thickness
  };
}