"use server";

import { prisma } from "../db";

export default async function CreateEvent(eventName: string) {
	console.log("Creating new event: " + eventName)
  const event = await prisma.event.create({
    data: {
      name: eventName,
    },
  });

  return event;
}