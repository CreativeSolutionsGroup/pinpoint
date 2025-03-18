"use server";

import { prisma } from "../db";

export default async function CreateEvent(eventName: string) {
  const event = await prisma.event.create({
    data: {
      name: eventName,
    },
  });

  return event;
}