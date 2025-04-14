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

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Panel position="bottom-left">
      <div className="bg-white text-black p-4 flex flex-col rounded-xl border bg-card text-card-foreground shadow">
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
      </div>
    </Panel>
  );
}
