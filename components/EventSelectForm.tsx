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
import { Event } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LocationAdder from "./LocationCreator";
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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { GetEvent } from "@/lib/api/read/GetEvent";

export default function EventSelectForm({
  events,
}: {
  events: (Pick<Event, "id" | "name"> & { locations: { id: string }[] })[];
}) {
  const router = useRouter();
  const [notSelected, setSelected] = useState(true);
  const [isOpenLocationCreator, setIsOpenLocationCreator] = useState(false);
  const [eventId, setEventId] = useState("");
  const handleChange = (e: SelectChangeEvent) => {
    setSelected(false);
    setEventId(e.target.value);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event>();

  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [eventToCreate, setEventToCreate] = useState<string>("");

  const [dropdownEvents, setDropdownEvents] = useState<Event[]>(events);

  function deleteEvent(id: string) {
    DeleteEvent(id);
    setDeleteDialogOpen(false);
    setDropdownEvents(dropdownEvents.filter((e) => e.id != id));
  }

  async function createEvent(name: string) {
    const event = await CreateEvent(name);
    setInsertDialogOpen(false);
    setDropdownEvents([...dropdownEvents, event]);
    setEventId(event.id);
  }

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
                // border: "1px dashed #ccc",
                // borderRadius: "4px",
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
      <div className="mt-3 max-w-fit self-end">
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
      </div>
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
