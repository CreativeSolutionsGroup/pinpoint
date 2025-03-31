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
import DeleteEvent from "@/lib/api/delete/deleteEvent";
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
  const [notSelected, setSelected] = useState(true);
  const [isOpenLocationCreator, setIsOpenLocationCreator] = useState(false);
  const [eventId, setEventId] = useState("");
  const [selectedEventLocations, setSelectedEventLocations] = useState<
    Location[]
  >([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event>();

  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [eventToCreate, setEventToCreate] = useState<string>("");

  const [dropdownEvents, setDropdownEvents] = useState<Event[]>(events);

  function deleteEvent(id: string) {
    DeleteEvent(id);
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

  const handleChange = async (e: SelectChangeEvent) => {
    setSelected(false);
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

  const handleClick = async () => {
    const selectedEvent = await GetEvent(eventId);

    if (selectedEvent && selectedEvent.locations.length === 0) {
      setIsOpenLocationCreator(true);
    } else {
      router.push(`/event/edit/${eventId}`);
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
                        setEventToDelete(event);
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
      {selectedEventLocations.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedEventLocations.map((location) => (
            <Button
              key={location.id}
              variant="outlined"
              onClick={() => {
                router.push(`/event/edit/${eventId}/${location.id}`);
              }}
            >
              {location.name}
            </Button>
          ))}
        </div>
      )}
      {/* <div className="mt-3 max-w-fit self-end">
        <Button
          disabled={notSelected}
          variant="contained"
          onClick={handleClick}
        >
          Select
        </Button>

        <LocationAdder
          eventId={eventId}
          currentLocations={[]}
          isOpen={isOpenLocationCreator}
          onClose={() => setIsOpenLocationCreator(false)}
        />
      </div> */}
      {/* Delete Event Dialog */}
      <AlertDialog open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {eventToDelete?.name || ""}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteEvent(eventToDelete!.id)}>
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
    </div>
  );
}
