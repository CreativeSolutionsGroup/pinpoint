"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";

export default async function DeleteEntity(
  type: "event" | "location",
  id: string,
  eventId?: string
) {
  if (type === "event") {
    await prisma.eventToLocation.deleteMany({
      where: { eventId: id },
    });

    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/home");
  } else if (type === "location") {
    if (!eventId) {
      throw new Error("eventId is required when deleting a location.");
    }

    await prisma.eventToLocation.deleteMany({
      where: { locationId: id, eventId },
    });

    revalidatePath("/home");
  } else {
    throw new Error("Invalid type. Must be 'event' or 'location'.");
  }
}
