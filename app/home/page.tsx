"use client";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import Heading from "@/components/Heading";

export default function EventSelect() {
  // TEMPORARY: WILL BE REPLACED WITH CALL TO DB
  const events = [
    { id: "20092", name: "Where's Diego?" },
    { id: "28387", name: "I'm the Map!" },
    { id: "09313", name: "Swiper, No Swiping!!" },
  ];

  const [notSelected, setselected] = useState(true);
  const handleChange = () => {
    setselected(false);
  };

  return (
    <Box width="45rem" mx="auto" display="flex" flexDirection="column">
      <Box mt={5}>
        <Heading />
      </Box>
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
