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
import EventPageTransitionWrapper from "@/components/EventPageTransitionWrapper";
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
      isCC: true,
      locations: {
        select: {
          id: true,
          locationId: true,
        },
      },
    },
  });

  return (
    <>
      <Box className="w-full mx-auto flex flex-col relative z-1">
        <Box mt={5}>
          <Heading />
        </Box>
        <EventPageTransitionWrapper exitDirection="left" entryDirection="right">
          <div className="relative">
            <EventSelectForm events={events} />
          </div>
        </EventPageTransitionWrapper>
        <Suspense>
          <ErrorToast />
        </Suspense>
      </Box>
      <div className="absolute w-3/4 left-0 bottom-0 pointer-events-none -z-30">
        <HomepageArrow />
      </div>
    </>
  );
}
