import { Box } from "@mui/material";
import Image from "next/image";
import PinpointLogoColor from "@/public/pinpoint-logo-color.png";
import EventBreadcrumb from "./EventBreadcrumb";
import { Location } from "@prisma/client";
import { EventWithLocations } from "@/types/Event";

interface HeaderProps {
  event?: EventWithLocations | null,
  location?: Location,
}

export default function Heading({event, location}: HeaderProps) {
  return (
    <Box>
      <Box
        sx={{
          width: 1,
          height: 70,
        }}
        position="relative"
        className="flex flex-col w-1 h-70"
      >
        <Image
          fill
          src={PinpointLogoColor}
          alt="Pinpoint"
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "contain" }}
          priority
        />
      </Box>
      <Box className="fixed left-4 top-4">
        <EventBreadcrumb event={event} location={location} />
      </Box>
    </Box>
  );
}
