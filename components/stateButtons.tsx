"use client";
import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SaveIcon from "@mui/icons-material/Save";
import { Panel } from "@xyflow/react";
import { Card } from "./ui/card";
import EventSettings from "./EventSettings";
import { Event, Location } from "@prisma/client";

export default function StateButtons(props: {
  undo: () => void;
  redo: () => void;
  event: Event;
  eventLocations: Location[];
}) {
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);

  const { event, eventLocations } = props;

  return (
    <Panel position="top-right">
      <Card className={`flex flex-${isMobile ? "col" : "row"} justify-center`}>
        <IconButton onClick={props.undo} style={{ color: "black" }}>
          <UndoIcon />
        </IconButton>

        <IconButton onClick={props.redo} style={{ color: "black" }}>
          <RedoIcon />
        </IconButton>

        <IconButton style={{ color: "black" }}>
          <SaveIcon />
        </IconButton>
        <EventSettings event={event} locations={eventLocations} />
      </Card>
    </Panel>
  );
}
