"use client";
import { IconButton } from "@mui/material";
import { HomeIcon } from "lucide-react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useParams, useRouter } from "next/navigation";
import { Location } from "@prisma/client";

export default function NavButtons({ locations }: { locations: Location[] }) {
  const router = useRouter();
  const params = useParams();

  const locationIds = locations.map((l) => l.id.toString());

  function nextLocation(direction: "forward" | "backward") {
    // get the current location (with a lot of error protection)
    const currId = (params.locationId || locationIds[0]).toString();
    const currIndex = locationIds.indexOf(currId) || 0;

    // handle wrap around
    const offset = direction === "forward" ? 1 : -1;
    const newIndex =
      (currIndex + offset + locationIds.length) % locationIds.length;

    // checking the current url gave us the values we need
    if (params.mode && params.eventId && locationIds[newIndex]) {
      router.push(
        `/event/${params.mode}/${params.eventId}/${locationIds[newIndex]}`
      );
    }
  }

  return (
    <div className="flex flex-row justify-center">
      <IconButton
        onClick={() => nextLocation("backward")}
        style={{ color: "black" }}
      >
        <ArrowBackIcon />
      </IconButton>

      <IconButton
        onClick={() => router.push("/home")}
        style={{ color: "black" }}
      >
        <HomeIcon />
      </IconButton>

      <IconButton
        onClick={() => nextLocation("forward")}
        style={{ color: "black" }}
      >
        <ArrowForwardIcon />
      </IconButton>
    </div>
  );
}
