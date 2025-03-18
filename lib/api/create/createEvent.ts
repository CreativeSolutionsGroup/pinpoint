"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";

export default async function CreateEvent(eventName: string) {
  const event = await prisma.event.create({
    data: {
      name: eventName,
    },
  });

  revalidatePath('/home');

  return event;
}