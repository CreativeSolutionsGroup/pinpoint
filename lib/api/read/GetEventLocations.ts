"use server";

import { prisma } from "../db";

export async function GetEventLocations(eventId: string) {
  const locations = await prisma.eventToLocation.findMany({
    where: {
      eventId: eventId,
    },
  });

  if (!locations) {
    return null;
  }

  return locations;
}