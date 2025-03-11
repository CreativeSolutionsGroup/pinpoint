"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@components/ui/button";
import { Divider } from "@mui/material";
import { Location } from "@prisma/client";
import { Panel } from "@xyflow/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import LocationAdder from "./LocationCreator";

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

  const [isOpenLocationAdder, setIsOpenLocationAdder] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Panel
      position="bottom-center"
      className="bg-white text-black p-5 border-2 flex flex-col w-36"
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>Switch Map</DialogTrigger>
        <DialogContent className="max-w-64">
          <DialogTitle>Choose a Different Map</DialogTitle>
          {locations.filter(v => v.id !== (params.locationId?.[0])).map((location) => (
            <Button
              key={location.id}
              onClick={() => {
                setIsOpen(false);
                router.push(`/event/${params.mode}/${eventId}/${location.id}`);
              }}
            >
              {location.name}
            </Button>
          ))}
          <Divider>OR</Divider>
          <button
            onClick={() => {
              setIsOpen(false);
              setTimeout(() => setIsOpenLocationAdder(true), 300);
            }}
            className="w-full p-2 text-white bg-blue-500 rounded"
          >
            Add Location
          </button>
        </DialogContent>
      </Dialog>

      <LocationAdder
        eventId={eventId}
        currentLocations={locations}
        isOpen={isOpenLocationAdder}
        onClose={() => setIsOpenLocationAdder(false)}
      />
    </Panel>
  );
}
