"use client";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { NextPlan } from "@mui/icons-material";
import ColorMenu from "@components/ColorMenu";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { Trash, Clipboard, CopyPlus } from "lucide-react";
import ResizeMenu from "./ResizeMenu";
import { CustomNode } from "@/types/CustomNode";

interface MobileIconSettingsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLandscape: boolean;
  isEditable: boolean;
  activeNodeId: string | null;
  id: string;
  data: CustomNode["data"];
  IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  handleLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleResize: (size: number) => void;
  handleCopy: () => void;
  handleDup: () => void;
  handleDelete: () => void;
  colorChange: (color: string) => void;
  handleRotateClockwise: () => void;
  handleRotateCounterClockwise: () => void;
}

export default function MobileIconSettings({
  isOpen,
  setIsOpen,
  isLandscape,
  isEditable,
  activeNodeId,
  id,
  data,
  IconComponent,
  handleLabelChange,
  handleNotesChange,
  handleResize,
  handleCopy,
  handleDup,
  handleDelete,
  colorChange,
  handleRotateClockwise,
  handleRotateCounterClockwise,
}: MobileIconSettingsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        style={{
          borderColor: data.color,
        }}
        className="popover-trigger flex flex-col items-center justify-center cursor-move"
      >
        {(activeNodeId === id || isOpen) && (
          <>
            <div
              onClick={(e) => {
                e.stopPropagation(); // Prevent popover from triggering
                handleRotateClockwise();
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translate(${
                  ((data.size == 1 ? 1.5 : data.size) ?? 3) * 15
                }px, 0) rotate(90deg)`,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
              }}
              className="nodrag"
            >
              <NextPlan sx={{ color: "white" }} />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation(); // Prevent popover from triggering
                handleRotateCounterClockwise();
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translate(-${
                  ((data.size == 1 ? 1.5 : data.size) ?? 3) * 15
                }px, 0) scale(-1, 1) rotate(90deg)`,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
              }}
              className="nodrag"
            >
              <NextPlan sx={{ color: "white" }} />
            </div>
          </>
        )}
        <div
          style={{
            transform: `rotate(${Math.round(data.rotation / 45) * 45}deg)`,
          }}
        >
          <IconComponent
            style={{
              color: data.color,
              width: `${data.size ?? 3}rem`,
              height: `${data.size ?? 3}rem`,
            }}
            className="text-gray-700"
          />
        </div>
        <Typography
          style={{
            color: data.color,
            width: "100%",
            fontSize: `${(data.size ?? 3) / 3}rem`,
            lineHeight: `${(data.size ?? 3) / 3}rem`,
            textWrap: "wrap",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            maxWidth: `${(data.size ?? 3) * 3}rem`,
          }}
          className="text-center text-wrap"
        >
          {data.label}
        </Typography>
      </DialogTrigger>
      <DialogContent
        className="w-fit"
        style={
          isLandscape
            ? {
                width: "80vw",
                maxWidth: "90vw",
                height: "auto",
                maxHeight: "calc(100vh - 2rem)",
                borderRadius: 0,
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
              }
            : {
                maxWidth: "90vw",
                maxHeight: "100vh",
              }
        }
      >
        <DialogTitle className="text-lg font-semibold">
          Icon Settings
        </DialogTitle>
        <div className="grid gap-4">
          {isEditable && isLandscape && (
            <div className="grid gap-2 grid-cols-[1fr_auto] w-full items-start">
              <div className="flex flex-col gap-2 w-full">
                <Input
                  value={data.label}
                  onChange={handleLabelChange}
                  className="w-full"
                />
                <Textarea
                  placeholder="Add notes"
                  defaultValue={data.notes}
                  onChange={handleNotesChange}
                  disabled={!isEditable}
                  className="w-full h-32 overflow-y-auto resize-none"
                />
              </div>
              <div className="shrink-0 pt-1">
                <ColorMenu
                  x={0}
                  y={0}
                  currentColor={data.color ?? "#000000"}
                  changeColor={colorChange}
                />
              </div>
            </div>
          )}
          {isEditable && !isLandscape && (
            <div className="justify-center">
              <Input value={data.label} onChange={handleLabelChange} />
            </div>
          )}
          {!isLandscape && (
            <div className="flex-1 flex min-h-0">
              <Textarea
                placeholder="Add notes"
                defaultValue={data.notes}
                onChange={handleNotesChange}
                disabled={!isEditable}
                className="flex-1 h-full w-full resize-none"
                style={{ minHeight: 0 }}
              />
            </div>
          )}
          {isEditable && (
            <Box className="flex place-content-between">
              <ResizeMenu
                onResize={handleResize}
                currentSize={data.size ?? 2}
              />
              <Box>
                <Tooltip title="Copy Node">
                  <IconButton
                    onClick={() => handleCopy()}
                    sx={{ color: "black" }}
                  >
                    <Clipboard />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicate Node">
                  <IconButton
                    onClick={() => handleDup()}
                    sx={{ color: "black" }}
                  >
                    <CopyPlus />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Node">
                  <IconButton onClick={handleDelete} sx={{ color: "red" }}>
                    <Trash />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
          {isEditable && !isLandscape && (
            <ColorMenu
              x={0}
              y={0}
              currentColor={data.color ?? "#000000"}
              changeColor={colorChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}