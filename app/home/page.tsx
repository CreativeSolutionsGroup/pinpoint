/**
 * @file page.tsx
 * @description EventSelect component
 * @author Isaac Lloyd
 * @author Chase Evans
 * @return {JSX.Element} EventSelect component
 * 1. Collects all events from doradev database
 * 2. Wraps client rendered eventSelectForm in server side function to retrieve events from database
 * 3. Renders the eventSelectForm with the events retrieved from the database
 */

import { Box, Typography } from "@mui/material";
import Heading from "@/components/Heading";
import EventSelectForm from "@/components/EventSelectForm";
import { prisma } from "@/lib/api/db";
import ErrorToast from "@/components/ErrorToast";

// Collect all events from doradev database
export default async function EventSelect() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
    },
  });

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
        color="primary.main"
      >
        Select an Event
      </Typography>
      <EventSelectForm events={events} />
      <ErrorToast />
    </Box>
  );
}
