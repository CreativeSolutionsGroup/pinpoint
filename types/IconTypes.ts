import { LucideIcon } from "lucide-react";
import { ComponentType, SVGProps } from "react";

// Define a flexible icon type that can handle different icon libraries
export type FlexibleIcon = 
  | LucideIcon 
  | ComponentType<SVGProps<SVGSVGElement>>
  | ComponentType<{
      className?: string;
      style?: React.CSSProperties;
      size?: number | string;
      color?: string;
    }>;

// Type for icon registry entries
export interface IconRegistryEntry {
  component: FlexibleIcon;
  name: string;
  category?: string;
}

// Type for the complete icon registry
export type IconRegistry = Record<string, FlexibleIcon>;