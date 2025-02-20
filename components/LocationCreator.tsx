import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CreateLocation } from "@/lib/api/create/CreateLocation";
import { GetAllLocations } from "@/lib/api/read/GetAllLocations";
import { Location } from "@prisma/client";
import { useEffect, useState } from "react";

export default function LocationCreator({
  eventId,
  isOpen,
  onClose,
}: {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await CreateLocation({ eventId, locationId });
    onClose();
  }

  useEffect(() => {
    GetAllLocations().then((locations) => setLocations(locations ?? []));
  }, []);

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
            Create Location
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
