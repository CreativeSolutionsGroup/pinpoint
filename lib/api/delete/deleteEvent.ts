"use server";

import { prisma } from "../db";

export default async function DeleteEvent(eventId: string) {
  await prisma.eventToLocation.deleteMany({
    where: { eventId },
  });

  await prisma.event.delete({
    where: { id: eventId },
  });
}
