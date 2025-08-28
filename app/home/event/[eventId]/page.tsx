import { GetEvent } from "@/lib/api/read/GetEvent";
import LocationList from "@/components/LocationList";
import EventPageTransitionWrapper from "@/components/EventPageTransitionWrapper";
import Heading from "@/components/Heading";
import { Box } from "@mui/material";
import HomepageArrow from "@/components/svg/HomepageArrow";

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
        <Box width="45rem" mx="auto" display="flex" flexDirection="column">
            <Box mt={5}>
                <Heading />
            </Box>
            {event && (
            <EventPageTransitionWrapper>
                <div>
                <LocationList eventId={event.id} eventName={event.name} />
                </div>
            </EventPageTransitionWrapper>
            )}
        </Box>
        <Box sx={{
          position: "fixed",
          width: "75%",
          left: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}>
            <HomepageArrow />
        </Box>
    </>
  );
}