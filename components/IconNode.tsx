"use client";

import * as Icons from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@mui/material";
import { useReactFlow } from '@xyflow/react';
import React from 'react';

export default function IconNode({ data, id }) {
  const { deleteElements } = useReactFlow();
  // Get the icon component from the Lucide icons
  const IconComponent = Icons[data.iconName];

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <IconComponent style={{color: data.color}} className="w-6 h-6 text-gray-700" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            Place content for the popover here.
            <Button onClick={handleDelete} color="warning">Delete</Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );

  /* return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-2 shadow-sm">
      <div className="flex flex-col items-center gap-1">
        {IconComponent && <IconComponent className="w-6 h-6 text-gray-700" />}
        <span className="text-xs text-gray-600">{data.label}</span>
      </div>
    </div>
  ); */
}
