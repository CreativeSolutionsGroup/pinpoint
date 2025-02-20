"use server";

import { prisma } from "../db";

export async function CreateLocation({
  eventId,
  locationId,
}: {
  eventId: string;
  locationId: string;
}) {
  return await prisma.eventToLocation.create({
    data: {
      eventId,
      locationId,
    },
  });
}
