import * as LucideIcons from "lucide-react";
import { FlexibleIcon } from "@/types/IconTypes";
import BistroTable from "./icons/bistroTable";
import SixFootTable from "./icons/sixFootTable";
import SpikeBall from "./icons/spikeBall";
import PingPong from "./icons/pingPong";
import CornHole from "./icons/cornHole";

// Import your custom icons here
const customIcons = {
  BistroIcon: BistroTable,
  SixFootIcon: SixFootTable,
  SpikeBall,
  PingPong,
  CornHole,
  // Add more custom icons here as you create them
  // CustomIcon3,
  // CustomIcon4,
};

// Filter out non-icon exports from Lucide (like 'Icon', 'icons', etc.)
const lucideIconComponents = Object.fromEntries(Object.entries(LucideIcons));

// Create a combined icon registry
export const IconRegistry: Record<string, FlexibleIcon> = {
  // Spread filtered Lucide icons
  ...lucideIconComponents,
  // Add custom icons with their names
  ...customIcons,
};

export default IconRegistry;