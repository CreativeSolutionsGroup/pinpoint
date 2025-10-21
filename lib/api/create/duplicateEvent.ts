"use server";

import CreateEvent from "./createEvent";
import { SyncLocations, UpdateGettingStarted, UpdateCampusChristmas } from "../update/Event";
import { GetEventLocationInfo } from "../read/GetEventLocationInfo";
import SaveState from "../update/ReactFlowSave";
import { EventWithLocationIds } from "@/types/Event";

/**
 * Duplicates an event with all its locations and node states
 * @param eventToCopy - The event to duplicate
 * @param options - Optional configuration
 * @returns The newly created event
 */
export async function duplicateEvent(
  eventToCopy: EventWithLocationIds,
  options?: {
    nameSuffix?: string;
    isArchived?: boolean;
  }
) {
  const { nameSuffix = " (Copy)" } = options || {};

  // Create the new event
  const newEvent = await CreateEvent(eventToCopy.name + nameSuffix);

  // Copy all locations and their states
  const locationLinks = eventToCopy.locations;

  if (locationLinks && locationLinks.length > 0) {
    // Extract location IDs directly from the links
    const locationIds = locationLinks.map((link) => link.locationId);

    if (locationIds.length > 0) {
      await SyncLocations(newEvent, locationIds);

      // For each location, copy the state from the original event
      for (const locationId of locationIds) {
        // Get the original event's state for this location
        const originalEventLocation = await GetEventLocationInfo(
          eventToCopy.id,
          locationId
        );

        if (originalEventLocation?.state) {
          // Save the same state to the new event's location
          await SaveState(
            newEvent.id,
            locationId,
            originalEventLocation.state,
            "" // Empty client ID since this is a copy operation
          );
        }
      }
    }
  }

  // Copy the isGS and isCC flags
  if (eventToCopy.isGS !== undefined) {
    await UpdateGettingStarted(newEvent.id, eventToCopy.isGS);
  }
  if (eventToCopy.isCC !== undefined) {
    await UpdateCampusChristmas(newEvent.id, eventToCopy.isCC);
  }

  // The new event's archive status is determined by the options parameter
  // By default it's false (not archived) since newly created events start as isArchived: false
  // If you want to explicitly set it, you can add UpdateArchive call here

  return newEvent;
}
