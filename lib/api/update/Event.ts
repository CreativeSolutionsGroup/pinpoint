"use server";

import { Event } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "../db";

export async function SyncLocations(event: Event, locations: string[]) {
  revalidatePath("event/");
  const existingLocations = await prisma.eventToLocation.findMany({
    where: {
      eventId: event.id,
    },
    select: {
      locationId: true,
    },
  });
  const existingLocationIds = existingLocations.map(
    (location) => location.locationId
  );
  const newLocations = locations.filter(
    (locationId) => !existingLocationIds.includes(locationId)
  );
  const deleteLocations = existingLocationIds.filter(
    (locationId) => !locations.includes(locationId)
  );
  await prisma.eventToLocation.deleteMany({
    where: {
      eventId: event.id,
      locationId: {
        in: deleteLocations,
      },
    },
  });
  return await prisma.eventToLocation.createMany({
    data: newLocations.map((locationId) => ({
      eventId: event.id,
      locationId,
    })),
  });
}

export async function UpdateName(eventId: string, name: string) {
  revalidatePath("event/");
  return await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      name,
    },
  });
}

export async function UpdateGettingStarted(eventId: string, isGS: boolean) {
  revalidatePath("event/");
  return await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      isGS,
    },
  });
}

export async function UpdateArchive(eventId: string, isArchived: boolean) {
  revalidatePath("event/");
  revalidatePath("/home");
  return await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      isArchived,
    },
  });
}

export async function UpdateCampusChristmas(eventId: string, isCC: boolean) {
  revalidatePath("event/");
  return await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      isCC,
    },
  });
}
