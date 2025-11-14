"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Palette } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { FreehandDrawingData } from "./FreehandDrawingNode";
import { ShapeData } from "./ShapeNode";
import { TextAnnotationData } from "./TextAnnotationNode";

const colorPresets = [
  "#000000", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500",
  "#800080", "#008080", "#808080", "#FFFFFF"
];

interface DrawingSettingsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  id: string;
  data: FreehandDrawingData | ShapeData | TextAnnotationData;
  type: "freehand" | "shape" | "text";
  handleLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleColorChange?: (color: string) => void;
  handleFillColorChange?: (fillColor: string) => void;
  handleFilledChange?: (filled: boolean) => void;
  handleStrokeWidthChange?: (width: number) => void;
  handleTextChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleBackgroundColorChange?: (color: string) => void;
  handleFontSizeChange?: (size: number) => void;
  handleFontWeightChange?: (weight: "normal" | "bold") => void;
  handleDelete: () => void;
}

export default function DrawingSettings({
  isOpen,
  setIsOpen,
  id,
  data,
  type,
  handleLabelChange,
  handleNotesChange,
  handleColorChange,
  handleFillColorChange,
  handleFilledChange,
  handleStrokeWidthChange,
  handleTextChange,
  handleBackgroundColorChange,
  handleFontSizeChange,
  handleFontWeightChange,
  handleDelete,
}: DrawingSettingsProps) {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className="absolute inset-0 popover-trigger"
          style={{ cursor: "move" }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`label-${id}`}>Label</Label>
            <Input
              id={`label-${id}`}
              value={data.label}
              onChange={handleLabelChange}
              placeholder="Enter label"
            />
          </div>

          {type === "text" && handleTextChange && (
            <div className="space-y-2">
              <Label htmlFor={`text-${id}`}>Text</Label>
              <Textarea
                id={`text-${id}`}
                value={(data as TextAnnotationData).text}
                onChange={handleTextChange}
                placeholder="Enter text"
                rows={3}
              />
            </div>
          )}

          {type === "text" && handleFontSizeChange && (
            <div className="space-y-2">
              <Label>Font Size: {(data as TextAnnotationData).fontSize || 16}px</Label>
              <Slider
                value={[(data as TextAnnotationData).fontSize || 16]}
                onValueChange={([value]) => handleFontSizeChange(value)}
                min={8}
                max={48}
                step={1}
              />
            </div>
          )}

          {type === "text" && handleFontWeightChange && (
            <div className="space-y-2">
              <Label>Font Weight</Label>
              <div className="flex gap-2">
                <Button
                  variant={(data as TextAnnotationData).fontWeight === "normal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFontWeightChange("normal")}
                >
                  Normal
                </Button>
                <Button
                  variant={(data as TextAnnotationData).fontWeight === "bold" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFontWeightChange("bold")}
                >
                  Bold
                </Button>
              </div>
            </div>
          )}

          {handleColorChange && (
            <div className="space-y-2">
              <Label>
                <Palette className="inline w-4 h-4 mr-1" />
                {type === "text" ? "Text Color" : "Stroke Color"}
              </Label>
              <div className="grid grid-cols-6 gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: color,
                      borderColor: data.color === color ? "#000" : "#ccc",
                    }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={data.color || "#000000"}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-10"
              />
            </div>
          )}

          {type === "text" && handleBackgroundColorChange && (
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="grid grid-cols-6 gap-2">
                <button
                  className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: (data as TextAnnotationData).backgroundColor === "transparent" ? "#000" : "#ccc",
                    backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)",
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 4px 4px",
                  }}
                  onClick={() => handleBackgroundColorChange("transparent")}
                />
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: color,
                      borderColor: (data as TextAnnotationData).backgroundColor === color ? "#000" : "#ccc",
                    }}
                    onClick={() => handleBackgroundColorChange(color)}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={(data as TextAnnotationData).backgroundColor !== "transparent"
                  ? (data as TextAnnotationData).backgroundColor
                  : "#FFFFFF"}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                className="w-full h-10"
              />
            </div>
          )}

          {type === "shape" && handleFillColorChange && handleFilledChange && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`filled-${id}`}
                  checked={(data as ShapeData).filled || false}
                  onCheckedChange={(checked) => handleFilledChange(!!checked)}
                />
                <Label htmlFor={`filled-${id}`}>Fill Shape</Label>
              </div>
              {(data as ShapeData).filled && (
                <div className="space-y-2">
                  <Label>Fill Color</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: color,
                          borderColor: (data as ShapeData).fillColor === color ? "#000" : "#ccc",
                        }}
                        onClick={() => handleFillColorChange(color)}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={(data as ShapeData).fillColor || "#FFFFFF"}
                    onChange={(e) => handleFillColorChange(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              )}
            </>
          )}

          {(type === "freehand" || type === "shape") && handleStrokeWidthChange && (
            <div className="space-y-2">
              <Label>
                Stroke Width: {(data as FreehandDrawingData | ShapeData).strokeWidth || 2}px
              </Label>
              <Slider
                value={[(data as FreehandDrawingData | ShapeData).strokeWidth || 2]}
                onValueChange={([value]) => handleStrokeWidthChange(value)}
                min={1}
                max={10}
                step={1}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`notes-${id}`}>Notes</Label>
            <Textarea
              id={`notes-${id}`}
              value={data.notes || ""}
              onChange={handleNotesChange}
              placeholder="Add notes..."
              rows={3}
            />
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
