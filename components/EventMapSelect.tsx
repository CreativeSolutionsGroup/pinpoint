"use client"
import { Panel } from "@xyflow/react";
import { Button } from "@components/ui/button";
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EventMapsSelect({ eventId, locations }) {
  const router = useRouter()

  return (
    <Panel
      position="bottom-left"
      className="bg-white text-black p-5 border-2 flex flex-col w-36"
    >
      <Dialog>
        <DialogTrigger>Maps</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose a map location</DialogTitle>
            <DialogDescription>
              {locations.map((location) => <Button key={location.id} onClick={() => router.push(`/event/${eventId}/${location.id}`)}>{location.name}</Button>)}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}
