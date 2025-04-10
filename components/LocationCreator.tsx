"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  AddLocationToEvent,
  CreateNewLocation,
} from "@/lib/api/create/CreateLocation";
import { GetAllLocations } from "@/lib/api/read/GetAllLocations";
import { Location } from "@prisma/client";
import { useEffect, useState } from "react";
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
  onLocationChange?: (location: Location) => void;
  shouldUpdateDB?: boolean;
}) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("add");
  const [locationName, setLocationName] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newLocation = updateLocations(
        locations.find((v) => v.id === locationId) as Location
      );

      if (shouldUpdateDB) {
        const newEventLocation = await AddLocationToEvent({
          eventId,
          locationId,
        });

        if (onLocationChange && newLocation) {
          onLocationChange(newLocation);
        }

        if (redirect) {
          router.push(`/event/edit/${eventId}/${newEventLocation.locationId}`);
        } else {
          handleOnClose();
        }
      } else {
        handleOnClose();
      }
    } catch (error) {
      console.error("Error adding location:", error);
    } finally {
      setIsLoading(false);
    }
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

  async function handleCreateLocation(data: FormData) {
    setIsLoading(true);

    try {
      const locationName = data.get("locationName")?.toString();
      const imageURL = data.get("imageURL")?.toString();

      if (locationName && imageURL) {
        const newLocation = await CreateNewLocation(locationName, imageURL);

        const eventLocationLink = await AddLocationToEvent({
          eventId,
          locationId: newLocation.id,
        });

        if (shouldUpdateDB && onLocationChange) {
          onLocationChange(newLocation);

          if (redirect) {
            router.push(eventLocationLink.id);
          } else {
            handleOnClose();
          }
        }
      }
    } catch (error) {
      console.error("Error creating location:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOnClose = () => {
    setLocationId("");
    setLocationName("");
    setImageURL("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnClose}>
      <DialogContent className="sm:max-w-md w-full p-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2">
            {currentTab === "add" ? "Add" : "Create"} Location
          </DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="add"
          className="w-full"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="add">Add Existing</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          <TabsContent value="add" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="location-select"
                  className="text-sm font-medium"
                >
                  Location
                </label>
                <Select onValueChange={setLocationId} value={locationId}>
                  <SelectTrigger id="location-select" className="w-full">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.length > 0 ? (
                      locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No available locations
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-400 text-white hover:bg-blue-500"
                disabled={!locationId || isLoading}
              >
                {isLoading ? "Adding..." : "Add Location"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="create" className="space-y-4">
            <form action={handleCreateLocation} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="location-name" className="text-sm font-medium">
                  Location Name
                </label>
                <Input
                  id="location-name"
                  placeholder="Enter location name"
                  name="locationName"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="image-url" className="text-sm font-medium">
                  Image URL
                </label>
                <Input
                  id="image-url"
                  placeholder="Enter image URL"
                  name="imageURL"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-400 text-white hover:bg-blue-500"
                disabled={isLoading || !locationName.trim() || !imageURL.trim()}
              >
                {isLoading ? "Creating..." : "Create Location"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
