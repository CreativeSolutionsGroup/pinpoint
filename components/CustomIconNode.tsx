"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Ensure you have this icon installed
import {IconButton, TextField} from "@mui/material";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {LucideIcon} from "lucide-react";
import * as LucideIcons from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const IconItem = ({
    icon: Icon,
    label,
    }: {
        icon: LucideIcon;
        label: string;
    }) => {
        const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        const data = {
            type: "iconNode",
            iconName: Icon.displayName, // Use the display name of the Lucide icon
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
            <Icon className="w-6 h-6 mb-1 text-gray-700" />
            <span className="text-xs text-center text-gray-600">{label}</span>
        </div>
        );
    };

function handleIconSelect() {}
function handleSearchIcons(input: string) {
  for (const [key, Icon] of Object.entries(LucideIcons)) {
    if (key.toLowerCase().includes(input.toLowerCase())) {
      console.log(key, Icon);
      // return <IconItem icon={Icon} label={key} />;
    }
  }
}

export default function CustomIconAccordion(){
    return (
        <AccordionItem key="custom-icons" value="custom-icons">
            <AccordionTrigger>Custom Icons</AccordionTrigger>
            <AccordionContent>
                {/* pool of "custom" icons we store in the database /}
              {/ <div className="grid grid-cols-3 gap-2">
                {category.items.map((item, index) => (
                  <IconItem key={index} {...item} />
                ))}
              </div> */}
                <Dialog>
                    <DialogTrigger asChild>
                        <IconButton>
                        <AddCircleIcon/>
                        </IconButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a Custom Icon</DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                          <TextField label="Search Icons"
                          variant="outlined"
                          size="medium"
                          onChange={(e) => handleSearchIcons(e.target.value)}/>
                        </div>
                        <div>
                            {Object.entries(LucideIcons).map(([key, Icon]) => (
                                <IconItem icon={Icon} key={key}/>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </AccordionContent>
          </AccordionItem>
    );
}