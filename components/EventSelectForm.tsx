/**
 * @file EventSelectForm.tsx
 * @author Isaac Lloyd
 * @author Chase Evans
 * @param {Event[]} events - List of events to select from
 * @param {boolean} isEditable - Does the user have edit permissions?
 * @returns {JSX.Element} - Event select form
 */

"use client";

import {
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { Event } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function EventSelectForm({
  events,
}: {
  events: Pick<Event, "id" | "name">[];
}) {
  const router = useRouter();
  const [notSelected, setSelected] = useState(true);
  const [eventId, setEventId] = useState("");
  const handleChange = (e: SelectChangeEvent) => {
    setSelected(false);
    setEventId(e.target.value);
  };

  const handleClick = () => {
    // always push to /edit, it'll auto redirect
    // if user doesn't have permission
    router.push(`/event/edit/${eventId}`);
  };

  return (
    <>
      <FormControl required fullWidth>
        <InputLabel id="selectEvent">Event</InputLabel>
        <Select
          defaultValue=""
          labelId="selectEvent"
          label="Event"
          name="eventSelected"
          onChange={handleChange}
          sx={{ width: "100%" }}
        >
          {events.length !== 0 ? (
            events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                <Typography fontSize={15}>{event.name}</Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem key={1} value={"noEvent"}>
              <Typography fontSize={15}>No events to select</Typography>
            </MenuItem>
          )}
        </Select>
      </FormControl>
      <Button
        disabled={notSelected}
        variant="contained"
        sx={{ mt: 2, maxWidth: "fit-content", alignSelf: "end" }}
        onClick={handleClick}
      >
        Select
      </Button>
    </>
  );
}
