"use client";
import { IconButton, Tooltip } from "@mui/material";
import { Panel } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import EventSettings from "@/components/EventSettings";
import { Event, Location } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Undo, Redo, Save, Home } from "lucide-react";

export default function ControlButtons(props: {
  undo: () => void;
  redo: () => void;
  event: Event;
  eventLocations: Location[];
}) {
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);

  const { event, eventLocations } = props;
  const router = useRouter();

  return (
    <Panel position="top-right">
      <Card className={`flex flex-${isMobile ? "col" : "row"} justify-center`}>
        <Tooltip title="Undo">
          <IconButton onClick={props.undo} style={{ color: "black" }}>
            <Undo />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton onClick={props.redo} style={{ color: "black" }}>
            <Redo />
          </IconButton>
        </Tooltip>
        <Tooltip title="Save">
          <IconButton style={{ color: "black" }}>
            <Save />
          </IconButton>
        </Tooltip>
        <Tooltip title="Home">
          <IconButton
            onClick={() => router.push("/home")}
            style={{ color: "black" }}
          >
            <Home />
          </IconButton>
        </Tooltip>
        <EventSettings event={event} locations={eventLocations} />
      </Card>
    </Panel>
  );
}
