"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";

export async function AddLocationToEvent({
  eventId,
  locationId,
}: {
  eventId: string;
  locationId: string;
}) {
  // Invalidate the cache of the route to force new content to be fetched.
  revalidatePath('event/');
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
