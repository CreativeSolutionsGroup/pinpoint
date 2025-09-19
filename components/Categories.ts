import {
  Armchair,
  Circle,
  Coffee,
  Cylinder,
  Fence,
  Flag,
  Gift,
  Grid3X3,
  KeyboardMusic,
  Lightbulb,
  Recycle,
  Signpost,
  Speaker,
  Theater,
  TrafficCone,
  Trash2,
  TreePine,
  Truck,
  Tv,
} from "lucide-react";
import bistroIcon from "./icons/bistroTable";
import SixFootTable from "./icons/sixFootTable";
import SpikeBall from "./icons/spikeBall";
import PingPong from "./icons/pingPong";
import CornHole from "./icons/cornHole";
import Canopy from "./icons/Canopy";

const categories = [
  {
    title: "Outdoor Equipment",
    value: "outdoor-equipment",
    items: [
      { icon: TrafficCone, label: "Cone" },
      { icon: Signpost, label: "A-Frame" },
    ],
  },
  {
    title: "Indoor Equipment",
    value: "indoor-equipment",
    items: [
      { icon: Trash2, label: "Trash Cans" },
      { icon: Recycle, label: "Recycling" },
      { icon: Fence, label: "Stanchions" },
      { icon: Armchair, label: "Chairs" },
      { icon: Theater, label: "Stage Items" },
    ],
  },
  {
    title: "Tech",
    value: "tech",
    items: [
      { icon: KeyboardMusic, label: "Soundboard" },
      { icon: Speaker, label: "Speakers" },
      { icon: Lightbulb, label: "Lights" },
      { icon: Tv, label: "TVs" },
    ],
  },
  {
    title: "Getting Started",
    value: "getting-started",
    items: [
      { icon: Canopy, label: "Tents" },
      { icon: Flag, label: "Flags" },
    ],
  },
  {
    title: "Campus XMas",
    value: "campus-xmas",
    items: [
      { icon: TreePine, label: "Christmas Tree" },
      { icon: Gift, label: "Present" },
    ],
  },
  {
    title: "Yard Games",
    value: "yard-games",
    items: [
      { icon: CornHole, label: "Corn Hole" },
      { icon: SpikeBall, label: "Spikeball" },
      { icon: PingPong, label: "Ping Pong" },
      { icon: Grid3X3, label: "9-Square" },
      { icon: Cylinder, label: "Can-Jam" },
    ],
  },
  {
    title: "Rental Equipment",
    value: "rental-equipment",
    items: [
      { icon: Coffee, label: "Coffee Cart" },
      { icon: Truck, label: "Food Trucks" },
      { icon: SixFootTable, label: "6ft Table" },
      { icon: bistroIcon, label: "Bistro Table" },
      { icon: Circle, label: "Round Table" },
    ],
  },
];

export default categories;