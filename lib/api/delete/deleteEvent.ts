"use server";

import { prisma } from "../db";

export default async function DeleteEvent(eventId: string) {
  await prisma.event.delete({ where: { id: eventId }});
  console.log(eventId + " deleted");
}