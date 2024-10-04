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
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";

export type Event = {
  id: string;
  name: string;
};

export default function EventSelectForm({ events }: { events: Event[] }) {
  const [notSelected, setSelected] = useState(true);
  const handleChange = () => {
    setSelected(false);
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
      >
        Select
      </Button>
    </>
  );
}
