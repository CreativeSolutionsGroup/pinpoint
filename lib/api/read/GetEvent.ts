"use server";

import { prisma } from "../db";

export async function GetEvent(eventId: string) {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
    include: {
      locations: true,
    },
  });

  if (!event) {
    return null;
  }

  return event;
}
