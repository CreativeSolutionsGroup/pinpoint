"use client";

import { useEffect, useState, startTransition } from "react";
import { Location } from "@prisma/client";
import { CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { GetAllLocations } from "@/lib/api/read/GetAllLocations";
import { GetEvent } from "@/lib/api/read/GetEvent";
import { Label } from "./ui/label";
import { Plus, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import DeleteEntity from "@/lib/api/delete/DeleteEntity";
import LocationAdder from "./LocationCreator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  eventId: string;
  eventName: string;
};

export default function LocationList({ eventId, eventName }: Props) {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const { data: session } = useSession();
  const canEdit = session?.role === "ADMIN" || session?.role === "EDITOR";

  // added state
  const [locationAdderOpen, setLocationAdderOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<Location | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      try {
        const [eventData, allLocations] = await Promise.all([
          GetEvent(eventId),
          GetAllLocations(),
        ]);
        const filtered =
          allLocations
            ?.filter((l) =>
              eventData?.locations.some((evLoc) => evLoc.locationId === l.id)
            )
            .sort((a, b) => a.name.localeCompare(b.name)) || [];
        if (active) setLocations(filtered);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [eventId]);

  function handleClick(locationId: string) {
    setIsNavigating(true);
    startTransition(() => {
      router.push(`/event/edit/${eventId}/${locationId}`);
    });
  }

  function deleteLocation(id: string) {
    DeleteEntity("location", id, eventId);
    setLocations((prev) => prev.filter((l) => l.id !== id));
    setDeleteDialogOpen(false);
    setEntityToDelete(null);
  }

  return (
    <div className="mt-4 w-full">
      <Label htmlFor="eventLocations" className="font-semibold px-2">
        {eventName} Locations
      </Label>
      <div
        id="eventLocations"
        className="space-y-2 rounded-md border-gray-200 border-2 p-2 pt-0 transition-all duration-300 max-h-[45vh] overflow-y-auto"
      >
        {isLoading ? (
          <div className="flex justify-center items-center p-6">
            <CircularProgress size={30} />
          </div>
        ) : (
          <>
            {canEdit && (
              <div
                className="flex items-center justify-center sticky top-0 bg-white z-10 mt-1"
                onClick={() => {
                  if (canEdit) setLocationAdderOpen(true);
                }}
              >
                <div className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded-md transition-all duration-300 text-sm text-gray-600 cursor-pointer pr-2">
                  <Plus className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-300" />
                  Add Location
                </div>
              </div>
            )}
            {locations.length === 0 ? (
              <div className="flex justify-center items-center p-6">
                <Typography fontSize={14} color="text.secondary">
                  No locations linked to this event.
                </Typography>
              </div>
            ) : (
              locations.map((location) => (
                <div
                  key={location.id}
                  className="flex flex-row items-center justify-between w-full hover:bg-gray-100 p-2 rounded-md transition-all duration-300 cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest(".trash-button"))
                      return;
                    handleClick(location.id);
                  }}
                >
                  <div className="flex-1 text-sm text-gray-600 h-full flex items-stretch">
                    {location.name}
                  </div>
                  {canEdit && (
                    <Trash
                      className="trash-button h-4 w-4 text-red-500 cursor-pointer hover:text-red-600 hover:bg-red-100 transition-all duration-300 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEntityToDelete(location);
                        setDeleteDialogOpen(true);
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </>
        )}

        {isNavigating && (
          <div className="mt-4 flex justify-center">
            <CircularProgress size={22} />
          </div>
        )}
      </div>

      {/* LocationAdder modal */}
      <LocationAdder
        eventId={eventId}
        currentLocations={locations}
        isOpen={locationAdderOpen}
        redirect={false}
        shouldUpdateDB={true}
        onClose={() => setLocationAdderOpen(false)}
        onLocationChange={(location) => {
          setLocations((prev) =>
            [...prev, location].sort((a, b) => a.name.localeCompare(b.name))
          );
        }}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to delete "${entityToDelete?.name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setEntityToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (entityToDelete) deleteLocation(entityToDelete.id);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
