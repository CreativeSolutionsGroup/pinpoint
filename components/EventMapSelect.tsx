"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@components/ui/button";
import { Card, CardContent, Divider } from "@mui/material";
import { Location } from "@prisma/client";
import { Panel } from "@xyflow/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import LocationAdder from "./LocationCreator";
import NavButtons from "./navButtons";

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
    <Panel position="bottom-left" className="">
      <Card>
        <CardContent className="p-4 flex flex-col">
          <NavButtons locations={locations} />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Change Location</Button>
            </DialogTrigger>
            <DialogContent className="max-w-64">
              <DialogHeader>
                <DialogTitle>Choose a Different Map</DialogTitle>
              </DialogHeader>
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
              {locations.length > 1 && <Divider>OR</Divider>}
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
        </CardContent>
      </Card>

      <LocationAdder
        eventId={eventId}
        currentLocations={locations}
        isOpen={isOpenLocationAdder}
        onClose={() => setIsOpenLocationAdder(false)}
      />
    </Panel>
  );
}
