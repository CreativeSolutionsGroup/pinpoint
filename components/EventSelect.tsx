"use client";

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";
import { Event } from "@prisma/client";

export default function EventSelect({ events }: { events: Event[] }) {
  const [notSelected, setselected] = useState(true);
  const handleChange = () => {
    setselected(false);
  };

  return (
    <Box width="45rem" mx="auto" display="flex" flexDirection="column">
      <Typography
        mx="auto"
        variant="h6"
        align="center"
        mt={0.5}
        mb={1}
        color="#da5a9f"
      >
        Select an Event
      </Typography>
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
    </Box>
  );
}
