import { GetEvent } from "@/lib/api/read/GetEvent";
import LocationList from "@/components/LocationList";
import EventPageTransitionWrapper from "@/components/EventPageTransitionWrapper";
import Heading from "@/components/Heading";
import { Box } from "@mui/material";
import HomepageArrow from "@/components/svg/HomepageArrow";
import BackToEventSelectButton from "@/components/BackToEventSelectButton";
import type { EventWithLocations } from "@/types/Event";

type EventPageParams = {
  eventId: string;
};

export default async function LocationSelectPage({
  params,
}: {
  params: Promise<EventPageParams>;
}) {
  const eventId = (await params).eventId;
  const event: EventWithLocations | null = await GetEvent(eventId);

  return (
    <Box className="w-full relative">
      <Box mt={5}>
        <Heading event={event} />
      </Box>
      <Box className="w-[45rem] mx-auto flex flex-col z-1">
        {event && (
          <EventPageTransitionWrapper exitDirection="right" entryDirection="right">
            <div className="relative flex flex-col gap-4 mt-5">
              <BackToEventSelectButton />
              <LocationList eventId={event.id} eventName={event.name} />
            </div>
          </EventPageTransitionWrapper>
        )}
      </Box>
      <Box className="absolute w-3/4 left-0 bottom-0 pointer-events-none -z-30">
        <HomepageArrow />
      </Box>
    </Box>
  );
}