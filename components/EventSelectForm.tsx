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
} from "@mui/material";
import { Label } from "./ui/label";
import { Plus, Trash } from "lucide-react";
import { Event, Location } from "@prisma/client";
import LocationAdder from "./LocationCreator";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

import CreateEvent from "@/lib/api/create/createEvent";
import DeleteEntity from "@/lib/api/delete/DeleteEntity";
import { GetEvent } from "@/lib/api/read/GetEvent";
import { GetLocationInfo } from "@/lib/api/read/GetLocationInfo";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function EventSelectForm({
  events,
}: {
  events: (Pick<Event, "id" | "name"> & {
    locations: { id: string; name: string }[];
  })[];
}) {
  const router = useRouter();
  const [eventSelected, setEventSelected] = useState(false);
  const [eventId, setEventId] = useState("");
  const [selectedEventLocations, setSelectedEventLocations] = useState<
    Location[]
  >([]);
  const [locationAdderOpen, setLocationAdderOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<{
    entity: Event | Location;
    type: "event" | "location";
  }>();

  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [eventToCreate, setEventToCreate] = useState<string>("");

  const [dropdownEvents, setDropdownEvents] = useState<Event[]>(events);

  function deleteEvent(id: string) {
    DeleteEntity("event", id);
    setDeleteDialogOpen(false);
    setDropdownEvents(dropdownEvents.filter((e) => e.id != id));
    setEventId("");
  }

  async function createEvent(name: string) {
    const event = await CreateEvent(name);
    setInsertDialogOpen(false);
    setDropdownEvents([...dropdownEvents, event]);
    setEventId(event.id);
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
    const selectedEventId = e.target.value;
    setEventId(selectedEventId);

    const selectedEvent = dropdownEvents.find(
      (event) => event.id === selectedEventId
    );
    if (selectedEvent) {
      const info = await GetEvent(selectedEventId);

      setSelectedEventLocations([]); // Clear the div by resetting the state
      info?.locations.forEach(async (location) => {
        const locationInfo = await GetLocationInfo(location.locationId);
        console.log(locationInfo);
        if (locationInfo) {
          setSelectedEventLocations((prev) => [...prev, locationInfo]);
        }
      });
    }
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
        {selectedEventLocations.map((location) => (
          <div
          key={location.id}
          className="flex flex-row items-center justify-between w-full hover:bg-gray-100 p-2 rounded-md transition-all duration-300 cursor-pointer"
          onClick={(e) => {
            // Prevent the click event from triggering when clicking the trash button
            if ((e.target as HTMLElement).closest(".trash-button"))
            return;
            router.push(`/event/edit/${eventId}/${location.id}`);
          }}
          >
          <div className="flex-1 text-sm text-gray-600 h-full flex items-stretch">
            {location.name}{" "}
          </div>
          {canEdit && (
            <Button
            color="warning"
            size="small"
            className="ml-2 trash-button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogOpen(true);
              setEntityToDelete({ entity: location, type: "location" });
            }}
            >
            <Trash className="h-4 w-4" />
            </Button>
          )}
          </div>
            ))}
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
        onClose={() => {
          setLocationAdderOpen(false);
        }}
        onLocationChange={(location) => {
          setSelectedEventLocations((prev) => [...prev, location]);
        }}
      />
    </div>
  );
}
