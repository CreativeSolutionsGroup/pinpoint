"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../api/db";

export async function updateRecents(
  email: string,
  eventId: string,
  locationId: string
) {
  const currentRecents = await prisma.recents.findMany({
    where: { user: { email } },
    orderBy: { lastUsed: "desc" },
  });

  const existingRecent = currentRecents.find(
    (recent) => recent.locationId === locationId && recent.eventId === eventId
  );

  if (existingRecent) {
    await prisma.recents.update({
      where: { id: existingRecent.id },
      data: { lastUsed: new Date() },
    });
  } else {
    const locationExists = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!locationExists) {
      return;
    }

    await prisma.recents.create({
      data: {
        user: { connect: { email } },
        location: { connect: { id: locationId } },
        event: { connect: { id: eventId } },
        lastUsed: new Date(),
      },
    });

    if (currentRecents.length >= 5) {
      const oldestRecent = currentRecents[currentRecents.length - 1];
      await prisma.recents.delete({
        where: { id: oldestRecent.id },
      });
    }
  }

  revalidatePath("/");
}
