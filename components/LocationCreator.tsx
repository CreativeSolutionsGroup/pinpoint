"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  AddLocationToEvent,
  CreateNewLocation,
} from "@/lib/api/create/CreateLocation";
import { GetAllLocations } from "@/lib/api/read/GetAllLocations";
import { Location } from "@prisma/client";
import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export default function LocationAdder({
  eventId,
  currentLocations,
  setCurrentLocations,
  isOpen,
  redirect = true,
  onClose,
  onLocationChange,
  shouldUpdateDB,
}: {
  eventId: string;
  currentLocations: Location[];
  setCurrentLocations?: (locations: Location[]) => void;
  isOpen: boolean;
  redirect?: boolean;
  onClose: () => void;
  onLocationChange?: (location: Location) => void; // Updated to pass the full location object
  shouldUpdateDB?: boolean;
}) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState<string>("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newLocation = updateLocations(locations.find((v) => v.id === locationId) as Location);
    if (shouldUpdateDB) {
      const newEventLocation = await AddLocationToEvent({
        eventId,
        locationId,
      });
      if(onLocationChange && newLocation) {
        onLocationChange(newLocation);
      }
      redirect
        ? router.push(`/event/edit/${eventId}/${newEventLocation.locationId}`)
        : onClose();
    }
    onClose();
  }

  useEffect(() => {
    GetAllLocations().then((locations) =>
      setLocations(
        (
          locations?.filter(
            (v) => !currentLocations?.find((x) => x.id === v.id)
          ) ?? []
        ).sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }, [currentLocations]);

  function updateLocations(newLocation: Location) {
    setCurrentLocations &&
      setCurrentLocations([...currentLocations, newLocation]);
    return newLocation;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Create Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Select onValueChange={setLocationId}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="submit"
            className="w-full p-2 mt-4 text-white bg-blue-500 rounded"
          >
            Add Location
          </button>
        </form>
        <Divider className="my-4">OR</Divider>
        <form
          action={async (data) => {
            const locationName = data.get("locationName")?.toString();
            const imageURL = data.get("imageURL")?.toString();
            if (locationName && imageURL) {
              const newLocation = await CreateNewLocation(
                locationName,
                imageURL
              );
              const eventLocationLink = await AddLocationToEvent({
                eventId,
                locationId: newLocation.id,
              });
              if (shouldUpdateDB && onLocationChange) {
                onLocationChange(newLocation); // Pass the new location object
                redirect ? router.push(eventLocationLink.id) : onClose();
              }
            }
          }}
        >
          <Input
            className="mb-2"
            placeholder="Location Name"
            name="locationName"
            required
          />
          <Input
            className="mb-2"
            placeholder="Image URL"
            name="imageURL"
            required
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded"
            onClick={onClose}
          >
            Create New Location
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
