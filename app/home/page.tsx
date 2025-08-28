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

import ErrorToast from "@/components/ErrorToast";
import EventSelectForm from "@/components/EventSelectForm";
import Heading from "@/components/Heading";
import HomepageArrow from "@/components/svg/HomepageArrow";
import { prisma } from "@/lib/api/db";
import { Box } from "@mui/material";
import { Suspense } from "react";

// Collect all events from doradev database
export default async function EventSelect() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      isGS: true,
      locations: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <>
      <Box width="45rem" mx="auto" display="flex" flexDirection="column" sx={{ position:"relative", zIndex:1 }}>
        <Box mt={5}>
          <Heading />
        </Box>
        <EventSelectForm events={events} />
        <Suspense>
          <ErrorToast />
        </Suspense>
      </Box>
      <Box
        sx={{
          position: "fixed",
          width: "75%",
          left: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <HomepageArrow />
      </Box>
    </>
  );
}

