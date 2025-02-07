"use server";

import { prisma } from "../db";

export default async function SaveState(
  eventId: string,
  locationId: string,
  state: string
) {
  await prisma.eventToLocation.update({
    where: {
      eventId_locationId: {
        eventId,
        locationId,
      },
    },
    data: {
      state,
    },
  });
}
