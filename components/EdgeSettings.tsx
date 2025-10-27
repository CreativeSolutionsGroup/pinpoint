"use client";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import ColorMenu from "@components/ColorMenu";
import { Box, IconButton, Tooltip, Slider, Typography } from "@mui/material";
import { Trash } from "lucide-react";
import { CustomEdge } from "@/types/CustomEdge";

interface EdgeSettingsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEditable: boolean;
  id: string;
  data: CustomEdge["data"];
  handleLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleWidthChange: (width: number) => void;
  handleDelete: () => void;
  colorChange: (color: string) => void;
}

export default function EdgeSettings({
  isOpen,
  setIsOpen,
  isEditable,
  data,
  handleLabelChange,
  handleNotesChange,
  handleWidthChange,
  handleDelete,
  colorChange,
}: EdgeSettingsProps) {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {/* This will be rendered by the edge itself */}
        <div />
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="grid gap-4">
          {isEditable && (
            <div className="justify-center">
              <Input
                placeholder="Label"
                value={data?.label || ""}
                onChange={handleLabelChange}
              />
            </div>
          )}
          <Textarea
            placeholder="Add notes"
            defaultValue={data?.notes || ""}
            onChange={handleNotesChange}
            disabled={!isEditable}
          />
          {isEditable && (
            <>
              <Box className="flex place-content-between items-center gap-4">
                <Box className="flex-grow">
                  <Typography variant="caption" gutterBottom>
                    Wire Thickness: {data?.width || 1.5}px
                  </Typography>
                  <Slider
                    value={data?.width || 1.5}
                    onChange={(_, value) => handleWidthChange(value as number)}
                    min={0.5}
                    max={10}
                    step={0.5}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Tooltip title="Delete Edge">
                  <IconButton onClick={handleDelete} sx={{ color: "red" }}>
                    <Trash />
                  </IconButton>
                </Tooltip>
              </Box>
              <ColorMenu
                x={0}
                y={0}
                currentColor={data?.color ?? "#57B9FF"}
                changeColor={colorChange}
              />
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}