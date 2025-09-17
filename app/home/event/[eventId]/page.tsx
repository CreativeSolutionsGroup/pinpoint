import { GetEvent } from "@/lib/api/read/GetEvent";
import LocationList from "@/components/LocationList";
import EventPageTransitionWrapper from "@/components/EventPageTransitionWrapper";
import Heading from "@/components/Heading";
import { Box } from "@mui/material";
import HomepageArrow from "@/components/svg/HomepageArrow";
import BackToEventSelectButton from "@/components/BackToEventSelectButton";

type EventPageParams = {
  eventId: string;
};

export default async function LocationSelectPage({
  params,
}: {
  params: Promise<EventPageParams>;
}) {
  const event = await GetEvent((await params).eventId);

  return (
    <>
      <Box width={{ xs: "100%", sm: "40rem", md: "45rem" }} mx="auto" display="flex" flexDirection="column" px={{ xs: 2, sm: 0 }}>
        <Box mt={5}>
          <Heading />
        </Box>
        {event && (
          <EventPageTransitionWrapper
            exitDirection="right"
            entryDirection="right"
          >
            <div className="flex flex-col gap-4 mt-5">
              <BackToEventSelectButton />
              <LocationList eventId={event.id} eventName={event.name} />
            </div>
          </EventPageTransitionWrapper>
        )}
      </Box>
      <div className="absolute w-3/4 left-0 bottom-0 pointer-events-none -z-30">
        <HomepageArrow />
      </div>
    </>
  );
}
