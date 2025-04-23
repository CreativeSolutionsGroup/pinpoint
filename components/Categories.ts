import {
  Armchair,
  Coffee,
  Fence,
  Flag,
  Gamepad2,
  Gift,
  Lightbulb,
  Pickaxe,
  Radio,
  Recycle,
  Signpost,
  Speaker,
  Table,
  Tent,
  Theater,
  TrafficCone,
  Trash2,
  TreePine,
  Truck,
  Tv,
} from "lucide-react";

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
      { icon: Radio, label: "Soundboard" },
      { icon: Speaker, label: "Speakers" },
      { icon: Lightbulb, label: "Lights" },
      { icon: Tv, label: "TVs" },
    ],
  },
  {
    title: "Getting Started",
    value: "getting-started",
    items: [
      { icon: Tent, label: "Tents" },
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
      { icon: Gamepad2, label: "Cornhole" },
      { icon: Gamepad2, label: "Spikeball" },
      { icon: Gamepad2, label: "Ping Pong" },
      { icon: Gamepad2, label: "9-Square" },
      { icon: Gamepad2, label: "Can-Jam" },
    ],
  },
  {
    title: "Rental Equipment",
    value: "rental-equipment",
    items: [
      { icon: Coffee, label: "Coffee Cart" },
      { icon: Truck, label: "Food Trucks" },
      { icon: Table, label: "6ft Table" },
      { icon: Table, label: "Bistro Table" },
      { icon: Pickaxe, label: "Round Table" },
    ],
  },
];

export default categories;