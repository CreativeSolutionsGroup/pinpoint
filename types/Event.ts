import { Event, Location } from "@prisma/client";

export interface EventWithLocations extends Event {
  locations: Location[];
}

export interface EventWithLocationIds extends Event {
  locations: Array<{
    id: string;
  }>;
}
