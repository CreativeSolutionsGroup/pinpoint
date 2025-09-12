import { Event } from "@prisma/client";

// Centralized event-related types
export type EventLocationLink = {
  id: string;
  eventId: string;
  locationId: string;
  state: string;
};

export type EventWithLocations = {
  id: string;
  name: string;
  isGS: boolean;
  locations: EventLocationLink[];
};

export interface EventWithLocationIds extends Event {
  locations: Array<{
    id: string;
  }>;
}
