"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@components/ui/button";
import { Location } from "@prisma/client";
import { Panel } from "@xyflow/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";

interface EventMapsSelectProps {
  eventName: string;
  eventId: string;
  locations: Location[];
}

export default function EventMapsSelect({
  eventName,
  eventId,
  locations,
}: EventMapsSelectProps) {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const locationIds = locations.map((l) => l.id.toString());

  function nextLocation(direction: "forward" | "backward") {
    const currId = (params.locationId || locationIds[0]).toString();
    const currIndex = locationIds.indexOf(currId) || 0;

    const offset = direction === "forward" ? 1 : -1;
    const newIndex =
      (currIndex + offset + locationIds.length) % locationIds.length;

    if (params.mode && params.eventId && locationIds[newIndex]) {
      router.push(
        `/event/${params.mode}/${params.eventId}/${locationIds[newIndex]}`
      );
    }
  }

  return (
    <Panel position="bottom-right">
      <div className="bg-white text-black p-3 flex flex-col items-center rounded-xl border bg-card text-card-foreground shadow">
        <h1 className="text-center font-extrabold mb-2">{eventName}</h1>
        <div className="flex flex-row items-center space-x-3">
          <Tooltip title="Previous Location">
            <IconButton
              onClick={() => nextLocation("backward")}
              style={{ color: "black" }}
            >
              <ArrowBigLeftDash />
            </IconButton>
          </Tooltip>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Change Location</Button>
            </DialogTrigger>
            <DialogContent className="max-w-64">
              <DialogHeader>
                <DialogTitle>Choose a Different Map</DialogTitle>
              </DialogHeader>
              {locations
                .filter((v) => v.id === params.locationId?.[0])
                .map((location) => (
                  <fieldset
                    key={location.id}
                    className="border-2 border-black rounded pb-1.5 pt-0.25 text-sm text-center w-full"
                  >
                    <legend className="text-xs text-left ml-1 px-1 text-blue-500">
                      Current
                    </legend>
                    {location.name}
                  </fieldset>
                ))}
              {locations
                .filter((v) => v.id !== params.locationId?.[0])
                .map((location) => (
                  <Button
                    key={location.id}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(
                        `/event/${params.mode}/${eventId}/${location.id}`
                      );
                    }}
                  >
                    {location.name}
                  </Button>
                ))}
            </DialogContent>
          </Dialog>
          <Tooltip title="Next Location">
            <IconButton
              onClick={() => nextLocation("forward")}
              style={{ color: "black" }}
            >
              <ArrowBigRightDash />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Panel>
  );
}
