"use server";

import { prisma } from "../db";

export async function GetArchivedEvents() {
  const events = await prisma.event.findMany({
    where: {
      isArchived: true,
    },
    select: {
      id: true,
      name: true,
      isGS: true,
      isCC: true,
      isArchived: true,
      locations: {
        select: {
          id: true,
          locationId: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
  return events;
}
