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
import { Card, CardContent } from "./ui/card";
import NavButtons from "./navButtons";
import { Panel } from "@xyflow/react";
import { useParams, useRouter } from "next/navigation";

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

  return (
      <Panel
      position="bottom-left"
      className=""
      >
        <Card>
        <CardContent className="p-4 flex flex-col">
          <NavButtons locations={locations} />
          <Dialog>
            <DialogTrigger asChild><Button>Change Location</Button></DialogTrigger>
              <DialogContent className="max-w-64">
                <DialogHeader>
                  <DialogTitle className="pb-1">Change Location</DialogTitle>
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
          </CardContent>
        </Card>
      </Panel>
  );
}
