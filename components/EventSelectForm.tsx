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
import { Event, Location } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePageTransitionExit } from "@/components/EventPageTransitionWrapper";

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

import CreateEvent from "@/lib/api/create/createEvent";
import DeleteEntity from "@/lib/api/delete/DeleteEntity";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { EventWithLocationIds } from "@/types/Event";

export default function EventSelectForm({
  events,
}: {
  events: Array<EventWithLocationIds>;
}) {
  const router = useRouter();

  const [eventId, setEventId] = useState("");
  const [locationAdderOpen, setLocationAdderOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [eventToCreate, setEventToCreate] = useState<string>("");
  const [dropdownEvents, setDropdownEvents] = useState<Event[]>(events);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isNavigating, setIsNavigating] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<{
    entity: Event | Location;
    type: "event" | "location";
  }>();
  const [selectedEventLocations, setSelectedEventLocations] = useState<
    Location[]
  >([]);
  // exit handled by wrapper

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
    setSelectedEventLocations([]);
  }

  function deleteLocation(id: string, eventId: string) {
    DeleteEntity("location", id, eventId);
    setDeleteDialogOpen(false);
    setSelectedEventLocations(
      selectedEventLocations.filter((location) => location.id !== id)
    );
  }

  const handleChange = (e: SelectChangeEvent) => {
    const selectedEventId = e.target.value;
    if (selectedEventId === "newEvent") {
      setInsertDialogOpen(true);
      return;
    }
    setEventId(selectedEventId);
    exit(() => router.push(`/home/event/${selectedEventId}`));
  };
  const exit = usePageTransitionExit();

  const { data: session } = useSession();
  const canEdit = session?.role === "ADMIN" || session?.role === "EDITOR";

  return (
    <div className="p-8 w-full flex flex-col">
      <Typography
        variant="h6"
        align="center"
        mt={0.5}
        mb={1}
        color="primary.main"
      >
        Select an Event
      </Typography>
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
          // disabled during dialog; wrapper exit blocks interaction anyway
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
