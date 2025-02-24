"use server";

import { prisma } from "../db";

export async function AddLocationToEvent({
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

export async function CreateNewLocation(name: string, imageURL: string) {
  return await prisma.location.create({
    data: {
      name,
      imageURL,
    },
  });
}
