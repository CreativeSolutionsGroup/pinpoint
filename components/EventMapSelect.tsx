"use client";
import { Panel } from "@xyflow/react";
import { Button } from "@components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Location } from "@prisma/client";
import { useState } from "react";
import LocationCreator from "./LocationCreator";

interface EventMapsSelectProps {
  eventId: string;
  locations: Location[];
}

export default function EventMapsSelect({
  eventId,
  locations,
}: EventMapsSelectProps) {
  const router = useRouter();
  const params = useParams();

  const [isOpenLocationCreator, setIsOpenLocationCreator] = useState(false);

  return (
    <Panel
      position="bottom-center"
      className="bg-white text-black p-5 border-2 flex flex-col w-36"
    >
      <Dialog>
        <DialogTrigger>Maps</DialogTrigger>
        <DialogContent className="max-w-64">
          <DialogTitle>Choose a Map Location</DialogTitle>
          {locations.map((location) => (
            <Button
              key={location.id}
              onClick={() =>
                router.push(`/event/${params.mode}/${eventId}/${location.id}`)
              }
            >
              {location.name}
            </Button>
          ))}
          <Button onClick={() => setIsOpenLocationCreator(true)}>
            Create Location
          </Button>
        </DialogContent>
      </Dialog>

      <LocationCreator
        eventId={eventId}
        isOpen={isOpenLocationCreator}
        onClose={() => setIsOpenLocationCreator(false)}
      />
    </Panel>
  );
}
