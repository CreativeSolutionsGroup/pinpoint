"use client";
import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SaveIcon from "@mui/icons-material/Save";
import { Panel } from "@xyflow/react";
import { Card } from "./ui/card";

export default function StateButtons(props: {
  undo: () => void;
  redo: () => void;
}) {
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);

  return (
    <Panel position="top-right">
      <Card className={`flex flex-${isMobile ? "col" : "row"} justify-center`}>
        <IconButton onClick={props.undo} style={{ color: "black" }}>
          <UndoIcon />
        </IconButton>

        <IconButton onClick={props.redo} style={{ color: "black" }}>
          <RedoIcon />
        </IconButton>

        <IconButton
          onClick={() => console.log("Saved")}
          style={{ color: "black" }}
        >
          <SaveIcon />
        </IconButton>
      </Card>
    </Panel>
  );
}
