"use client";

import { muiTheme } from "@/theme";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Label } from "./ui/label";
import { Plus, Trash } from "lucide-react";
import { Event, Location } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, startTransition } from "react";
import LocationAdder from "./LocationCreator";
import PinpointLoader from "./PinpointLoader";

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

import CreateEvent from "@/lib/api/create/CreateEvent";
import DeleteEntity from "@/lib/api/delete/DeleteEntity";
import { GetEvent } from "@/lib/api/read/GetEvent";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { GetAllLocations } from "@/lib/api/read/GetAllLocations";
import { EventWithLocationIds } from "@/types/Event";

export default function EventSelectForm({
  events,
}: {
  events: Array<EventWithLocationIds>;
}) {
  const router = useRouter();

  const [eventSelected, setEventSelected] = useState(false);
  const [eventId, setEventId] = useState("");
  const [locationAdderOpen, setLocationAdderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [eventToCreate, setEventToCreate] = useState<string>("");
  const [dropdownEvents, setDropdownEvents] = useState<Event[]>(events);
  const [isNavigating, setIsNavigating] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<{
    entity: Event | Location;
    type: "event" | "location";
  }>();
  const [selectedEventLocations, setSelectedEventLocations] = useState<
    Location[]
  >([]);

  function deleteEvent(id: string) {
    DeleteEntity("event", id);
    setDeleteDialogOpen(false);
    setDropdownEvents(dropdownEvents.filter((e) => e.id != id));
    setEventId("");
    setEventSelected(false);
  }

  async function createEvent(name: string) {
    const event = await CreateEvent(name);
    setInsertDialogOpen(false);
    setDropdownEvents([...dropdownEvents, event]);
    setEventId(event.id);
    setSelectedEventLocations([]);
  }

  function deleteLocation(id: string, eventId: string) {
    DeleteEntity("location", id, eventId);
    setDeleteDialogOpen(false);
    setSelectedEventLocations(
      selectedEventLocations.filter((location) => location.id !== id)
    );
  }

  const handleChange = async (e: SelectChangeEvent) => {
    setEventSelected(true);
    setIsLoading(true);
    const selectedEventId = e.target.value;
    setEventId(selectedEventId);

    const selectedEvent = dropdownEvents.find(
      (event) => event.id === selectedEventId
    );
    if (selectedEvent) {
      const info = await GetEvent(selectedEventId);

      setSelectedEventLocations([]); // Clear the div by resetting the state

      const allLocations = await GetAllLocations();
      const updatedLocations = allLocations
        ?.filter((location) =>
          info?.locations.some(
            (eventLocation) => eventLocation.locationId === location.id
          )
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      setSelectedEventLocations(updatedLocations ?? []);
    }
    setIsLoading(false);
  };

  const { data: session } = useSession();
  const canEdit = session?.role === "ADMIN" || session?.role === "EDITOR";

  return (
    <div className="m-8 flex flex-col">
      <FormControl required fullWidth>
        <InputLabel id="selectEvent">Event</InputLabel>
        <Select
          value={eventId}
          defaultValue=""
          labelId="selectEvent"
          label="Event"
          name="eventSelected"
          onChange={handleChange}
          sx={{ width: "100%" }}
          renderValue={(selected) => {
            const event = dropdownEvents.find((e) => e.id === selected);
            return event ? (
              <Typography fontSize={15}>{event.name}</Typography>
            ) : null;
          }}
        >
          {dropdownEvents
            .map((event) => (
              <MenuItem key={event.id} value={event.id}>
                <div className="flex flex-row items-center justify-between w-full">
                  <Typography fontSize={15}>{event.name}</Typography>
                  {canEdit && (
                    <Button
                      color="warning"
                      size="small"
                      className="ml-2"
                      onClick={() => {
                        setDeleteDialogOpen(true);
                        setEntityToDelete({ entity: event, type: "event" });
                      }}
                    >
                      <RemoveIcon />
                    </Button>
                  )}
                </div>
              </MenuItem>
            ))
            .reverse()}
          {canEdit && (
            <MenuItem
              key={1}
              value={"newEvent"}
              onClick={() => setInsertDialogOpen(true)}
              sx={{
                backgroundColor: "#fafafa",
                "&:hover": {
                  backgroundColor: "rgba(4, 135, 217, 0.3)",
                },
                "&.Mui-selected": {
                  backgroundColor: "#fafafa",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "rgba(4, 135, 217, 0.3)",
                },
              }}
            >
              <div className="flex flex-row items-center justify-between w-full">
                <Typography fontSize={15} fontWeight="bold">
                  Add Event
                </Typography>
                <Button
                  size="small"
                  className="ml-2"
                  sx={{ color: muiTheme.palette.lightblue.main }}
                >
                  <AddIcon />
                </Button>
              </div>
            </MenuItem>
          )}
        </Select>
      </FormControl>

      {eventSelected && (
        <div className="mt-4">
          <Label htmlFor="eventLocations" className="font-semibold px-2">
            {dropdownEvents.find((event) => event.id === eventId)?.name ||
              "Event"}{" "}
            Locations
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
                <div
                  className="flex items-center justify-center sticky top-0 bg-white z-10 mt-1"
                  onClick={() => {
                    setLocationAdderOpen(true);
                  }}
                >
                  <div className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded-md transition-all duration-300 text-sm text-gray-600 cursor-pointer pr-2">
                    <Plus className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-300" />
                    Add Location
                  </div>
                </div>
                {selectedEventLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex flex-row items-center justify-between w-full hover:bg-gray-100 p-2 rounded-md transition-all duration-300 cursor-pointer"
                    onClick={(e) => {
                      // Prevent the click event from triggering when clicking the trash button
                      if ((e.target as HTMLElement).closest(".trash-button"))
                        return;

                      // Show loading immediately
                      setIsNavigating(true);

                      // Use startTransition for the navigation to indicate it's a UI update
                      startTransition(() => {
                        router.push(`/event/edit/${eventId}/${location.id}`);
                      });
                    }}
                  >
                    <div className="flex-1 text-sm text-gray-600 h-full flex items-stretch">
                      {location.name}{" "}
                    </div>
                    {canEdit && (
                      <Trash
                        className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-600 hover:bg-red-100 transition-all duration-300 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialogOpen(true);
                          setEntityToDelete({
                            entity: location,
                            type: "location",
                          });
                        }}
                      />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete</AlertDialogTitle>
            <AlertDialogDescription>
              {entityToDelete?.type === "event"
                ? `Are you sure you want to delete "${entityToDelete.entity.name}"?`
                : `Are you sure you want to delete "${
                    entityToDelete?.entity.name
                  }" from "${
                    dropdownEvents.find((event) => event.id === eventId)?.name
                  }"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (entityToDelete!.type === "location") {
                  deleteLocation(entityToDelete!.entity.id, eventId);
                } else {
                  deleteEvent(entityToDelete!.entity.id);
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={insertDialogOpen}>
        <AlertDialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (eventToCreate) {
                createEvent(eventToCreate);
              }
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Event</AlertDialogTitle>
              <AlertDialogDescription>
                Enter the name of an event you would like to add:
              </AlertDialogDescription>
              <Input
                autoFocus
                onChange={(e) => {
                  setEventToCreate(e.target.value);
                }}
              />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setInsertDialogOpen(false)}
                type="button"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction disabled={eventToCreate == ""} type="submit">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <LocationAdder
        eventId={eventId}
        currentLocations={selectedEventLocations}
        isOpen={locationAdderOpen}
        redirect={false}
        shouldUpdateDB={true}
        onClose={() => {
          setLocationAdderOpen(false);
        }}
        onLocationChange={(location) => {
          setSelectedEventLocations((prev) => [...prev, location]);
        }}
      />

      {isNavigating && <PinpointLoader />}
    </div>
  );
}
