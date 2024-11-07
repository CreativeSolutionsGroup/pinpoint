"use client";

import React from "react";
import { Panel } from "@xyflow/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Gamepad2,
  Speaker,
  Tv,
  Radio,
  Lightbulb,
  Tent,
  Trash2,
  Recycle,
  Cone,
  Frame,
  Coffee,
  Truck,
  Table,
  Pickaxe,
  Flag,
  Theater,
  Fence,
  Armchair,
  LucideIcon,
} from "lucide-react";

const IconItem = ({ icon, label }: { icon: LucideIcon; label: string }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const data = {
      type: "iconNode",
      iconName: icon.displayName, // Use the display name of the Lucide icon
      label,
    };
    event.dataTransfer.setData("application/reactflow", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-move"
      draggable
      onDragStart={onDragStart}
    >
      {React.createElement(icon, { className: "w-6 h-6 mb-1 text-gray-700" })}
      <span className="text-xs text-center text-gray-600">{label}</span>
    </div>
  );
};

const categories = [
  {
    title: "Games",
    value: "games",
    items: [
      { icon: Gamepad2, label: "Cornhole" },
      { icon: Gamepad2, label: "Spikeball" },
      { icon: Gamepad2, label: "Ping Pong" },
      { icon: Gamepad2, label: "9-Square" },
      { icon: Gamepad2, label: "Can-Jam" },
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
    title: "Site Furnishing",
    value: "site-furnishing",
    items: [
      //Chairs, Tents, Trash Cans, Recycling Bins, Stanchions, Cones, Stage
      //Pieces, A-Frames, Flags (yellow, navy, white, light blue)
      //{ icon: ChairOffice, label: "Chairs" }, // this icon didn't exist
      { icon: Tent, label: "Tents" },
      { icon: Trash2, label: "Trash Cans" },
      { icon: Recycle, label: "Recycling" },
      { icon: Fence, label: "Stanchions" },
      { icon: Cone, label: "Cones" },
      //{ icon: Stage, label: "Stage Pieces" }, // same here
      { icon: Frame, label: "A-Frames" },
      { icon: Theater, label: "Stage Items" },
      { icon: Flag, label: "Flags" },
      { icon: Armchair, label: "Chairs" },
    ],
  },
  {
    title: "Vending",
    value: "vending",
    items: [
      //Rinnova Coffee Cart, Food Trucks, Tables (6ft, Bistro, Round)
      { icon: Coffee, label: "Coffee Cart" },
      { icon: Truck, label: "Food Trucks" },
      { icon: Table, label: "6ft Table" },
      { icon: Table, label: "Bistro Table" },
      { icon: Pickaxe, label: "Round Table" },
    ],
  },
];

export default function Legend() {
  return (
    <Panel
      position="top-left"
      className="bg-white text-black p-5 border-2 flex flex-col w-72"
    >
      <h2 className="text-lg font-bold mb-4">ICONS</h2>
      <Accordion type="single" collapsible className="w-full">
        {categories.map((category) => (
          <AccordionItem key={category.value} value={category.value}>
            <AccordionTrigger>{category.title}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-2">
                {category.items.map((item, index) => (
                  <IconItem key={index} {...item} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Panel>
  );
}
