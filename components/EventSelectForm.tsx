/**
 * @file EventSelectForm.tsx
 * @author Isaac Lloyd
 * @author Chase Evans
 * @param {Event[]} events - List of events to select from
 * @returns {JSX.Element} - Event select form
 * Event Select Form component to enable select button when an event is selected
 */

"use client";

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

import { Event } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function EventSelectForm({ events }: { events: Event[] }) {
  const router = useRouter();
  const [notSelected, setSelected] = useState(true);
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
    console.log(event.name);
    setInsertDialogOpen(false);
    setDropdownEvents([...dropdownEvents, event]);
    setEventId(event.id);
  }

  return (
    <>
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
                </div>
              </MenuItem>
            ))
            .reverse()}
          <MenuItem
            key={1}
            value={"newEvent"}
            onClick={() => setInsertDialogOpen(true)}
          >
            <div className="flex flex-row items-center justify-between w-full">
              <Typography fontSize={15}>Add Event</Typography>
              <Button color="success" size="small" className="ml-2">
                <AddIcon />
              </Button>
            </div>
          </MenuItem>
        </Select>
      </FormControl>
      <Button
        disabled={notSelected}
        variant="contained"
        sx={{ mt: 2, maxWidth: "fit-content", alignSelf: "end" }}
        onClick={() => router.push(`/event/${eventId}`)}
      >
        Select
      </Button>

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
                Enter the name of an event you would like to add
                <Input
                  autoFocus
                  onChange={(e) => {
                    console.log(e.target.value);
                    setEventToCreate(e.target.value);
                  }}
                />
              </AlertDialogDescription>
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
    </>
  );
}
