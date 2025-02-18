import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CreateLocation } from "@/lib/api/Location";
import { Input } from "./ui/input";
import { useState } from "react";

export default function LocationCreator({
  eventId,
  isOpen,
  onClose,
}: {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [locationName, setLocationName] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await CreateLocation({ eventId, locationId });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Location</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Location Name"
          className="w-full p-2 border border-gray-300 rounded"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
        <Select onValueChange={setLocationId}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent></SelectContent>
        </Select>
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded"
        >
          Create Location
        </button>
      </DialogContent>
    </Dialog>
  );
}
