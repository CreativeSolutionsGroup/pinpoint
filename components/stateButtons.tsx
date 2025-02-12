"use client";
import { IconButton } from "@mui/material";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import { Panel } from "@xyflow/react";
import { Card } from "./ui/card";

export default function StateButtons() {
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);

  return (
    <Panel position="top-right">
      <Card className={`flex flex-${isMobile ? "col" : "row"} justify-center`}>
        <IconButton onClick={ () => console.log("Undo")}>
          <UndoIcon />
        </IconButton>

        <IconButton onClick={() => console.log("Redo")}>
          <RedoIcon />
        </IconButton>

        <IconButton onClick={() => console.log("Saved")}>
          <SaveIcon />
        </IconButton>
      </Card>
    </Panel>
  );
}
