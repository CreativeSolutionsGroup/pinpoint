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

interface EventMapsSelectProps {
  eventId: string;
  locations: Location[];
}

export default function EventMapsSelect({ eventId, locations }: EventMapsSelectProps) {
  const router = useRouter();
  const params = useParams();
  
  return (
    <Panel
      position="bottom-center"
      className="bg-white text-black p-5 border-2 flex flex-col w-36"
    >
      <Dialog>
        <DialogTrigger>Maps</DialogTrigger>
        <DialogContent className="max-w-64">
          <DialogHeader>
            <DialogTitle>Choose a map location</DialogTitle>
            {locations.map((location) => (
              <Button
                key={location.id}
                onClick={() => router.push(`/event/${params.mode}/${eventId}/${location.id}`)}
              >
                {location.name}
              </Button>
            ))}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}