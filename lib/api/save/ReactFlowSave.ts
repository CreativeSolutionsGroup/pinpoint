"use server";

import { prisma } from "../db";

export default async function SaveState(eventId: string, state: string) {
  await prisma.event.update({ where: { id: eventId }, data: { state } });
  console.log(eventId, state);
}
