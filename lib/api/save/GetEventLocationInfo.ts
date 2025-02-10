"use server";

import { prisma } from "../db";

export async function GetEventLocationInfo(eventId: string, locationId: string) {
  const eventLocationInfo = await prisma.eventToLocation.findFirst({
    where: {
      eventId,
      locationId,
    },
  })

  if (!eventLocationInfo) {
    return null;
  }

  return eventLocationInfo;
}